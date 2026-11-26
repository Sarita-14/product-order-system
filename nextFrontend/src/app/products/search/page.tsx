import ProductSearch from './product-search';

// Server Component page that just renders the client search box.
// The search itself runs in the browser (it reacts to every keystroke).
export default function ProductSearchPage() {
  return <ProductSearch />;
}