import { DefaultAzureCredential } from '@azure/identity';
import axios, { AxiosInstance } from 'axios';

/**
 * Dataverse service for managing contact submissions
 * Uses Managed Identity for secure authentication
 */
export class DataverseService {
    private httpClient: AxiosInstance;
    private baseUrl: string;
    private accessToken: string | null = null;
    private tokenExpiry: Date | null = null;

    constructor(environmentUrl: string) {
        // Remove trailing slash and construct API base URL
        this.baseUrl = `${environmentUrl.replace(/\/$/, '')}/api/data/v9.2`;
        
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
     * Get access token using Managed Identity
     * Implements token caching with automatic renewal
     */
    private async getAccessToken(): Promise<string> {
        // Check if we have a valid cached token
        if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
            return this.accessToken;
        }

        try {
            const credential = new DefaultAzureCredential();
            const tokenResponse = await credential.getToken('https://service.powerapps.com/');
            
            if (!tokenResponse) {
                throw new Error('Failed to obtain access token');
            }

            this.accessToken = tokenResponse.token;
            // Set expiry 5 minutes before actual expiry for safety
            this.tokenExpiry = new Date(tokenResponse.expiresOnTimestamp - 300000);
            
            console.log('Successfully obtained Dataverse access token');
            return this.accessToken;
        } catch (error) {
            console.error('Failed to get access token:', error);
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
                e365_phone: submission.phone || null,
                e365_service: this.mapServiceToOptionSet(submission.service),
                e365_message: submission.message,
                e365_submissiondate: new Date().toISOString(),
                e365_ipaddress: submission.ipAddress || null,
                e365_status: 1 // Default to "New" status
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
                throw new Error('Authentication failed: Please check Managed Identity configuration');
            } else if (error.response?.status === 403) {
                throw new Error('Authorization failed: Insufficient permissions to create records');
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
            'microsoft-365': 1,
            'power-platform': 2,
            'digital-transformation': 3,
            'training': 4,
            'custom-solutions': 5,
            'consultation': 6
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

        // Extract GUID from URL like: https://org.api.crm.dynamics.com/api/data/v9.2/msl_contactsubmissions(12345678-1234-1234-1234-123456789012)
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
            await this.httpClient.get('/msl_contactsubmissions?$top=1');
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
