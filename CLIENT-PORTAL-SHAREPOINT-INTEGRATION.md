# Client Portal with SharePoint Document Storage

## 🏗️ **Updated Architecture Overview**

### **Document Storage Strategy: SharePoint**

Instead of Azure Blob Storage, we'll use SharePoint Online for document storage with these benefits:
- Native Microsoft 365 integration
- Better security and permissions model
- Built-in version control and collaboration
- Rich metadata and search capabilities
- Office Online integration for document preview/editing

## 📊 **Updated Dataverse Table Schema**

### **Modified: e365_clientdocuments Table**

Instead of storing blob URLs, we'll store SharePoint document library references:

| Column Name | Type | Length | Required | Description |
|-------------|------|---------|----------|-------------|
| `e365_name` | Text | 255 | ✅ | Document title/filename |
| `e365_clientid` | Lookup | - | ✅ | Reference to e365_clients |
| `e365_categoryid` | Lookup | - | ✅ | Reference to e365_documentcategories |
| `e365_sharepointurl` | Text | 500 | ✅ | Full SharePoint document URL |
| `e365_sharepointid` | Text | 100 | ✅ | SharePoint unique document ID |
| `e365_sharepointsite` | Text | 255 | ✅ | SharePoint site URL |
| `e365_documentlibrary` | Text | 100 | ✅ | Document library name |
| `e365_folderpath` | Text | 500 | ❌ | Folder path within library |
| `e365_filesize` | Number | - | ❌ | File size in bytes |
| `e365_mimetype` | Text | 50 | ❌ | Document MIME type |
| `e365_uploadeddate` | DateTime | - | ✅ | When document was uploaded |
| `e365_accesslevel` | Choice | - | ✅ | Standard/Restricted/Confidential |
| `e365_isactive` | Yes/No | - | ❌ | Whether document is active |
| `e365_description` | Multiline Text | 1000 | ❌ | Document description |

## 🔗 **SharePoint Integration Components**

### **1. SharePoint Site Structure**
```
📁 Client Portal Documents (SharePoint Site)
├── 📚 Client Documents (Document Library)
│   ├── 📁 Client_001_ABC_Corp/
│   │   ├── 📁 Contracts/
│   │   ├── 📁 Invoices/
│   │   ├── 📁 Reports/
│   │   └── 📁 Legal_Documents/
│   └── 📁 Client_002_XYZ_Ltd/
│       ├── 📁 Contracts/
│       └── 📁 Invoices/
```

### **2. SharePoint Columns (Metadata)**
- **Client Number** (Text) - Links to Dataverse client
- **Document Category** (Choice) - Contracts, Invoices, Reports, etc.
- **Access Level** (Choice) - Standard, Restricted, Confidential
- **Upload Date** (Date/Time)
- **Document Status** (Choice) - Active, Archived, Draft

### **3. API Integration Pattern**

#### **Document Upload Flow:**
```typescript
1. Upload to SharePoint → Get SharePoint URL & ID
2. Store metadata in Dataverse → Link SharePoint reference
3. Set SharePoint permissions → Based on access level
4. Return success to client portal
```

#### **Document Access Flow:**
```typescript
1. Client requests document → Verify in Dataverse
2. Check access permissions → Based on client & document access level
3. Generate SharePoint access token → Time-limited access
4. Return secure SharePoint URL → Client downloads/previews
```

## 🔐 **Security Model**

### **SharePoint Permissions:**
- **Site Collection Admin** - Portal API service account
- **Contribute** - For document upload API
- **Read** - Generated for individual client access (time-limited)

### **Access Control:**
1. **Client authentication** - JWT token from your portal
2. **Document authorization** - Check Dataverse permissions
3. **SharePoint access** - Generate time-limited access token
4. **Audit logging** - Track all document access

## 🛠️ **Implementation Services**

### **SharePointService (New)**
```typescript
class SharePointService {
  // Upload document to SharePoint
  async uploadDocument(clientId: string, categoryId: string, file: Buffer, filename: string)
  
  // Get secure document URL
  async getDocumentUrl(documentId: string, clientId: string)
  
  // Set document permissions
  async setDocumentPermissions(documentId: string, accessLevel: string)
  
  // Create client folder structure
  async createClientFolders(clientNumber: string)
}
```

### **Updated DocumentService**
```typescript
class DocumentService {
  // Upload document (SharePoint + Dataverse)
  async uploadClientDocument(clientId: string, categoryId: string, file: Buffer, metadata: DocumentMetadata)
  
  // Get client documents from Dataverse
  async getClientDocuments(clientId: string, categoryId?: string)
  
  // Generate secure access URL
  async generateSecureDocumentUrl(documentId: string, clientId: string)
  
  // Update document metadata
  async updateDocumentMetadata(documentId: string, metadata: Partial<DocumentMetadata>)
}
```

## 📡 **API Endpoints Update**

### **Document Management Endpoints:**
- `POST /api/documents/upload` - Upload document to SharePoint + Dataverse
- `GET /api/documents/client/{clientId}` - Get client's documents list
- `GET /api/documents/{documentId}/download` - Get secure SharePoint URL
- `GET /api/documents/{documentId}/preview` - Get preview URL
- `PUT /api/documents/{documentId}` - Update document metadata
- `DELETE /api/documents/{documentId}` - Archive document

## 🔧 **Configuration Requirements**

### **SharePoint App Registration:**
```json
{
  "clientId": "your-app-id",
  "clientSecret": "your-app-secret",
  "tenantId": "your-tenant-id",
  "siteUrl": "https://yourtenant.sharepoint.com/sites/ClientPortal",
  "documentLibrary": "Client Documents"
}
```

### **Required Permissions:**
- `Sites.ReadWrite.All` - For document operations
- `Files.ReadWrite.All` - For file operations
- `User.Read.All` - For user context

## 🚀 **Benefits of SharePoint Integration**

1. **Native Microsoft Integration** - Works seamlessly with your existing Microsoft 365
2. **Better User Experience** - Document preview, Office Online editing
3. **Robust Security** - SharePoint's proven security model
4. **Audit Trail** - Built-in SharePoint audit logging
5. **Version Control** - Automatic document versioning
6. **Search** - Microsoft Search integration
7. **Compliance** - Built-in retention and compliance features
8. **Cost Effective** - Often included in Microsoft 365 licenses

## 📋 **Implementation Steps**

1. ✅ **Create Dataverse tables** - Clients, Categories (completed)
2. 🔄 **Modify Client Documents table** - Add SharePoint columns
3. ⏭️ **Set up SharePoint site** - Create document library
4. ⏭️ **Configure SharePoint columns** - Add metadata columns
5. ⏭️ **Register SharePoint app** - For API access
6. ⏭️ **Implement SharePoint services** - Upload/download functionality
7. ⏭️ **Update client portal UI** - Document management interface
8. ⏭️ **Test document workflow** - End-to-end testing

Would you like me to create the updated Client Documents table schema for SharePoint integration?
