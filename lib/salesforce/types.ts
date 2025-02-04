// lib/salesforce/types.ts

// Example Product Type - Adjust to match Salesforce API response
export interface SalesforceProduct {
    id: string;
    name: string;
    description: string;
    imageUrl: string; // Example - might be different in Salesforce
    price: number;
    // ... other product fields based on Salesforce API ...
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