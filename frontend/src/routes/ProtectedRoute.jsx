import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
// Check whether a token exists in localStorage.
// If no token exists, redirect the user to Login.
// If a token exists, display the requested page.