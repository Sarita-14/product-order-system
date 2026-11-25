
// Create OR edit a product (edit mode when a `product` is passed).
// Used inside a Modal on the Products page.
import useZodForm from "../hooks/useZodForm";
import { productSchema } from "../validation/productSchema";
import { useCreateProduct, useUpdateProduct } from "../hooks/useProductMutations";
import Alert from "./ui/Alert";
import FormField from "./ui/FormField";
import SubmitButton from "./ui/SubmitButton";

function ProductForm({ product, onSaved, onCancel }) {
  // ---------- Form setup (prefilled in edit mode) ----------
  const {
    register,
    submit,
    formState: { errors, isSubmitting },
  } = useZodForm(productSchema, {
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    stockQuantity: product?.stockQuantity ?? 0,
  });

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  // ---------- Save (errors are shown via errors.root by useZodForm) ----------
  async function save(values) {
    if (product) {
      await updateProduct.mutateAsync({
        id: product.id,
        values,
      });
    } else {
      await createProduct.mutateAsync(values);
    }

    onSaved();
  }

  // ---------- Markup ----------
  return (
    <form className="form" onSubmit={submit(save)} noValidate>
      <Alert>{errors.root?.message}</Alert>

      <FormField label="Name" error={errors.name}>
        <input {...register("name")} placeholder="Wireless Mouse" autoFocus />
      </FormField>

      <FormField label="Description (optional)" error={errors.description}>
        <textarea rows={3} {...register("description")} placeholder="2.4 GHz ergonomic mouse" />
      </FormField>

      <div className="form-row">
        <FormField label="Price (₹)" error={errors.price}>
          <input type="number" step="0.01" min="0" {...register("price")} />
        </FormField>

        <FormField label="Stock quantity" error={errors.stockQuantity}>
          <input type="number" step="1" min="0" {...register("stockQuantity")} />
        </FormField>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <SubmitButton loading={isSubmitting}>
          {product ? "Save changes" : "Add product"}
        </SubmitButton>
      </div>
    </form>
  );
}

export default ProductForm;
