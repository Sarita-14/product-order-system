// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/admin/product-fields.tsx
// The inputs of the product form. Used for "Add product" (empty)
// and "Edit product" (filled with the product), inside an <ActionForm>.
// The input NAMES must match what readProduct() reads in actions/product.actions.ts.
// ─────────────────────────────────────────────────────────────────────────────

// Shared styles.
import { inputClass, labelClass } from '@/components/ui/styles';
// The Product shape.
import type { Product } from '@/types/product';

// product = optional: given when editing (boxes start filled), missing when adding.
export function ProductFields({ product }: { product?: Product }) {
  return (
    // 1 column on phones, 2 columns from "sm" screens.
    <div className="grid gap-4 sm:grid-cols-2">
      {/* sm:col-span-2 = this field takes both columns (full width) */}
      <label className={`${labelClass} sm:col-span-2`}>
        Name
        {/* product?.name = the current name when editing, nothing when adding */}
        <input name="name" required maxLength={255} defaultValue={product?.name} className={inputClass} />
      </label>
      <label className={`${labelClass} sm:col-span-2`}>
        Description
        <textarea
          name="description"
          rows={3} // 3 lines tall
          defaultValue={product?.description ?? ''} // "?? ''" = empty when there is none
          className={`${inputClass} h-auto py-2`}
        />
      </label>
      <label className={labelClass}>
        Price (₹)
        <input
          name="price"
          type="number"
          required
          min={0.01} // must be more than 0
          step={0.01} // paise allowed (2 decimals)
          defaultValue={product?.price}
          className={inputClass}
        />
      </label>
      <label className={labelClass}>
        Stock
        <input
          name="stockQuantity"
          type="number"
          required
          min={0} // 0 or more
          step={1} // whole numbers only
          defaultValue={product?.stockQuantity ?? 0}
          className={inputClass}
        />
      </label>
    </div>
  );
}
