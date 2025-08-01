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
Object.defineProperty(exports, "__esModule", { value: true });
const dataverse_service_1 = require("../services/dataverse.service");
const dataverse_auth_service_1 = require("../services/dataverse-auth.service");
/**
 * Azure Function to handle contact form submissions
 * Validates input and saves to Dataverse using Managed Identity
 */
const httpTrigger = function (context, req) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __awaiter(this, void 0, void 0, function* () {
        // Set CORS headers for browser compatibility
        context.res = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Content-Type': 'application/json'
            }
        };
        // Handle OPTIONS request for CORS preflight
        if (req.method === 'OPTIONS') {
            context.res.status = 200;
            context.res.body = '';
            return;
        }
        // Only allow POST requests
        if (req.method !== 'POST') {
            context.res.status = 405;
            context.res.body = {
                error: 'Method not allowed. Please use POST.'
            };
            return;
        }
        try {
            // Validate request body exists
            if (!req.body) {
                context.res.status = 400;
                context.res.body = {
                    error: 'Request body is required'
                };
                return;
            }
            // Extract form data from request
            const formData = req.body;
            // Validate required fields
            const validationError = validateFormData(formData);
            if (validationError) {
                context.res.status = 400;
                context.res.body = {
                    error: validationError
                };
                return;
            }
            // Prepare submission data
            const submissionData = {
                name: (_a = formData.name) === null || _a === void 0 ? void 0 : _a.trim(),
                email: (_b = formData.email) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase(),
                company: ((_c = formData.company) === null || _c === void 0 ? void 0 : _c.trim()) || undefined,
                phone: ((_d = formData.phone) === null || _d === void 0 ? void 0 : _d.trim()) || undefined,
                service: formData.service || undefined,
                message: (_e = formData.message) === null || _e === void 0 ? void 0 : _e.trim(),
                ipAddress: getClientIpAddress(req)
            };
            // Get Dataverse environment URL from environment variables
            const dataverseUrl = process.env.DATAVERSE_ENVIRONMENT_URL;
            if (!dataverseUrl) {
                context.log.error('DATAVERSE_ENVIRONMENT_URL environment variable not configured');
                context.res.status = 500;
                context.res.body = {
                    error: 'Server configuration error. Please try again later.'
                };
                return;
            }
            // Determine authentication method based on available environment variables
            let dataverseService;
            const hasServicePrincipalConfig = process.env.AZURE_CLIENT_ID &&
                process.env.AZURE_CLIENT_SECRET &&
                process.env.AZURE_TENANT_ID;
            if (hasServicePrincipalConfig) {
                context.log.info('Using Service Principal authentication for Dataverse');
                dataverseService = new dataverse_auth_service_1.DataverseAuthService(dataverseUrl);
            }
            else {
                context.log.info('Using Managed Identity authentication for Dataverse');
                dataverseService = new dataverse_service_1.DataverseService(dataverseUrl);
            }
            context.log.info('Processing contact form submission', {
                name: submissionData.name,
                email: submissionData.email,
                service: submissionData.service
            });
            // Save to Dataverse
            const recordId = yield dataverseService.createContactSubmission(submissionData);
            context.log.info('Contact submission saved successfully', {
                recordId: recordId,
                email: submissionData.email
            });
            // Return success response
            context.res.status = 200;
            context.res.body = {
                message: 'Thank you! Your message has been received and saved. We will contact you soon.',
                submissionId: recordId,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            context.log.error('Error processing contact form submission:', {
                error: error.message,
                stack: error.stack,
                name: error.name,
                response: (_f = error.response) === null || _f === void 0 ? void 0 : _f.data,
                status: (_g = error.response) === null || _g === void 0 ? void 0 : _g.status,
                statusText: (_h = error.response) === null || _h === void 0 ? void 0 : _h.statusText
            });
            // Return appropriate error response
            if (error.message.includes('Authentication failed')) {
                context.res.status = 500;
                context.res.body = {
                    error: 'Server authentication error. Please try again later.'
                };
            }
            else if (error.message.includes('Authorization failed')) {
                context.res.status = 500;
                context.res.body = {
                    error: 'Server permission error. Please try again later.'
                };
            }
            else if (error.message.includes('Invalid') || error.message.includes('required')) {
                context.res.status = 400;
                context.res.body = {
                    error: error.message
                };
            }
            else {
                context.res.status = 500;
                context.res.body = {
                    error: 'An unexpected error occurred. Please try again later.'
                };
            }
        }
    });
};
/**
 * Validate form data input
 */
function validateFormData(data) {
    // Check required fields
    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
        return 'Name is required';
    }
    if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
        return 'Email is required';
    }
    if (!data.message || typeof data.message !== 'string' || !data.message.trim()) {
        return 'Message is required';
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
        return 'Please enter a valid email address';
    }
    // Validate field lengths
    if (data.name.trim().length > 100) {
        return 'Name must be 100 characters or less';
    }
    if (data.email.trim().length > 320) {
        return 'Email address is too long';
    }
    if (data.company && data.company.length > 100) {
        return 'Company name must be 100 characters or less';
    }
    if (data.phone && data.phone.length > 50) {
        return 'Phone number must be 50 characters or less';
    }
    if (data.message.trim().length > 4000) {
        return 'Message must be 4000 characters or less';
    }
    // Validate service selection if provided
    if (data.service) {
        const validServices = [
            // Main contact form values (with hyphens)
            'microsoft-365', 'power-platform', 'digital-transformation', 'training', 'custom-solutions', 'consultation',
            // Debug form values (without hyphens) - for compatibility
            'microsoft365', 'powerplatform', 'migration', 'other'
        ];
        if (!validServices.includes(data.service)) {
            return 'Invalid service selection';
        }
    }
    return null; // No validation errors
}
/**
 * Extract client IP address from request headers
 */
function getClientIpAddress(req) {
    // Check common headers for IP address (in order of preference)
    const ipHeaders = [
        'x-forwarded-for',
        'x-real-ip',
        'x-client-ip',
        'cf-connecting-ip',
        'x-azure-clientip'
    ];
    for (const header of ipHeaders) {
        const ip = req.headers[header];
        if (ip && typeof ip === 'string') {
            // Handle comma-separated IPs (take the first one)
            return ip.split(',')[0].trim();
        }
    }
    return undefined;
}
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map