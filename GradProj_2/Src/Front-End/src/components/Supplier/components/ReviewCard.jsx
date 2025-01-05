import React from "react";
import { Card, Image } from "react-bootstrap";
import AppColors from "../../Theme/AppColors";

const ReviewCard = ({ logo, rating, companyName, description }) => {
  return (
    <Card
      style={{
        borderRadius: "5px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        border: "none",
      }}
    >
      <Card.Body className="d-flex align-items-center">
        <Image
          src={logo}
          roundedCircle
          style={{
            width: "75px",
            height: "75px",
            objectFit: "cover",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.16)",
          }}
          alt="Company Logo"
        />
        <div className="ms-3">
          <div className="d-flex align-items-center mb-1">
            <span style={{ color: AppColors.primaryColor, fontSize: "1.3rem" }}>
              ★
            </span>
            <span className="ms-1 fw-bold">{rating}</span>
          </div>
          <Card.Title className="mb-1" style={{ fontSize: "1rem" }}>
            {companyName}
          </Card.Title>
          <Card.Text
            className="text-muted"
            style={{ fontSize: "0.85rem", whiteSpace: "pre-wrap" }}
          >
            {description}
          </Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReviewCard;
