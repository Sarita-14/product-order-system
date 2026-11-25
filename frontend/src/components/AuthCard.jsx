// Shared centered card for the Login and Register pages.
function AuthCard({ title, subtitle, footer, children }) {
  return (
    <div className="auth-page">
      <div className="card auth-card">
        <p className="auth-brand">Product Order System</p>
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
        {children}
        <p className="auth-footer">{footer}</p>
      </div>
    </div>
  );
}

export default AuthCard;
