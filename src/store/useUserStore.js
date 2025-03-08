import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axiosInstance";

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      loading: false,

      fetchUserProfile: async () => {
        set({ loading: true });
        try {
          const response = await api.get("/users/profile");
          set({ user: response.data.data, loading: false });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          set({ loading: false });
        }
      },

      loginUser: async (email, password) => {
        set({ loading: true });
        try {
          const response = await api.post("/users/login", { email, password });
          const { token, user } = response.data.data;

          // Simpan token ke localStorage
          localStorage.setItem("token", token);

          set({ user, loading: false });
          return { success: true, role: user.role };
        } catch (error) {
          console.error("Login error:", error);
          set({ loading: false });
          return { success: false, message: error.response?.data?.message || "Login failed" };
        }
      },

      logout: () => {
        localStorage.removeItem("token"); // Hapus token
        // set({ user: null });
      },
    }),
    {
      name: "user-storage", // Nama key di localStorage
      getStorage: () => localStorage, // Gunakan localStorage agar data bertahan setelah refresh
    }
  )
);

export default useUserStore;
