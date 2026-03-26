import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import Header from "../Pages/Header";
import MiniPlayer from "../Pages/MiniPlayer";
import FullPlayer from "../Pages/FullPlayer";
import { useAudio } from "../context/AudioProvider";
import { AnimatePresence } from "framer-motion";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const { isExpanded } = useAudio();
  return isAuthenticated ? (
    <>
      <Header />
      <div>
        <Outlet />
      </div>

      <MiniPlayer />

      <AnimatePresence>{isExpanded && <FullPlayer />}</AnimatePresence>
    </>
  ) : (
    <Navigate to="/login" replace />
  );
}
