import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { authService } from "../services/auth-Service";
import { GetGoogleAccess } from "../services/google";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
export default function Login() {
  const navigate = useNavigate();
  //Getting the login function to handle user authentication.
  const { login } = useAuth();

  //useMutation is used when we want to send data to the server and perform actions like login, signup, or updates.
  const mutation = useMutation({
    //mutationFn is the function that performs the API request using the given data.
    //It takes the Google token, sends it to the backend, and returns the response.
    mutationFn: async (googleToken: string) =>
      await authService.loginWithGoogle(googleToken),

    //After a successful API call, it logs in the user and redirects to the mantra page.
    onSuccess: (data) => {
      login(data.accessToken);
      toast.success("Register Completed Successfully ✅");
      navigate("/home");
    },
  });

  //Gets the Google token and sends it to the backend, handles errors if any
  const handleLogin = async () => {
    try {
      const token = await GetGoogleAccess();
      mutation.mutate(token);
    } catch (error: any) {
        if (error.response) {

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
        toast.error("Server error");
      }
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