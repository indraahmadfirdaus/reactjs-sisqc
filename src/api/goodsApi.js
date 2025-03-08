import api from "./axiosInstance";

export const getGoodsAll = async () => {
  const response = await api.get(`/goods`);
  return response.data.data;
};

export const createGoods = async (formData) => {
    const response = await api.post("/goods", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};