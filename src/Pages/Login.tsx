// Navigation hook (used to redirect user)
import { useNavigate } from "react-router-dom";

// Auth context (handles login state globally)
import { useAuth } from "../context/AuthProvider";

// API service for authentication
import { authService } from "../services/auth-Service";

// Function to get Google access token
import { GetGoogleAccess } from "../services/google";

// React Query mutation (used for POST actions like login)
import { useMutation } from "@tanstack/react-query";

// Toast notifications
import toast from "react-hot-toast";

// Animation library
import { motion } from "framer-motion";

export default function Login() {
  // Used to navigate between pages
  const navigate = useNavigate();

  // Get login function from context
  const { login } = useAuth();

  // Mutation for login API
  const mutation = useMutation({
    // Function to call backend with Google token
    mutationFn: async (googleToken: string) =>
      await authService.loginWithGoogle(googleToken),

    // Runs after successful login
    onSuccess: (data) => {
      login(data.accessToken); // store token in context

      toast.success("Register Completed Successfully", {
        style: {
          background: "rgba(15,23,42,0.85)",
          color: "#fff",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(34,197,94,0.3)", // green border
          borderRadius: "14px",
          boxShadow: "0 0 20px rgba(34,197,94,0.3)", // glow
        },
      }); // success message

      navigate("/home"); // redirect to home page
    },
  });

  // Handle login button click
  const handleLogin = async () => {
    try {
      // Get token from Google login
      const token = await GetGoogleAccess();

      // Send token to backend
      mutation.mutate(token);
    } catch (error: any) {
      // If backend returns error response
      if (error.response) {
        // Handle different error status codes
        switch (error.response.status) {
          case 401:
            toast.error("Invalid Google token");
            break;

          case 403:
            toast.error("Admin verification pending");
            break;

          case 404:
            toast.error("User not registered");
            break;

          default:
            toast.error("Login failed");
        }
      } else {
        // Network/server error
        toast.error("Server error");
      }
    }
  };

  return (
    // 🔥 FULL PAGE BACKGROUND
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f172a] via-[#1e293b] to-black px-4 text-white relative overflow-hidden">
      {/* 🔥 GLOW BACKGROUND */}
      <div className="absolute w-72 h-72 bg-orange-500/20 blur-3xl rounded-full top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-yellow-500/10 blur-3xl rounded-full bottom-10 right-10"></div>

      {/* 🔥 MAIN GRID */}
      <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl w-full">
        {/* 🔥 LEFT SIDE (BRANDING) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex flex-col gap-4"
        >
          <h1 className="text-4xl font-bold text-orange-400 leading-tight">
            Devotional <br /> Experience 🪔
          </h1>

          <p className="text-gray-300 text-sm max-w-sm">
            Explore powerful mantras, calming audio, and inspiring spiritual
            stories. Stay connected with your inner peace anytime.
          </p>

          <div className="flex gap-3 mt-2">
            <span className="text-xs bg-white/10 px-3 py-1 rounded-full">
              Mantras
            </span>
            <span className="text-xs bg-white/10 px-3 py-1 rounded-full">
              Stories
            </span>
            <span className="text-xs bg-white/10 px-3 py-1 rounded-full">
              Audio
            </span>
          </div>
        </motion.div>

        {/* 🔥 LOGIN CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 w-full text-center"
        >
          {/* 🔥 TITLE */}
          <h1 className="text-3xl font-bold text-orange-400 mb-2">Welcome</h1>

          {/* 🔥 SUBTEXT */}
          <p className="text-gray-300 mb-6 text-sm">
            Continue your spiritual journey
          </p>

          {/* 🔥 GOOGLE LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            className="flex items-center justify-center gap-3 w-full bg-white text-black rounded-xl py-3 hover:scale-105 transition shadow-lg"
          >
            {/* GOOGLE ICON */}
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />

            {/* BUTTON TEXT */}
            <span className="text-sm font-semibold">Continue with Google</span>
          </button>

          {/* 🔥 LOADING STATE */}
          {mutation.isPending && (
            <p className="text-xs text-gray-400 mt-4">Signing you in...</p>
          )}

          {/* 🔥 FOOTER TEXT */}
          <p className="text-xs text-gray-500 mt-6">
            By continuing, you agree to our terms & privacy policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
