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
const httpTrigger = function (context, req) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        context.log('Client registration function processed a request.');
        // Set CORS headers
        context.res = {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Content-Type": "application/json"
            }
        };
        // Handle preflight OPTIONS request
        if (req.method === "OPTIONS") {
            context.res.status = 200;
            context.res.body = "";
            return;
        }
        if (req.method !== "POST") {
            context.res.status = 405;
            context.res.body = JSON.stringify({ error: "Method not allowed" });
            return;
        }
        try {
            const registrationData = req.body;
            // Validate required fields
            if (!registrationData.firstName || !registrationData.lastName || !registrationData.email || !registrationData.password) {
                context.res.status = 400;
                context.res.body = JSON.stringify({
                    error: "Missing required fields: firstName, lastName, email, and password are required"
                });
                return;
            }
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(registrationData.email)) {
                context.res.status = 400;
                context.res.body = JSON.stringify({ error: "Invalid email format" });
                return;
            }
            // Validate password strength
            if (registrationData.password.length < 8) {
                context.res.status = 400;
                context.res.body = JSON.stringify({ error: "Password must be at least 8 characters long" });
                return;
            }
            const dataverseService = new dataverse_service_1.DataverseService(process.env.DATAVERSE_URL || 'https://org75c51f0f.crm6.dynamics.com/');
            // Check if email already exists
            const existingClient = yield dataverseService.checkEmailExists(registrationData.email);
            if (existingClient) {
                context.res.status = 409;
                context.res.body = JSON.stringify({ error: "An account with this email address already exists" });
                return;
            }
            // Check if client number already exists
            const existingClientNumber = yield dataverseService.checkClientNumberExists(registrationData.clientNumber);
            if (existingClientNumber) {
                // Generate a new client number if collision occurs
                registrationData.clientNumber = yield generateUniqueClientNumber(dataverseService, registrationData.firstName, registrationData.lastName);
            }
            // Hash the password
            const bcrypt = require('bcrypt');
            const saltRounds = 12;
            const passwordHash = yield bcrypt.hash(registrationData.password, saltRounds);
            // Create the full name
            const fullName = `${registrationData.firstName} ${registrationData.lastName}`;
            // Prepare client data for Dataverse
            const clientData = {
                e365_name: fullName,
                e365_firstname: registrationData.firstName,
                e365_surname: registrationData.lastName,
                e365_email: registrationData.email.toLowerCase(),
                e365_passwordhash: passwordHash,
                e365_clientnumber: registrationData.clientNumber,
                e365_company: registrationData.company || '',
                e365_phone: registrationData.phone || '',
                e365_status: 463170000,
                e365_loginattempts: 0,
                e365_accountlocked: false,
                e365_createddate: new Date().toISOString()
            };
            // Create the client record in Dataverse
            const clientId = yield dataverseService.createClientRecord(clientData);
            context.log(`Successfully created client account for: ${registrationData.email}`);
            context.res.status = 201;
            context.res.body = JSON.stringify({
                success: true,
                message: "Account created successfully",
                clientId: clientId,
                clientNumber: registrationData.clientNumber
            });
        }
        catch (error) {
            context.log.error('Error in client registration:', error);
            // Handle specific error types
            if (((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes('duplicate')) || ((_b = error.message) === null || _b === void 0 ? void 0 : _b.includes('already exists'))) {
                context.res.status = 409;
                context.res.body = JSON.stringify({ error: "Account with this information already exists" });
            }
            else if (((_c = error.message) === null || _c === void 0 ? void 0 : _c.includes('authentication')) || ((_d = error.message) === null || _d === void 0 ? void 0 : _d.includes('access'))) {
                context.res.status = 503;
                context.res.body = JSON.stringify({ error: "Service temporarily unavailable. Please try again later." });
            }
            else {
                context.res.status = 500;
                context.res.body = JSON.stringify({
                    error: "Internal server error during registration",
                    details: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        }
    });
};
function generateUniqueClientNumber(dataverseService, firstName, lastName) {
    return __awaiter(this, void 0, void 0, function* () {
        let attempts = 0;
        const maxAttempts = 10;
        while (attempts < maxAttempts) {
            const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
            const randomSuffix = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
            const clientNumber = `CL${initials}${randomSuffix}`;
            const exists = yield dataverseService.checkClientNumberExists(clientNumber);
            if (!exists) {
                return clientNumber;
            }
            attempts++;
        }
        // Fallback: use timestamp if we can't generate unique number
        const timestamp = Date.now().toString();
        return `CL${timestamp.slice(-8)}`;
    });
}
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map