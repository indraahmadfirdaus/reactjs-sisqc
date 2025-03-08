import axios from "axios";

// Base URL API
const API_BASE_URL = import.meta.env.VITE_BASE_URL + "/api";

// Ambil token dari localStorage
const getToken = () => localStorage.getItem("token");

// Buat instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menambahkan token di setiap request
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
