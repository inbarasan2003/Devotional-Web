import axios from "axios";
import { authService } from "./auth-Service";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

//Gets the token before sending every request
axiosInstance.interceptors.request.use((config) => {
  const token = authService.getAccessToken();

  //Adds the token to the request header if it exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});