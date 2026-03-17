import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { authService } from "../services/auth-Service";
import { cn } from "../services/utils";
import { GetGoogleAccess } from "../services/google";
import { useMutation } from "@tanstack/react-query";

export default function Login() {

  const navigate = useNavigate();
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: async (googleToken: string) => {
      return await authService.loginWithGoogle(googleToken);
    },

    onSuccess: (data) => {
      login(data.accessToken);
      alert("Login Successfully");
      navigate("/dashboard");
    },

    onError: (error: any) => {
      alert(
        error?.message ||
        error?.response?.data?.message ||
        "Login failed"
      );
    },
  });

  const handleLogin = async () => {
    try {
      const googleToken = await GetGoogleAccess();
      mutation.mutate(googleToken);
    } catch (err: any) {
      alert(err?.message || "Google Login Failed");
    }
  };


  if (import.meta.env.VITE_MODE === "development") {
    return (
      <div>
        Login Page 
        <button onClick={() => navigate("/dev-login")}>Login</button>
      </div>
    );
  }

  return (
    <div className="m-auto flex min-h-screen w-screen items-center justify-center p-6">
      <div className="flex w-full max-w-md flex-col items-center justify-center rounded-xl border border-neutral-300 bg-white p-8 text-center shadow">
        <h1 className="mb-4 text-2xl font-bold">Welcome Admin</h1>

        <button
          className={cn(
            "w-3xs mx-auto",
            mutation.isPending
              ? "cursor-not-allowed"
              : "cursor-pointer"
          )}
          onClick={handleLogin}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Logging in..." : "Continue with Google"}
        </button>

      </div>
    </div>
  );
}