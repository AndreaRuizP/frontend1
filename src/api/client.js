import axios from "axios";
import { authStorage } from "../utils/security";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api-docs/",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Error de conexión con el servidor";

    const isAuthRoute = error.config?.url?.includes("/auth/");
    if (error.response?.status === 401 && !isAuthRoute) {
      authStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
