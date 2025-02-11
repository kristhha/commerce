// lib/salesforce/api-client.ts
const SALESFORCE_API_BASE_URL = process.env.SALESFORCE_API_BASE_URL;
const SALESFORCE_ACCESS_TOKEN = process.env.SALESFORCE_ACCESS_TOKEN;

export async function salesforceFetch<T>({
  endpoint,
  method = 'GET',
  headers = {},
  body,
  baseURL = process.env.SALESFORCE_API_BASE_URL,
  accessToken = process.env.BUYER_SESSION_ID
}: {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  headers?: HeadersInit;
  body?: any;
  baseURL?: string;
  accessToken?: string;
}): Promise<{ status: number; body: T }> {
  if (!accessToken) {
    throw new Error(
      'SALESFORCE_ACCESS_TOKEN (BUYER_SESSION_ID) is not set.  Cannot make API requests.'
    );
  }
  if (!baseURL) {
    throw new Error('SALESFORCE_API_BASE_URL is not set.  Cannot make API requests.');
  }

  const fullURL = `${baseURL}${endpoint}`; // Construct the full URL

  const defaultHeaders = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    ...headers // Allow overriding default headers
  };

  const response = await fetch(fullURL, {
    method,
    headers: defaultHeaders,
    body: body ? JSON.stringify(body) : undefined // Stringify body for POST/PATCH
  });

  const responseBody = await response.json();

  if (!response.ok) {
    // Throw a more informative error, including the response body
    throw new Error(
      `Salesforce API Error: ${response.status} - ${response.statusText} - ${JSON.stringify(responseBody)}`
    );
  }

  return { status: response.status, body: responseBody };
}
