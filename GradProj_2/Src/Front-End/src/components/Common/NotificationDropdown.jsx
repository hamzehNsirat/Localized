// NotificationDropdown.jsx

import React, { useState } from "react";
import AppColors from "../Theme/AppColors";
import notificationTypes from "../Models/NotificationTypes";
import { Col, Row } from "react-bootstrap";

const NotificationDropdown = ({ notifications, markAsRead }) => {
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
            className="notification-item d-flex align-items-center my-2"
            style={{
              cursor: "pointer",
              borderBottom: `1px solid ${AppColors.dividerLine}`,
            }}
            onClick={() => markAsRead(notification.id)}
          >
            <img
              src={notificationTypes[parseInt(notification.type)].icon}
              alt="Notification Icon"
              style={{ width: "40px", marginRight: "10px" }}
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
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "13px",
                    height: "13px",
                    backgroundColor: AppColors.primaryColor,
                    borderRadius: "100%",
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
