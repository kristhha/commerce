import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import Footer from 'components/layout/footer';
import { getProductsFromSalesforce } from 'lib/salesforce/queries';

export const metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {
  const products = await getProductsFromSalesforce();
  console.log('page getProductsFromSalesforce:', products);

  return (
    <>
      {/* <div>
        <h1>Login Example</h1>
        <p>{message}</p>
        <button onClick={() => handleLogin('admin')}>Login as Admin</button>
        <button onClick={() => handleLogin('buyer')}>Login as Buyer</button>

        {adminSessionId && <p>Admin Session ID: {adminSessionId}</p>}
        {buyerSessionId && <p>Buyer Session ID: {buyerSessionId}</p>}
        <button onClick={() => getProduct}>Get Product with Buyer Session</button>
      </div> */}
      <ThreeItemGrid />
      <pre className="m-4 max-h-[500px] overflow-auto bg-gray-100 p-4">
        {JSON.stringify(products, null, 2)}
      </pre>
      <Carousel />
      <Footer />
    </>
  );
}
