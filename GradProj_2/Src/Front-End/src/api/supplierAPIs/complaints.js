import apiClient from "../index.js";

const complaintApi ={
  getComplaintsList : async (data) =>{
    const response = await apiClient.post("/platformservices/getcomplaintssupplier", data);
    return response.data;
  },
  getComplaintDetails : async (data) =>{
    const response = await apiClient.post("/platformservices/getcomplaintbyid", data);
    return response.data;
  },
  getComplaintTypes : async (data) =>{
    const response = await apiClient.post("/platformservices/getcomplainttypes", data);
    return response.data;
  },
  createComplaint : async (data) =>{
    const response = await apiClient.post("/platformservices/createcomplaint", data);
    return response.data;
  },
}

export default complaintApi;

