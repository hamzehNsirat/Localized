import { cleanFactoryPayload, cleanSupplierPayload, cleanUserPayload } from "../../components/Utils/cleanPayload.js";
import apiClient from "../index.js";

const updateApi = {
  updateUser : async (profileData, userData, imgUrl ) =>{
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
  updateSupplierDetails : async (billData, userData) =>{
    const payload = cleanSupplierPayload(billData, userData);
    try{
    const response = await apiClient.post("/dashboard/updatesupplierdetails", payload);
    const resData = response.data;
    return {resData, payload};
    }
    catch(err){
      console.error("Error adding product:", err.message);
      return false;
    }
  },
  updateFactoryDetails : async (estData, userData, coverUrl, logoUrl) =>{
    const payload = cleanFactoryPayload(estData, userData, coverUrl, logoUrl);
    try{
      const response = await apiClient.post("/dashboard/updatefactorydetails", payload);
      const resData = response.data;
      return {resData, payload};
    }
    catch(err){
      console.error("Error updating factory:", err.message);
      return false;
    }
  },
}

export default updateApi;

