/ lib/shopify/types.ts (Make sure this is accurate based on component usage)

export interface Product {
  id: string;
  handle: string; // Crucial for routing: /product/[handle]
  title: string;
  description?: string; // Optional, but good to have
  descriptionHtml?: string;
  featuredImage: {
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  };
  images: {
      url: string;
      altText?: string;
      width?: number;
      height?: number;
  }[];
  priceRange: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  availableForSale: boolean; // Add availableForSale
  variants: ProductVariant[];
  options: ProductOption[];
  tags: string[]; // For HIDDEN_PRODUCT_TAG
  seo: {  //Required by page.tsx inside product/[handle]
    title: string;
    description: string;
  }
}

// You might also have these, ensure they're complete:
export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: {
    amount: string;
    currencyCode: string;
  };
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}
    // lib/salesforce/types.ts

// Example Product Type - Adjust to match Salesforce API response
export interface SalesforceProduct {
  id: string;
  name: string;
  mediaGroups?: {
    mediaItems?: {
      url: string;
      alternateText?: string;
      contentVersionId?: string;
      id?: string;
      mediaType?: string;
      sortOrder?: number;
      title?: string;
    }[];
  }[];
  prices?: {
    pricebookEntryType: string;
    currencyISOCode: string;
    listPrice: number;
  }[];
  fields?: {
    Description?: {
      value: string;
    };
  };
}

// Example Collection Type - Adjust to match Salesforce API response
export interface SalesforceCollection {
    id: string;
    name: string;
    description: string;
    handle: string; // or slug for URL
    // ... other collection fields ...
}

// ... Define types for Cart, Cart Items, etc., as you implement cart functionality ...