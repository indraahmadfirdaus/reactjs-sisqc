import api from "./axiosInstance";

export const getQCReports = async (reporterId) => {
  const response = await api.get(`/qc-reports/reporter/${reporterId}`);
  return response.data.data;
};

export const getQCReportById = async (id) => {
  const response = await api.get(`/qc-reports/${id}`);
  return response.data.data;
};

export const updateQCReport = async (id, formData) => {
  const response = await api.put(`/qc-reports/${id}`, formData);
  return response.data;
};

export const createQCReport = async (formData) => {
  const response = await api.post('/qc-reports', formData);
  return response.data;
};

export const getQCReportsAll = async () => {
  const response = await api.get(`/qc-reports`);
  return response.data.data;
};

export const approvalQcReport = async (id, payload) => {
  const response = await api.put(`/qc-reports/${id}/approval`, payload);
  return response.data
}