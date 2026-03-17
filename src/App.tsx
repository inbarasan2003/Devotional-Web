import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./routes/Protected-Routes";
import { AuthProvider } from "./context/AuthProvider";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>

        <Routes>

          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
}