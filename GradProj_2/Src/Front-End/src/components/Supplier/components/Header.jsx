import React, { useState, useEffect, useRef } from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import userPic from "../../../assets/user.png";
import notificationLogo from "../../../assets/notification.png";
import logo from "../../../assets/headerLogo.png";
import "../styles/Header.css";
import AppColors from "../../Theme/AppColors";

import marketIcon from "../../../assets/marketIcon.png";

import NotificationDropdown from "./NotificationDropdown";
import { useAuth } from "../../Providers";
import notificationsApi from "../../../api/supplierAPIs/notifications";

export default function Header() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const { userData, user } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const handleMarketClick = () => {
    navigate("marketplace");
  };

  const handleProfileClick = () => {
    navigate("profile");
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

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

  return (
    <>
      <Navbar expand="lg" className="custom-navbar">
        <Container className="custom-container">
          <Navbar.Brand className="custom-brand" style={{ width: "10vw" }}>
            <NavLink to="/" className="custom-link">
              <img src={logo} alt="Localized" style={{ width: "100%" }} />
            </NavLink>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-center"
          >
            <Nav className="nav gap-4">
              <NavLink
                to="/supplier"
                end
                className={({ isActive }) =>
                  isActive ? "custom-link active" : "custom-link"
                }
                onClick={() => {
                  setExpanded(false);
                }}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="products"
                className={({ isActive }) =>
                  isActive ? "custom-link active" : "custom-link"
                }
                onClick={() => {
                  setExpanded(false);
                }}
              >
                Products
              </NavLink>

              <NavLink
                to="manageQuotations"
                className={({ isActive }) =>
                  isActive ? "custom-link active" : "custom-link"
                }
                onClick={() => {
                  setExpanded(false);
                }}
              >
                Manage Quotations
              </NavLink>

              <NavLink
                to="complaints"
                className={({ isActive }) =>
                  isActive ? "custom-link active" : "custom-link"
                }
                onClick={() => {
                  setExpanded(false);
                }}
              >
                Complaints
              </NavLink>
            </Nav>
          </Navbar.Collapse>
          <img
            onClick={handleMarketClick}
            src={marketIcon}
            className="custom-icon"
            alt="market"
            style={{ cursor: "pointer" }}
          />

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
                  setNotifications={setNotifications}
                  setShowNotifications={setShowNotifications}
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
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}
