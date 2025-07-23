# Document Categories Table Creation Guide

## 🎯 Step 2: Create Document Categories Table

### Purpose
This table will store the different types of documents that can be assigned to clients (e.g., "Contracts", "Invoices", "Reports", "Legal Documents").

### Create the Document Categories Table

1. **In your solution, click**: `+ New` → `Table` → `Table`

2. **Configure basic table settings**:
   - **Display name**: `Document Categories`
   - **Plural display name**: `Document Categories`
   - **Name**: `e365_documentcategorie` (should auto-generate)
   - **Description**: `Categories for organizing client documents`

3. **Advanced options**:
   - **Ownership**: Organization
   - **Enable for mobile**: ✅ Checked
   - **Enable change tracking**: ✅ Checked
   - **Enable auditing**: ✅ Checked

4. **Click**: `Save`

### Create Required Columns

#### 1. Primary Column (Category Name)
The primary column should already exist as `e365_name`. Configure it as:
- **Display name**: `Category Name`
- **Name**: `e365_name`
- **Data type**: Text
- **Required**: ✅ Required
- **Maximum length**: 100
- **Description**: Name of the document category

#### 2. Category Code
- **Display name**: `Category Code`
- **Name**: `e365_categorycode`
- **Data type**: Text
- **Required**: ✅ Required
- **Maximum length**: 20
- **Description**: Short code for the category (e.g., "CNT" for Contracts)

#### 3. Description
- **Display name**: `Description`
- **Name**: `e365_description`
- **Data type**: Multiple Lines of Text
- **Required**: ❌ Optional
- **Maximum length**: 500
- **Description**: Detailed description of what documents belong in this category

#### 4. Display Order
- **Display name**: `Display Order`
- **Name**: `e365_displayorder`
- **Data type**: Whole Number
- **Required**: ❌ Optional
- **Minimum value**: 1
- **Maximum value**: 999
- **Default value**: 1
- **Description**: Order for displaying categories in lists

#### 5. Is Active
- **Display name**: `Is Active`
- **Name**: `e365_isactive`
- **Data type**: Yes/No
- **Required**: ❌ Optional
- **Default value**: Yes
- **Description**: Whether this category is currently active

#### 6. Icon Name
- **Display name**: `Icon Name`
- **Name**: `e365_iconname`
- **Data type**: Text
- **Required**: ❌ Optional
- **Maximum length**: 50
- **Description**: Icon identifier for UI display (e.g., "document", "contract", "invoice")

#### 7. Color Code
- **Display name**: `Color Code`
- **Name**: `e365_colorcode`
- **Data type**: Text
- **Required**: ❌ Optional
- **Maximum length**: 7
- **Description**: Hex color code for category display (e.g., "#3B82F6")

#### 8. Access Level
- **Display name**: `Access Level`
- **Name**: `e365_accesslevel`
- **Data type**: Choice
- **Required**: ✅ Required
- **Default choice**: Standard
- **Choices**:
  - **Standard** (Value: 463170000) - Normal client access
  - **Restricted** (Value: 463170001) - Requires special permissions
  - **Confidential** (Value: 463170002) - Highly restricted access

### Save and Publish the Table

1. **Click**: `Save table`
2. **Click**: `Publish` to make the table available
3. **Wait** for publishing to complete

## 🔍 Table Schema Summary

Here's what you should see in your completed `e365_documentcategories` table:

| Column Name | Type | Length | Required | Description |
|-------------|------|---------|----------|-------------|
| `e365_name` | Text | 100 | ✅ | Category name (Primary) |
| `e365_categorycode` | Text | 20 | ✅ | Short category code |
| `e365_description` | Multiline Text | 500 | ❌ | Category description |
| `e365_displayorder` | Number | - | ❌ | Display order |
| `e365_isactive` | Yes/No | - | ❌ | Active status |
| `e365_iconname` | Text | 50 | ❌ | UI icon identifier |
| `e365_colorcode` | Text | 7 | ❌ | Hex color code |
| `e365_accesslevel` | Choice | - | ✅ | Standard/Restricted/Confidential |

## 📋 Sample Data to Create

After creating the table, add these sample categories:

### Category 1: Contracts
- **Category Name**: `Contracts`
- **Category Code**: `CNT`
- **Description**: `Legal contracts and agreements`
- **Display Order**: `1`
- **Is Active**: `Yes`
- **Icon Name**: `contract`
- **Color Code**: `#3B82F6`
- **Access Level**: `Standard`

### Category 2: Invoices
- **Category Name**: `Invoices`
- **Category Code**: `INV`
- **Description**: `Billing invoices and payment documents`
- **Display Order**: `2`
- **Is Active**: `Yes`
- **Icon Name**: `invoice`
- **Color Code**: `#10B981`
- **Access Level**: `Standard`

### Category 3: Reports
- **Category Name**: `Reports`
- **Category Code**: `RPT`
- **Description**: `Progress reports and analysis documents`
- **Display Order**: `3`
- **Is Active**: `Yes`
- **Icon Name**: `chart`
- **Color Code**: `#F59E0B`
- **Access Level**: `Standard`

### Category 4: Legal Documents
- **Category Name**: `Legal Documents`
- **Category Code**: `LEG`
- **Description**: `Legal correspondence and documentation`
- **Display Order**: `4`
- **Is Active**: `Yes`
- **Icon Name**: `legal`
- **Color Code**: `#EF4444`
- **Access Level**: `Restricted`

### Category 5: Financial Statements
- **Category Name**: `Financial Statements`
- **Category Code**: `FIN`
- **Description**: `Financial reports and statements`
- **Display Order**: `5`
- **Is Active**: `Yes`
- **Icon Name**: `finance`
- **Color Code**: `#8B5CF6`
- **Access Level**: `Confidential`

## 🚀 Next Steps

After creating the Document Categories table:

1. ✅ **Clients table created** - Complete
2. ✅ **Document Categories table created** - You are here
3. ⏭️ **Create Client Documents table** - Next step
4. ⏭️ **Create Access Log table** - Final table
5. ⏭️ **Set up security roles** - Configure permissions
6. ⏭️ **Test table access** - Verify API connectivity

Let me know when you've completed creating the Document Categories table and added the sample data, and I'll provide the guide for the Client Documents table!
