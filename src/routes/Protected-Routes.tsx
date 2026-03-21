import { Outlet } from "react-router-dom";
import Header from "../Pages/Header";

export default function ProtectedLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}