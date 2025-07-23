# Client Portal Implementation Guide

## 📊 Step 1: Create Required Dataverse Tables

### Table 1: Client Authentication (`e365_clients`)

**Purpose**: Store client login credentials and profile information

**Columns**:
- `e365_name` (Text, 100 chars) - Client full name ✅ Required
- `e365_email` (Email, 320 chars) - Login email (unique) ✅ Required  
- `e365_passwordhash` (Text, 255 chars) - Bcrypt hashed password ✅ Required
- `e365_clientnumber` (Text, 50 chars) - Unique client identifier ✅ Required
- `e365_company` (Text, 100 chars) - Client company name
- `e365_phone` (Text, 50 chars) - Contact phone number
- `e365_status` (Choice) - Active, Inactive, Suspended ✅ Required
- `e365_lastlogin` (DateTime) - Last successful login
- `e365_loginattempts` (Whole Number) - Failed login counter
- `e365_accountlocked` (Yes/No) - Account lockout status
- `e365_passwordreset` (Text, 255 chars) - Password reset token
- `e365_resetexpiry` (DateTime) - Reset token expiration
- `e365_createddate` (DateTime) - Account creation date ✅ Required

**Choice Field Values**:
- **Status** (`e365_status`):
  - `active` (463170000) - Active 
  - `inactive` (463170001) - Inactive
  - `suspended` (463170002) - Suspended

### Table 2: Document Categories (`e365_documentcategories`)

**Purpose**: Organize documents by type/category

**Columns**:
- `e365_name` (Text, 100 chars) - Category name ✅ Required
- `e365_description` (Text, 500 chars) - Category description
- `e365_sortorder` (Whole Number) - Display order
- `e365_icon` (Text, 50 chars) - CSS icon class
- `e365_color` (Text, 20 chars) - Display color code

### Table 3: Client Documents (`e365_clientdocuments`)

**Purpose**: Link documents to clients with metadata and access control

**Columns**:
- `e365_name` (Text, 255 chars) - Document display name ✅ Required
- `e365_filename` (Text, 255 chars) - Original filename ✅ Required
- `e365_blobpath` (Text, 500 chars) - Azure Storage blob path ✅ Required
- `e365_clientid` (Lookup to e365_clients) - Owner client ✅ Required
- `e365_categoryid` (Lookup to e365_documentcategories) - Document category
- `e365_filesize` (Whole Number) - File size in bytes
- `e365_mimetype` (Text, 100 chars) - MIME type (pdf, docx, etc.)
- `e365_uploaddate` (DateTime) - When document was uploaded ✅ Required
- `e365_uploadedby` (Text, 100 chars) - Who uploaded the document
- `e365_status` (Choice) - Available, Archived, Pending ✅ Required
- `e365_accesscount` (Whole Number) - Download/view counter
- `e365_lastaccess` (DateTime) - Last accessed timestamp
- `e365_description` (Text, 1000 chars) - Document description
- `e365_tags` (Text, 500 chars) - Searchable tags (comma-separated)
- `e365_expirydate` (DateTime) - Document expiration date
- `e365_confidential` (Yes/No) - Requires additional verification

**Choice Field Values**:
- **Status** (`e365_status`):
  - `available` (463170000) - Available
  - `archived` (463170001) - Archived  
  - `pending` (463170002) - Pending Review

### Table 4: Client Access Log (`e365_clientaccesslog`)

**Purpose**: Audit trail for client portal access and document downloads

**Columns**:
- `e365_clientid` (Lookup to e365_clients) - Client who accessed ✅ Required
- `e365_action` (Choice) - Login, Logout, DocumentView, DocumentDownload ✅ Required
- `e365_documentid` (Lookup to e365_clientdocuments) - Document accessed (if applicable)
- `e365_ipaddress` (Text, 45 chars) - Client IP address
- `e365_useragent` (Text, 500 chars) - Browser/device information
- `e365_timestamp` (DateTime) - When action occurred ✅ Required
- `e365_success` (Yes/No) - Whether action was successful
- `e365_errormessage` (Text, 1000 chars) - Error details if failed

**Choice Field Values**:
- **Action** (`e365_action`):
  - `login` (463170000) - User Login
  - `logout` (463170001) - User Logout
  - `documentview` (463170002) - Document Viewed
  - `documentdownload` (463170003) - Document Downloaded
  - `failed_login` (463170004) - Failed Login Attempt

## 🗄️ Azure Storage Setup

### Storage Account Configuration

1. **Create Storage Account** (if not exists):
   ```bash
   az storage account create \
     --name yourstorageaccount \
     --resource-group your-resource-group \
     --location australiaeast \
     --sku Standard_LRS \
     --kind StorageV2
   ```

2. **Create Container for Documents**:
   ```bash
   az storage container create \
     --name client-documents \
     --account-name yourstorageaccount \
     --public-access off
   ```

3. **Configure CORS** (for direct uploads if needed):
   ```json
   {
     "cors": [
       {
         "allowedOrigins": ["https://your-domain.azurestaticapps.net"],
         "allowedMethods": ["GET", "POST", "PUT"],
         "allowedHeaders": ["*"],
         "exposedHeaders": ["*"],
         "maxAgeInSeconds": 3600
       }
     ]
   }
   ```

### Folder Structure in Storage
```
client-documents/
├── client-{clientnumber}/
│   ├── invoices/
│   ├── contracts/
│   ├── reports/
│   └── correspondence/
└── shared/
    └── templates/
```

## 🔐 Step 3: Authentication Service Implementation

This implementation extends your existing Dataverse integration with secure client authentication, document management, and comprehensive audit logging.

The system provides:
- **Secure login** with bcrypt password hashing
- **JWT token-based sessions** with 8-hour expiry
- **Account lockout protection** after failed attempts
- **Comprehensive audit logging** for all client actions
- **Document access control** with SAS tokens
- **Role-based permissions** ensuring clients only see their documents

Would you like me to continue with the implementation of:

1. **Authentication Service Code** (`ClientAuthService`)
2. **Document Management Service** (`DocumentService`) 
3. **API Endpoints** (login, documents, download)
4. **Frontend Portal Pages** (login form, dashboard, document viewer)
5. **Admin Management Interface** (client creation, document upload)

Which component should I implement next?
