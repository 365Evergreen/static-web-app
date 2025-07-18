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
exports.DataverseService = void 0;
const identity_1 = require("@azure/identity");
const axios_1 = __importDefault(require("axios"));
/**
 * Dataverse service for managing contact submissions
 * Uses Managed Identity for secure authentication
 */
class DataverseService {
    constructor(environmentUrl) {
        this.accessToken = null;
        this.tokenExpiry = null;
        // Remove trailing slash and construct API base URL
        this.baseUrl = `${environmentUrl.replace(/\/$/, '')}/api/data/v9.2`;
        this.httpClient = axios_1.default.create({
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
        this.httpClient.interceptors.request.use((config) => __awaiter(this, void 0, void 0, function* () {
            const token = yield this.getAccessToken();
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        }));
        // Add response interceptor for error handling
        this.httpClient.interceptors.response.use((response) => response, (error) => {
            var _a, _b, _c, _d;
            console.error('Dataverse API Error:', {
                status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                statusText: (_b = error.response) === null || _b === void 0 ? void 0 : _b.statusText,
                data: (_c = error.response) === null || _c === void 0 ? void 0 : _c.data,
                url: (_d = error.config) === null || _d === void 0 ? void 0 : _d.url
            });
            throw error;
        });
    }
    /**
     * Get access token using Managed Identity
     * Implements token caching with automatic renewal
     */
    getAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if we have a valid cached token
            if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
                return this.accessToken;
            }
            try {
                const credential = new identity_1.DefaultAzureCredential();
                const tokenResponse = yield credential.getToken('https://service.powerapps.com/');
                if (!tokenResponse) {
                    throw new Error('Failed to obtain access token');
                }
                this.accessToken = tokenResponse.token;
                // Set expiry 5 minutes before actual expiry for safety
                this.tokenExpiry = new Date(tokenResponse.expiresOnTimestamp - 300000);
                console.log('Successfully obtained Dataverse access token');
                return this.accessToken;
            }
            catch (error) {
                console.error('Failed to get access token:', error);
                throw new Error('Authentication failed: Unable to obtain access token');
            }
        });
    }
    /**
     * Create a new contact submission record in Dataverse
     */
    createContactSubmission(submission) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
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
                    e365_contactstatus: 463170000 // New status
                };
                console.log('Creating contact submission in Dataverse:', {
                    name: submission.name,
                    email: submission.email,
                    service: submission.service
                });
                // Create the record
                const response = yield this.httpClient.post('/e365_contactsubmissions', dataversePayload);
                // Extract the ID from the OData-EntityId header
                const entityId = this.extractEntityId(response.headers['odata-entityid']);
                console.log('Successfully created contact submission:', entityId);
                return entityId;
            }
            catch (error) {
                console.error('Error creating contact submission:', error);
                if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                    throw new Error('Authentication failed: Please check Managed Identity configuration');
                }
                else if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === 403) {
                    throw new Error('Authorization failed: Insufficient permissions to create records');
                }
                else if (((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) === 400) {
                    throw new Error(`Bad request: ${((_f = (_e = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.message) || 'Invalid data'}`);
                }
                throw new Error('Failed to save submission to Dataverse');
            }
        });
    }
    /**
     * Validate submission data before sending to Dataverse
     */
    validateSubmission(submission) {
        var _a, _b, _c;
        if (!((_a = submission.name) === null || _a === void 0 ? void 0 : _a.trim())) {
            throw new Error('Name is required');
        }
        if (!((_b = submission.email) === null || _b === void 0 ? void 0 : _b.trim())) {
            throw new Error('Email is required');
        }
        if (!((_c = submission.message) === null || _c === void 0 ? void 0 : _c.trim())) {
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
    mapServiceToOptionSet(service) {
        if (!service)
            return null;
        const serviceMapping = {
            // Main contact form values (with hyphens)
            'microsoft-365': 463170000,
            'power-platform': 463170001,
            'digital-transformation': 463170002,
            'training': 463170003,
            'custom-solutions': 463170004,
            'consultation': 463170005,
            // Debug form values (without hyphens) - for compatibility
            'microsoft365': 463170000,
            'powerplatform': 463170001,
            'migration': 463170002,
            'other': 463170004 // Custom Business Solutions (alias)
        };
        return serviceMapping[service] || null;
    }
    /**
     * Extract entity ID from OData-EntityId header
     */
    extractEntityId(entityIdUrl) {
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
    testConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.httpClient.get('/e365_contactsubmissions?$top=1');
                console.log('Dataverse connection test successful');
                return true;
            }
            catch (error) {
                console.error('Dataverse connection test failed:', error);
                return false;
            }
        });
    }
}
exports.DataverseService = DataverseService;
//# sourceMappingURL=dataverse.service.js.map