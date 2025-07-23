# Dataverse Client Portal Tables Creation Guide

## 🎯 Step 1: Create Client Authentication Table

### Access Your Power Apps Environment

1. **Navigate to your Power Apps environment**:
   ```
   https://make.powerapps.com/environments/9e393617-e3e8-e41f-a368-6bde5b1121c3/solutions/6c561a02-0963-f011-bec3-000d3ad05c95
   ```

2. **Open your existing solution** where you created the contact submissions table

### Create the Clients Table

1. **In the solution, click**: `+ New` → `Table` → `Table`

2. **Configure basic table settings**:
   - **Display name**: `Clients`
   - **Plural display name**: `Clients`
   - **Name**: `e365_client` (should auto-generate)
   - **Description**: `Client authentication and profile information for portal access`

3. **Advanced options**:
   - **Ownership**: Organization
   - **Enable for mobile**: ✅ Checked
   - **Enable change tracking**: ✅ Checked
   - **Enable auditing**: ✅ Checked

4. **Click**: `Save`

### Create Required Columns

#### 1. Primary Column (Name)
The primary column should already exist as `e365_name`. If not, it will be created automatically.
- **Display name**: `Name`
- **Name**: `e365_name`
- **Data type**: Text
- **Required**: ✅ Required
- **Maximum length**: 100
- **Description**: Client full name

#### 2. Email Address (Login Field)
- **Display name**: `Email Address`
- **Name**: `e365_email`
- **Data type**: Email
- **Required**: ✅ Required
- **Format**: Email
- **Maximum length**: 320
- **Description**: Client login email address (must be unique)

#### 3. Password Hash
- **Display name**: `Password Hash`
- **Name**: `e365_passwordhash`
- **Data type**: Text
- **Required**: ✅ Required
- **Maximum length**: 255
- **Description**: Bcrypt hashed password for authentication

#### 4. Client Number
- **Display name**: `Client Number`
- **Name**: `e365_clientnumber`
- **Data type**: Text
- **Required**: ✅ Required
- **Maximum length**: 50
- **Description**: Unique client identifier for business reference

#### 5. Company Name
- **Display name**: `Company`
- **Name**: `e365_company`
- **Data type**: Text
- **Required**: ❌ Optional
- **Maximum length**: 100
- **Description**: Client company or organization name

#### 6. Phone Number
- **Display name**: `Phone Number`
- **Name**: `e365_phone`
- **Data type**: Text
- **Required**: ❌ Optional
- **Format**: Phone
- **Maximum length**: 50
- **Description**: Client contact phone number

#### 7. Status (Choice Field)
- **Display name**: `Status`
- **Name**: `e365_status`
- **Data type**: Choice
- **Required**: ✅ Required
- **Sync with global choice**: No (local choice)
- **Default choice**: Active
- **Choices**:
  - **Active** (Value: 463170000)
  - **Inactive** (Value: 463170001)
  - **Suspended** (Value: 463170002)

#### 8. Last Login
- **Display name**: `Last Login`
- **Name**: `e365_lastlogin`
- **Data type**: Date and Time
- **Required**: ❌ Optional
- **Format**: Date and time
- **Behavior**: User local
- **Description**: Timestamp of last successful login

#### 9. Login Attempts
- **Display name**: `Login Attempts`
- **Name**: `e365_loginattempts`
- **Data type**: Whole Number
- **Required**: ❌ Optional
- **Minimum value**: 0
- **Maximum value**: 100
- **Default value**: 0
- **Description**: Counter for failed login attempts

#### 10. Account Locked
- **Display name**: `Account Locked`
- **Name**: `e365_accountlocked`
- **Data type**: Yes/No
- **Required**: ❌ Optional
- **Default value**: No
- **Description**: Whether account is locked due to failed login attempts

#### 11. Password Reset Token
- **Display name**: `Password Reset Token`
- **Name**: `e365_passwordreset`
- **Data type**: Text
- **Required**: ❌ Optional
- **Maximum length**: 255
- **Description**: Temporary token for password reset functionality

#### 12. Reset Token Expiry
- **Display name**: `Reset Token Expiry`
- **Name**: `e365_resetexpiry`
- **Data type**: Date and Time
- **Required**: ❌ Optional
- **Format**: Date and time
- **Behavior**: User local
- **Description**: When password reset token expires

#### 13. Created Date
- **Display name**: `Created Date`
- **Name**: `e365_createddate`
- **Data type**: Date and Time
- **Required**: ✅ Required
- **Format**: Date and time
- **Behavior**: User local
- **Default value**: Current date/time
- **Description**: When client account was created

### Save and Publish the Table

1. **Click**: `Save table`
2. **Click**: `Publish` to make the table available
3. **Wait** for publishing to complete

### Verify Table Creation

1. **Navigate to**: `Tables` in your solution
2. **Confirm**: `Clients` table appears in the list
3. **Open the table** to verify all columns are created correctly
4. **Note the table's logical name**: `e365_clients` (for API integration)

## 🔍 Table Schema Summary

Here's what you should see in your completed `e365_clients` table:

| Column Name | Type | Length | Required | Description |
|-------------|------|---------|----------|-------------|
| `e365_name` | Text | 100 | ✅ | Client full name (Primary) |
| `e365_email` | Email | 320 | ✅ | Login email address |
| `e365_passwordhash` | Text | 255 | ✅ | Bcrypt hashed password |
| `e365_clientnumber` | Text | 50 | ✅ | Unique client identifier |
| `e365_company` | Text | 100 | ❌ | Company name |
| `e365_phone` | Text | 50 | ❌ | Phone number |
| `e365_status` | Choice | - | ✅ | Active/Inactive/Suspended |
| `e365_lastlogin` | DateTime | - | ❌ | Last login timestamp |
| `e365_loginattempts` | Number | - | ❌ | Failed login counter |
| `e365_accountlocked` | Yes/No | - | ❌ | Account lock status |
| `e365_passwordreset` | Text | 255 | ❌ | Password reset token |
| `e365_resetexpiry` | DateTime | - | ❌ | Token expiry time |
| `e365_createddate` | DateTime | - | ✅ | Account creation date |

## 🚀 Next Steps

After creating the Clients table:

1. ✅ **Clients table created** - You are here
2. ⏭️ **Create Document Categories table** - Next step
3. ⏭️ **Create Client Documents table** - After categories
4. ⏭️ **Create Access Log table** - Final table
5. ⏭️ **Set up security roles** - Configure permissions
6. ⏭️ **Test table access** - Verify API connectivity

Let me know when you've completed creating the Clients table and I'll provide the guide for the next table (Document Categories)!
