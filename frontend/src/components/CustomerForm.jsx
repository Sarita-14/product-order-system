// Create a customer (backend POST /users). Used inside a Modal on the Customers page.
import useZodForm from "../hooks/useZodForm";
import { usersApi } from "../api/resources";
import { customerSchema } from "../validation/customerSchema";
import Alert from "./ui/Alert";
import FormField from "./ui/FormField";
import SubmitButton from "./ui/SubmitButton";

function CustomerForm({ onSaved, onCancel }) {
  // ---------- Form setup ----------
  const {
    register,
    submit,
    formState: { errors, isSubmitting },
  } = useZodForm(customerSchema, { username: "", email: "", phoneNumber: "" });

  // ---------- Save (duplicate username/email/phone → backend 409, shown in errors.root) ----------
  async function save(values) {
    await usersApi.create(values);
    onSaved();
  }

  // ---------- Markup ----------
  return (
    <form className="form" onSubmit={submit(save)} noValidate>
      <Alert>{errors.root?.message}</Alert>

      <FormField label="Username" error={errors.username}>
        <input {...register("username")} placeholder="anjali" autoFocus />
      </FormField>

      <FormField label="Email" error={errors.email}>
        <input type="email" {...register("email")} placeholder="anjali@example.com" />
      </FormField>

      <FormField label="Phone number" error={errors.phoneNumber}>
        <input type="tel" {...register("phoneNumber")} placeholder="9876543210" />
      </FormField>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <SubmitButton loading={isSubmitting}>Add customer</SubmitButton>
      </div>
    </form>
  );
}

export default CustomerForm;
