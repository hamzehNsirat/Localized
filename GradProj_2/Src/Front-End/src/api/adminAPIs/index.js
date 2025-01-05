import adminDetailsApi from "./adminDetails.js";
import userManagementApi from "./userManagement.js";
import quotationApi from "./quotations.js";
import complaintApi from "./complaints.js";
import penaltyApi from "./penalties.js";
import applicationsApi from "./applications.js";
import notificationsApi from "./notifications.js";
import categoriesApi from "./categories.js";
import passwordManagementApi from "./passwordManagement.js";

const adminApi = {
  adminDetails: adminDetailsApi,
  userManagement: userManagementApi,
  quotations: quotationApi,
  complaints: complaintApi,
  penalties: penaltyApi,
  applications: applicationsApi,
  notifications: notificationsApi,
  categories: categoriesApi,
  passwordManagement: passwordManagementApi,
};

export default adminApi;
