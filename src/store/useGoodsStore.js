import { create } from "zustand";
import api from "../api/axiosInstance";

const useGoodsStore = create((set) => ({
  goods: [],
  loading: false,
  error: null,
  
  fetchGoods: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/goods");
      set({ goods: response.data.data, loading: false });
    } catch (error) {
      set({ error: "Gagal mengambil data barang", loading: false });
    }
  },
}));

export default useGoodsStore;
