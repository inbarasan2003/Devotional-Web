import { Outlet } from "react-router-dom";
import Header from "../Pages/Header";
import { AuthProvider } from "../context/AuthProvider";

export default function RootLayout() {
  return (
    <>
    <AuthProvider>
      <Header />
      <Outlet />
      </AuthProvider>
      
    </>
  );
}