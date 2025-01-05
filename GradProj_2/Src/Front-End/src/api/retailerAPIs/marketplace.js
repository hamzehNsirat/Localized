import apiClient from "../index.js";

const marketplaceApi = {
   searchProducts : async (data) =>{
    const response = await apiClient.post("/products/searchretproducts", data);
    return response.data;
  },
   getSupplierProfile : async (supId, pageSize, pageIdx) =>{
    const payload = {
      supplierId:supId,
      pageSize: pageSize,
      pageIndex:pageIdx   
    }
    try{
      const response = await apiClient.post("/products/getretsupplierproducts", payload);
      return response.data;
    }
    catch(err){
    console.log("Error in getSupplierProfile: ", err.response?.data || err.message);
    return false;
    }
  },
}

export default marketplaceApi;
