// tests/global.setup.ts
import { FullConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.test') }); // Load test env variables

async function globalSetup(config: FullConfig) {
  console.log('Global setup started');

  // Example: Verify environment variables are set
  if (!process.env.SALESFORCE_API_BASE_URL || !process.env.SALESFORCE_API_CLIENT_ID || !process.env.SALESFORCE_API_CLIENT_SECRET) {
    throw new Error("Salesforce API environment variables are missing in .env.test");
  }

  // You might initialize a Salesforce API client here if you need it for setup tasks.
  // Example (Conceptual - adapt to your Salesforce API client library):
  // const salesforceClient = new SalesforceApiClient({
  //   baseUrl: process.env.SALESFORCE_API_BASE_URL,
  //   clientId: process.env.SALESFORCE_API_CLIENT_ID,
  //   clientSecret: process.env.SALESFORCE_API_CLIENT_SECRET,
  // });
  // globalThis.salesforceClient = salesforceClient; // Make it globally available if needed

  console.log('Global setup finished');
}

export default globalSetup;