// lib/salesforce/api-client.ts
const SALESFORCE_API_BASE_URL = process.env.SALESFORCE_API_BASE_URL;
const SALESFORCE_CONSUMER_KEY = process.env.SALESFORCE_CONSUMER_KEY;
const SALESFORCE_CONSUMER_SECRET = process.env.SALESFORCE_CONSUMER_SECRET;

// Example -  This is a simplified example. Real OAuth 2.0 flow is more complex
async function getSalesforceAccessToken(): Promise<string> {
    // **Implement OAuth 2.0 flow here to get access token from Salesforce**
    // ... (Use Salesforce API documentation for OAuth 2.0 details)
    // For simplicity, this is just a placeholder:
    console.log("Simulating getting Salesforce Access Token");
    return "YOUR_SALESFORCE_ACCESS_TOKEN"; // Replace with actual token retrieval
}

export async function salesforceFetch<T>({
    endpoint,
    method = 'GET',
    headers = {},
    body,
}: {
    endpoint: string;
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    headers?: HeadersInit;
    body?: any;
}): Promise<{ status: number; body: T }> {
    const accessToken = await getSalesforceAccessToken(); // Get your access token

    const defaultHeaders = {
        'Authorization': `Bearer ${accessToken}`, // Include access token
        'Content-Type': 'application/json',
        ...headers,
    };

    try {
        const response = await fetch(`${SALESFORCE_API_BASE_URL}${endpoint}`, {
            method,
            headers: defaultHeaders,
            ...(body ? { body: JSON.stringify(body) } : {}),
        });

        const responseBody = await response.json() as T; // Type assertion based on expected response

        if (!response.ok) {
            console.error("Salesforce API Error:", response.status, responseBody);
            throw new Error(`Salesforce API Error: ${response.status} - ${JSON.stringify(responseBody)}`);
        }

        return { status: response.status, body: responseBody };

    } catch (error) {
        console.error("Error during Salesforce API call:", error);
        throw error; // Re-throw to be handled by calling function
    }
}