import { axiosInstance } from "./auth-Instance";

class AuthService {
  getAccessToken() {
    return sessionStorage.getItem("authToken");
  }

  setAccessToken(token: string) {
    sessionStorage.setItem("authToken", token);
  }

  async loginWithGoogle(token: string) {
    const { data } = await axiosInstance.post("/auth/google-login", {
      googleToken: token,
    });

    return data.data;
  }

  triggerLogout() {
    sessionStorage.removeItem("authToken");
  }

  onLogout(handler: any) {
    return () => {};
  }
}

export const authService = new AuthService();