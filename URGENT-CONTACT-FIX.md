# URGENT: Fix Contact Form - Azure Portal Method

## 🚨 Your contact form is failing because the Dataverse URL is missing

Since the `azd up` command failed, let's fix this directly in Azure Portal:

### 🔧 Quick Fix via Azure Portal (5 minutes)

1. **Go to Azure Portal**: https://portal.azure.com
2. **Search for**: `swa-gqqvw2kvdrh6i` (your Static Web App)
3. **Click on your Static Web App resource**
4. **In the left menu, click**: `Configuration`
5. **Click**: `+ Add` (under Application settings)
6. **Add this setting**:
   - **Name**: `DATAVERSE_ENVIRONMENT_URL`
   - **Value**: `https://org75c51f0f.crm6.dynamics.com`
7. **Click**: `Save`
8. **Wait 2-3 minutes** for the configuration to apply

### 🧪 Test the Fix

After saving the configuration:

1. **Visit**: https://proud-plant-095ef400f.2.azurestaticapps.net/contact-debug.html
2. **Click**: "Test API Connection" (should show ✅)
3. **Fill out the form** and click "Submit Test Form"
4. **Check the result** - should now work!

### 🔐 If Still Failing: Enable Managed Identity

If you still get authentication errors:

1. **In your Static Web App** → **Identity**
2. **System assigned** → **Status: On** → **Save**
3. **Copy the Object (principal) ID** that appears
4. **Go to Power Platform Admin Center**: https://admin.powerplatform.microsoft.com/
5. **Select your environment** → **Settings** → **Users + permissions** → **Application users**
6. **+ New app user** → **Add an app** → paste the Object ID
7. **Add security role**: "365 Evergreen Contact Form User"

### 📊 Current Status

- ✅ Website deployed: https://proud-plant-095ef400f.2.azurestaticapps.net/
- ✅ Contact form UI working
- ✅ Azure Function deployed
- ❌ **Missing**: Dataverse environment URL
- ❌ **Possibly missing**: Managed Identity permissions

### 🎯 Expected Result

After adding the environment variable, your contact form should:
1. ✅ Accept form submissions
2. ✅ Save data to Dataverse
3. ✅ Show success message
4. ✅ Send notifications (if configured)

### 📞 Need Help?

If this doesn't work:
1. Check the debug tool: `/contact-debug.html`
2. Look at Function logs in Azure Portal
3. Verify Dataverse table exists and has proper permissions

---

**Remember**: After adding the environment variable, wait 2-3 minutes for it to take effect before testing!
