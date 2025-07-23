# Making the Contact Form Reusable for Multiple Solutions and Tables

This guide provides step-by-step instructions for adapting the current contact form to work with different Dataverse environments, tables, and business scenarios.

## 📋 Table of Contents

1. [Environment Configuration](#environment-configuration)
2. [Table Structure Adaptation](#table-structure-adaptation)
3. [Service Principal Setup](#service-principal-setup)
4. [Code Modifications](#code-modifications)
5. [Frontend Form Adaptation](#frontend-form-adaptation)
6. [Deployment and Testing](#deployment-and-testing)
7. [Example Scenarios](#example-scenarios)

## 🔧 Environment Configuration

### Step 1: Create Environment Variables Template

Create a `.env.template` file in your project root:

```env
# Dataverse Environment Configuration
DATAVERSE_ENVIRONMENT_URL=https://your-org.crm.dynamics.com/
DATAVERSE_TABLE_NAME=your_custom_table

# Service Principal Authentication
AZURE_CLIENT_ID=your-app-registration-id
AZURE_CLIENT_SECRET=your-app-registration-secret
AZURE_TENANT_ID=your-tenant-id

# Optional: Custom Configuration
FORM_TYPE=contact|support|registration|custom
API_ENDPOINT_NAME=contact
```

### Step 2: Update Application Settings

For each deployment, configure these environment variables in:
- **Azure Static Web Apps**: Configuration → Application settings
- **Local Development**: `.env` file (not committed to git)
- **GitHub Actions**: Repository secrets

## 🗃️ Table Structure Adaptation

### Step 3: Define Your Table Schema

Create a configuration file `table-schemas.json`:

```json
{
  "contact_form": {
    "tableName": "e365_contactsubmissions",
    "fields": {
      "name": "e365_name",
      "email": "e365_email", 
      "company": "e365_company",
      "phone": "e365_phonenumber",
      "service": "e365_service",
      "message": "e365_message",
      "ipAddress": "e365_ipaddress",
      "status": "e365_contactstatus"
    },
    "required": ["name", "email", "message"],
    "choiceFields": {
      "service": {
        "microsoft-365": 463170000,
        "power-platform": 463170001,
        "digital-transformation": 463170002,
        "training": 463170003,
        "custom-solutions": 463170004,
        "consultation": 463170005
      },
      "status": {
        "new": 463170000,
        "in-progress": 463170001,
        "completed": 463170002
      }
    }
  },
  "support_ticket": {
    "tableName": "e365_supporttickets",
    "fields": {
      "title": "e365_title",
      "description": "e365_description",
      "priority": "e365_priority",
      "category": "e365_category",
      "submittedBy": "e365_submittedby",
      "email": "e365_email",
      "phone": "e365_phone"
    },
    "required": ["title", "description", "email"],
    "choiceFields": {
      "priority": {
        "low": 1,
        "medium": 2,
        "high": 3,
        "critical": 4
      },
      "category": {
        "technical": 100000000,
        "billing": 100000001,
        "general": 100000002
      }
    }
  }
}
```

## 🔐 Service Principal Setup

### Step 4: Create New Service Principal (If Needed)

For each new Dataverse environment:

1. **Azure Portal** → App registrations → New registration
2. Name: `YourApp-Dataverse-{Environment}`
3. **API Permissions** → Add permission → Dynamics CRM → user_impersonation
4. **Certificates & secrets** → New client secret
5. **Power Platform Admin Center** → Add as application user with appropriate roles

## 💻 Code Modifications

### Step 5: Create Generic Dataverse Service

Create `api/services/generic-dataverse.service.ts`:

```typescript
import axios, { AxiosInstance } from 'axios';

export interface TableSchema {
    tableName: string;
    fields: Record<string, string>;
    required: string[];
    choiceFields?: Record<string, Record<string, number>>;
}

export interface FormSubmissionData {
    [key: string]: any;
}

export class GenericDataverseService {
    private httpClient: AxiosInstance;
    private baseUrl: string;
    private accessToken: string | null = null;
    private tokenExpiry: Date | null = null;
    private clientId: string;
    private clientSecret: string;
    private tenantId: string;
    private schema: TableSchema;

    constructor(environmentUrl: string, schema: TableSchema) {
        this.baseUrl = `${environmentUrl.replace(/\/$/, '')}/api/data/v9.2`;
        this.schema = schema;
        
        // Get authentication configuration
        this.clientId = process.env.AZURE_CLIENT_ID || '';
        this.clientSecret = process.env.AZURE_CLIENT_SECRET || '';
        this.tenantId = process.env.AZURE_TENANT_ID || '';

        if (!this.clientId || !this.clientSecret || !this.tenantId) {
            throw new Error('Missing authentication configuration');
        }
        
        this.setupHttpClient();
    }

    private setupHttpClient(): void {
        this.httpClient = axios.create({
            baseURL: this.baseUrl,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0'
            }
        });

        // Add request interceptor for authentication
        this.httpClient.interceptors.request.use(async (config) => {
            const token = await this.getAccessToken();
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        });
    }

    private async getAccessToken(): Promise<string> {
        // Check if we have a valid cached token
        if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
            return this.accessToken;
        }

        try {
            const tokenUrl = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
            const scope = `${this.baseUrl.replace('/api/data/v9.2', '')}/.default`;

            const params = new URLSearchParams();
            params.append('grant_type', 'client_credentials');
            params.append('client_id', this.clientId);
            params.append('client_secret', this.clientSecret);
            params.append('scope', scope);

            const response = await axios.post(tokenUrl, params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            this.accessToken = response.data.access_token;
            const expiresIn = response.data.expires_in || 3600;
            this.tokenExpiry = new Date(Date.now() + (expiresIn - 300) * 1000);
            
            return this.accessToken;
        } catch (error) {
            console.error('Authentication failed:', error);
            throw new Error('Unable to authenticate with Dataverse');
        }
    }

    async createRecord(submissionData: FormSubmissionData): Promise<string> {
        try {
            // Validate required fields
            this.validateSubmission(submissionData);

            // Transform data to Dataverse format
            const dataversePayload = this.transformToDataverse(submissionData);

            console.log('Creating record in table:', this.schema.tableName);

            // Create the record
            const response = await this.httpClient.post(`/${this.schema.tableName}`, dataversePayload);

            // Extract entity ID
            const entityId = this.extractEntityId(response.headers['odata-entityid']);
            console.log('Successfully created record:', entityId);
            
            return entityId;
        } catch (error) {
            console.error('Error creating record:', error);
            this.handleDataverseError(error);
        }
    }

    private validateSubmission(data: FormSubmissionData): void {
        // Check required fields
        for (const requiredField of this.schema.required) {
            if (!data[requiredField]?.toString().trim()) {
                throw new Error(`${requiredField} is required`);
            }
        }

        // Add custom validation logic here
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            throw new Error('Invalid email format');
        }
    }

    private transformToDataverse(data: FormSubmissionData): Record<string, any> {
        const payload: Record<string, any> = {};

        // Map each field according to schema
        for (const [frontendField, dataverseField] of Object.entries(this.schema.fields)) {
            if (data[frontendField] !== undefined && data[frontendField] !== null) {
                // Handle choice fields
                if (this.schema.choiceFields?.[frontendField]) {
                    const choiceValue = this.schema.choiceFields[frontendField][data[frontendField]];
                    payload[dataverseField] = choiceValue || null;
                } else {
                    payload[dataverseField] = data[frontendField];
                }
            }
        }

        return payload;
    }

    private extractEntityId(entityIdUrl: string): string {
        if (!entityIdUrl) {
            throw new Error('No entity ID returned from Dataverse');
        }

        const match = entityIdUrl.match(/\(([^)]+)\)$/);
        if (!match) {
            throw new Error('Invalid entity ID format');
        }

        return match[1];
    }

    private handleDataverseError(error: any): never {
        if (error.response?.status === 401) {
            throw new Error('Authentication failed: Check Service Principal configuration');
        } else if (error.response?.status === 403) {
            throw new Error('Authorization failed: Insufficient permissions');
        } else if (error.response?.status === 400) {
            throw new Error(`Bad request: ${error.response?.data?.error?.message || 'Invalid data'}`);
        }
        
        throw new Error('Failed to save submission to Dataverse');
    }

    async testConnection(): Promise<boolean> {
        try {
            await this.httpClient.get(`/${this.schema.tableName}?$top=1`);
            return true;
        } catch (error) {
            console.error('Connection test failed:', error);
            return false;
        }
    }
}
```

### Step 6: Create Configuration Loader

Create `api/services/config-loader.service.ts`:

```typescript
import { TableSchema } from './generic-dataverse.service';
import * as tableSchemas from '../config/table-schemas.json';

export class ConfigLoader {
    static getTableSchema(formType: string): TableSchema {
        const schemas = tableSchemas as Record<string, TableSchema>;
        const schema = schemas[formType];
        
        if (!schema) {
            throw new Error(`No schema found for form type: ${formType}`);
        }
        
        return schema;
    }

    static getEnvironmentUrl(): string {
        const url = process.env.DATAVERSE_ENVIRONMENT_URL;
        if (!url) {
            throw new Error('DATAVERSE_ENVIRONMENT_URL environment variable is required');
        }
        return url;
    }

    static getFormType(): string {
        return process.env.FORM_TYPE || 'contact_form';
    }
}
```

### Step 7: Update Azure Function

Create a generic `api/generic-form/index.ts`:

```typescript
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { GenericDataverseService } from "../services/generic-dataverse.service";
import { ConfigLoader } from "../services/config-loader.service";

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
        if (!req.body) {
            context.res.status = 400;
            context.res.body = { error: 'Request body is required' };
            return;
        }

        // Load configuration
        const formType = ConfigLoader.getFormType();
        const schema = ConfigLoader.getTableSchema(formType);
        const environmentUrl = ConfigLoader.getEnvironmentUrl();

        // Initialize service
        const dataverseService = new GenericDataverseService(environmentUrl, schema);

        // Add metadata
        const submissionData = {
            ...req.body,
            ipAddress: getClientIpAddress(req),
            submittedAt: new Date().toISOString()
        };

        // Create record
        const recordId = await dataverseService.createRecord(submissionData);

        // Success response
        context.res.status = 200;
        context.res.body = {
            message: 'Thank you! Your submission has been received.',
            submissionId: recordId,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error('Form submission error:', error);
        
        context.res.status = 500;
        context.res.body = {
            error: error.message || 'An error occurred while processing your submission'
        };
    }
};

function getClientIpAddress(req: HttpRequest): string | undefined {
    const ipHeaders = ['x-forwarded-for', 'x-real-ip', 'x-client-ip'];
    
    for (const header of ipHeaders) {
        const ip = req.headers[header];
        if (ip && typeof ip === 'string') {
            return ip.split(',')[0].trim();
        }
    }
    
    return undefined;
}

export default httpTrigger;
```

## 🎨 Frontend Form Adaptation

### Step 8: Create Dynamic Form Generator

Create `js/form-generator.js`:

```javascript
class DynamicFormGenerator {
    constructor(formConfig) {
        this.config = formConfig;
        this.apiEndpoint = formConfig.apiEndpoint || '/api/generic-form';
    }

    generateForm(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const form = document.createElement('form');
        form.id = 'dynamic-form';
        form.className = 'dynamic-form';

        // Generate fields
        this.config.fields.forEach(field => {
            const fieldContainer = this.createField(field);
            form.appendChild(fieldContainer);
        });

        // Add submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = this.config.submitText || 'Submit';
        submitButton.className = 'btn btn-primary';
        form.appendChild(submitButton);

        // Add event listener
        form.addEventListener('submit', (e) => this.handleSubmit(e));

        container.appendChild(form);
    }

    createField(fieldConfig) {
        const container = document.createElement('div');
        container.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = fieldConfig.label;
        label.setAttribute('for', fieldConfig.name);
        if (fieldConfig.required) {
            label.innerHTML += ' <span class="required">*</span>';
        }

        let input;
        
        switch (fieldConfig.type) {
            case 'select':
                input = document.createElement('select');
                fieldConfig.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.textContent = option.label;
                    input.appendChild(optionElement);
                });
                break;
            case 'textarea':
                input = document.createElement('textarea');
                input.rows = fieldConfig.rows || 4;
                break;
            default:
                input = document.createElement('input');
                input.type = fieldConfig.type || 'text';
                break;
        }

        input.id = fieldConfig.name;
        input.name = fieldConfig.name;
        input.className = 'form-control';
        input.required = fieldConfig.required || false;
        
        if (fieldConfig.placeholder) {
            input.placeholder = fieldConfig.placeholder;
        }

        container.appendChild(label);
        container.appendChild(input);

        return container;
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                this.showSuccess(result.message);
                event.target.reset();
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            console.error('Submission error:', error);
            this.showError('An error occurred. Please try again.');
        }
    }

    showSuccess(message) {
        // Implement success notification
        alert(message);
    }

    showError(message) {
        // Implement error notification  
        alert('Error: ' + message);
    }
}
```

### Step 9: Create Form Configuration Files

Create `config/forms/contact-form.json`:

```json
{
    "apiEndpoint": "/api/contact",
    "submitText": "Send Message",
    "fields": [
        {
            "name": "name",
            "type": "text",
            "label": "Full Name",
            "required": true,
            "placeholder": "Enter your full name"
        },
        {
            "name": "email", 
            "type": "email",
            "label": "Email Address",
            "required": true,
            "placeholder": "your.email@example.com"
        },
        {
            "name": "company",
            "type": "text", 
            "label": "Company",
            "placeholder": "Your company name"
        },
        {
            "name": "service",
            "type": "select",
            "label": "Service Interested In",
            "options": [
                {"value": "", "label": "Select a service..."},
                {"value": "microsoft-365", "label": "Microsoft 365 Implementation"},
                {"value": "power-platform", "label": "Power Platform Development"},
                {"value": "digital-transformation", "label": "Digital Transformation"},
                {"value": "training", "label": "Training & Support"},
                {"value": "custom-solutions", "label": "Custom Business Solutions"},
                {"value": "consultation", "label": "General Consultation"}
            ]
        },
        {
            "name": "message",
            "type": "textarea",
            "label": "Message",
            "required": true,
            "rows": 5,
            "placeholder": "Tell us about your project or requirements..."
        }
    ]
}
```

## 🚀 Deployment and Testing

### Step 10: Environment-Specific Deployment

1. **Create separate branches** for different environments:
   ```bash
   git checkout -b environment/development
   git checkout -b environment/staging  
   git checkout -b environment/production
   ```

2. **Configure GitHub Actions** with environment-specific variables:
   ```yaml
   env:
     DATAVERSE_ENVIRONMENT_URL: ${{ secrets.DATAVERSE_URL }}
     FORM_TYPE: ${{ secrets.FORM_TYPE }}
     AZURE_CLIENT_ID: ${{ secrets.AZURE_CLIENT_ID }}
     # ... other variables
   ```

3. **Test each configuration**:
   ```bash
   # Test API endpoint
   curl -X POST "https://your-app.azurestaticapps.net/api/generic-form" \
        -H "Content-Type: application/json" \
        -d '{"name":"Test","email":"test@example.com"}'
   ```

## 📝 Example Scenarios

### Scenario 1: Support Ticket System

Environment Variables:
```env
FORM_TYPE=support_ticket
DATAVERSE_TABLE_NAME=e365_supporttickets
API_ENDPOINT_NAME=support
```

Form Configuration:
```json
{
    "apiEndpoint": "/api/support",
    "fields": [
        {"name": "title", "type": "text", "label": "Issue Title", "required": true},
        {"name": "priority", "type": "select", "label": "Priority", "options": [...]},
        {"name": "description", "type": "textarea", "label": "Description", "required": true}
    ]
}
```

### Scenario 2: Event Registration

Environment Variables:
```env
FORM_TYPE=event_registration
DATAVERSE_TABLE_NAME=e365_eventregistrations
```

### Scenario 3: Lead Generation

Environment Variables:
```env
FORM_TYPE=lead_generation
DATAVERSE_TABLE_NAME=leads
```

## 🔄 Migration Checklist

When adapting for a new use case:

- [ ] Define table schema in `table-schemas.json`
- [ ] Create Service Principal for target environment  
- [ ] Set environment variables
- [ ] Create form configuration JSON
- [ ] Update validation rules if needed
- [ ] Test API endpoint
- [ ] Test frontend form
- [ ] Deploy to target environment
- [ ] Configure monitoring and logging

## 📚 Additional Resources

- [Dataverse Web API Reference](https://docs.microsoft.com/en-us/powerapps/developer/data-platform/webapi/)
- [Azure Static Web Apps Configuration](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Service Principal Authentication](https://docs.microsoft.com/en-us/azure/active-directory/develop/app-objects-and-service-principals)

This guide provides a flexible foundation for creating reusable forms across multiple Dataverse environments and business scenarios.
