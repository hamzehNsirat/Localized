import apiClient from "../index.js";

const userManagementApi = {
  getUserList: async (data) => {
    const response = await apiClient.post("/user/getall", data);
    return response.data;
  },
  searchUsers: async (data) => {
    const response = await apiClient.post("/user/getall", data);
    return response.data;
  },
  getUserDetails: async (data) => {
    const response = await apiClient.post("/user/get", data);
    return response.data;
  },
  getUserAllData: async (data) => {
    const response = await apiClient.post("/user/getalldata", data);
    return response.data;
  },
  addUser: async (data) => {
    const response = await apiClient.post("/user/add", data);
    return response.data;
  },
  deleteUser: async (data) => {
    const response = await apiClient.post("/user/delete", data);
    return response.data;
  },
  updateUserStatus: async (data) => {
    const response = await apiClient.post("/user/updatestatus", data);
    return response.data;
  },
};

export default userManagementApi;
