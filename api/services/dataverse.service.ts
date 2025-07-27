import { DefaultAzureCredential } from '@azure/identity';
import axios, { AxiosInstance } from 'axios';

/**
 * Dataverse service for managing contact submissions
 * Uses Managed Identity for secure authentication
 */
export class DataverseService {
    private httpClient: AxiosInstance;
    private baseUrl: string;
    private environmentUrl: string;
    private accessToken: string | null = null;
    private tokenExpiry: Date | null = null;
    private clientsTableName: string | null = null;

    constructor(environmentUrl: string) {
        // Store environment URL for token requests
        this.environmentUrl = environmentUrl.replace(/\/$/, '');
        // Remove trailing slash and construct API base URL
        this.baseUrl = `${this.environmentUrl}/api/data/v9.2`;
        
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
            const tokenResponse = await credential.getToken(`${this.environmentUrl}/.default`);
            
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
                e365_phonenumber: submission.phone || null,  // Fixed: was e365_phone
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
            await this.httpClient.get('/e365_contactsubmissions?$top=1');
            console.log('Dataverse connection test successful');
            return true;
        } catch (error) {
            console.error('Dataverse connection test failed:', error);
            return false;
        }
    }

    /**
     * Find the correct clients table name
     */
    private async findClientsTableName(): Promise<string> {
        if (this.clientsTableName) {
            return this.clientsTableName;
        }

        // First try to list all entity sets to see what's available
        try {
            console.log('Listing all available entity sets...');
            const metadataResponse = await this.httpClient.get('/$metadata');
            console.log('Metadata response received (first 500 chars):', metadataResponse.data.substring(0, 500));
        } catch (metadataError) {
            console.log('Could not fetch metadata:', metadataError.message);
        }

        const possibleTableNames = ['e365_clients', 'cr48b_e365clients', 'cr48b_e365_clients', 'cr48b_clients'];
        
        for (const tableName of possibleTableNames) {
            try {
                console.log(`Trying table name: ${tableName}`);
                await this.httpClient.get(`/${tableName}?$top=1`);
                console.log(`Found table: ${tableName}`);
                this.clientsTableName = tableName;
                return tableName;
            } catch (tableError: any) {
                console.log(`Table ${tableName} not found, trying next...`);
                if (tableError.response?.status !== 404) {
                    // If it's not a 404, it might be a real error
                    throw tableError;
                }
            }
        }
        
        throw new Error('Could not find the clients table with any expected name. The table may need to be created in Dataverse first.');
    }

    /**
     * Check if an email address already exists in the clients table
     */
    async checkEmailExists(email: string): Promise<boolean> {
        try {
            const tableName = await this.findClientsTableName();
            const response = await this.httpClient.get(`/${tableName}?$filter=e365_email eq '${email.toLowerCase()}'&$top=1`);
            return response.data.value && response.data.value.length > 0;
        } catch (error) {
            console.error('Error checking email existence:', error);
            throw new Error('Failed to check email availability');
        }
    }

    /**
     * Check if a client number already exists in the clients table
     */
    async checkClientNumberExists(clientNumber: string): Promise<boolean> {
        try {
            const tableName = await this.findClientsTableName();
            const response = await this.httpClient.get(`/${tableName}?$filter=e365_clientnumber eq '${clientNumber}'&$top=1`);
            return response.data.value && response.data.value.length > 0;
        } catch (error) {
            console.error('Error checking client number existence:', error);
            throw new Error('Failed to check client number availability');
        }
    }

    /**
     * Create a new client record in Dataverse
     */
    async createClientRecord(clientData: ClientData): Promise<string> {
        try {
            console.log('Creating client record in Dataverse...');
            
            const tableName = await this.findClientsTableName();
            const response = await this.httpClient.post(`/${tableName}`, clientData, {
                headers: {
                    'Prefer': 'return=representation'
                }
            });

            // Extract the entity ID from the response
            const entityIdUrl = response.headers['odata-entityid'];
            const entityId = this.extractEntityId(entityIdUrl);
            
            console.log('Client record created successfully with ID:', entityId);
            return entityId;
        } catch (error) {
            console.error('Error creating client record:', error);
            
            if (error.response?.status === 400) {
                const errorData = error.response.data;
                if (errorData?.error?.message?.includes('duplicate')) {
                    throw new Error('A client with this email or client number already exists');
                }
                throw new Error(`Validation error: ${errorData?.error?.message || 'Invalid data provided'}`);
            } else if (error.response?.status === 401) {
                throw new Error('Authentication failed');
            } else if (error.response?.status === 403) {
                throw new Error('Access denied');
            }
            
            throw new Error('Failed to create client record');
        }
    }

    /**
     * Authenticate a client by email and password
     */
    async authenticateClient(email: string, password: string): Promise<ClientAuthResult | null> {
        try {
            const response = await this.httpClient.get(
                `/e365_clients?$filter=e365_email eq '${email.toLowerCase()}'&$select=e365_clientsid,e365_name,e365_firstname,e365_surname,e365_email,e365_passwordhash,e365_clientnumber,e365_status,e365_accountlocked,e365_loginattempts`
            );

            if (!response.data.value || response.data.value.length === 0) {
                return null; // Client not found
            }

            const client = response.data.value[0];
            
            // Check if account is locked
            if (client.e365_accountlocked) {
                throw new Error('Account is locked due to too many failed login attempts');
            }

            // Check if account is active
            if (client.e365_status !== 463170000) { // 463170000 = Active
                throw new Error('Account is not active');
            }

            // Verify password using bcrypt
            const bcrypt = require('bcrypt');
            const passwordMatch = await bcrypt.compare(password, client.e365_passwordhash);

            if (!passwordMatch) {
                // Increment login attempts
                await this.incrementLoginAttempts(client.e365_clientsid, client.e365_loginattempts);
                return null; // Invalid password
            }

            // Reset login attempts and update last login
            await this.resetLoginAttempts(client.e365_clientsid);

            return {
                clientId: client.e365_clientsid,
                name: client.e365_name,
                firstName: client.e365_firstname,
                lastName: client.e365_surname,
                email: client.e365_email,
                clientNumber: client.e365_clientnumber,
                status: client.e365_status
            };
        } catch (error) {
            console.error('Error authenticating client:', error);
            if (error.message.includes('locked') || error.message.includes('active')) {
                throw error; // Re-throw specific errors
            }
            throw new Error('Authentication failed');
        }
    }

    /**
     * Increment login attempts for a client
     */
    private async incrementLoginAttempts(clientId: string, currentAttempts: number): Promise<void> {
        try {
            const newAttempts = (currentAttempts || 0) + 1;
            const updateData: any = {
                e365_loginattempts: newAttempts
            };

            // Lock account if too many attempts
            if (newAttempts >= 5) {
                updateData.e365_accountlocked = true;
            }

            await this.httpClient.patch(`/e365_clients(${clientId})`, updateData);
        } catch (error) {
            console.error('Error incrementing login attempts:', error);
        }
    }

    /**
     * Reset login attempts and update last login
     */
    private async resetLoginAttempts(clientId: string): Promise<void> {
        try {
            await this.httpClient.patch(`/e365_clients(${clientId})`, {
                e365_loginattempts: 0,
                e365_accountlocked: false,
                e365_lastlogin: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error resetting login attempts:', error);
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

/**
 * Interface for client data when creating new client records
 */
export interface ClientData {
    e365_name: string;
    e365_firstname: string;
    e365_surname: string;
    e365_email: string;
    e365_passwordhash: string;
    e365_clientnumber: string;
    e365_company?: string;
    e365_phone?: string;
    e365_status: number;
    e365_loginattempts: number;
    e365_accountlocked: boolean;
    e365_createddate: string;
}

/**
 * Interface for client authentication result
 */
export interface ClientAuthResult {
    clientId: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    clientNumber: string;
    status: number;
}
