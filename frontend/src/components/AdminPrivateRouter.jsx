import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => !!localStorage.getItem("access_token");
const isAdmin = () => localStorage.getItem("is_staff") === "true";

export default function AdminPrivateRouter() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}