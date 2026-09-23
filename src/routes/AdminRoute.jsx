import { Navigate } from "react-router-dom";

// Reads the expiry out of the JWT so an expired admin login sends you to the
// login page instead of showing a dashboard where every request fails.
// (The server still verifies the token on every request; this is only UX.)
const isExpired = (token) => {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return !payload.exp || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("eventghar_admin_token");

  if (!token || isExpired(token)) {
    localStorage.removeItem("eventghar_admin_token");
    localStorage.removeItem("eventghar_admin");
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;
