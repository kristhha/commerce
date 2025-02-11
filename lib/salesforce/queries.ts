// lib/salesforce/queries.ts
import { salesforceFetch } from './api-client';
import { SalesforceCollection, SalesforceProduct } from './types'; // Create types in types.ts

const WEBSTORE_ID = process.env.SALESFORCE_WEBSTORE_ID;
const PRODUCT_API_ENDPOINT = `commerce/webstores/${WEBSTORE_ID}/products`;
const COLLECTION_API_ENDPOINT = `commerce/webstores/${WEBSTORE_ID}/collections`;
export const PRODUCT_SEARCH_ENDPOINT = `commerce/webstores/${process.env.SALESFORCE_WEBSTORE_ID}/search/product-search`;

export async function getProductsFromSalesforce(): Promise<SalesforceProduct[]> {
  const response = await salesforceFetch<{ products: SalesforceProduct[] }>({
    endpoint: PRODUCT_SEARCH_ENDPOINT,
    method: 'POST',
    body: {
      categoryId: '0ZGPw0000004qG9OAI',
      searchTerm: ''
      // Optional parameters you might want to add:
      // pageSize: 20,
      // pageNumber: 0,
      // sortPolicy: {
      //   sortField: "NAME",
      //   sortOrder: "ASC"
      // }
    }
  });
  console.log('getProductsFromSalesforce response:', response);

  return response.body.productsPage.products;
}

export async function getProductFromSalesforce(
  productId: string
): Promise<SalesforceProduct | undefined> {
  const response = await salesforceFetch<SalesforceProduct>({
    // Adjust type
    endpoint: `${PRODUCT_API_ENDPOINT}/${productId}` // Assuming product ID is used in endpoint
  });
  return response.body;
}

export async function getCollectionsFromSalesforce(): Promise<SalesforceCollection[]> {
  const response = await salesforceFetch<{ collections: SalesforceCollection[] }>({
    // Adjust type
    endpoint: COLLECTION_API_ENDPOINT
  });
  return response.body.collections; // Adjust based on actual response structure
}

export async function getCart(cartId?: string): Promise<any> {
  const endpoint = cartId
    ? `commerce/webstores/${WEBSTORE_ID}/carts/${cartId}`
    : `commerce/webstores/${WEBSTORE_ID}/carts`;

  const response = await salesforceFetch<any>({
    endpoint: endpoint
  });
  return response.body;
}

// export async function getCollectionProducts(collectionId: string): Promise<SalesforceProduct[]> {
//   const response = await salesforceFetch<{ products: SalesforceProduct[] }>({
//     endpoint: PRODUCT_SEARCH_ENDPOINT,
//     method: 'POST',
//     body: {
//       categoryId: collectionId,
//       // Add any additional search parameters as needed
//       page: 0,
//       pageSize: 100,
//       sortBy: 'name-asc'
//     }
//   });
//   return response.body.products || [];
// }

// ... Add more functions for other data (e.g., single collection, etc.) ...
