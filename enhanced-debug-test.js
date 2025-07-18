// Enhanced test script with detailed debugging
const https = require('https');

const testData = {
    name: "Debug Test",
    email: "debug@test.com",
    company: "Debug Company", 
    phone: "+1234567890",
    service: "microsoft-365",
    message: "Debug test message for column mapping validation"
};

function testContactForm() {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(testData);
        
        const options = {
            hostname: 'polite-smoke-056b0d100.2.azurestaticapps.net',
            port: 443,
            path: '/api/contact',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'User-Agent': 'ContactFormDebugger/1.0'
            }
        };

        console.log('🔍 Testing Contact Form API');
        console.log('📡 Endpoint:', `https://${options.hostname}${options.path}`);
        console.log('📝 Test Data:', testData);
        console.log('⏰ Timestamp:', new Date().toISOString());
        console.log('\n--- Making Request ---');

        const req = https.request(options, (res) => {
            console.log(`📊 Status: ${res.statusCode} ${res.statusMessage}`);
            console.log('📋 Headers:', JSON.stringify(res.headers, null, 2));
            
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            
            res.on('end', () => {
                console.log('\n--- Response Body ---');
                console.log(body);
                
                try {
                    const jsonResponse = JSON.parse(body);
                    console.log('\n--- Parsed Response ---');
                    console.log(JSON.stringify(jsonResponse, null, 2));
                } catch (e) {
                    console.log('❌ Response is not valid JSON');
                }

                if (res.statusCode === 200) {
                    console.log('\n✅ SUCCESS: Contact form is working!');
                    resolve(body);
                } else if (res.statusCode === 500) {
                    console.log('\n❌ INTERNAL SERVER ERROR: This indicates an issue with:');
                    console.log('   - Dataverse connection');
                    console.log('   - Column mapping');
                    console.log('   - Authentication');
                    console.log('   - Environment configuration');
                    reject(new Error(`Server error: ${body}`));
                } else if (res.statusCode === 400) {
                    console.log('\n❌ BAD REQUEST: Input validation failed');
                    reject(new Error(`Validation error: ${body}`));
                } else {
                    console.log(`\n❌ UNEXPECTED STATUS: ${res.statusCode}`);
                    reject(new Error(`Unexpected status: ${res.statusCode} - ${body}`));
                }
            });
        });

        req.on('error', (e) => {
            console.error('\n❌ REQUEST ERROR:', e.message);
            reject(e);
        });

        req.setTimeout(30000, () => {
            console.error('\n⏱️ REQUEST TIMEOUT');
            req.abort();
            reject(new Error('Request timeout'));
        });

        req.write(postData);
        req.end();
    });
}

// Test with different payloads to narrow down the issue
async function runTests() {
    console.log('🚀 Starting Contact Form Debugging Session');
    console.log('=' .repeat(50));
    
    try {
        // Test 1: Full payload
        console.log('\n📋 TEST 1: Full payload with all fields');
        await testContactForm();
        
    } catch (error) {
        console.log('\n📋 TEST 1 FAILED:', error.message);
        
        // Test 2: Minimal payload
        console.log('\n📋 TEST 2: Minimal payload (required fields only)');
        const originalData = { ...testData };
        testData.company = undefined;
        testData.phone = undefined;
        testData.service = undefined;
        
        try {
            await testContactForm();
        } catch (minimalError) {
            console.log('\n📋 TEST 2 FAILED:', minimalError.message);
            
            // Restore original data
            Object.assign(testData, originalData);
            
            console.log('\n🔍 DEBUGGING SUMMARY:');
            console.log('Both full and minimal payloads failed with same error.');
            console.log('This suggests the issue is likely:');
            console.log('1. Dataverse authentication/authorization');
            console.log('2. Environment configuration');
            console.log('3. Dataverse table/field schema mismatch');
            console.log('4. Network connectivity to Dataverse');
        }
    }
    
    console.log('\n' + '=' .repeat(50));
    console.log('🏁 Debugging session complete');
}

runTests().catch(console.error);
