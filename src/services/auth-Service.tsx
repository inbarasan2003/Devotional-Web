import axios from "axios";
import { axiosInstance } from "./auth-Instance";

export type LogoutHandler = () => void;

export type AuthUserType = {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "user";
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUserType;
};

class AuthService {
  private accessKey = "authToken";
  private refreshKey = "refreshToken";
  private logoutHandler: LogoutHandler[] = [];

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.accessKey);
  }
  setAccessToken(token: string) {
    sessionStorage.setItem(this.accessKey, token);
  }
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshKey);
  }
  setRefreshToken(token: string) {
    localStorage.setItem(this.refreshKey, token);
  }
  clear() {
    sessionStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
  }
  onLogout(handler: LogoutHandler) {
    this.logoutHandler.push(handler);
    return () => {
      this.logoutHandler = this.logoutHandler.filter((h) => h !== handler);
    };
  }

  async triggerLogout() {
    try {
      axiosInstance.post("/auth/logout").catch((error) => {
        console.error("Error during logout request", error);
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      this.clear();
      this.logoutHandler.forEach((h) => h());
    }
  }

  async loginWithGoogle(googleAccessToken: string) {
    try {
      const { data } = await axiosInstance.post("/api/auth/google-login", {
        googleToken: googleAccessToken,
      });

      return data.data as AuthResponse;
    } catch (error: any) {
      this.clear();
      throw error;
    }
  }

  async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh Token");

    const baseUrl = "https://bhaktidev.devserver.live";

    if (!baseUrl) {
      throw new Error("base url is missing");
    }

    const { data } = await axios.post(
      `${"https://bhaktidev.devserver.live/api/auth/refresh"}`,
      { token: refreshToken },
    );

    if (!data?.accessToken) {
      this.triggerLogout();
      throw new Error("Invalid refresh response");
    }
    this.setAccessToken(data.accessToken);
    return data.accessToken;
  }
}

export const authService = new AuthService();
