// lib/salesforce/queries.ts
import { salesforceFetch } from './api-client';
import { SalesforceCollection, SalesforceProduct } from './types'; // Create types in types.ts

const PRODUCT_API_ENDPOINT = 'commerce/webstores/YOUR_WEBSTORE_ID/products'; // **REPLACE YOUR_WEBSTORE_ID** - Find this in Salesforce Setup
const COLLECTION_API_ENDPOINT = 'commerce/webstores/YOUR_WEBSTORE_ID/collections'; // **REPLACE YOUR_WEBSTORE_ID** - Find this in Salesforce Setup

export async function getProductsFromSalesforce(): Promise<SalesforceProduct[]> {
    const response = await salesforceFetch<{ products: SalesforceProduct[] }>({ // Adjust type based on API response
        endpoint: PRODUCT_API_ENDPOINT,
    });
    return response.body.products; // Adjust based on actual response structure
}

export async function getProductFromSalesforce(productId: string): Promise<SalesforceProduct | undefined> {
    const response = await salesforceFetch<SalesforceProduct>({ // Adjust type
        endpoint: `${PRODUCT_API_ENDPOINT}/${productId}`, // Assuming product ID is used in endpoint
    });
    return response.body;
}

export async function getCollectionsFromSalesforce(): Promise<SalesforceCollection[]> {
    const response = await salesforceFetch<{ collections: SalesforceCollection[] }>({ // Adjust type
        endpoint: COLLECTION_API_ENDPOINT,
    });
    return response.body.collections; // Adjust based on actual response structure
}

// ... Add more functions for other data (e.g., single collection, etc.) ...