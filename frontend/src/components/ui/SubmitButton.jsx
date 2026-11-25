// Submit button that disables itself and shows "Please wait…" while the form submits.
function SubmitButton({ loading, children, className = "btn btn-primary" }) {
  return (
    <button type="submit" className={className} disabled={loading}>
      {loading ? "Please wait…" : children}
    </button>
  );
}

export default SubmitButton;
