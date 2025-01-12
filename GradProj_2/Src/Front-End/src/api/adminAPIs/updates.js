import apiClient from "../index.js";
import { cleanUserPayload } from "../../components/Utils/cleanPayload.js";

const updateApi = {
  updateUser : async (profileData, userData, imgUrl) =>{
    const payload = {user: cleanUserPayload(profileData, userData, imgUrl)};
    console.log(payload);    
    try{
    const response = await apiClient.post("/user/update", payload);
    return response.data;
    }
    catch(err){
      console.error("Error updating user:", err.message);
      return false;
    }
  },
}

export default updateApi;

