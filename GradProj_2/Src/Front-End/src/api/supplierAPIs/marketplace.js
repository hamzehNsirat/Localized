import apiClient from "../index.js";

const marketplaceApi = {
   searchProducts : async (data) =>{
    const response = await apiClient.post("/products/searchsuppproducts", data);
    return response.data;
  },
}
