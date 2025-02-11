const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**'
      }
    ]
  },
  serverRuntimeConfig: {
    // Make the session ID available to the server-side
    buyerSessionId: process.env.BUYER_SESSION_ID
  }
};

if (!process.env.BUYER_SESSION_ID) {
  console.error('CRITICAL ERROR: BUYER_SESSION_ID environment variable is not set.  Exiting.');
  process.exit(1); // Exit the Node.js process
}

module.exports = nextConfig;
