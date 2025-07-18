# 🚨 **Contact Form 500 Error - Diagnosis & Fix**

## 🔍 **Current Issue:**
- **Status**: 500 Internal Server Error
- **Payload**: Form sending `"microsoft-365"` (with hyphen)
- **Expected**: Function expects `"microsoft365"` (without hyphen)

## ✅ **Fixes Applied:**

### 1. **Choice Mapping Updated** ✅
Updated Azure Function to handle both formats:
- `"microsoft-365"` → `463170000` ✅
- `"microsoft365"` → `463170000` ✅  
- `"power-platform"` → `463170001` ✅
- `"powerplatform"` → `463170001` ✅

### 2. **Code Rebuilt** ✅
- Compiled with `npm run build`
- Ready for deployment

## 🚀 **Next Steps:**

### **Option A: Quick Test with Fixed Payload**
Update your debugging form to send the expected format:

**Change HTML form values from:**
```html
<option value="microsoft-365">...</option>
```

**To:**
```html
<option value="microsoft365">...</option>
```

### **Option B: Deploy Updated Function**
The Azure Function needs to be redeployed with the new choice mapping:

```bash
# Deploy updated function
azd up
# OR commit changes and let GitHub Actions deploy
```

## 🧪 **Immediate Test:**

**Try this payload in your contact-debug.html:**
```json
{
  "name": "Paul",
  "email": "hello@365evergreen.com",
  "company": "365 Evergreen", 
  "phone": "0423 652 019",
  "service": "microsoft365",  // ← Change this to no hyphen
  "message": "Tell me more"
}
```

## 🔍 **Other Potential Issues:**

If the 500 error persists after fixing the choice mapping:

1. **Managed Identity Permissions**: May need final role assignment in Dataverse
2. **Environment Variable**: DATAVERSE_ENVIRONMENT_URL might not be set on production
3. **Table/Column Names**: Verify Dataverse table and column names match exactly

## 🎯 **Expected Success Response:**
```json
{
  "message": "Thank you! Your message has been received and saved. We will contact you soon.",
  "submissionId": "[some-guid]",
  "timestamp": "2025-07-19T..."
}
```

---

**Next**: Test with `"microsoft365"` (no hyphen) or redeploy the updated Azure Function! 🚀
