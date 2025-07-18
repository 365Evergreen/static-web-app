// Trigger redeploy
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { DataverseService, ContactSubmissionData } from "../services/dataverse.service";

/**
 * Azure Function to handle contact form submissions
 * Validates input and saves to Dataverse using Managed Identity
 */
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
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
        const submissionData: ContactSubmissionData = {
            name: formData.name?.trim(),
            email: formData.email?.trim().toLowerCase(),
            company: formData.company?.trim() || undefined,
            phone: formData.phone?.trim() || undefined,
            service: formData.service || undefined,
            message: formData.message?.trim(),
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

        // Initialize Dataverse service and save submission
        const dataverseService = new DataverseService(dataverseUrl);
        
        context.log.info('Processing contact form submission', {
            name: submissionData.name,
            email: submissionData.email,
            service: submissionData.service
        });

        // Save to Dataverse
        const recordId = await dataverseService.createContactSubmission(submissionData);
        
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

    } catch (error) {
        context.log.error('Error processing contact form submission:', error);

        // Return appropriate error response
        if (error.message.includes('Authentication failed')) {
            context.res.status = 500;
            context.res.body = {
                error: 'Server authentication error. Please try again later.'
            };
        } else if (error.message.includes('Authorization failed')) {
            context.res.status = 500;
            context.res.body = {
                error: 'Server permission error. Please try again later.'
            };
        } else if (error.message.includes('Invalid') || error.message.includes('required')) {
            context.res.status = 400;
            context.res.body = {
                error: error.message
            };
        } else {
            context.res.status = 500;
            context.res.body = {
                error: 'An unexpected error occurred. Please try again later.'
            };
        }
    }
};

/**
 * Validate form data input
 */
function validateFormData(data: any): string | null {
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
        const validServices = ['microsoft-365', 'power-platform', 'digital-transformation', 'training', 'custom-solutions', 'consultation'];
        if (!validServices.includes(data.service)) {
            return 'Invalid service selection';
        }
    }

    return null; // No validation errors
}

/**
 * Extract client IP address from request headers
 */
function getClientIpAddress(req: HttpRequest): string | undefined {
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

export default httpTrigger;
