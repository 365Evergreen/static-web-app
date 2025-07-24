"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphAuthService = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * Microsoft Graph service with Service Principal authentication
 * Uses client credentials flow for accessing organizational data from Entra ID
 */
class GraphAuthService {
    constructor() {
        this.baseUrl = 'https://graph.microsoft.com/v1.0';
        this.accessToken = null;
        this.tokenExpiry = null;
        // Get authentication configuration from environment variables
        this.clientId = process.env.AZURE_CLIENT_ID || '';
        this.clientSecret = process.env.AZURE_CLIENT_SECRET || '';
        this.tenantId = process.env.AZURE_TENANT_ID || '';
        if (!this.clientId || !this.clientSecret || !this.tenantId) {
            throw new Error('Missing authentication configuration. Required: AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID');
        }
        this.httpClient = axios_1.default.create({
            baseURL: this.baseUrl,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        // Add request interceptor for authentication
        this.httpClient.interceptors.request.use((config) => __awaiter(this, void 0, void 0, function* () {
            const token = yield this.getAccessToken();
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        }));
        // Add response interceptor for error handling
        this.httpClient.interceptors.response.use((response) => response, (error) => {
            var _a, _b, _c, _d;
            console.error('Microsoft Graph API Error:', {
                status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                statusText: (_b = error.response) === null || _b === void 0 ? void 0 : _b.statusText,
                data: (_c = error.response) === null || _c === void 0 ? void 0 : _c.data,
                url: (_d = error.config) === null || _d === void 0 ? void 0 : _d.url
            });
            throw error;
        });
    }
    /**
     * Get access token for Microsoft Graph using Service Principal
     */
    getAccessToken() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
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
                const response = yield axios_1.default.post(tokenUrl, params, {
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
            }
            catch (error) {
                console.error('Failed to get Graph API access token:', error);
                if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 400) {
                    console.error('Authentication error details:', error.response.data);
                    throw new Error(`Authentication failed: ${error.response.data.error_description || error.response.data.error}`);
                }
                throw new Error('Authentication failed: Unable to obtain access token');
            }
        });
    }
    /**
     * Get all users from the organization
     */
    getUsers() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Fetching users from Microsoft Graph');
                const response = yield this.httpClient.get('/users', {
                    params: {
                        '$select': 'id,displayName,jobTitle,department,mail,userPrincipalName,manager,photo',
                        '$top': 999
                    }
                });
                console.log(`Successfully fetched ${response.data.value.length} users`);
                return response.data.value;
            }
            catch (error) {
                console.error('Error fetching users:', error);
                if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                    throw new Error('Authentication failed: Please check Service Principal configuration');
                }
                else if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === 403) {
                    throw new Error('Authorization failed: Service Principal lacks permissions to read users');
                }
                throw new Error('Failed to fetch users from Microsoft Graph');
            }
        });
    }
    /**
     * Get user's manager information
     */
    getUserManager(userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.httpClient.get(`/users/${userId}/manager`, {
                    params: {
                        '$select': 'id,displayName,jobTitle,department,mail,userPrincipalName'
                    }
                });
                return response.data;
            }
            catch (error) {
                if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
                    // User has no manager
                    return null;
                }
                console.error(`Error fetching manager for user ${userId}:`, error);
                return null;
            }
        });
    }
    /**
     * Get user's direct reports
     */
    getUserDirectReports(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.httpClient.get(`/users/${userId}/directReports`, {
                    params: {
                        '$select': 'id,displayName,jobTitle,department,mail,userPrincipalName'
                    }
                });
                return response.data.value || [];
            }
            catch (error) {
                console.error(`Error fetching direct reports for user ${userId}:`, error);
                return [];
            }
        });
    }
    /**
     * Get user's profile photo
     */
    getUserPhoto(userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.httpClient.get(`/users/${userId}/photo/$value`, {
                    responseType: 'arraybuffer'
                });
                // Convert to base64
                const base64 = Buffer.from(response.data, 'binary').toString('base64');
                return `data:${response.headers['content-type']};base64,${base64}`;
            }
            catch (error) {
                if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
                    // User has no photo
                    return null;
                }
                console.error(`Error fetching photo for user ${userId}:`, error);
                return null;
            }
        });
    }
    /**
     * Build organizational hierarchy from users list
     */
    buildOrgChart(users) {
        const userMap = new Map();
        const orgChart = [];
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
    buildUserNode(user, allUsers, userMap) {
        const children = allUsers
            .filter(u => u.manager && u.manager.id === user.id)
            .map(child => this.buildUserNode(child, allUsers, userMap));
        return {
            id: user.id,
            displayName: user.displayName,
            jobTitle: user.jobTitle || '',
            department: user.department || '',
            email: user.mail || user.userPrincipalName,
            photoUrl: null,
            children: children
        };
    }
    /**
     * Test the connection to Microsoft Graph
     */
    testConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.httpClient.get('/me');
                console.log('Microsoft Graph connection test successful');
                return true;
            }
            catch (error) {
                console.error('Microsoft Graph connection test failed:', error);
                return false;
            }
        });
    }
}
exports.GraphAuthService = GraphAuthService;
//# sourceMappingURL=graph-auth.service.js.map