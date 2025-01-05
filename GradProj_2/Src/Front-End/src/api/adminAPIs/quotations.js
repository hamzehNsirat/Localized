import apiClient from "../index.js";

const quotationApi = {
  getQuotationsList: async (data) => {
    const response = await apiClient.post("/quotations/getbyadmin", data);
    return response.data;
  },
  searchQuotations: async (data) => {
    const response = await apiClient.post("/quotations/search", data);
    return response.data;
  },
  getQuotationDetails: async (data) => {
    const response = await apiClient.post("/quotations/getbyid", data);
    return response.data;
  },
};

export default quotationApi;
