import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { DataverseService, ClientData } from '../services/dataverse.service';

interface ClientRegistrationData {
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
    phone?: string;
    password: string;
    clientNumber: string;
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
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
        const registrationData: ClientRegistrationData = req.body;

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

        const dataverseService = new DataverseService(process.env.DATAVERSE_URL || 'https://org75c51f0f.crm6.dynamics.com/');

        // Check if email already exists
        const existingClient = await dataverseService.checkEmailExists(registrationData.email);
        if (existingClient) {
            context.res.status = 409;
            context.res.body = JSON.stringify({ error: "An account with this email address already exists" });
            return;
        }

        // Check if client number already exists
        const existingClientNumber = await dataverseService.checkClientNumberExists(registrationData.clientNumber);
        if (existingClientNumber) {
            // Generate a new client number if collision occurs
            registrationData.clientNumber = await generateUniqueClientNumber(dataverseService, registrationData.firstName, registrationData.lastName);
        }

        // Hash the password
        const bcrypt = require('bcrypt');
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(registrationData.password, saltRounds);

        // Create the full name
        const fullName = `${registrationData.firstName} ${registrationData.lastName}`;

        // Prepare client data for Dataverse
        const clientData: ClientData = {
            e365_name: fullName,
            e365_firstname: registrationData.firstName,
            e365_surname: registrationData.lastName,
            e365_email: registrationData.email.toLowerCase(),
            e365_passwordhash: passwordHash,
            e365_clientnumber: registrationData.clientNumber,
            e365_company: registrationData.company || '',
            e365_phone: registrationData.phone || '',
            e365_status: 463170000, // Active status
            e365_loginattempts: 0,
            e365_accountlocked: false,
            e365_createddate: new Date().toISOString()
        };

        // Create the client record in Dataverse
        const clientId = await dataverseService.createClientRecord(clientData);

        context.log(`Successfully created client account for: ${registrationData.email}`);

        context.res.status = 201;
        context.res.body = JSON.stringify({
            success: true,
            message: "Account created successfully",
            clientId: clientId,
            clientNumber: registrationData.clientNumber
        });

    } catch (error) {
        context.log.error('Error in client registration:', error);
        
        // Handle specific error types
        if (error.message?.includes('duplicate') || error.message?.includes('already exists')) {
            context.res.status = 409;
            context.res.body = JSON.stringify({ error: "Account with this information already exists" });
        } else if (error.message?.includes('authentication') || error.message?.includes('access')) {
            context.res.status = 503;
            context.res.body = JSON.stringify({ error: "Service temporarily unavailable. Please try again later." });
        } else {
            context.res.status = 500;
            context.res.body = JSON.stringify({ 
                error: "Internal server error during registration",
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

async function generateUniqueClientNumber(dataverseService: DataverseService, firstName: string, lastName: string): Promise<string> {
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
        const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
        const randomSuffix = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
        const clientNumber = `CL${initials}${randomSuffix}`;
        
        const exists = await dataverseService.checkClientNumberExists(clientNumber);
        if (!exists) {
            return clientNumber;
        }
        
        attempts++;
    }
    
    // Fallback: use timestamp if we can't generate unique number
    const timestamp = Date.now().toString();
    return `CL${timestamp.slice(-8)}`;
}

export default httpTrigger;
