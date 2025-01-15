import React, { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";

import { Navbar, Container, Row, Col } from "react-bootstrap";

import AppColors from "../../Theme/AppColors";
import logo from "../../../assets/headerLogo.png";

import NotificationDropdown from "../../Common/NotificationDropdown.jsx";
import userPic from "../../../assets/user.png";
import notificationLogo from "../../../assets/notification.png";

import dashboardIcon from "../../../assets/adminIcons/dashboard.png";
import applicationsIcon from "../../../assets/adminIcons/application.png";
import usersIcon from "../../../assets/adminIcons/user.png";
import quotationIcon from "../../../assets/adminIcons/quotation.png";
import complaintIcon from "../../../assets/adminIcons/complaint.png";
import categoryIcon from "../../../assets/adminIcons/category.png";
import penaltyIcon from "../../../assets/adminIcons/penalty.png";
import policiesIcon from "../../../assets/profileIcons/policiesIcon.png";
import logoutIcon from "../../../assets/adminIcons/logoutIcon.png";

import orderPic from "../../../assets/notifications/order.png";
import marketPic from "../../../assets/notifications/marketplace.png";
import approvePic from "../../../assets/notifications/approval.png";
import reviewPic from "../../../assets/notifications/review.png";
import ProfileSidebarItem from "../../Retailer/components/ProfileSidebarItem.jsx";

import { useAuth } from "../../Providers/authProvider.jsx";
import notificationsApi from "../../../api/adminAPIs/notifications.js";
const AdminOutlet = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const { logout, user } = useAuth();

  const handleProfileClick = () => {
    navigate("profile");
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const markAsRead = async (id) => {
    try {
      const payload = {
        notificationId: id,
      };
      const response = await notificationsApi.readNotification(payload);
      if (response?.body?.success) {
        console.log("notification read successfully");
      } else console.error("notification read error", response);
    } catch (err) {
      console.error("notification read error", err);
    }
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      );
      // Find the clicked notification
      const clickedNotification = updatedNotifications.find(
        (notification) => notification.id === id
      );

      // Navigate based on the notification type
      if (
        clickedNotification?.type === "3" ||
        clickedNotification?.type === "9"
      ) {
        navigate("/admin/manageQuotations");
        setShowNotifications(false);
      } else if (
        clickedNotification?.type === "7" ||
        clickedNotification?.type === "11"
      ) {
        navigate("/admin/complaints");
        setShowNotifications(false);
      }

      return updatedNotifications; // Return the updated state
    });
  };

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const payload = {
          userId: parseInt(user.userId),
          pageSize: 5,
          pageIndex: 1,
        };
        const response = await notificationsApi.getNotifications(payload);
        if (response?.body.success) {
          setNotifications(
            response.body.notificationList.notificationItem.map(
              (notification) => ({
                id: notification.id,
                type: notification.type,
                name: notification.subject,
                description: notification.details || "No description", // Fallback for empty descriptions
                isRead: notification.isRead,
                date: notification.creationTime,
              })
            )
          );
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    // Fetch notifications immediately
    fetchNotifications();

    // Set an interval to fetch notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000); // 30 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // If the click is outside the dropdown, close it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleNavigation = (step, path) => {
    setCurrentStep(step);
    navigate(path);
  };

  const headerStyle = {
    backgroundColor: AppColors.primaryColor,
    position: "fixed", // Fix the header position
    width: "100%",
    height: "70px",
    top: 0,
    left: 0,
    zIndex: 1000,
  };

  const sidebarStyle = {
    backgroundColor: AppColors.blackFont,
    position: "fixed", // Fix the sidebar position
    height: "100%",
    top: "0",
    left: "0",
    width: "18%", // Sidebar width
    padding: "2rem 0",
    paddingTop: "6.5rem",
    zIndex: 999,
  };

  const contentStyle = {
    marginLeft: "18%",
    marginRight: "5%",
    padding: "2rem",
  };

  const mainContentStyle = {
    marginTop: "70px", // Offset by header height
  };

  return (
    <>
      <Navbar expand="lg" className="custom-navbar" style={headerStyle}>
        <Container className="custom-container justify-content-between ">
          <Navbar.Brand className="custom-brand" style={{ width: "10vw" }}>
            <NavLink to="/" className="custom-link">
              <img src={logo} alt="Localized" style={{ width: "100%" }} />
            </NavLink>
          </Navbar.Brand>

          <div className="d-flex align-items-center gap-3">
            <div className="position-relative" style={{ marginRight: "10px" }}>
              <div
                className="position-absolute z-2 d-flex align-items-center justify-content-center"
                style={{
                  padding: "3px",
                  borderRadius: "50px",
                  left: "55%",
                  top: "-7%",
                  color: "white",
                  backgroundColor: AppColors.primaryColor,
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50px",
                    backgroundColor: "#DC3127",
                    fontSize: "0.75rem",
                    padding: "9px",
                  }}
                >
                  {
                    notifications.filter((notification) => !notification.isRead)
                      .length
                  }
                </div>
              </div>
              <img
                src={notificationLogo}
                className="custom-icon"
                alt="notifications"
                style={{ width: "33px", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent closing when clicking the icon
                  toggleNotifications();
                }}
              />

              {/* Notification Dropdown */}
              {showNotifications && (
                <div ref={dropdownRef}>
                  <NotificationDropdown
                    notifications={notifications}
                    markAsRead={markAsRead}
                  />
                </div>
              )}
            </div>

            <img
              onClick={handleProfileClick}
              src={userPic}
              className="custom-icon"
              alt="User"
              style={{ cursor: "pointer" }}
            />
          </div>
        </Container>
      </Navbar>

      <Col md={2} style={sidebarStyle}>
        <div className="d-flex flex-column justify-content-between h-100">
          <div>
            <ProfileSidebarItem
              icon={dashboardIcon}
              label="Dashboard"
              isActive={currentStep === 1}
              onClick={() => handleNavigation(1, "/admin")}
            />
            <ProfileSidebarItem
              icon={applicationsIcon}
              label="Applications"
              isActive={currentStep === 2}
              onClick={() => handleNavigation(2, "/admin/applications")}
            />
            <ProfileSidebarItem
              icon={usersIcon}
              label="Users"
              isActive={currentStep === 3}
              onClick={() => handleNavigation(3, "/admin/users")}
            />
            <ProfileSidebarItem
              icon={quotationIcon}
              label="Quotations"
              isActive={currentStep === 4}
              onClick={() => handleNavigation(4, "/admin/quotations")}
            />
            <ProfileSidebarItem
              icon={complaintIcon}
              label="Complaints"
              isActive={currentStep === 5}
              onClick={() => handleNavigation(5, "/admin/complaints")}
            />
            <ProfileSidebarItem
              icon={categoryIcon}
              label="Categories"
              isActive={currentStep === 6}
              onClick={() => handleNavigation(6, "/admin/categories")}
            />
            <ProfileSidebarItem
              icon={penaltyIcon}
              label="Penalties"
              isActive={currentStep === 7}
              onClick={() => handleNavigation(7, "/admin/penalties")}
            />
          </div>

          <div>
            <ProfileSidebarItem
              icon={policiesIcon}
              label="Policies"
              isActive={currentStep === 8}
              onClick={() => handleCurrentStep(8, "/admin/policies")}
            />
            <ProfileSidebarItem
              icon={logoutIcon}
              label="Log Out"
              onClick={logout}
              isDanger
            />
          </div>
        </div>
      </Col>

      {/* Main Content */}
      <div style={{ ...contentStyle, ...mainContentStyle }}>
        <Outlet />
      </div>
    </>
  );
};

export default AdminOutlet;
