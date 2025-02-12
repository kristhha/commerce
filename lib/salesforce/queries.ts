// lib/salesforce/queries.ts
import { salesforceFetch } from './api-client';
import { SalesforceCollection, SalesforceProduct } from './types'; // Create types in types.ts

const WEBSTORE_ID = process.env.SALESFORCE_WEBSTORE_ID;
const PRODUCT_API_ENDPOINT = `commerce/webstores/${WEBSTORE_ID}/products`;
const COLLECTION_API_ENDPOINT = `commerce/webstores/${WEBSTORE_ID}/collections`;
export const PRODUCT_SEARCH_ENDPOINT = `commerce/webstores/${process.env.SALESFORCE_WEBSTORE_ID}/search/product-search`;

export async function getProductsFromSalesforce(): Promise<SalesforceProduct[]> {
  const response = await salesforceFetch<{ productsPage: { products: SalesforceProduct[] } }>({
    endpoint: PRODUCT_SEARCH_ENDPOINT,
    method: 'POST',
    body: {
      categoryId: '0ZGPw0000004qG9OAI',
      searchTerm: '',
      includePrices: true
      // includeImages: true // Make sure to request images
    }
  });
  console.log('getProductsFromSalesforce response:', response);

  return response.body.productsPage.products.map(transformSalesforceProduct);
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
  return transformSalesforceProduct(response.body);
}

// lib/salesforce/queries.ts
import { Product } from './types'; // Import both types

function transformSalesforceProduct(sfProduct: SalesforceProduct): Product {
  // Helper function to get price (handle cases where prices might be null)
  const getPrice = (prices: any) => {
    if (prices) {
      const unitPrice = prices.unitPrice;
      if (unitPrice) {
        return {
          amount: unitPrice.toString(), // Ensure string
          currencyCode: 'USD'
        };
      }
      // Fallback if no standard price
      return {
        amount: '0',
        currencyCode: 'USD'
      };
    }
    //If no prices exists
    return {
      amount: '0',
      currencyCode: 'USD'
    };
  };

  // Helper function to get the first media item URL
  const getImageUrl = (product: SalesforceProduct) => {
    const mediaItems = product.mediaGroups?.[0]?.mediaItems;
    if (mediaItems && mediaItems.length > 0) {
      const baseUrl =
        'https://getremarkable--com.sandbox.preview.salesforce-experience.com/reMarkableB2BPortal/sfsites/c/cms/delivery';
      const mediaItem = mediaItems[0];
      return `${baseUrl}/media/${mediaItem.contentVersionId}?oid=00DQJ000007rWFR&version=1.1&channelId=0apPw0000003dmQ&width=600`;
    }
    return '/img/b2b/default-product-image.svg';
  };

  // Helper function to get all media items
  const getAllImages = (product: SalesforceProduct) => {
    const mediaItems = product.mediaGroups?.[0]?.mediaItems || [];
    return mediaItems.map((item) => ({
      url: `https://getremarkable--com.sandbox.preview.salesforce-experience.com/reMarkableB2BPortal/sfsites/c/cms/delivery/media/${item.contentVersionId}?oid=00DQJ000007rWFR&version=1.1&channelId=0apPw0000003dmQ&width=600`,
      altText: item.alternateText || product.name,
      width: 600,
      height: 600
    }));
  };

  const imageUrl = getImageUrl(sfProduct);
  const images = getAllImages(sfProduct);

  return {
    id: sfProduct.id,
    handle: sfProduct.id,
    title: sfProduct.name,
    description: sfProduct.fields?.Description?.value || '',
    descriptionHtml: sfProduct.fields?.Description?.value || '',
    featuredImage: {
      url: imageUrl,
      altText: sfProduct.name,
      width: 600,
      height: 600
    },
    images:
      images.length > 0
        ? images
        : [
            {
              url: imageUrl,
              altText: sfProduct.name,
              width: 600,
              height: 600
            }
          ],
    priceRange: {
      maxVariantPrice: getPrice(sfProduct.prices),
      minVariantPrice: getPrice(sfProduct.prices) // You might need separate logic for min/max
    },
    availableForSale: true, // You'll need to determine this from the Salesforce data
    variants: [], //  Implement variant logic later
    options: [], // Implement option logic later
    tags: [], // Add tags, including HIDDEN_PRODUCT_TAG if needed, based on Salesforce data.
    seo: {
      title: sfProduct.name,
      description: sfProduct.fields?.Description?.value || ''
    }
  };
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
