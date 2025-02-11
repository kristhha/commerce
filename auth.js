// auth.js
const path = require('path');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Verify environment variables are loaded
console.log('Environment check:');
console.log('SALESFORCE_SOAP_ENDPOINT:', process.env.SALESFORCE_SOAP_ENDPOINT);
if (!process.env.SALESFORCE_SOAP_ENDPOINT) {
    console.error('Required environment variables are missing!');
    process.exit(1);
}

async function performLogin(username, password, url, extraHeaders = {}) {
    // Log the request details
    console.log('\n=== Login Request Details ===');
    console.log('Attempting login for username:', username);
    console.log('Target URL:', url);
    console.log('Extra Headers:', JSON.stringify(extraHeaders, null, 2));

    try {
        let data = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <soap:Header>
        ${extraHeaders.loginScopeHeader || ''}
    </soap:Header>
    <soap:Body>
        <login xmlns="urn:partner.soap.sforce.com">
            <username><![CDATA[${username}]]></username>
            <password><![CDATA[${password}]]></password>
        </login>
    </soap:Body>
</soap:Envelope>`;

        console.log('\nPrepared SOAP Request Body:', data);

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'Content-Type': 'text/xml; charset=UTF-8',
                'SOAPAction': 'login',
                'Accept': 'text/xml',
            },
            data: data
        };

        console.log('\nAxios Config:', {
            ...config,
            data: '(SOAP Body omitted for brevity)'
        });

        const response = await axios.request(config);

        console.log('\nResponse Status:', response.status);
        console.log('Response Headers:', JSON.stringify(response.headers, null, 2));

        const sessionIdMatch = /<sessionId>(.*?)<\/sessionId>/.exec(response.data);
        if (!sessionIdMatch) {
            console.error("\nFull response body:", response.data);
            throw new Error('Session ID not found in response');
        }
        const sessionId = sessionIdMatch[1];
        console.log('\nSession ID successfully extracted');
        return sessionId;

    } catch (error) {
        console.error('\n=== Error Details ===');
        if (error.response) {
            console.error("Response Status:", error.response.status);
            console.error("Response Headers:", error.response.headers);
            console.error("Response Data:", error.response.data);
        } else if (error.request) {
            console.error("Request was made but no response received");
            console.error("Request details:", error.request);
        } else {
            console.error('Error during request setup:', error.message);
            console.error('Full error object:', error);
        }
        console.error('\nEnvironment variables:');
        console.error('SALESFORCE_SOAP_ENDPOINT:', process.env.SALESFORCE_SOAP_ENDPOINT);
        throw error;
    }
}

async function authenticate() {
    try {
        const adminSessionId = await performLogin(
            process.env.ADMIN_USERNAME,
            process.env.ADMIN_PASSWORD + process.env.ADMIN_SECURITY_TOKEN,
            process.env.SALESFORCE_SOAP_ENDPOINT
        );

        const buyerSessionId = await performLogin(
            process.env.BUYER_USERNAME,
            process.env.BUYER_PASSWORD,
            process.env.SALESFORCE_SOAP_ENDPOINT,
            {
                loginScopeHeader: `<LoginScopeHeader xmlns="urn:partner.soap.sforce.com">
            <organizationId>${process.env.BUYER_ORGANIZATION_ID}</organizationId>
        </LoginScopeHeader>`
            }
        );

        // Read the current .env.local file
        const envPath = path.resolve(process.cwd(), '.env.local');
        let envContent = fs.readFileSync(envPath, 'utf8');

        // Update or add the session IDs
        const updateEnvVar = (name, value) => {
            const regex = new RegExp(`^${name}=.*$`, 'm');
            if (envContent.match(regex)) {
                envContent = envContent.replace(regex, `${name}=${value}`);
            } else {
                envContent += `\n${name}=${value}`;
            }
        };

        updateEnvVar('ADMIN_SESSION_ID', adminSessionId);
        updateEnvVar('BUYER_SESSION_ID', buyerSessionId);

        // Write back to .env.local
        fs.writeFileSync(envPath, envContent);

        console.log('Session IDs have been updated in .env.local');

    } catch (error) {
        console.error('Authentication failed:', error);
        process.exit(1);  // Exit with error code if authentication fails
    }
}

authenticate();