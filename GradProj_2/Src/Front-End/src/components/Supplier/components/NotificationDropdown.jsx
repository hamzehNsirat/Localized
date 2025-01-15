// NotificationDropdown.jsx

import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import notificationsApi from "../../../api/supplierAPIs/notifications";
import AppColors from "../../Theme/AppColors";
import notificationTypes from "../../Models/NotificationTypes";

const NotificationDropdown = ({
  notifications,
  setNotifications,
  setShowNotifications,
}) => {
  const navigate = useNavigate();
  const markAsRead = async (id) => {
    try {
      const payload = {
        notificationId: id,
      };
      const response = await notificationsApi.readNotification(payload);
      if (response?.body.success) {
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
        navigate("/supplier/manageQuotations");
        setShowNotifications(false);
      } else if (
        clickedNotification?.type === "7" ||
        clickedNotification?.type === "11"
      ) {
        navigate("/supplier/complaints");
        setShowNotifications(false);
      }

      return updatedNotifications; // Return the updated state
    });
  };

  return (
    <div
      className="notifications-dropdown position-absolute"
      style={{
        top: "40px",
        right: "-75px",
        backgroundColor: "white",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        borderRadius: "8px",
        width: "350px",
        zIndex: "10",
        padding: "1rem",
        height: "400px",
        overflow: "auto",
      }}
    >
      <h5 className="fw-bold mb-3">Notifications</h5>
      {Object.keys(notifications).map((key) => {
        const notification = notifications[key];
        return (
          <div
            key={notification.id}
            className="notification-item d-flex align-items-center my-2 gap-2"
            style={{
              cursor: "pointer",
              borderBottom: `1px solid ${AppColors.dividerLine}`,
            }}
            onClick={() => markAsRead(notification.id)}
          >
            <img
              src={notificationTypes[parseInt(notification.type)].icon}
              alt="Notification Icon"
              style={{ width: "30px", marginRight: "10px" }}
            />
            <Row
              className="d-flex align-items-center justify-content-between w-100"
              style={{ position: "relative" }}
            >
              <Col md={10} style={{ width: "90%" }}>
                <p className="mb-0" style={{ fontSize: "0.9rem" }}>
                  {notification.name}
                </p>
                <p className="text-muted mt-0" style={{ fontSize: "0.7rem" }}>
                  {notification.description}
                </p>
              </Col>
              {/* New indicator */}
              {!notification.isRead && (
                <div
                  className="d-inline-block"
                  style={{
                    marginRight: "3px",
                    width: "23px",
                    height: "23px",
                    backgroundColor: AppColors.primaryColor,
                    borderRadius: "100px",
                  }}
                ></div>
              )}
            </Row>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationDropdown;
