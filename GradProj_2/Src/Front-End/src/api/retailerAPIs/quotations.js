import apiClient from "../index.js";

const quotationsApi ={
  requestQuotation: async (payload) => {
    const response = await apiClient.post("/quotations/request" , payload);
    return response.data;
  },
  getQuotationsList: async (payload) => {
    const response = await apiClient.post("/quotations/getbyretailer" , payload);
    return response.data;
  },
  getQuotationDetails: async (data) => {
    const response = await apiClient.post("/quotations/getbyid" , data);
    return response.data;
  },
  updateQuotationStatus: async (data) => {
    const response = await apiClient.post("/quotations/updatestatus" , data);
    return response.data;
  },
  createPurchase: async (data) => {
    const response = await apiClient.post("/purchase/create" , data);
    return response.data;
  },
  getQuotationActors: async (data) => {
    const response = await apiClient.post("/platformservices/getquotationactorsret" , data);
    return response.data;
  },
  submitReview: async (data) => {
    const response = await apiClient.post("/platformservices/submitreview" , data);
    return response.data;
  },
}

export default quotationsApi;



