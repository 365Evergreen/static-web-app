import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { DocumentService } from "../services/document.service";
import { ClientAuthService } from "../services/client-auth.service";

/**
 * Azure Function to handle client document operations
 * Supports listing, downloading, and searching client documents
 */
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // Set CORS headers
    context.res = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

    try {
        // Verify authentication
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            context.res.status = 401;
            context.res.body = { error: 'Authentication required' };
            return;
        }

        const token = authHeader.substring(7);
        const dataverseUrl = process.env.DATAVERSE_ENVIRONMENT_URL;
        
        if (!dataverseUrl) {
            context.res.status = 500;
            context.res.body = { error: 'Server configuration error' };
            return;
        }

        const authService = new ClientAuthService(dataverseUrl);
        const client = authService.verifyToken(token);

        if (!client) {
            context.res.status = 401;
            context.res.body = { error: 'Invalid or expired token' };
            return;
        }

        const documentService = new DocumentService(dataverseUrl);

        // Handle different operations based on URL path
        const path = req.params.path || '';
        
        if (req.method === 'GET') {
            if (path.endsWith('/download')) {
                // Download specific document
                const documentId = path.split('/')[0];
                
                try {
                    const downloadUrl = await documentService.generateDownloadUrl(documentId, client.clientId);
                    
                    context.res.status = 200;
                    context.res.body = {
                        success: true,
                        downloadUrl: downloadUrl,
                        expiresIn: '1 hour'
                    };
                } catch (error) {
                    context.res.status = 403;
                    context.res.body = { error: error.message };
                }
                
            } else if (req.query.search) {
                // Search documents
                try {
                    const documents = await documentService.searchDocuments(client.clientId, req.query.search);
                    
                    context.res.status = 200;
                    context.res.body = {
                        success: true,
                        documents: documents,
                        count: documents.length
                    };
                } catch (error) {
                    context.res.status = 500;
                    context.res.body = { error: 'Failed to search documents' };
                }
                
            } else {
                // List all client documents
                try {
                    const documents = await documentService.getClientDocuments(client.clientId);
                    
                    context.res.status = 200;
                    context.res.body = {
                        success: true,
                        documents: documents,
                        count: documents.length,
                        client: {
                            name: client.name,
                            clientNumber: client.clientNumber
                        }
                    };
                } catch (error) {
                    context.res.status = 500;
                    context.res.body = { error: 'Failed to load documents' };
                }
            }
        } else {
            context.res.status = 405;
            context.res.body = { error: 'Method not allowed' };
        }

    } catch (error) {
        console.error('Client documents API error:', error);
        context.res.status = 500;
        context.res.body = { error: 'Internal server error' };
    }
};

export default httpTrigger;
