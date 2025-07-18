# 🔐 Dataverse Permissions Setup Guide

## ✅ Completed Steps
- **Managed Identity Enabled**: Principal ID `fb57adeb-fa5c-414b-a022-d60df1c91b78`
- **Environment Variable Set**: `DATAVERSE_ENVIRONMENT_URL="https://org75c51f0f.crm6.dynamics.com"`

## 🚨 Required: Grant Dataverse Permissions

### **Method 1: Power Platform Admin Center (Recommended)**

1. **Open Power Platform Admin Center**
   - Go to: https://admin.powerplatform.microsoft.com/
   - Sign in with your admin account

2. **Navigate to Your Environment**
   - Click **Environments**
   - Find your environment: `org75c51f0f`
   - Click on the environment name

3. **Add Application User**
   - Click **Settings** → **Users + permissions** → **Application users**
   - Click **+ New app user**
   - Click **+ Add an app**

4. **Find Your Managed Identity**
   - Search for: `mySPAApp` or Principal ID: `fb57adeb-fa5c-414b-a022-d60df1c91b78`
   - Select the managed identity
   - Click **Add**

5. **Assign Security Role**
   - Select **Business Unit**: Default business unit
   - **Security roles**: Choose one of:
     - ✅ **System Customizer** (Recommended - can create/update records)
     - ✅ **Basic User** + custom role with contact entity permissions
     - ⚠️ **System Administrator** (Full access - use with caution)

6. **Save**
   - Click **Create**

### **Method 2: PowerShell (Alternative)**

```powershell
# Install Power Platform CLI if not already installed
pac install latest

# Authenticate to Power Platform
pac auth create --url https://org75c51f0f.crm6.dynamics.com

# Add application user (replace with your tenant details)
pac admin application-user add --environment https://org75c51f0f.crm6.dynamics.com --application-id <app-id>
```

## 🧪 Testing After Setup

### **Wait 2-3 minutes** for permissions to propagate, then:

1. **Test Contact Form**
   - Open: `/contact-debug.html`
   - Submit a test form
   - Check for successful submission

2. **Check Function Logs**
   ```bash
   az staticwebapp functions log stream --name "mySPAApp" --resource-group "myspagroup"
   ```

## 🔍 Common Issues

### **Issue**: "Unauthorized" or "Forbidden" errors
- **Solution**: Ensure the managed identity has proper security role in Dataverse
- **Check**: Verify Principal ID matches in both Azure and Power Platform

### **Issue**: "Environment not found"
- **Solution**: Verify DATAVERSE_ENVIRONMENT_URL is exactly: `https://org75c51f0f.crm6.dynamics.com`
- **Note**: No trailing slash, exact URL format

### **Issue**: Still getting "unknown error"
- **Solution**: Check Azure Function logs for detailed error messages
- **Debug**: Use the contact-debug.html tool to see full error responses

## 📋 Verification Checklist

- [ ] Managed Identity enabled with Principal ID: `fb57adeb-fa5c-414b-a022-d60df1c91b78`
- [ ] Environment variable set: `DATAVERSE_ENVIRONMENT_URL="https://org75c51f0f.crm6.dynamics.com"`
- [ ] Application user added to Dataverse environment
- [ ] Security role assigned to application user
- [ ] Contact form tested successfully

## 🎯 Expected Outcome

After completing these steps:
- Anonymous users can submit contact forms
- Azure Function authenticates using Managed Identity
- Contact records are created in Dataverse
- No authentication errors occur

---

**Next Step**: Complete the Dataverse permissions setup in Power Platform Admin Center, then test the contact form!
