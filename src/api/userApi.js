import api from "./axiosInstance";

export const login = async (email, password) => {
  const response = await api.post("/users/login", { email, password });
  return response.data;
};

export const register = async (name, email, password, id_number) => {
  const response = await api.post("/users/register", {
    name,
    email,
    password,
    id_number,
  });
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data.data;
};

export const updateUserProfile = async (formData) => {
  const response = await api.put("/users/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data.data;
};
