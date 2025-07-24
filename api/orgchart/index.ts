import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { GraphAuthService } from "../services/graph-auth.service";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // Set CORS headers
    context.res = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    };

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        context.res.status = 200;
        return;
    }

    try {
        const action = req.query.action || req.body?.action;

        if (!action) {
            context.res = {
                ...context.res,
                status: 400,
                body: { 
                    error: 'Missing action parameter. Supported actions: getUsers, getOrgChart, getUserPhoto' 
                }
            };
            return;
        }

        // Initialize Graph service
        const graphService = new GraphAuthService();

        switch (action) {
            case 'getUsers':
                await handleGetUsers(context, graphService);
                break;
            
            case 'getOrgChart':
                await handleGetOrgChart(context, graphService);
                break;
            
            case 'getUserPhoto':
                const userId = req.query.userId || req.body?.userId;
                if (!userId) {
                    context.res = {
                        ...context.res,
                        status: 400,
                        body: { error: 'Missing userId parameter' }
                    };
                    return;
                }
                await handleGetUserPhoto(context, graphService, userId);
                break;
            
            case 'testConnection':
                await handleTestConnection(context, graphService);
                break;
            
            default:
                context.res = {
                    ...context.res,
                    status: 400,
                    body: { 
                        error: `Unsupported action: ${action}. Supported actions: getUsers, getOrgChart, getUserPhoto, testConnection` 
                    }
                };
        }

    } catch (error) {
        console.error('Organizational chart API error:', error);
        
        context.res = {
            ...context.res,
            status: 500,
            body: {
                error: 'Internal server error',
                message: error.message,
                timestamp: new Date().toISOString()
            }
        };
    }
};

/**
 * Handle getting all users
 */
async function handleGetUsers(context: Context, graphService: GraphAuthService): Promise<void> {
    try {
        const users = await graphService.getUsers();
        
        context.res = {
            ...context.res,
            status: 200,
            body: {
                success: true,
                data: users,
                count: users.length,
                timestamp: new Date().toISOString()
            }
        };

    } catch (error) {
        console.error('Error getting users:', error);
        throw error;
    }
}

/**
 * Handle getting organizational chart structure
 */
async function handleGetOrgChart(context: Context, graphService: GraphAuthService): Promise<void> {
    try {
        // Get all users first
        const users = await graphService.getUsers();
        
        // Build organizational chart
        const orgChart = graphService.buildOrgChart(users);
        
        context.res = {
            ...context.res,
            status: 200,
            body: {
                success: true,
                data: orgChart,
                totalUsers: users.length,
                timestamp: new Date().toISOString()
            }
        };

    } catch (error) {
        console.error('Error building organizational chart:', error);
        throw error;
    }
}

/**
 * Handle getting user profile photo
 */
async function handleGetUserPhoto(context: Context, graphService: GraphAuthService, userId: string): Promise<void> {
    try {
        const photoData = await graphService.getUserPhoto(userId);
        
        context.res = {
            ...context.res,
            status: 200,
            body: {
                success: true,
                data: {
                    userId: userId,
                    photoUrl: photoData
                },
                timestamp: new Date().toISOString()
            }
        };

    } catch (error) {
        console.error(`Error getting photo for user ${userId}:`, error);
        throw error;
    }
}

/**
 * Handle testing Graph API connection
 */
async function handleTestConnection(context: Context, graphService: GraphAuthService): Promise<void> {
    try {
        const isConnected = await graphService.testConnection();
        
        context.res = {
            ...context.res,
            status: 200,
            body: {
                success: true,
                connected: isConnected,
                message: isConnected ? 'Microsoft Graph connection is working' : 'Microsoft Graph connection failed',
                timestamp: new Date().toISOString()
            }
        };

    } catch (error) {
        console.error('Error testing Graph connection:', error);
        throw error;
    }
}

export default httpTrigger;