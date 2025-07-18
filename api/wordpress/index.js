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
const httpTrigger = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        // Handle CORS preflight requests
        if (req.method === "OPTIONS") {
            context.res = {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                    "Access-Control-Max-Age": "86400"
                }
            };
            return;
        }
        try {
            // Get WordPress site URL from environment variables
            const wpSiteUrl = process.env.WORDPRESS_SITE_URL || 'https://your-wordpress-site.com';
            // Get the endpoint from the route parameter
            const endpoint = req.params.endpoint || 'posts';
            // Build the WordPress API URL
            const queryString = req.url.includes('?') ? req.url.split('?')[1] : '';
            const wpApiUrl = `${wpSiteUrl}/wp-json/wp/v2/${endpoint}${queryString ? '?' + queryString : ''}`;
            context.log(`Fetching from WordPress: ${wpApiUrl}`);
            // Fetch data from WordPress
            const response = yield fetch(wpApiUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': '365-Evergreen-Static-Site/1.0',
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`WordPress API responded with status: ${response.status}`);
            }
            const data = yield response.json();
            // Return the data with CORS headers
            context.res = {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                    "Content-Type": "application/json",
                    "Cache-Control": "public, max-age=300" // Cache for 5 minutes
                },
                body: data
            };
        }
        catch (error) {
            context.log.error('WordPress API Error:', error.message);
            context.res = {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                },
                body: {
                    error: "Failed to fetch WordPress data",
                    message: error.message,
                    timestamp: new Date().toISOString()
                }
            };
        }
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map