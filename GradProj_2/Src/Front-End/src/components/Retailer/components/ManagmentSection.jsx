import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Button, ProgressBar } from "react-bootstrap";
import AppColors from "../../Theme/AppColors";

const ManagementSection = ({
  icon,
  title,
  description,
  buttonText,
  progress,
}) => {
  return (
    <Card
      className="mb-3 px-2 py-2"
      style={{
        borderRadius: "3px",
        border: "0",
        boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Card.Body className="d-flex flex-column justify-content-center">
        <div className="d-flex justify-content-between align-items-center align-content-center">
          <div className="d-flex align-items-center align-content-center">
            <div className="me-4 mb-2" style={{ fontSize: "3rem" }}>
              {icon}
            </div>
            <div>
              <Card.Title className="fw-bold">{title}</Card.Title>
              <Card.Text>{description}</Card.Text>
            </div>
          </div>
          <Button
            className="rounded-pill px-5 py-2 d-flex align-content-center"
            style={{
              backgroundColor: AppColors.primaryColor,
              border: "none",
              boxShadow: "-4px 3px 1px rgba(0, 0, 0, 1)",
              fontSize: "14px",
            }}
          >
            {buttonText}
          </Button>
        </div>
        {/* This should be integrated with the backend */}
        {progress && (
          <ProgressBar
            now={progress}
            variant="dark"
            style={{ height: "6px", width: "80%", backgroundColor: "#b5b3b3" }}
          >
            <div
              style={{
                backgroundColor: AppColors.primaryColor,
                width: `${progress}%`,
              }}
            />
          </ProgressBar>
        )}
      </Card.Body>
    </Card>
  );
};

export default ManagementSection;
