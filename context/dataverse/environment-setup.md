# Azure Function Environment Configuration

## Required Environment Variables

### 1. DATAVERSE_ENVIRONMENT_URL
The base URL of your Dataverse environment.

**Example:**
```
DATAVERSE_ENVIRONMENT_URL=https://org12345.crm.dynamics.com
```

**How to find your environment URL:**
1. Go to [Power Platform Admin Center](https://admin.powerplatform.microsoft.com/)
2. Select your environment
3. Copy the **Environment URL** (without /api/data/v9.2)
4. Or extract from your Power Apps environment URL:
   - From: `https://make.powerapps.com/environments/9e393617-e3e8-e41f-a368-6bde5b1121c3/`
   - Environment ID: `9e393617-e3e8-e41f-a368-6bde5b1121c3`
   - Find corresponding Dataverse URL in admin center

## Azure Static Web Apps Configuration

### 1. Local Development (local.settings.json)
Create `api/local.settings.json` for local testing:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "DATAVERSE_ENVIRONMENT_URL": "https://your-org.crm.dynamics.com"
  }
}
```

### 2. Production Configuration
For Azure Static Web Apps, set environment variables:

1. Go to Azure Portal
2. Navigate to your Static Web App resource
3. Select **Configuration** → **Application settings**
4. Add new setting:
   - **Name**: `DATAVERSE_ENVIRONMENT_URL`
   - **Value**: `https://your-org.crm.dynamics.com`

## Authentication Setup

### 1. Enable Managed Identity
Your Azure Static Web App needs a Managed Identity to authenticate with Dataverse:

1. **Azure Portal** → Your Static Web App → **Identity**
2. **System assigned** → **Status: On** → **Save**
3. Note the **Object (principal) ID** for later use

### 2. Grant Dataverse Permissions
The Managed Identity needs permissions to access Dataverse:

1. **Power Platform Admin Center** → Your environment → **Settings** → **Users + permissions** → **Application users**
2. **+ New app user**
3. **Add an app** → Search for your Azure Static Web App by Object ID
4. **Business unit**: Default business unit
5. **Security roles**: Add appropriate roles:
   - **System User** (minimum required)
   - **Basic User** + custom role with Contact Submissions table permissions
   - Or **System Administrator** (for testing only)

### 3. Custom Security Role (Recommended)
Create a dedicated role for the API:

1. **Power Platform Admin Center** → **Security** → **Security roles**
2. **+ New role** → Name: "Contact API Service"
3. **Custom Entities** tab
4. Find "Contact Submissions" table
5. Set permissions:
   - **Create**: Organization
   - **Read**: Organization (optional, for testing)
   - **Write**: Organization (if updates needed)
6. **Save and Close**
7. Assign this role to your app user

## Testing the Configuration

### 1. Local Testing
```bash
cd api
npm install
npm run build
func start
```

Test endpoint: `POST http://localhost:7071/api/contact`

### 2. Production Testing
After deployment, test with your live endpoint:
`POST https://your-app.azurestaticapps.net/api/contact`

### 3. Connection Test Payload
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "message": "Test message for Dataverse integration",
  "company": "Test Company",
  "service": "consultation"
}
```

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify Managed Identity is enabled
   - Check if app user exists in Dataverse
   - Ensure correct environment URL

2. **Authorization Failed**
   - Verify security role assignments
   - Check table permissions
   - Ensure proper scope (Organization level)

3. **Table Not Found**
   - Verify table exists in Dataverse
   - Check table schema name: `e365_contactsubmissions`
   - Ensure table is published

4. **Environment Variable Not Found**
   - Check Azure Static Web App configuration
   - Verify variable name spelling
   - Restart the application after changes

### Monitoring and Logs

1. **Azure Portal** → Your Static Web App → **Functions** → **Monitor**
2. View real-time logs and execution history
3. Check Application Insights for detailed telemetry

## Security Best Practices

1. **Use Managed Identity** (never use connection strings)
2. **Principle of Least Privilege** (minimal required permissions)
3. **Environment-specific URLs** (separate dev/prod environments)
4. **Regular access reviews** (audit app user permissions)
5. **Monitor usage** (track API calls and access patterns)
