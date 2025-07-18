# Dataverse Table Creation Guide

## Step 1: Access Your Power Apps Environment

1. Navigate to your Power Apps environment:
   ```
   https://make.powerapps.com/environments/9e393617-e3e8-e41f-a368-6bde5b1121c3/solutions/6c561a02-0963-f011-bec3-000d3ad05c95
   ```

2. Open the specified solution in the environment

## Step 2: Create the Table

1. In the solution, click **"+ New"** → **"Table"** → **"Table"**

2. Configure basic table settings:
   - **Display name**: `Contact Submissions`
   - **Plural display name**: `Contact Submissions`
   - **Name**: `e365_contactsubmission` (should auto-generate)
   - **Description**: `Stores contact form submissions from 365 Evergreen website`

3. **Advanced options**:
   - **Ownership**: Organization
   - **Enable for mobile**: ✅ Checked
   - **Enable change tracking**: ✅ Checked
   - **Enable auditing**: ✅ Checked

## Step 3: Create Required Columns

### 1. Full Name (Primary column - should exist by default)
- **Display name**: `Full Name`
- **Name**: `e365_name`
- **Data type**: Text
- **Required**: ✅ Required
- **Maximum length**: 100

### 2. Email Address
- **Display name**: `Email Address`
- **Name**: `e365_email`
- **Data type**: Text
- **Required**: ✅ Required
- **Maximum length**: 320
- **Format**: Email

### 3. Company Name
- **Display name**: `Company Name`
- **Name**: `e365_company`
- **Data type**: Text
- **Required**: ❌ Optional
- **Maximum length**: 100

### 4. Phone Number
- **Display name**: `Phone Number`
- **Name**: `e365_phone`
- **Data type**: Text
- **Required**: ❌ Optional
- **Maximum length**: 50
- **Format**: Phone

### 5. Service Interest
- **Display name**: `Service Interest`
- **Name**: `e365_service`
- **Data type**: Choice
- **Required**: ❌ Optional
- **Sync with global choice**: No (local choice)
- **Choices**:
  - `Microsoft 365 Implementation`
  - `Power Platform Development`
  - `Digital Transformation`
  - `Training & Support`
  - `Custom Business Solutions`
  - `General Consultation`

### 6. Message
- **Display name**: `Message`
- **Name**: `e365_message`
- **Data type**: Text
- **Required**: ✅ Required
- **Format**: Text area
- **Maximum length**: 4000

### 7. Submission Date
- **Display name**: `Submission Date`
- **Name**: `e365_submissiondate`
- **Data type**: Date and Time
- **Required**: ✅ Required
- **Format**: Date and time
- **Behavior**: User local

### 8. IP Address
- **Display name**: `IP Address`
- **Name**: `e365_ipaddress`
- **Data type**: Text
- **Required**: ❌ Optional
- **Maximum length**: 45

### 9. Status
- **Display name**: `Status`
- **Name**: `e365_status`
- **Data type**: Choice
- **Required**: ✅ Required
- **Default value**: New
- **Choices**:
  - `New` (default)
  - `In Review`
  - `Contacted`
  - `Completed`
  - `Spam`

## Step 4: Save and Publish

1. Click **"Save table"**
2. Click **"Publish"** to make the table available
3. Wait for publishing to complete

## Step 5: Verify Table Creation

1. Navigate to **"Tables"** in your solution
2. Confirm **"Contact Submissions"** table appears
3. Open the table to verify all columns are created correctly
4. Note the table's logical name for API integration: `msl_contactsubmission`

## Step 6: Set Up Security (Optional)

1. Go to **"Security roles"** in your environment
2. Create or modify roles to grant access to the new table:
   - **Create**: Allow API and applications to create new records
   - **Read**: Allow viewing of submission data
   - **Write**: Allow updating submission status

## API Integration Information

Once created, the table will be available via Dataverse Web API at:
```
https://[environment].api.crm.dynamics.com/api/data/v9.2/msl_contactsubmissions
```

**Required permissions for Azure Function**:
- System User role with appropriate table permissions
- Or custom role with Create/Write permissions on Contact Submissions table

## Next Steps

After creating the table:
1. Note the environment URL and table name
2. Set up Managed Identity for Azure Function
3. Configure Dataverse connection in Azure Function
4. Test the integration

## Troubleshooting

- If table creation fails, check solution permissions
- Ensure the environment has Dataverse database enabled
- Verify you have System Administrator or System Customizer role
- Column names must be unique within the table
