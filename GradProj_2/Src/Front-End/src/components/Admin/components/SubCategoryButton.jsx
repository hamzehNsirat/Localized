import React from "react";
import { Button } from "react-bootstrap";
import { X } from "react-bootstrap-icons";

const SubCategoryButton = ({ label, onDelete }) => {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        margin: "10px",
      }}
    >
      <div
        style={{
          backgroundColor: "#C4CDD4",
          color: "#000",
          borderRadius: "3px",
          padding: "10px 20px",
          position: "relative",
          height: "2.5rem",
          border: "none",
          boxShadow: "none",
        }}
        className="d-flex align-items-center justify-content-center fw-bold"
      >
        {label}
      </div>
      <div
        onClick={onDelete}
        style={{
          position: "absolute",
          top: "-6px",
          right: "-6px",
          backgroundColor: "#ff0000",
          color: "#fff",
          borderRadius: "50%",
          width: "16px",
          height: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        <X size={12} />
      </div>
    </div>
  );
};

export default SubCategoryButton;
