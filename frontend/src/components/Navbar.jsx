// CHANGED: this file existed but was empty — it is now the top navigation
// shown on every logged-in page (rendered by AppLayout).
import { NavLink, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";

// ---------- Menu items ----------
const LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/products", label: "Products" },
  { to: "/orders", label: "Orders" },
  { to: "/customers", label: "Customers" },
];

function Navbar() {
  const navigate = useNavigate();
  const user = authApi.getCurrentUser();

  // ---------- Logout ----------
  // (moved here from Dashboard.jsx so Logout is available on every page)
  //Logout function
  function handleLogout() {
    //Remove login token if it exists
    authApi.logout();

    //After logout, navigate to Login page
    navigate("/", { replace: true }); // replace: Back button won't return to a protected page
  }

  // ---------- Markup ----------
  return (
    <nav className="navbar">
      <span className="navbar-brand">Product Order System</span>

      <div className="navbar-links">
        {LINKS.map((link) => (
          // NavLink adds the "active" class to the current page's link
          <NavLink key={link.to} to={link.to} className="navbar-link">
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="navbar-user">
        {user && <span className="muted small">{user.name}</span>}

        {/* Logout button in the top-right corner */}
        <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
