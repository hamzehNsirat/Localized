import apiClient from "../index.js";

const applicationsApi = {
  getApplicationsList: async (data) => {
    const response = await apiClient.post("/auth/getapplicationslist", data);
    return response.data;
  },
  searchApplications: async (data) => {
    const response = await apiClient.post("/auth/searchapplications", data);
    return response.data;
  },
  getApplicationById: async (data) => {
    const response = await apiClient.post("/auth/getApplicationById", data);
    return response.data;
  },
  updateApplicationStatus: async (data) => {
    const response = await apiClient.post("/auth/updateapplicationstatus", data);
    return response.data;
  },
  checkEstablishmentEligibility: async (data) => {
    const response = await apiClient.post("/auth/checkestablishmenteligibility", data);
    return response.data;
  },
};

export default applicationsApi;
