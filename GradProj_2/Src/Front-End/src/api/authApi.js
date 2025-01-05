import apiClient from "./index.js";

const authApi = {
  login: async (data) => {
    const response = await apiClient.post("/auth/login", data);
    return response.data; 
  },
  signUp: async (formData) => {
    const response = await apiClient.post("/auth/submitapplication", formData);
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },
};

export default authApi;
