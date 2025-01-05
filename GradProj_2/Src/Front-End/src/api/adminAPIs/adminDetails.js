import apiClient from "../index.js";

const adminDetailsApi = {
  getAdminDetails: async (data) => {
    try{

      const response = await apiClient.post("/dashboard/getadmindetails", data);
      return response.data;
    }catch (err) {
     if(err.response?.data.header.errorCode == 'TOKEN_EXPIRED'){
      console.log(err.response?.data);
      return {token: "failed"};
    }
    console.error("Error in getAdminDetails: ", err.response?.data || err.message);
    return false;
  }
  },
};

export default adminDetailsApi;
