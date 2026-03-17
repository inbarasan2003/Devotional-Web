import { authService } from "./auth-Service";
import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://bhaktidev.devserver.live",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (
    error: AxiosError & { config?: AxiosRequestConfig & { _retry?: boolean } },
  ) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    if (error.response?.status === 401 || error.response?.status === 403) {
      authService.triggerLogout();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);
