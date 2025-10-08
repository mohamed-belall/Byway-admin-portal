import api from "./api";

const DashboardService = {
  getDashboardData: async () => {
    const response = await api.get("/AdminDashboard");
    return response.data.data;
  },
};

export default DashboardService;
