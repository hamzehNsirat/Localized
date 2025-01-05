import apiClient from "../index.js";

const penaltyApi = {
  getPenaltiesList: async (data) => {
    const response = await apiClient.post("/platformservices/getpenalties", data);
    return response.data;
  },
  searchPenalties: async (data) => {
    const response = await apiClient.post("/platformservices/searchpenalties", data);
    return response.data;
  },
  addPenalty: async (data) => {
    const response = await apiClient.post("/platformservices/addpenalty", data);
    return response.data;
  },
  deletePenalty: async (data) => {
    const response = await apiClient.post("/platformservices/deletepenalty", data);
    return response.data;
  },
  viewPenalty: async (data) => {
    const response = await apiClient.post("/platformservices/viewpenalty", data);
    return response.data;
  },
};

export default penaltyApi;
