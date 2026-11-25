// CHANGED (improvement):
// - uses the shared useZodForm hook, FormField and AuthCard instead of inline markup
// - saves the account with the dummy authApi (backend has no register endpoint yet)
// - adds "Confirm password" and sends the email back to Login to prefill it
import { Link, useNavigate } from "react-router-dom";
import useZodForm from "../hooks/useZodForm";
import { authApi } from "../api/authApi";
import { registerSchema } from "../validation/authSchema";
import AuthCard from "../components/AuthCard";
import Alert from "../components/ui/Alert";
import FormField from "../components/ui/FormField";
import SubmitButton from "../components/ui/SubmitButton";

function Register() {
  const navigate = useNavigate();

  // ---------- Form setup ----------
  const {
    register,
    submit,
    formState: { errors, isSubmitting },
  } = useZodForm(registerSchema, {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ---------- Submit ----------
  async function onSubmit({ name, email, password }) {
    await authApi.register({ name, email, password }); // throws if the email is taken

    // Temporary navigation for learning.
    // Real registration will be connected to the backend.
    navigate("/", { state: { registeredEmail: email } });
  }

  // ---------- Markup ----------
  return (
    <AuthCard
      title="Create account"
      subtitle="Register to start managing your store."
      footer={<>Already have an account? <Link to="/">Log in</Link></>}
    >
      <form className="form" onSubmit={submit(onSubmit)} noValidate>
        <Alert>{errors.root?.message}</Alert>

        <FormField label="Name" error={errors.name}>
          <input type="text" placeholder="Enter name" autoComplete="name" {...register("name")} />
        </FormField>

        <FormField label="Email" error={errors.email}>
          <input type="email" placeholder="Enter email" autoComplete="email" {...register("email")} />
        </FormField>

        <FormField label="Password" error={errors.password}>
          <input type="password" placeholder="At least 6 characters" autoComplete="new-password" {...register("password")} />
        </FormField>

        <FormField label="Confirm password" error={errors.confirmPassword}>
          <input type="password" placeholder="Repeat password" autoComplete="new-password" {...register("confirmPassword")} />
        </FormField>

        <SubmitButton loading={isSubmitting} className="btn btn-primary btn-block">
          Register
        </SubmitButton>
      </form>
    </AuthCard>
  );
}

export default Register;
