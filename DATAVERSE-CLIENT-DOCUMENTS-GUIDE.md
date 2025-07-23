# Client Documents Table Creation Guide (SharePoint Integration)

## 🎯 Step 3: Create Client Documents Table

### Purpose
This table will store metadata and references to documents stored in SharePoint Online, linking them to specific clients and categories.

### Create the Client Documents Table

1. **In your solution, click**: `+ New` → `Table` → `Table`

2. **Configure basic table settings**:
   - **Display name**: `Client Documents`
   - **Plural display name**: `Client Documents`
   - **Name**: `e365_clientdocument` (should auto-generate)
   - **Description**: `Document metadata with SharePoint integration for client portal`

3. **Advanced options**:
   - **Ownership**: Organization
   - **Enable for mobile**: ✅ Checked
   - **Enable change tracking**: ✅ Checked
   - **Enable auditing**: ✅ Checked

4. **Click**: `Save`

### Create Required Columns

#### 1. Primary Column (Document Title)
The primary column should already exist as `e365_name`. Configure it as:
- **Display name**: `Document Title`
- **Name**: `e365_name`
- **Data type**: Text
- **Required**: ✅ Required
- **Maximum length**: 255
- **Description**: Document title or filename

#### 2. Client Lookup
- **Display name**: `Client`
- **Name**: `e365_clientid`
- **Data type**: Lookup
- **Required**: ✅ Required
- **Related table**: `Clients (e365_clients)`
- **Related column**: `Name (e365_name)`
- **Description**: Reference to the client who owns this document

#### 3. Document Category Lookup
- **Display name**: `Document Category`
- **Name**: `e365_categoryid`
- **Data type**: Lookup
- **Required**: ✅ Required
- **Related table**: `Document Categories (e365_documentcategories)`
- **Related column**: `Category Name (e365_name)`
- **Description**: Reference to the document category

#### 4. SharePoint URL
- **Display name**: `SharePoint URL`
- **Name**: `e365_sharepointurl`
- **Data type**: Text
- **Required**: ✅ Required
- **Maximum length**: 500
- **Description**: Full SharePoint document URL

#### 5. SharePoint Document ID
- **Display name**: `SharePoint Document ID`
- **Name**: `e365_sharepointid`
- **Data type**: Text
- **Required**: ✅ Required
- **Maximum length**: 100
- **Description**: SharePoint unique document identifier

#### 6. SharePoint Site URL
- **Display name**: `SharePoint Site`
- **Name**: `e365_sharepointsite`
- **Data type**: Text
- **Required**: ✅ Required
- **Maximum length**: 255
- **Description**: SharePoint site URL where document is stored

#### 7. Document Library
- **Display name**: `Document Library`
- **Name**: `e365_documentlibrary`
- **Data type**: Text
- **Required**: ✅ Required
- **Maximum length**: 100
- **Default value**: `Client Documents`
- **Description**: SharePoint document library name

#### 8. Folder Path
- **Display name**: `Folder Path`
- **Name**: `e365_folderpath`
- **Data type**: Text
- **Required**: ❌ Optional
- **Maximum length**: 500
- **Description**: Folder path within the document library

#### 9. File Size
- **Display name**: `File Size (Bytes)`
- **Name**: `e365_filesize`
- **Data type**: Whole Number
- **Required**: ❌ Optional
- **Minimum value**: 0
- **Maximum value**: 2147483647
- **Description**: File size in bytes

#### 10. MIME Type
- **Display name**: `MIME Type`
- **Name**: `e365_mimetype`
- **Data type**: Text
- **Required**: ❌ Optional
- **Maximum length**: 50
- **Description**: Document MIME type (e.g., application/pdf)

#### 11. Uploaded Date
- **Display name**: `Uploaded Date`
- **Name**: `e365_uploadeddate`
- **Data type**: Date and Time
- **Required**: ✅ Required
- **Format**: Date and time
- **Behavior**: User local
- **Default value**: Current date/time
- **Description**: When document was uploaded to SharePoint

#### 12. Access Level
- **Display name**: `Access Level`
- **Name**: `e365_accesslevel`
- **Data type**: Choice
- **Required**: ✅ Required
- **Default choice**: Standard
- **Choices**:
  - **Standard** (Value: 463170000) - Normal client access
  - **Restricted** (Value: 463170001) - Requires special permissions
  - **Confidential** (Value: 463170002) - Highly restricted access

#### 13. Is Active
- **Display name**: `Is Active`
- **Name**: `e365_isactive`
- **Data type**: Yes/No
- **Required**: ❌ Optional
- **Default value**: Yes
- **Description**: Whether document is currently active

#### 14. Document Description
- **Display name**: `Description`
- **Name**: `e365_description`
- **Data type**: Multiple Lines of Text
- **Required**: ❌ Optional
- **Maximum length**: 1000
- **Description**: Additional description or notes about the document

#### 15. Download Count
- **Display name**: `Download Count`
- **Name**: `e365_downloadcount`
- **Data type**: Whole Number
- **Required**: ❌ Optional
- **Minimum value**: 0
- **Maximum value**: 999999
- **Default value**: 0
- **Description**: Number of times document has been downloaded

#### 16. Last Accessed
- **Display name**: `Last Accessed`
- **Name**: `e365_lastaccessed`
- **Data type**: Date and Time
- **Required**: ❌ Optional
- **Format**: Date and time
- **Behavior**: User local
- **Description**: When document was last accessed by client

### Save and Publish the Table

1. **Click**: `Save table`
2. **Click**: `Publish` to make the table available
3. **Wait** for publishing to complete

## 🔍 Table Schema Summary

Here's what you should see in your completed `e365_clientdocuments` table:

| Column Name | Type | Length | Required | Description |
|-------------|------|---------|----------|-------------|
| `e365_name` | Text | 255 | ✅ | Document title (Primary) |
| `e365_clientid` | Lookup | - | ✅ | Reference to client |
| `e365_categoryid` | Lookup | - | ✅ | Reference to category |
| `e365_sharepointurl` | Text | 500 | ✅ | SharePoint document URL |
| `e365_sharepointid` | Text | 100 | ✅ | SharePoint document ID |
| `e365_sharepointsite` | Text | 255 | ✅ | SharePoint site URL |
| `e365_documentlibrary` | Text | 100 | ✅ | Document library name |
| `e365_folderpath` | Text | 500 | ❌ | Folder path |
| `e365_filesize` | Number | - | ❌ | File size in bytes |
| `e365_mimetype` | Text | 50 | ❌ | MIME type |
| `e365_uploadeddate` | DateTime | - | ✅ | Upload timestamp |
| `e365_accesslevel` | Choice | - | ✅ | Standard/Restricted/Confidential |
| `e365_isactive` | Yes/No | - | ❌ | Active status |
| `e365_description` | Multiline Text | 1000 | ❌ | Document description |
| `e365_downloadcount` | Number | - | ❌ | Download counter |
| `e365_lastaccessed` | DateTime | - | ❌ | Last access time |

## 📋 SharePoint Integration Benefits

### **Why SharePoint Over Azure Blob Storage:**

1. **Better Integration** - Native Microsoft 365 integration
2. **Document Preview** - Built-in preview capabilities
3. **Version Control** - Automatic document versioning
4. **Security Model** - Rich permission structure
5. **Search** - Microsoft Search integration
6. **Collaboration** - Office Online editing
7. **Audit Trail** - Built-in activity tracking
8. **Compliance** - Retention and compliance features

### **Document Storage Structure:**
```
📁 Client Portal Documents (SharePoint Site)
├── 📚 Client Documents (Document Library)
│   ├── 📁 Client_001_ABC_Corp/
│   │   ├── 📁 Contracts/
│   │   │   └── 📄 Service_Agreement_2024.pdf
│   │   ├── 📁 Invoices/
│   │   │   └── 📄 Invoice_INV-2024-001.pdf
│   │   └── 📁 Reports/
│   │       └── 📄 Monthly_Report_Jan2024.docx
│   └── 📁 Client_002_XYZ_Ltd/
│       ├── 📁 Contracts/
│       └── 📁 Invoices/
```

## 🚀 Next Steps

After creating the Client Documents table:

1. ✅ **Clients table created** - Complete
2. ✅ **Document Categories table created** - Complete  
3. ✅ **Client Documents table created** - You are here
4. ⏭️ **Create Access Log table** - Final table
5. ⏭️ **Set up SharePoint site** - Create document library
6. ⏭️ **Configure SharePoint integration** - App registration
7. ⏭️ **Implement document services** - Upload/download APIs
8. ⏭️ **Test document workflow** - End-to-end testing

Let me know when you've completed creating the Client Documents table and I'll provide the guide for the final Access Log table!
