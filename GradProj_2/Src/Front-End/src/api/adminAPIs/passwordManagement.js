import apiClient from "../index.js";

const passwordManagementApi = {
  updatePassword: async (data) => {
    const response = await apiClient.post("/user/changepassword", data);
    return response.data;
  },
};

export default passwordManagementApi;
