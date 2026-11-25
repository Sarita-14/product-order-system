// react-hook-form + zod in one call, used by every form in the app.
// `submit(action)` runs `action(values)` after validation and turns any
// thrown error (API or dummy auth) into a form-level error: errors.root.message
// — so no form needs its own try/catch.
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function useZodForm(schema, defaultValues) {
  const form = useForm({ resolver: zodResolver(schema), defaultValues });

  const submit = (action) =>
    form.handleSubmit(async (values) => {
      try {
        await action(values);
      } catch (err) {
        form.setError("root", { message: err.message });
      }
    });

  return { ...form, submit };
}

export default useZodForm;
