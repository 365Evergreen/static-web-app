import axios, { AxiosInstance } from 'axios';

/**
 * Dataverse service with Service Principal authentication
 * Uses client credentials flow (App Registration) for secure authentication
 * This is the recommended approach for Azure Functions connecting to Dataverse
 */
export class DataverseAuthService {
    private httpClient: AxiosInstance;
    private baseUrl: string;
    private accessToken: string | null = null;
    private tokenExpiry: Date | null = null;
    private clientId: string;
    private clientSecret: string;
    private tenantId: string;

    constructor(environmentUrl: string) {
        // Remove trailing slash and construct API base URL
        this.baseUrl = `${environmentUrl.replace(/\/$/, '')}/api/data/v9.2`;
        
        // Get authentication configuration from environment variables
        this.clientId = process.env.AZURE_CLIENT_ID || '';
        this.clientSecret = process.env.AZURE_CLIENT_SECRET || '';
        this.tenantId = process.env.AZURE_TENANT_ID || '';

        if (!this.clientId || !this.clientSecret || !this.tenantId) {
            throw new Error('Missing authentication configuration. Required: AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID');
        }
        
        this.httpClient = axios.create({
            baseURL: this.baseUrl,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0'
            }
        });

        // Add request interceptor for authentication
        this.httpClient.interceptors.request.use(async (config) => {
            const token = await this.getAccessToken();
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        });

        // Add response interceptor for error handling
        this.httpClient.interceptors.response.use(
            (response) => response,
            (error) => {
                console.error('Dataverse API Error:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    url: error.config?.url
                });
                throw error;
            }
        );
    }

    /**
     * Get access token using Service Principal (Client Credentials flow)
     * Implements token caching with automatic renewal
     */
    private async getAccessToken(): Promise<string> {
        // Check if we have a valid cached token
        if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
            return this.accessToken;
        }

        try {
            const tokenUrl = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
            const scope = `${this.baseUrl.replace('/api/data/v9.2', '')}/.default`;

            const params = new URLSearchParams();
            params.append('grant_type', 'client_credentials');
            params.append('client_id', this.clientId);
            params.append('client_secret', this.clientSecret);
            params.append('scope', scope);

            console.log('Requesting access token from:', tokenUrl);
            console.log('Scope:', scope);
            console.log('Client ID:', this.clientId.substring(0, 8) + '...');

            const response = await axios.post(tokenUrl, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (!response.data.access_token) {
                throw new Error('No access token received from authentication endpoint');
            }

            this.accessToken = response.data.access_token;
            // Set expiry 5 minutes before actual expiry for safety
            const expiresIn = response.data.expires_in || 3600;
            this.tokenExpiry = new Date(Date.now() + (expiresIn - 300) * 1000);
            
            console.log('Successfully obtained Dataverse access token');
            console.log('Token expires in:', expiresIn, 'seconds');
            return this.accessToken;

        } catch (error) {
            console.error('Failed to get access token:', error);
            
            if (error.response?.status === 400) {
                console.error('Authentication error details:', error.response.data);
                throw new Error(`Authentication failed: ${error.response.data.error_description || error.response.data.error}`);
            }
            
            throw new Error('Authentication failed: Unable to obtain access token');
        }
    }

    /**
     * Create a new contact submission record in Dataverse
     */
    async createContactSubmission(submission: ContactSubmissionData): Promise<string> {
        try {
            // Validate required fields
            this.validateSubmission(submission);

            // Prepare the data payload for Dataverse
            const dataversePayload = {
                e365_name: submission.name,
                e365_email: submission.email,
                e365_company: submission.company || null,
                e365_phonenumber: submission.phone || null,
                e365_service: this.mapServiceToOptionSet(submission.service),
                e365_message: submission.message,
                e365_ipaddress: submission.ipAddress || null,
                e365_contactstatus: 463170000  // New status
            };

            console.log('Creating contact submission in Dataverse:', {
                name: submission.name,
                email: submission.email,
                service: submission.service
            });

            // Create the record
            const response = await this.httpClient.post('/e365_contactsubmissions', dataversePayload);

            // Extract the ID from the OData-EntityId header
            const entityId = this.extractEntityId(response.headers['odata-entityid']);
            
            console.log('Successfully created contact submission:', entityId);
            return entityId;

        } catch (error) {
            console.error('Error creating contact submission:', error);
            
            if (error.response?.status === 401) {
                throw new Error('Authentication failed: Please check Service Principal configuration');
            } else if (error.response?.status === 403) {
                throw new Error('Authorization failed: Service Principal lacks permissions to create records');
            } else if (error.response?.status === 400) {
                throw new Error(`Bad request: ${error.response?.data?.error?.message || 'Invalid data'}`);
            }
            
            throw new Error('Failed to save submission to Dataverse');
        }
    }

    /**
     * Validate submission data before sending to Dataverse
     */
    private validateSubmission(submission: ContactSubmissionData): void {
        if (!submission.name?.trim()) {
            throw new Error('Name is required');
        }
        
        if (!submission.email?.trim()) {
            throw new Error('Email is required');
        }
        
        if (!submission.message?.trim()) {
            throw new Error('Message is required');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(submission.email)) {
            throw new Error('Invalid email format');
        }

        // Validate field lengths
        if (submission.name.length > 100) {
            throw new Error('Name must be 100 characters or less');
        }
        
        if (submission.email.length > 320) {
            throw new Error('Email must be 320 characters or less');
        }
        
        if (submission.company && submission.company.length > 100) {
            throw new Error('Company name must be 100 characters or less');
        }
        
        if (submission.phone && submission.phone.length > 50) {
            throw new Error('Phone number must be 50 characters or less');
        }
        
        if (submission.message.length > 4000) {
            throw new Error('Message must be 4000 characters or less');
        }
    }

    /**
     * Map service string to Dataverse option set value
     */
    private mapServiceToOptionSet(service: string | undefined): number | null {
        if (!service) return null;

        const serviceMapping: { [key: string]: number } = {
            // Main contact form values (with hyphens)
            'microsoft-365': 463170000,           // Microsoft 365 Implementation
            'power-platform': 463170001,         // Power Platform Development  
            'digital-transformation': 463170002, // Digital Transformation
            'training': 463170003,               // Training & Support
            'custom-solutions': 463170004,       // Custom Business Solutions
            'consultation': 463170005,           // General Consultation
            
            // Debug form values (without hyphens) - for compatibility
            'microsoft365': 463170000,           // Microsoft 365 Implementation
            'powerplatform': 463170001,          // Power Platform Development  
            'migration': 463170002,              // Digital Transformation (alias)
            'other': 463170004                   // Custom Business Solutions (alias)
        };

        return serviceMapping[service] || null;
    }

    /**
     * Extract entity ID from OData-EntityId header
     */
    private extractEntityId(entityIdUrl: string): string {
        if (!entityIdUrl) {
            throw new Error('No entity ID returned from Dataverse');
        }

        // Extract GUID from URL like: https://org.api.crm.dynamics.com/api/data/v9.2/e365_contactsubmissions(12345678-1234-1234-1234-123456789012)
        const match = entityIdUrl.match(/\(([^)]+)\)$/);
        if (!match) {
            throw new Error('Invalid entity ID format returned from Dataverse');
        }

        return match[1];
    }

    /**
     * Test the connection to Dataverse
     */
    async testConnection(): Promise<boolean> {
        try {
            await this.httpClient.get('/e365_contactsubmissions?$top=1');
            console.log('Dataverse connection test successful');
            return true;
        } catch (error) {
            console.error('Dataverse connection test failed:', error);
            return false;
        }
    }
}

/**
 * Interface for contact submission data
 */
export interface ContactSubmissionData {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    service?: string;
    message: string;
    ipAddress?: string;
}
