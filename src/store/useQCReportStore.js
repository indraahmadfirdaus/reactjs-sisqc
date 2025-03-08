import { create } from "zustand";
import { getQCReportById, getQCReports } from "../api/qcReportApi";

const useQCReportStore = create((set) => ({
  reports: [],
  currentReport: null,
  loading: true,

  fetchReports: async (reporterId) => {
    const data = await getQCReports(reporterId);
    set({ reports: data, loading: false });
  },

  fetchReportById: async (id) => {
    const data = await getQCReportById(id);
    set({ currentReport: data, loading: false });
  }
}));

export default useQCReportStore;
