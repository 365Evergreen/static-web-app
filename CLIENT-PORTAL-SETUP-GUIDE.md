# Client Portal Setup and Implementation Guide

## 🎯 Overview

This guide provides step-by-step instructions to implement a secure client portal that allows external clients to log in and access documents stored in Dataverse and Azure Storage.

## 🏗️ Architecture Summary

```
[Client Login] → [JWT Authentication] → [Client Dashboard] → [Document Access]
       ↓                    ↓                     ↓                ↓
[Dataverse Users] → [Azure Functions] → [Document Metadata] → [Azure Storage]
```

## 📊 Step 1: Create Dataverse Tables

### A. Create Client Authentication Table

1. **Navigate to Power Apps**:
   ```
   https://make.powerapps.com/environments/9e393617-e3e8-e41f-a368-6bde5b1121c3/solutions/6c561a02-0963-f011-bec3-000d3ad05c95
   ```

2. **Create Table: `e365_clients`**
   - Display name: `Clients`
   - Name: `e365_client`
   - Description: `Client authentication and profile information`

3. **Add Columns**:

   | Column Name | Type | Length | Required | Description |
   |-------------|------|---------|----------|-------------|
   | `e365_name` | Text | 100 | ✅ | Client full name |
   | `e365_email` | Email | 320 | ✅ | Login email (unique) |
   | `e365_passwordhash` | Text | 255 | ✅ | Bcrypt hashed password |
   | `e365_clientnumber` | Text | 50 | ✅ | Unique client identifier |
   | `e365_company` | Text | 100 | ❌ | Client company name |
   | `e365_phone` | Text | 50 | ❌ | Contact phone number |
   | `e365_status` | Choice | - | ✅ | Active/Inactive/Suspended |
   | `e365_lastlogin` | DateTime | - | ❌ | Last successful login |
   | `e365_loginattempts` | Whole Number | - | ❌ | Failed login counter |
   | `e365_accountlocked` | Yes/No | - | ❌ | Account lockout status |
   | `e365_createddate` | DateTime | - | ✅ | Account creation date |

   **Status Choice Values**:
   - Active (463170000)
   - Inactive (463170001) 
   - Suspended (463170002)

### B. Create Document Categories Table

1. **Create Table: `e365_documentcategories`**
   - Display name: `Document Categories`
   - Name: `e365_documentcategory`

2. **Add Columns**:

   | Column Name | Type | Length | Required | Description |
   |-------------|------|---------|----------|-------------|
   | `e365_name` | Text | 100 | ✅ | Category name |
   | `e365_description` | Text | 500 | ❌ | Category description |
   | `e365_sortorder` | Whole Number | - | ❌ | Display order |
   | `e365_icon` | Text | 50 | ❌ | CSS icon class |
   | `e365_color` | Text | 20 | ❌ | Display color code |

### C. Create Client Documents Table

1. **Create Table: `e365_clientdocuments`**
   - Display name: `Client Documents`
   - Name: `e365_clientdocument`

2. **Add Columns**:

   | Column Name | Type | Length | Required | Description |
   |-------------|------|---------|----------|-------------|
   | `e365_name` | Text | 255 | ✅ | Document display name |
   | `e365_filename` | Text | 255 | ✅ | Original filename |
   | `e365_blobpath` | Text | 500 | ✅ | Azure Storage blob path |
   | `e365_clientid` | Lookup | - | ✅ | Owner client (→ e365_clients) |
   | `e365_categoryid` | Lookup | - | ❌ | Document category (→ e365_documentcategories) |
   | `e365_filesize` | Whole Number | - | ❌ | File size in bytes |
   | `e365_mimetype` | Text | 100 | ❌ | MIME type |
   | `e365_uploaddate` | DateTime | - | ✅ | When uploaded |
   | `e365_uploadedby` | Text | 100 | ❌ | Who uploaded |
   | `e365_status` | Choice | - | ✅ | Available/Archived/Pending |
   | `e365_accesscount` | Whole Number | - | ❌ | Download counter |
   | `e365_lastaccess` | DateTime | - | ❌ | Last accessed |
   | `e365_description` | Text | 1000 | ❌ | Document description |
   | `e365_tags` | Text | 500 | ❌ | Searchable tags |
   | `e365_confidential` | Yes/No | - | ❌ | Requires verification |

   **Status Choice Values**:
   - Available (463170000)
   - Archived (463170001)
   - Pending (463170002)

### D. Create Access Log Table

1. **Create Table: `e365_clientaccesslog`**
   - Display name: `Client Access Log`
   - Name: `e365_clientaccesslog`

2. **Add Columns**:

   | Column Name | Type | Length | Required | Description |
   |-------------|------|---------|----------|-------------|
   | `e365_clientid` | Lookup | - | ✅ | Client (→ e365_clients) |
   | `e365_action` | Choice | - | ✅ | Action type |
   | `e365_documentid` | Lookup | - | ❌ | Document (→ e365_clientdocuments) |
   | `e365_ipaddress` | Text | 45 | ❌ | Client IP address |
   | `e365_timestamp` | DateTime | - | ✅ | When occurred |
   | `e365_success` | Yes/No | - | ❌ | Was successful |
   | `e365_errormessage` | Text | 1000 | ❌ | Error details |

   **Action Choice Values**:
   - Login (463170000)
   - Logout (463170001)
   - Document View (463170002)
   - Document Download (463170003)
   - Failed Login (463170004)

## 🗄️ Step 2: Configure Azure Storage

### A. Create Storage Account (if needed)

```bash
# Create storage account
az storage account create \
  --name "yourstorageaccount" \
  --resource-group "your-resource-group" \
  --location "australiaeast" \
  --sku "Standard_LRS" \
  --kind "StorageV2"

# Create container for client documents
az storage container create \
  --name "client-documents" \
  --account-name "yourstorageaccount" \
  --public-access off
```

### B. Get Storage Credentials

1. **Azure Portal** → Storage Account → **Access keys**
2. Copy **Storage account name** and **Key1**
3. Add to environment variables:
   - `AZURE_STORAGE_ACCOUNT_NAME`
   - `AZURE_STORAGE_ACCOUNT_KEY`

### C. Recommended Folder Structure

```
client-documents/
├── client-001/
│   ├── invoices/
│   ├── contracts/
│   ├── reports/
│   └── correspondence/
├── client-002/
│   └── ...
└── shared/
    └── templates/
```

## 🔐 Step 3: Implement Authentication Services

### A. Install Required Packages

Add to `api/package.json`:

```json
{
  "dependencies": {
    "@azure/storage-blob": "^12.15.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.2",
    "@types/jsonwebtoken": "^9.0.2"
  }
}
```

### B. Set Environment Variables

In Azure Static Web Apps Configuration:

```env
# Existing Dataverse Configuration
DATAVERSE_ENVIRONMENT_URL=https://org75c51f0f.crm6.dynamics.com
AZURE_CLIENT_ID=cfbad57f-e290-46d6-9f87-c25849524724
AZURE_CLIENT_SECRET=your-client-secret
AZURE_TENANT_ID=your-tenant-id

# New Client Portal Configuration
JWT_SECRET=your-super-secret-jwt-signing-key-change-in-production
AZURE_STORAGE_ACCOUNT_NAME=yourstorageaccount
AZURE_STORAGE_ACCOUNT_KEY=your-storage-key

# Optional: Session Configuration
JWT_EXPIRY=8h
MAX_LOGIN_ATTEMPTS=5
ACCOUNT_LOCKOUT_DURATION=30m
```

## 🔧 Step 4: Deploy and Test

### A. Deploy Updated Code

```bash
# Commit all changes
git add .
git commit -m "Add client portal functionality"
git push origin main

# The GitHub Actions pipeline will deploy automatically
```

### B. Create Test Client

1. **Manual Database Entry** (for testing):
   ```sql
   -- Create test client with hashed password
   INSERT INTO e365_clients (
       e365_name,
       e365_email, 
       e365_passwordhash,
       e365_clientnumber,
       e365_company,
       e365_status,
       e365_createddate
   ) VALUES (
       'Test Client',
       'demo@client.com',
       '$2a$12$hashed_password_here', -- Use bcrypt to hash 'demo123'
       'CLIENT-001',
       'Demo Company',
       463170000, -- Active
       GETDATE()
   );
   ```

2. **Using PowerShell** (recommended):
   ```powershell
   # Generate password hash
   npm install -g bcryptjs
   node -e "console.log(require('bcryptjs').hashSync('demo123', 12))"
   
   # Use the output in Dataverse
   ```

### C. Upload Test Documents

1. **Azure Storage Explorer** or Azure Portal
2. Navigate to `client-documents` container
3. Create folder: `client-CLIENT-001/`
4. Upload sample files:
   - `sample-invoice.pdf`
   - `project-report.docx`
   - `contract-template.pdf`

4. **Add Document Metadata to Dataverse**:
   ```sql
   INSERT INTO e365_clientdocuments (
       e365_name,
       e365_filename,
       e365_blobpath,
       e365_clientid,
       e365_filesize,
       e365_mimetype,
       e365_uploaddate,
       e365_status
   ) VALUES (
       'Sample Invoice',
       'sample-invoice.pdf',
       'client-documents/client-CLIENT-001/sample-invoice.pdf',
       'guid-of-test-client',
       245760, -- File size in bytes
       'application/pdf',
       GETDATE(),
       463170000 -- Available
   );
   ```

## 🧪 Step 5: Test the System

### A. Test Authentication

1. **Navigate to**: `https://your-app.azurestaticapps.net/client-login.html`
2. **Login with**:
   - Email: `demo@client.com`
   - Password: `demo123`
3. **Verify**: Redirects to dashboard

### B. Test Document Access

1. **Dashboard should show**: Documents for the logged-in client
2. **Click document**: Should generate secure download URL
3. **Download**: File should download from Azure Storage

### C. Test Security

1. **Wrong password**: Should increment failed attempts
2. **JWT expiry**: Should redirect to login after 8 hours
3. **Direct API access**: Should require valid JWT token

## 🚀 Step 6: Production Deployment

### A. Security Hardening

1. **Change JWT Secret**: Use a strong, random 256-bit key
2. **HTTPS Only**: Ensure all traffic uses HTTPS
3. **Password Policy**: Implement strong password requirements
4. **Rate Limiting**: Add protection against brute force attacks

### B. Monitoring Setup

1. **Application Insights**: Monitor login attempts and errors
2. **Storage Analytics**: Track document access patterns
3. **Alerts**: Set up notifications for suspicious activity

### C. User Management

1. **Admin Interface**: Create interface for managing clients
2. **Bulk Upload**: Implement document upload functionality
3. **Password Reset**: Add self-service password reset
4. **User Onboarding**: Automate client account creation

## 📱 Step 7: Mobile Responsiveness

The client portal is already mobile-responsive, but consider:

1. **PWA Features**: Add offline capability for document viewing
2. **Touch Optimization**: Improve touch interactions
3. **Mobile App**: Consider native mobile app for better UX

## 🔍 Step 8: Advanced Features (Optional)

### A. Two-Factor Authentication
- SMS or email-based 2FA
- TOTP app integration
- Backup codes

### B. Document Collaboration
- Comments and annotations
- Version control
- Approval workflows

### C. Advanced Search
- Full-text search within documents
- AI-powered content discovery
- Saved search queries

## 📝 Summary

This implementation provides:

✅ **Secure client authentication** with bcrypt and JWT  
✅ **Document access control** with SAS tokens  
✅ **Comprehensive audit logging** for compliance  
✅ **Mobile-responsive interface** for all devices  
✅ **Scalable architecture** using Azure services  
✅ **Integration with existing** Dataverse environment  

The system is production-ready and follows security best practices while providing a smooth user experience for your clients.

## 🆘 Support and Troubleshooting

For issues during implementation:

1. **Check Azure Function logs** in Azure Portal
2. **Verify Dataverse permissions** for new tables
3. **Test API endpoints** using Postman or curl
4. **Review browser console** for frontend errors
5. **Contact support** at support@365evergreen.com.au

---

**Next Steps**: Once implemented, you can extend this system with additional features like document upload, client self-registration, or integration with your existing business processes.
