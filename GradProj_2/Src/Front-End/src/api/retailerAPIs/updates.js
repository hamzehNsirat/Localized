import apiClient from "../index.js";
import { cleanFactoryPayload, cleanRetailerPayload, cleanRetailStorePayload, cleanSupplierPayload, cleanUserPayload } from "../../components/Utils/cleanPayload.js";


const updateApi = {
  updateUser: async (profileData, userData, imgUrl)=>{
    const payload = {user: cleanUserPayload(profileData, userData, imgUrl)};
    try{
    const response = await apiClient.post("/user/update", payload);
    const resData = response.data;
    return {resData, payload};
    }
    catch(err){
      console.error("Error updating user:", err.message);
      return false;
    }
  },
  updateRetailerDetails : async (billData, userData) =>{
     const payload = cleanRetailerPayload(billData, userData);
        try{
    const response = await apiClient.post("/dashboard/updateretailerdetails", payload);
    const resData = response.data;
    return {resData, payload};
    }
    catch(err){
      console.error("Error adding product:", err.message);
      return false;
    }
  },
  updateRetailerStoreDetails : async (estData, userData, logoUrl) =>{
    const payload = cleanRetailStorePayload(estData, userData, logoUrl);
    try{
    const response = await apiClient.post("/dashboard/updateretailstoredetails", payload);
   const resData = response.data;
      return {resData, payload};
    }
    catch(err){
      console.error("Error updating factory:", err.message);
      return false;
    }
  },
  updateSupplierViews : async (supId) =>{
    const payload = {supplierId: supId};
    try{
      const response = await apiClient.post("/platformservices/updateviewcount", payload);
      return response.data;
    }
    catch(err){
      console.error("Error updating factory:", err.message);
      return false;
    }
  },
}
export default updateApi;

