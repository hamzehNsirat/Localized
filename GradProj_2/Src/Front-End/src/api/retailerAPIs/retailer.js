import { toast } from "react-toastify";
import apiClient from "../index.js";
import AppColors from "../../components/Theme/AppColors.jsx";
import { useAuth } from "../../components/Providers/authProvider.jsx";

const retailerApi = {
  getRetailerAllDetails: async (usrId) => {
    try {
    const payload = { userId: usrId }; // Wrap the userId in an object
    const response = await apiClient.post("/dashboard/getretailerdetails", payload);

    return response.data;
  } catch (err) {
    if(err.response?.data.header.errorCode == 'TOKEN_EXPIRED'){
      console.log(err.response?.data);
      return {token: "failed"};
    }
    console.error("Error in getRetailerAllDetails: ", err.response?.data || err.message);
    return false;
  }
  },
  getRetailerMarketplace: async (retId, pageSize, pageIndex) => {
    const payload = {
      retailerId: retId, 
      pageSize: pageSize,
      pageIndex: pageIndex
    }
    const response = await apiClient.post("/products/getretmarketplaceproducts",payload );
    return response.data;
  },
  getRetailerProductsByCategory: async (payload) => {
    const response = await apiClient.post( "/products/getretproductsbycategory",
      payload
    );
    return response.data;
  },
  updateRetailerDetails: async () => {
    const response = await apiClient.post("/dashboard/updateretailerdetails", data);
    return response.data;
  },
  updateRetailerStoreDetails: async () => {
    const response = await apiClient.post("/dashboard/updateretailstoredetails",data);
    return response.data;
  },
};

export default retailerApi;

