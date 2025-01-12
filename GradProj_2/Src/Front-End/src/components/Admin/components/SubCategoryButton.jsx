import React from "react";

const SubCategoryButton = ({ label }) => {
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
    </div>
  );
};

export default SubCategoryButton;
