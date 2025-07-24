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
const graph_auth_service_1 = require("../services/graph-auth.service");
const httpTrigger = function (context, req) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
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
            const action = req.query.action || ((_a = req.body) === null || _a === void 0 ? void 0 : _a.action);
            if (!action) {
                context.res = Object.assign(Object.assign({}, context.res), { status: 400, body: {
                        error: 'Missing action parameter. Supported actions: getUsers, getOrgChart, getUserPhoto'
                    } });
                return;
            }
            // Initialize Graph service
            const graphService = new graph_auth_service_1.GraphAuthService();
            switch (action) {
                case 'getUsers':
                    yield handleGetUsers(context, graphService);
                    break;
                case 'getOrgChart':
                    yield handleGetOrgChart(context, graphService);
                    break;
                case 'getUserPhoto':
                    const userId = req.query.userId || ((_b = req.body) === null || _b === void 0 ? void 0 : _b.userId);
                    if (!userId) {
                        context.res = Object.assign(Object.assign({}, context.res), { status: 400, body: { error: 'Missing userId parameter' } });
                        return;
                    }
                    yield handleGetUserPhoto(context, graphService, userId);
                    break;
                case 'testConnection':
                    yield handleTestConnection(context, graphService);
                    break;
                default:
                    context.res = Object.assign(Object.assign({}, context.res), { status: 400, body: {
                            error: `Unsupported action: ${action}. Supported actions: getUsers, getOrgChart, getUserPhoto, testConnection`
                        } });
            }
        }
        catch (error) {
            console.error('Organizational chart API error:', error);
            context.res = Object.assign(Object.assign({}, context.res), { status: 500, body: {
                    error: 'Internal server error',
                    message: error.message,
                    timestamp: new Date().toISOString()
                } });
        }
    });
};
/**
 * Handle getting all users
 */
function handleGetUsers(context, graphService) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield graphService.getUsers();
            context.res = Object.assign(Object.assign({}, context.res), { status: 200, body: {
                    success: true,
                    data: users,
                    count: users.length,
                    timestamp: new Date().toISOString()
                } });
        }
        catch (error) {
            console.error('Error getting users:', error);
            throw error;
        }
    });
}
/**
 * Handle getting organizational chart structure
 */
function handleGetOrgChart(context, graphService) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get all users first
            const users = yield graphService.getUsers();
            // Build organizational chart
            const orgChart = graphService.buildOrgChart(users);
            context.res = Object.assign(Object.assign({}, context.res), { status: 200, body: {
                    success: true,
                    data: orgChart,
                    totalUsers: users.length,
                    timestamp: new Date().toISOString()
                } });
        }
        catch (error) {
            console.error('Error building organizational chart:', error);
            throw error;
        }
    });
}
/**
 * Handle getting user profile photo
 */
function handleGetUserPhoto(context, graphService, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const photoData = yield graphService.getUserPhoto(userId);
            context.res = Object.assign(Object.assign({}, context.res), { status: 200, body: {
                    success: true,
                    data: {
                        userId: userId,
                        photoUrl: photoData
                    },
                    timestamp: new Date().toISOString()
                } });
        }
        catch (error) {
            console.error(`Error getting photo for user ${userId}:`, error);
            throw error;
        }
    });
}
/**
 * Handle testing Graph API connection
 */
function handleTestConnection(context, graphService) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isConnected = yield graphService.testConnection();
            context.res = Object.assign(Object.assign({}, context.res), { status: 200, body: {
                    success: true,
                    connected: isConnected,
                    message: isConnected ? 'Microsoft Graph connection is working' : 'Microsoft Graph connection failed',
                    timestamp: new Date().toISOString()
                } });
        }
        catch (error) {
            console.error('Error testing Graph connection:', error);
            throw error;
        }
    });
}
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map