import axios, { AxiosInstance } from 'axios';

/**
 * Microsoft Graph service with Service Principal authentication
 * Uses client credentials flow for accessing organizational data from Entra ID
 */
export class GraphAuthService {
    private httpClient: AxiosInstance;
    private baseUrl: string = 'https://graph.microsoft.com/v1.0';
    private accessToken: string | null = null;
    private tokenExpiry: Date | null = null;
    private clientId: string;
    private clientSecret: string;
    private tenantId: string;

    constructor() {
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
                'Accept': 'application/json'
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
                console.error('Microsoft Graph API Error:', {
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
     * Get access token for Microsoft Graph using Service Principal
     */
    private async getAccessToken(): Promise<string> {
        // Check if we have a valid cached token
        if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
            return this.accessToken;
        }

        try {
            const tokenUrl = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
            const scope = 'https://graph.microsoft.com/.default';

            const params = new URLSearchParams();
            params.append('grant_type', 'client_credentials');
            params.append('client_id', this.clientId);
            params.append('client_secret', this.clientSecret);
            params.append('scope', scope);

            console.log('Requesting Graph API access token from:', tokenUrl);
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
            
            console.log('Successfully obtained Graph API access token');
            console.log('Token expires in:', expiresIn, 'seconds');
            return this.accessToken;

        } catch (error) {
            console.error('Failed to get Graph API access token:', error);
            
            if (error.response?.status === 400) {
                console.error('Authentication error details:', error.response.data);
                throw new Error(`Authentication failed: ${error.response.data.error_description || error.response.data.error}`);
            }
            
            throw new Error('Authentication failed: Unable to obtain access token');
        }
    }

    /**
     * Get all users from the organization
     */
    async getUsers(): Promise<User[]> {
        try {
            console.log('Fetching users from Microsoft Graph');
            
            const response = await this.httpClient.get('/users', {
                params: {
                    '$select': 'id,displayName,jobTitle,department,mail,userPrincipalName,manager,photo',
                    '$top': 999
                }
            });

            console.log(`Successfully fetched ${response.data.value.length} users`);
            return response.data.value;

        } catch (error) {
            console.error('Error fetching users:', error);
            
            if (error.response?.status === 401) {
                throw new Error('Authentication failed: Please check Service Principal configuration');
            } else if (error.response?.status === 403) {
                throw new Error('Authorization failed: Service Principal lacks permissions to read users');
            }
            
            throw new Error('Failed to fetch users from Microsoft Graph');
        }
    }

    /**
     * Get user's manager information
     */
    async getUserManager(userId: string): Promise<User | null> {
        try {
            const response = await this.httpClient.get(`/users/${userId}/manager`, {
                params: {
                    '$select': 'id,displayName,jobTitle,department,mail,userPrincipalName'
                }
            });

            return response.data;

        } catch (error) {
            if (error.response?.status === 404) {
                // User has no manager
                return null;
            }
            console.error(`Error fetching manager for user ${userId}:`, error);
            return null;
        }
    }

    /**
     * Get user's direct reports
     */
    async getUserDirectReports(userId: string): Promise<User[]> {
        try {
            const response = await this.httpClient.get(`/users/${userId}/directReports`, {
                params: {
                    '$select': 'id,displayName,jobTitle,department,mail,userPrincipalName'
                }
            });

            return response.data.value || [];

        } catch (error) {
            console.error(`Error fetching direct reports for user ${userId}:`, error);
            return [];
        }
    }

    /**
     * Get user's profile photo
     */
    async getUserPhoto(userId: string): Promise<string | null> {
        try {
            const response = await this.httpClient.get(`/users/${userId}/photo/$value`, {
                responseType: 'arraybuffer'
            });

            // Convert to base64
            const base64 = Buffer.from(response.data, 'binary').toString('base64');
            return `data:${response.headers['content-type']};base64,${base64}`;

        } catch (error) {
            if (error.response?.status === 404) {
                // User has no photo
                return null;
            }
            console.error(`Error fetching photo for user ${userId}:`, error);
            return null;
        }
    }

    /**
     * Build organizational hierarchy from users list
     */
    buildOrgChart(users: User[]): OrgChartNode[] {
        const userMap = new Map<string, User>();
        const orgChart: OrgChartNode[] = [];

        // Create a map of all users
        users.forEach(user => {
            userMap.set(user.id, user);
        });

        // Find root users (users without managers in the current list)
        const rootUsers = users.filter(user => {
            // If user has no manager field or manager is not in our user list, consider them root
            return !user.manager || !userMap.has(user.manager.id);
        });

        // Build hierarchy recursively
        rootUsers.forEach(rootUser => {
            orgChart.push(this.buildUserNode(rootUser, users, userMap));
        });

        return orgChart;
    }

    /**
     * Build user node with children recursively
     */
    private buildUserNode(user: User, allUsers: User[], userMap: Map<string, User>): OrgChartNode {
        const children = allUsers
            .filter(u => u.manager && u.manager.id === user.id)
            .map(child => this.buildUserNode(child, allUsers, userMap));

        return {
            id: user.id,
            displayName: user.displayName,
            jobTitle: user.jobTitle || '',
            department: user.department || '',
            email: user.mail || user.userPrincipalName,
            photoUrl: null, // Will be loaded separately
            children: children
        };
    }

    /**
     * Test the connection to Microsoft Graph
     */
    async testConnection(): Promise<boolean> {
        try {
            await this.httpClient.get('/me');
            console.log('Microsoft Graph connection test successful');
            return true;
        } catch (error) {
            console.error('Microsoft Graph connection test failed:', error);
            return false;
        }
    }
}

/**
 * User interface from Microsoft Graph
 */
export interface User {
    id: string;
    displayName: string;
    jobTitle?: string;
    department?: string;
    mail?: string;
    userPrincipalName: string;
    manager?: {
        id: string;
    };
}

/**
 * Organizational chart node structure
 */
export interface OrgChartNode {
    id: string;
    displayName: string;
    jobTitle: string;
    department: string;
    email: string;
    photoUrl: string | null;
    children: OrgChartNode[];
}