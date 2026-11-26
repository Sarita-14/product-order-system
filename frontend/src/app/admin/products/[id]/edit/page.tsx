// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/admin/products/[id]/edit/page.tsx — "/admin/products/<id>/edit".
// Edit form + delete button for one product.
// ([id] dynamic route and generateMetadata: see app/(public)/products/[id]/page.tsx.)
// ─────────────────────────────────────────────────────────────────────────────

// Type of the metadata object (the title/description info for Google).
import type { Metadata } from 'next';
// Suspense = wait for data.
import { Suspense } from 'react';
// The two Server Actions.
import { deleteProduct, updateProduct } from '@/actions/product.actions';
// The product inputs.
import { ProductFields } from '@/components/admin/product-fields';
// The shared form.
import { ActionForm } from '@/components/ui/action-form';
// "Loading…" text.
import { Loading } from '@/components/ui/loading';
// The page's <h1>.
import { PageHeading } from '@/components/ui/page-heading';
// White box style.
import { cardClass } from '@/components/ui/styles';
// API "not found" -> 404 page.
import { findOrNotFound } from '@/lib/not-found';
// Builds "/admin/products/<id>/edit".
import { editProductPath } from '@/lib/routes';
// SEO helper.
import { buildMetadata } from '@/lib/seo';
// GET /products/<id>.
import { getProductById } from '@/services/product.service';

// The [id] from the URL (it arrives a moment later, so we wait for it with await).
type Params = Promise<{ id: string }>;

// SEO: private page -> noIndex; canonical (the page's official address) = this exact URL.
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return buildMetadata({
    title: 'Edit product',
    description: 'Change or delete a product.',
    path: editProductPath(id),
    noIndex: true,
  });
}

export default function EditProductPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<Loading />}>
      <EditProduct params={params} />
    </Suspense>
  );
}

// Container: loads the product, shows the two forms.
async function EditProduct({ params }: { params: Params }) {
  const { id } = await params;
  const product = await findOrNotFound(getProductById(id)); // missing -> 404 page

  return (
    <section className="flex flex-col gap-6">
      <PageHeading title={`Edit: ${product.name}`} />

      {/* Edit form: fields start filled with the product's current values */}
      <div className={cardClass}>
        {/* .bind(null, id) = the action already knows WHICH product */}
        <ActionForm action={updateProduct.bind(null, id)} submitLabel="Save changes">
          <ProductFields product={product} />
        </ActionForm>
      </div>

      {/* Delete box: a red button only (no fields) */}
      <div className={`${cardClass} flex flex-col gap-3`}>
        <h2 className="text-xl font-semibold text-slate-900">Delete product</h2>
        <p className="text-sm text-slate-600">
          The product is hidden from the shop. Past orders keep pointing to it.
        </p>
        <ActionForm
          action={deleteProduct.bind(null, id)}
          submitLabel="Delete product"
          pendingLabel="Deleting…"
          variant="danger"
          className="flex flex-col items-start gap-3"
        />
      </div>
    </section>
  );
}
