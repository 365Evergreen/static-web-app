# Add Managed Identity to Dataverse Environment
# Run this PowerShell script as an administrator with Power Platform permissions

# Install Power Platform CLI if not already installed
Write-Host "Installing Power Platform CLI..." -ForegroundColor Yellow
winget install Microsoft.PowerPlatformCLI

# Authenticate to Power Platform (this will open a browser)
Write-Host "Authenticating to Power Platform..." -ForegroundColor Yellow
pac auth create --url https://org75c51f0f.crm6.dynamics.com

# Add the managed identity as application user
Write-Host "Adding managed identity as application user..." -ForegroundColor Yellow
try {
    # Using the App ID from Azure AD
    pac admin application-user add `
        --environment https://org75c51f0f.crm6.dynamics.com `
        --application-id fdba0e2c-2a7c-40ec-8f1b-83a4bafaf9e5 `
        --role "System Customizer"
    
    Write-Host "✅ Successfully added managed identity to Dataverse!" -ForegroundColor Green
    Write-Host "App ID: fdba0e2c-2a7c-40ec-8f1b-83a4bafaf9e5" -ForegroundColor Green
    Write-Host "Role: System Customizer" -ForegroundColor Green
} catch {
    Write-Host "❌ Error adding application user: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "You may need to add this manually in Power Platform Admin Center" -ForegroundColor Yellow
}

Write-Host "`n🧪 Test Instructions:" -ForegroundColor Cyan
Write-Host "1. Wait 2-3 minutes for permissions to propagate" -ForegroundColor White
Write-Host "2. Open /contact-debug.html in your browser" -ForegroundColor White
Write-Host "3. Submit a test contact form" -ForegroundColor White
Write-Host "4. Check for successful submission (no more 'unknown error')" -ForegroundColor White
