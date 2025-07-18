# Contact Form Troubleshooting Guide

## 🚨 Current Issue: "Unknown Error" in Contact Form

Your contact form is failing because the **Dataverse environment URL is not configured** in your Azure Static Web App.

---

## 🔧 Quick Fix (5 Minutes)

### Step 1: Find Your Dataverse Environment URL

1. **Go to Power Platform Admin Center**: https://admin.powerplatform.microsoft.com/
2. **Select your environment** (the one where you created the contact form table)
3. **Copy the Environment URL** - it looks like:
   ```
   https://your-org12345.crm.dynamics.com
   ```

### Step 2: Configure Environment Variable

**Option A: Using AZD CLI (Recommended)**
```bash
# Replace with your actual Dataverse URL
azd env set DATAVERSE_ENVIRONMENT_URL "https://your-org12345.crm.dynamics.com"

# Redeploy to apply changes
azd up
```

**Option B: Using Azure Portal**
1. Go to [Azure Portal](https://portal.azure.com)
2. Find your Static Web App: `swa-gqqvw2kvdrh6i`
3. Go to **Configuration** → **Application settings**
4. Click **+ Add**
5. **Name**: `DATAVERSE_ENVIRONMENT_URL`
6. **Value**: `https://your-org12345.crm.dynamics.com`
7. Click **Save**

### Step 3: Test the Fix

1. Visit: https://proud-plant-095ef400f.2.azurestaticapps.net/contact-debug.html
2. Click **"Test API Connection"**
3. Fill out the form and click **"Submit Test Form"**
4. Check the results

---

## 🔍 Debugging Tools

### Test Page
I've created a debugging tool: **contact-debug.html**
- Tests API connectivity
- Shows detailed error messages
- Logs network requests
- Validates form submission

### Manual Testing
```bash
# Test the API endpoint directly
curl -X POST https://proud-plant-095ef400f.2.azurestaticapps.net/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "service": "microsoft365",
    "message": "Test message"
  }'
```

---

## 🔐 Authentication Setup (If Still Failing)

If setting the environment URL doesn't work, you may need to configure authentication:

### 1. Enable System-Assigned Managed Identity

**Using Azure CLI:**
```bash
# Enable managed identity for your Static Web App
az staticwebapp identity assign \
  --name "swa-gqqvw2kvdrh6i" \
  --resource-group "mySPAGroup"
```

**Using Azure Portal:**
1. Go to your Static Web App
2. Select **Identity** → **System assigned**
3. Set **Status** to **On**
4. Click **Save**

### 2. Grant Dataverse Permissions

1. **Go to Power Platform Admin Center**
2. **Select your environment**
3. **Settings** → **Users + permissions** → **Application users**
4. **+ New app user**
5. **Add an app** → Find your Static Web App's managed identity
6. **Business unit**: Select your business unit
7. **Security roles**: Add "365 Evergreen Contact Form User" role

---

## 🐛 Common Error Messages & Solutions

### "Authentication failed: Unable to obtain access token"
- **Cause**: Managed Identity not configured
- **Solution**: Follow authentication setup above

### "Invalid environment URL"
- **Cause**: Wrong Dataverse URL format
- **Solution**: Ensure URL format is `https://your-org.crm.dynamics.com` (no trailing slash)

### "Access is denied"
- **Cause**: Managed Identity doesn't have Dataverse permissions
- **Solution**: Grant proper security role in Power Platform Admin Center

### "Unknown error"
- **Cause**: Environment variable not set
- **Solution**: Set `DATAVERSE_ENVIRONMENT_URL` environment variable

---

## 📊 Verification Steps

### 1. Check Environment Variables
```bash
azd env get-values | grep DATAVERSE
```
Should return:
```
DATAVERSE_ENVIRONMENT_URL="https://your-org.crm.dynamics.com"
```

### 2. Check API Response
Visit: https://proud-plant-095ef400f.2.azurestaticapps.net/api/contact
- Should return: `405 Method Not Allowed` (this is correct)
- Should NOT return: `404 Not Found` or `500 Internal Server Error`

### 3. Check Logs
```bash
# View application logs
azd logs

# Or check in Azure Portal:
# Static Web App → Functions → contact → Monitor
```

---

## 🎯 Expected Workflow

When working correctly:

1. **User submits form** → Contact form on website
2. **Form data sent** → Azure Function `/api/contact`
3. **Function authenticates** → Using Managed Identity
4. **Data saved** → Dataverse contact table
5. **Success response** → User sees confirmation

---

## 📞 Need Help?

### Current Status
- ✅ Azure Static Web App deployed
- ✅ Contact form UI working
- ✅ Azure Function deployed
- ❌ Dataverse connection not configured
- ❌ Environment variable missing

### Next Steps
1. Set `DATAVERSE_ENVIRONMENT_URL` environment variable
2. Test using `/contact-debug.html`
3. If still failing, enable Managed Identity
4. Grant Dataverse permissions

### Resources
- **Setup Guide**: `context/dataverse/environment-setup.md`
- **Debug Tool**: `/contact-debug.html`
- **Current Site**: https://proud-plant-095ef400f.2.azurestaticapps.net/
- **Azure Portal**: https://portal.azure.com/

---

**Remember**: After making any configuration changes, you need to redeploy with `azd up` or wait for the changes to take effect (usually 2-3 minutes).
