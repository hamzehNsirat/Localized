import orderPic from "../../assets/notifications/order.png";
import marketPic from "../../assets/notifications/marketplace.png";
import approvePic from "../../assets/notifications/approval.png";
import reviewPic from "../../assets/notifications/review.png";
import regPic from "../../assets/notifications/reg.png";
import quoReqPic from "../../assets/notifications/quoReq.png";
import passPic from "../../assets/notifications/pass.png";
import revPic from "../../assets/notifications/rev.png";
import compPic from "../../assets/notifications/comp.png";
import purchasePic from "../../assets/notifications/purchase.png";
import userPic from "../../assets/notifications/user.png";
import anyPic from "../../assets/notifications/any.png";

const notificationTypes = {
  1: { name: "Registration", icon: regPic },
  2: { name: "Verification", icon: orderPic },
  3: { name: "Quotation Request", icon: quoReqPic },
  4: { name: "Password Change", icon: passPic },
  5: { name: "Request Password Change", icon: passPic },
  6: { name: "Review Submitted", icon: revPic },
  7: { name: "Complaint Created", icon: compPic },
  8: { name: "Purchase Created", icon: purchasePic },
  9: { name: "Quotation Update", icon: quoReqPic },
  10: { name: "Profile Update", icon: userPic },
  11: { name: "Complaint Resolution", icon: compPic },
  12: { name: "Penalty Applied", icon: anyPic },
};

export default notificationTypes;
