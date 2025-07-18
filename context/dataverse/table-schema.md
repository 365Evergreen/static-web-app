# Dataverse Table Schema: Contact Submissions

## Table Information
- **Table Name**: `e365_contactsubmission`
- **Display Name**: Contact Submissions
- **Description**: Stores contact form submissions from 365 Evergreen website
- **Solution**: Specified solution in Power Apps environment
- **Environment URL**: https://make.powerapps.com/environments/9e393617-e3e8-e41f-a368-6bde5b1121c3/solutions/6c561a02-0963-f011-bec3-000d3ad05c95

## Required Fields

| Field Name | Display Name | Type | Max Length | Required | Description |
|------------|--------------|------|------------|----------|-------------|
| `e365_contactsubmissionid` | Contact Submission | Primary Key | - | Yes | System-generated unique identifier |
| `e365_name` | Full Name | Single Line of Text | 100 | Yes | Contact's full name |
| `e365_email` | Email Address | Single Line of Text | 320 | Yes | Contact's email address |
| `e365_company` | Company Name | Single Line of Text | 100 | No | Contact's company name |
| `e365_phone` | Phone Number | Single Line of Text | 50 | No | Contact's phone number |
| `e365_service` | Service Interest | Choice | - | No | Type of service interested in |
| `e365_message` | Message | Multiple Lines of Text | 4000 | Yes | Contact's message/inquiry |
| `e365_submissiondate` | Submission Date | Date and Time | - | Yes | When the form was submitted |
| `e365_ipaddress` | IP Address | Single Line of Text | 45 | No | Submitter's IP address for security |
| `e365_status` | Status | Choice | - | Yes | Processing status of the submission |

## Choice Field Options

### Service Interest (e365_service)
- `microsoft-365`: Microsoft 365 Implementation
- `power-platform`: Power Platform Development
- `digital-transformation`: Digital Transformation
- `training`: Training & Support
- `custom-solutions`: Custom Business Solutions
- `consultation`: General Consultation

### Status (e365_status)
- `new`: New (default)
- `in-review`: In Review
- `contacted`: Contacted
- `completed`: Completed
- `spam`: Spam

## Security Settings
- **Access Level**: Organization
- **Enable for Mobile**: Yes
- **Enable Change Tracking**: Yes
- **Enable Auditing**: Yes (for compliance)

## Business Rules
1. Email format validation
2. Phone number format validation (if provided)
3. Auto-set submission date to current timestamp
4. Default status to "New"

## API Integration Notes
- Use Dataverse Web API for CRUD operations
- Authentication via Managed Identity from Azure Function
- Endpoint pattern: `/api/data/v9.2/msl_contactsubmissions`
- Required permissions: `prvCreatemsl_contactsubmission`, `prvWritemsl_contactsubmission`

## Naming Conventions
- Prefix: `msl_` (Murphy's Law solution prefix)
- Pascal case for display names
- Snake case for schema names
- Consistent with Power Platform naming standards
