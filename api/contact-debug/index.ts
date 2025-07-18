import { AzureFunction, Context, HttpRequest } from "@azure/functions";

/**
 * DEBUG VERSION: Test function to isolate the issue
 */
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
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

        // Test authentication based on available environment variables
        try {
            const hasServicePrincipalConfig = process.env.AZURE_CLIENT_ID && 
                                            process.env.AZURE_CLIENT_SECRET && 
                                            process.env.AZURE_TENANT_ID;

            if (hasServicePrincipalConfig) {
                context.log('DEBUG: Using Service Principal authentication...');
                context.log('DEBUG: Client ID:', process.env.AZURE_CLIENT_ID?.substring(0, 8) + '...');
                context.log('DEBUG: Tenant ID:', process.env.AZURE_TENANT_ID?.substring(0, 8) + '...');
                
                // Test Service Principal authentication
                const tokenUrl = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`;
                const scope = `${dataverseUrl}/.default`;

                const params = new URLSearchParams();
                params.append('grant_type', 'client_credentials');
                params.append('client_id', process.env.AZURE_CLIENT_ID);
                params.append('client_secret', process.env.AZURE_CLIENT_SECRET);
                params.append('scope', scope);

                context.log('DEBUG: Token URL:', tokenUrl);
                context.log('DEBUG: Scope:', scope);

                const axios = require('axios');
                const response = await axios.post(tokenUrl, params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                if (response.data.access_token) {
                    context.log('DEBUG: Service Principal authentication successful');
                    context.log('DEBUG: Token expires in:', response.data.expires_in, 'seconds');
                } else {
                    context.log.error('DEBUG: No access token received');
                }

            } else {
                context.log('DEBUG: Using Managed Identity authentication...');
                const { DefaultAzureCredential } = require('@azure/identity');
                
                const credential = new DefaultAzureCredential();
                const tokenResponse = await credential.getToken('https://service.powerapps.com/');
                
                if (tokenResponse) {
                    context.log('DEBUG: Managed identity token acquired successfully');
                    context.log('DEBUG: Token expires:', new Date(tokenResponse.expiresOnTimestamp));
                } else {
                    context.log.error('DEBUG: Failed to get token - no response');
                }
            }
            
        } catch (authError) {
            context.log.error('DEBUG: Authentication error:', authError);
            context.res.status = 500;
            context.res.body = { 
                error: 'Authentication failed',
                details: authError.message,
                authMethod: process.env.AZURE_CLIENT_ID ? 'Service Principal' : 'Managed Identity'
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

    } catch (error) {
        context.log.error('DEBUG: Unexpected error:', error);
        context.res.status = 500;
        context.res.body = {
            error: 'DEBUG: Unexpected error occurred',
            details: error.message,
            stack: error.stack
        };
    }
};

export default httpTrigger;
