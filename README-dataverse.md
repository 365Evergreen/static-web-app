# 365 Evergreen Website - Dataverse Integration Setup

## 🎯 Overview
This guide provides complete instructions for integrating your 365 Evergreen contact form with Microsoft Dataverse, meeting all PRP requirements for secure data submission and storage.

## 📋 Prerequisites
- Azure subscription with Static Web Apps
- Power Platform environment with Dataverse
- Power Apps environment access: https://make.powerapps.com/environments/9e393617-e3e8-e41f-a368-6bde5b1121c3/solutions/6c561a02-0963-f011-bec3-000d3ad05c95
- Azure Developer CLI (azd) installed

## 🏗️ Architecture Overview

```
[Website Form] → [Azure Function] → [Dataverse Table]
      ↓                 ↓                ↓
  [Frontend]    [Managed Identity]   [Contact Submissions]
```

## 📊 Step 1: Create Dataverse Table

### Follow the detailed guide:
📄 **[Table Creation Guide](./context/dataverse/table-creation-guide.md)**

### Quick Summary:
1. Navigate to your Power Apps environment
2. Create new table: "Contact Submissions" (`msl_contactsubmission`)
3. Add all required columns as specified in the schema
4. Publish the table

### Verification:
✅ Table exists with schema name `msl_contactsubmissions`
✅ All required columns are created
✅ Choice fields have correct options
✅ Table is published and available

## 🔐 Step 2: Configure Authentication

### Enable Managed Identity:
1. **Azure Portal** → Your Static Web App → **Identity**
2. **System assigned** → **Status: On** → **Save**
3. Copy the **Object (principal) ID**

### Grant Dataverse Access:
1. **Power Platform Admin Center** → Your environment
2. **Settings** → **Users + permissions** → **Application users**
3. **+ New app user** → Add your Static Web App by Object ID
4. Assign **System User** role or create custom role with table permissions

### Detailed authentication setup:
📄 **[Environment Setup Guide](./context/dataverse/environment-setup.md)**

## ⚙️ Step 3: Configure Environment Variables

### Set in Azure Static Web Apps:
1. **Azure Portal** → Your Static Web App → **Configuration**
2. **Application settings** → **+ Add**
3. Add setting:
   - **Name**: `DATAVERSE_ENVIRONMENT_URL`
   - **Value**: `https://your-org.crm.dynamics.com`

### Find your Dataverse URL:
1. **Power Platform Admin Center** → Your environment
2. Copy the **Environment URL** (base URL without API path)

## 🚀 Step 4: Deploy Updated Code

The code has been updated with Dataverse integration. Deploy the changes:

```bash
# From your project root
azd deploy
```

### What's Updated:
- ✅ Azure Function with Dataverse service
- ✅ Managed Identity authentication
- ✅ Enhanced validation and error handling
- ✅ Proper CORS configuration
- ✅ IP address tracking for security

## 🧪 Step 5: Test the Integration

### Test Payload:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "message": "Test message for Dataverse integration",
  "company": "Test Company",
  "phone": "+61 400 123 456",
  "service": "consultation"
}
```

### Test Methods:

#### A. Using the Website:
1. Navigate to: https://proud-plant-095ef400f.2.azurestaticapps.net/
2. Scroll to contact form
3. Fill out and submit the form
4. Verify success message

#### B. Direct API Testing:
```bash
curl -X POST https://proud-plant-095ef400f.2.azurestaticapps.net/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "message": "Test message"
  }'
```

### Verify in Dataverse:
1. **Power Apps** → **Tables** → **Contact Submissions**
2. **Data** → Check for new record
3. Verify all fields are populated correctly

## 📁 File Structure

```
├── api/
│   ├── contact/
│   │   ├── function.json          # Function binding configuration
│   │   └── index.ts               # Updated with Dataverse integration
│   ├── services/
│   │   └── dataverse.service.ts   # Dataverse API service
│   ├── host.json                  # Function host configuration
│   ├── package.json               # Updated dependencies
│   └── tsconfig.json              # TypeScript configuration
├── context/
│   └── dataverse/
│       ├── table-schema.md        # Complete table schema documentation
│       ├── table-definition.json  # Table structure for import
│       ├── table-creation-guide.md # Step-by-step table creation
│       ├── environment-setup.md   # Authentication and configuration
│       └── power-automate-alternative.md # Low-code alternative
├── index.html                     # Updated with enhanced contact form
└── README-dataverse.md           # This file
```

## 🔄 Alternative: Power Automate Flow

For a low-code approach, see:
📄 **[Power Automate Alternative](./context/dataverse/power-automate-alternative.md)**

## 🛠️ Troubleshooting

### Common Issues:

#### Authentication Errors:
- ✅ Verify Managed Identity is enabled
- ✅ Check app user exists in Dataverse
- ✅ Confirm security role assignments

#### Table Not Found:
- ✅ Verify table schema name: `msl_contactsubmissions`
- ✅ Ensure table is published
- ✅ Check environment URL is correct

#### Permission Denied:
- ✅ Verify security role has Create permissions
- ✅ Check organization-level access
- ✅ Ensure table permissions are set

### Debug Steps:
1. Check Azure Function logs in Portal
2. Test Dataverse connection separately
3. Verify environment variables
4. Check CORS configuration

## 📈 Monitoring and Analytics

### Azure Application Insights:
- Function execution logs
- Performance metrics
- Error tracking
- Custom telemetry

### Power Platform Analytics:
- Dataverse usage statistics
- Table access patterns
- API call monitoring

## 🔒 Security Features

- ✅ **Managed Identity authentication** (no hardcoded credentials)
- ✅ **Input validation and sanitization**
- ✅ **CORS protection**
- ✅ **IP address logging** for security audit
- ✅ **Error message sanitization** (no sensitive data exposure)
- ✅ **Rate limiting** (via Azure Functions)

## 📋 Compliance & Governance

- ✅ **PRP Requirements**: All functional requirements met
- ✅ **Context Engineering**: Documented schemas and flows
- ✅ **Security**: Managed Identity and validation
- ✅ **Audit Trail**: Submission timestamps and IP tracking
- ✅ **Data Governance**: Structured Dataverse storage

## 🎉 Success Criteria

When setup is complete, you should have:

- ✅ Contact form submitting to Dataverse
- ✅ All form data properly stored
- ✅ Secure authentication with Managed Identity
- ✅ Proper error handling and validation
- ✅ Real-time submission tracking
- ✅ Comprehensive monitoring and logging

## 🆘 Support

If you encounter issues:

1. **Check the troubleshooting section** in environment setup guide
2. **Review Azure Function logs** in Azure Portal
3. **Verify Dataverse table permissions** in Power Platform Admin Center
4. **Test authentication** using the connection test endpoint

## 📚 Additional Resources

- [Microsoft Dataverse Documentation](https://docs.microsoft.com/en-us/powerapps/maker/data-platform/)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Managed Identity Documentation](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/)
- [Power Platform Security](https://docs.microsoft.com/en-us/power-platform/admin/security/)

---

**🎯 Your 365 Evergreen website now has enterprise-grade contact form submission with secure Dataverse integration!**
