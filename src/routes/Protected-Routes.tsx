import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import Header from "../Pages/Header";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ?
  <>
  <Header/>
  <Outlet />
  </> : <Navigate to="/login" replace />;
}