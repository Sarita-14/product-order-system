// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/admin/products/page.tsx — "/admin/products": add form + product table.
// ─────────────────────────────────────────────────────────────────────────────

// Suspense = wait for data.
import { Suspense } from 'react';
// The Server Action that creates a product.
import { createProduct } from '@/actions/product.actions';
// The product inputs (name, description, price, stock).
import { ProductFields } from '@/components/admin/product-fields';
// The product table.
import { ProductsTable } from '@/components/admin/products-table';
// The shared form.
import { ActionForm } from '@/components/ui/action-form';
// "Loading…" text.
import { Loading } from '@/components/ui/loading';
// The page's <h1>.
import { PageHeading } from '@/components/ui/page-heading';
// Styles.
import { cardClass, mutedClass } from '@/components/ui/styles';
// SEO helper.
import { buildMetadata } from '@/lib/seo';
// GET /products.
import { getProducts } from '@/services/product.service';

// SEO: private page -> noIndex.
export const metadata = buildMetadata({
  title: 'Manage products',
  description: 'Add, edit and delete products.',
  path: '/admin/products',
  noIndex: true,
});

export default function AdminProductsPage() {
  return (
    <section className="flex flex-col gap-6">
      <PageHeading title="Products" subtitle="Add a product, or edit an existing one." />

      {/* The "Add product" box: empty fields + submit -> createProduct runs on the server */}
      <div className={cardClass}>
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Add product</h2>
        <ActionForm action={createProduct} submitLabel="Add product" pendingLabel="Adding…">
          <ProductFields />
        </ActionForm>
      </div>

      {/* The table needs data -> inside Suspense */}
      <Suspense fallback={<Loading />}>
        <ProductList />
      </Suspense>
    </section>
  );
}

// Container: loads products and shows the table.
async function ProductList() {
  const products = await getProducts();
  if (products.length === 0) return <p className={mutedClass}>No products yet.</p>;
  return <ProductsTable products={products} />;
}
