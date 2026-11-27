'use server';
// ─────────────────────────────────────────────────────────────────────────────
// FILE: actions/product.actions.ts — admin: create, update, delete products.
// (Server Action concept: see lib/form.ts. revalidatePath: see order.actions.ts.)

// Mark pages as needing fresh data.
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { attempt, text, type FormState } from '@/lib/form';
import { ADMIN_PATHS, productPath } from '@/lib/routes';
import { createProduct as createApi, deleteProduct as deleteApi, updateProduct as updateApi } from '@/services/product.service';
import type { ProductInput } from '@/types/product';

// The product form (components/admin/product-fields.tsx) -> API body
const readProduct = (formData: FormData): ProductInput => ({
  name: text(formData, 'name'),
  // "|| undefined" = empty text -> leave it out
  description: text(formData, 'description') || undefined,
  // Form values are always text; Number(...) turns "499.5" into 499.5.
  price: Number(formData.get('price')),
  stockQuantity: Number(formData.get('stockQuantity')),
});

// After any change: refresh the public list, the product page and the admin table
function refreshProductPages(id?: string) {
  revalidatePath('/'); // home page product grid
  revalidatePath(ADMIN_PATHS.products); // admin product table
  if (id) {
    revalidatePath(productPath(id)); // that product's own page
  }
}

// Called by the "Add product" form.
export async function createProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = await attempt(() => createApi(readProduct(formData)), 'Could not create the product');
  if (!result.ok) return result.state; // show the error on the form
  refreshProductPages();
  redirect(ADMIN_PATHS.products); // back to the product table
}

// The edit page fills in id ahead of time ("bind"): updateProduct.bind(null, product.id)
export async function updateProduct(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const result = await attempt(() => updateApi(id, readProduct(formData)), 'Could not update the product');
  if (!result.ok) return result.state;
  refreshProductPages(id);
  redirect(ADMIN_PATHS.products);
}

// The edit page fills in id ahead of time ("bind"): deleteProduct.bind(null, product.id)
export async function deleteProduct(id: string): Promise<FormState> {
  const result = await attempt(() => deleteApi(id), 'Could not delete the product');
  if (!result.ok) return result.state;
  refreshProductPages(id);
  redirect(ADMIN_PATHS.products);
}
