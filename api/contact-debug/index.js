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
/**
 * DEBUG VERSION: Test function to isolate the issue
 */
const httpTrigger = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        // Set CORS headers
        context.res = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Content-Type': 'application/json'
            }
        };
        // Handle OPTIONS request
        if (req.method === 'OPTIONS') {
            context.res.status = 200;
            context.res.body = '';
            return;
        }
        if (req.method !== 'POST') {
            context.res.status = 405;
            context.res.body = { error: 'Method not allowed' };
            return;
        }
        try {
            context.log('DEBUG: Function started');
            // Check environment variable
            const dataverseUrl = process.env.DATAVERSE_ENVIRONMENT_URL;
            context.log('DEBUG: Dataverse URL:', dataverseUrl);
            if (!dataverseUrl) {
                context.log.error('DEBUG: No Dataverse URL configured');
                context.res.status = 500;
                context.res.body = { error: 'No Dataverse URL configured' };
                return;
            }
            // Check request body
            if (!req.body) {
                context.log('DEBUG: No request body');
                context.res.status = 400;
                context.res.body = { error: 'Request body required' };
                return;
            }
            context.log('DEBUG: Request body received:', JSON.stringify(req.body));
            // Validate basic fields
            const { name, email, message } = req.body;
            if (!name || !email || !message) {
                context.log('DEBUG: Missing required fields');
                context.res.status = 400;
                context.res.body = {
                    error: 'Missing required fields',
                    received: { name: !!name, email: !!email, message: !!message }
                };
                return;
            }
            // Test managed identity token acquisition
            try {
                const { DefaultAzureCredential } = require('@azure/identity');
                context.log('DEBUG: Testing managed identity...');
                const credential = new DefaultAzureCredential();
                const tokenResponse = yield credential.getToken('https://service.powerapps.com/');
                if (tokenResponse) {
                    context.log('DEBUG: Managed identity token acquired successfully');
                    context.log('DEBUG: Token expires:', new Date(tokenResponse.expiresOnTimestamp));
                }
                else {
                    context.log.error('DEBUG: Failed to get token - no response');
                }
            }
            catch (authError) {
                context.log.error('DEBUG: Managed identity error:', authError);
                context.res.status = 500;
                context.res.body = {
                    error: 'Managed identity authentication failed',
                    details: authError.message
                };
                return;
            }
            // If we get here, everything basic is working
            context.log('DEBUG: All basic checks passed');
            context.res.status = 200;
            context.res.body = {
                success: true,
                message: 'DEBUG: Function is working, managed identity is working',
                timestamp: new Date().toISOString(),
                receivedData: {
                    name: name,
                    email: email,
                    hasCompany: !!req.body.company,
                    hasPhone: !!req.body.phone,
                    hasService: !!req.body.service,
                    messageLength: message.length
                }
            };
        }
        catch (error) {
            context.log.error('DEBUG: Unexpected error:', error);
            context.res.status = 500;
            context.res.body = {
                error: 'DEBUG: Unexpected error occurred',
                details: error.message,
                stack: error.stack
            };
        }
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map