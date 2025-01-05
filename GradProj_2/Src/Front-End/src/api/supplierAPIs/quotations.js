import apiClient from "../index.js";

const quotationsApi ={
  getQuotationsList: async (data) => {
    const response = await apiClient.post("/quotations/getbysupplier" , data);
    return response.data;
  },
  getQuotationDetails: async (payload) => {
    const response = await apiClient.post("/quotations/getbyid" , payload);
    return response.data;
  },
  updateQuotationStatus: async (data) => {
    const response = await apiClient.post("/quotations/updatestatus" , data);
    return response.data;
  },
  submitQuotation: async (data) => {
    const response = await apiClient.post("/quotations/submit" , data);
    return response.data;
  },
  getQuotationActors: async (data) => {
    const response = await apiClient.post("/platformservices/getquotationactorssupp" , data);
    return response.data;
  },
}

export default quotationsApi;



