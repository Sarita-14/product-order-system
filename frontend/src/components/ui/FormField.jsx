// Label + any input/select/textarea + its validation message.
// Usage: <FormField label="Email" error={errors.email}><input {...register("email")} /></FormField>
function FormField({ label, error, children }) {
  return (
    <label className="field">
      {label && <span className="field-label">{label}</span>}
      {children}
      {error && <span className="field-error">{error.message}</span>}
    </label>
  );
}

export default FormField;
