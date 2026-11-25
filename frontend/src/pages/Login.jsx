
// CHANGED (improvement):
// - uses the shared useZodForm hook, FormField and AuthCard instead of inline markup
// - logs in against the dummy authApi (backend has no login endpoint yet)
// - shows the demo credentials, a "registered" message coming from Register,
//   and redirects to the Dashboard if the user is already logged in
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import useZodForm from "../hooks/useZodForm";
import { authApi, DEMO_ACCOUNT } from "../api/authApi";
import { loginschema } from "../validation/authSchema";
import AuthCard from "../components/AuthCard";
import Alert from "../components/ui/Alert";
import FormField from "../components/ui/FormField";
import SubmitButton from "../components/ui/SubmitButton";

function Login() {
  const navigate = useNavigate();
  //creates a navigate function so we can send the user to another page later

  // Email passed by the Register page after a successful sign-up
  const registeredEmail = useLocation().state?.registeredEmail;

  // ---------- Form setup ----------
  const {
    register,//Connects an <input> box to the form so the form can watch what you type basically taken from user
    submit,// A wrapper that stops the page from refreshing when you click submit, checks your rules, and only runs your submit code if everything passes
    // (submit = handleSubmit from useZodForm; a thrown error also becomes errors.root)
    formState: { errors, isSubmitting },
  } = useZodForm(loginschema, {
    email: registeredEmail ?? DEMO_ACCOUNT.email,
    password: "",
  });

  // ---------- Submit ----------
  async function onSubmit(data) {//data contains the clean email and password the user typed
    //used when email and password is correct
    await authApi.login(data); // throws "Invalid email or password" on failure

    // Temporary navigation for learning.
    // Real navigation will happen after successful backend login.
    navigate("/dashboard", { replace: true });
  }

  // Already logged in → no need to see the login form
  if (authApi.getCurrentUser()) return <Navigate to="/dashboard" replace />;

  // ---------- Markup ----------
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to manage products and orders."
      footer={<>New here? <Link to="/register">Create an account</Link></>}
    >
      {registeredEmail && <Alert type="success">Account created. Please log in.</Alert>}

      <form className="form" onSubmit={submit(onSubmit)} noValidate>
        <Alert>{errors.root?.message}</Alert>

        <FormField label="Email" error={errors.email}>
          <input type="email" placeholder="Enter email" autoComplete="email" {...register("email")} />
        </FormField>

        <FormField label="Password" error={errors.password}>
          <input type="password" placeholder="Enter your password" autoComplete="current-password" {...register("password")} />
        </FormField>
        {/* if rule is break */}
        {/* (FormField shows the error message under the input) */}

        <SubmitButton loading={isSubmitting} className="btn btn-primary btn-block">
          Login
        </SubmitButton>
      </form>
    </AuthCard>
  );
}

export default Login;
