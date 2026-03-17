import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { authService } from "../services/auth-Service";
import { GetGoogleAccess } from "../services/google";
import { useMutation } from "@tanstack/react-query";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: async (googleToken: string) =>
      await authService.loginWithGoogle(googleToken),

    onSuccess: (data) => {
      login(data.accessToken);
      navigate("/dashboard");
    },
  });

  const handleLogin = async () => {
    try {
      const token = await GetGoogleAccess();
      mutation.mutate(token);
    } catch (e: any) {
      alert(e.message);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-100 to-white px-4">
      
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-sm text-center">
        
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Welcome 🙏
        </h1>

        <p className="text-gray-500 mb-6 text-sm">
          Continue your spiritual journey
        </p>

        <button
          onClick={handleLogin}
          className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition cursor-pointer"
        >
          {/* Google Icon */}
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />

          <span className="text-sm font-medium text-gray-700">
            Continue with Google
          </span>
        </button>

      </div>
    </div>
  );
}