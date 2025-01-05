const StatusColors = {
  applicationStatus: {
    NEW: "#2C8C99",
    APPROVED: "#252525",
    REJECTED: "#9D4548",
  },
  userStatus: {
    Active: "#2C8C99",
    Inactive: "#252525",
    Suspended: "#F9A828",
    Banned: "#9D4548",
    Deleted: "#AEADAD",
  },
  quotationStatus: {
    "Awaiting Response": "#AEADAD",
    Quoted: "#F9A828",
    "New Request": "#F9A828",
    "Quotation Sent": "#AEADAD",
    "Order Confirmed": "#2C8C99",
    Completed: "#252525",
    Declined: "#9D4548",
  },
  complaintStatus: {
    CREATED: "#2C8C99",
    UNDERREVIEW: "#AEADAD",
    RESOLVED: "#252525",
    REJECTED: "#9D4548",
  },
  productStatus: {
    Published: "#252525",
    Drafted: "#AEADAD",
  },
};

export default StatusColors;
