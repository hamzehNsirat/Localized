import apiClient from "../index.js";

const notificationsApi = {
  getNotifications : async (data) =>{
    const response = await apiClient.post("/dashboard/getretailernotifications", data);
    return response.data;
  },
  readNotification : async (data) =>{
    const response = await apiClient.post("/dashboard/readnotif", data);
    return response.data;
  }
}

export default notificationsApi;
