import "bootstrap/dist/css/bootstrap.min.css";
import AppColors from "../../Theme/AppColors";
import "../styles/profile.css";

const ProfileSidebarItem = ({ icon, label, isActive, onClick, isDanger }) => (
  <div
    className={`sidebar-item d-flex align-items-center px-3 py-1 ${
      (isActive ? "active" : "", isDanger ? "logout-button" : "")
    }`}
    onClick={onClick}
    style={{
      cursor: "pointer",
      backgroundColor: isActive ? AppColors.primaryColor : "transparent",
      color: isDanger ? "#DC3545" : "#FFF",
      marginBottom: "0.4rem",
      transition: "all 0.2s ease",
    }}
  >
    <img
      src={icon}
      alt={label}
      style={{ width: "20px", marginRight: "10px" }}
    />
    <span>{label}</span>
  </div>
);

export default ProfileSidebarItem;
