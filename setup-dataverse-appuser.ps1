# PowerShell script to add Application User to Dataverse
# Run this script to complete the authentication setup

# Configuration
$AppId = "f7adfbea-5c0b-4118-9d73-d1ca5e722483"
$DataverseUrl = "https://org75c51f0f.crm6.dynamics.com"
$AppUserName = "mySPAApp Dataverse Connector"

Write-Host "🔧 Dataverse Application User Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Configuration Details:" -ForegroundColor Yellow
Write-Host "App Registration ID: $AppId" -ForegroundColor White
Write-Host "Dataverse URL: $DataverseUrl" -ForegroundColor White
Write-Host "Application User Name: $AppUserName" -ForegroundColor White
Write-Host ""

Write-Host "🚀 MANUAL STEPS REQUIRED:" -ForegroundColor Red
Write-Host ""
Write-Host "1. Open the Power Platform Admin Center:" -ForegroundColor Green
Write-Host "   https://admin.powerplatform.microsoft.com/" -ForegroundColor Blue
Write-Host ""
Write-Host "2. Navigate to your Dataverse environment:" -ForegroundColor Green
Write-Host "   - Click on 'Environments'" -ForegroundColor White
Write-Host "   - Find and click your environment (org75c51f0f)" -ForegroundColor White
Write-Host ""
Write-Host "3. Add Application User:" -ForegroundColor Green
Write-Host "   - Click 'Settings' > 'Users + permissions' > 'Application users'" -ForegroundColor White
Write-Host "   - Click '+ New app user'" -ForegroundColor White
Write-Host "   - Click '+ Add an app'" -ForegroundColor White
Write-Host "   - Search for App ID: $AppId" -ForegroundColor Yellow
Write-Host "   - Select the app and click 'Add'" -ForegroundColor White
Write-Host ""
Write-Host "4. Assign Security Role:" -ForegroundColor Green
Write-Host "   - In the 'Security roles' section, click the pencil (edit) icon" -ForegroundColor White
Write-Host "   - Select 'System Administrator' role" -ForegroundColor White
Write-Host "   - Click 'Save'" -ForegroundColor White
Write-Host ""
Write-Host "5. Create the Application User:" -ForegroundColor Green
Write-Host "   - Click 'Create' to create the application user" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  IMPORTANT NOTES:" -ForegroundColor Yellow
Write-Host "- The app registration must exist in the same Azure AD tenant as Dataverse" -ForegroundColor White
Write-Host "- System Administrator role gives full access - use for testing only" -ForegroundColor White
Write-Host "- For production, create a custom security role with minimal required permissions" -ForegroundColor White
Write-Host ""

Write-Host "✅ AFTER COMPLETING THESE STEPS:" -ForegroundColor Green
Write-Host "   Test the contact form at: https://polite-smoke-056b0d100.2.azurestaticapps.net/contact-debug.html" -ForegroundColor Blue
Write-Host ""

# Alternative: Try to create via PowerShell (requires Dataverse PowerShell module)
Write-Host "🔄 ALTERNATIVE: PowerShell Method (if you have permissions)" -ForegroundColor Magenta
Write-Host ""
Write-Host "If you have the Microsoft.PowerApps.Administration.PowerShell module installed:" -ForegroundColor White
Write-Host ""
Write-Host 'Install-Module -Name Microsoft.PowerApps.Administration.PowerShell -Force' -ForegroundColor Gray
Write-Host 'Connect-PowerAppsAccount' -ForegroundColor Gray
Write-Host "`$env = Get-PowerAppEnvironment | Where-Object { `$_.DisplayName -like '*org75c51f0f*' }" -ForegroundColor Gray
Write-Host "New-PowerAppApplicationUser -EnvironmentName `$env.EnvironmentName -ApplicationId $AppId -RoleName 'System Administrator'" -ForegroundColor Gray
Write-Host ""

Write-Host "📞 Need Help?" -ForegroundColor Cyan
Write-Host "Documentation: https://learn.microsoft.com/en-us/power-platform/admin/manage-application-users" -ForegroundColor Blue
