// Test script to validate contact form functionality
const https = require('https');

const testData = {
    name: "Test User",
    email: "test@example.com",
    company: "Test Company",
    phone: "+1234567890",
    service: "microsoft-365",
    message: "This is a test message to validate the contact form after column mapping fixes."
};

const postData = JSON.stringify(testData);

const options = {
    hostname: 'polite-smoke-056b0d100.2.azurestaticapps.net',
    port: 443,
    path: '/api/contact',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

console.log('Testing contact form with corrected column mappings...');
console.log('Test data:', testData);
console.log('\nSending request to:', `https://${options.hostname}${options.path}`);

const req = https.request(options, (res) => {
    console.log(`\nResponse Status: ${res.statusCode} ${res.statusMessage}`);
    console.log('Response Headers:', res.headers);
    
    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });
    
    res.on('end', () => {
        console.log('\nResponse Body:', body);
        
        if (res.statusCode === 200) {
            console.log('\n✅ SUCCESS: Contact form is working correctly!');
            try {
                const response = JSON.parse(body);
                if (response.success && response.id) {
                    console.log(`📝 Record created with ID: ${response.id}`);
                }
            } catch (e) {
                console.log('Response is not JSON format');
            }
        } else {
            console.log('\n❌ FAILED: Contact form still has issues');
            if (res.statusCode === 500) {
                console.log('This may indicate the deployment is still in progress or there are still column mapping issues');
            }
        }
    });
});

req.on('error', (e) => {
    console.error('Request error:', e);
});

req.write(postData);
req.end();
