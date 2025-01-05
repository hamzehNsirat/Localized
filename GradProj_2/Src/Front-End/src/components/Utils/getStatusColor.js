import AppColors from "../Theme/AppColors";
import quotationStatus from "../Models/QuotationStatus";

const getStatusColor = (role, status) => {
  // Get the status name from the quotationStatus object for the given role
  const statusName = quotationStatus?.[role]?.[status];

  // Return the corresponding color from AppColors.quotationStatus
  if (statusName) {
    const colorMapping = AppColors.quotationStatus;
    if (colorMapping) {
      switch (statusName) {
        // Retailer statuses
        case "Awaiting Response":
          return colorMapping.Awaiting;
        case "Quoted":
          return colorMapping.Quoted;

        // Supplier statuses
        case "New Request":
          return colorMapping.New;
        case "Quotation Sent":
          return colorMapping.Sent;

        // General statuses
        case "Order Confirmed":
          return colorMapping.Confirmed;
        case "Completed":
          return colorMapping.Completed;
        case "Declined":
          return colorMapping.Declined;

        default:
          return AppColors.grayBackground; // Fallback color
      }
    }
  }

  return AppColors.grayBackground; // Fallback color if status or role doesn't match
};

export default getStatusColor;
