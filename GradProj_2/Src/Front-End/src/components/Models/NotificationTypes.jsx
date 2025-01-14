import orderPic from "../../assets/notifications/order.png";
import marketPic from "../../assets/notifications/marketplace.png";
import approvePic from "../../assets/notifications/approval.png";
import reviewPic from "../../assets/notifications/review.png";
const notificationTypes = {
  1: { name: "Registration", icon: orderPic },
  2: { name: "Verification", icon: orderPic },
  3: { name: "Quotation Request", icon: orderPic },
  4: { name: "Password Change", icon: orderPic },
  5: { name: "Request Password Change", icon: orderPic },
  6: { name: "Review Submitted", icon: orderPic },
  7: { name: "Complaint Created", icon: orderPic },
  8: { name: "Purchase Created", icon: orderPic },
  9: { name: "Quotation Update", icon: orderPic },
  10: { name: "Profile Update", icon: orderPic },
  11: { name: "Complaint Resolution", icon: orderPic },
  12: { name: "Penalty Applied", icon: orderPic },
};

export default notificationTypes;
