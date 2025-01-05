import apiClient from "../index.js";

const complaintApi = {
  getComplaintsList: async (data) => {
    const response = await apiClient.post("/platformservices/getComplaintsListr", data);
    return response.data;
  },
  getComplaintDetails: async (data) => {
    const response = await apiClient.post("/platformservices/getcomplaintbyid", data);
    return response.data;
  },
  searchComplaints: async (data) => {
    const response = await apiClient.post("/platformservices/searchcomplaints", data);
    return response.data;
  },
  updateComplaint: async (data) => {
    const response = await apiClient.post("/platformservices/updatecomplaint", data);
    return response.data;
  },
};

export default complaintApi;
