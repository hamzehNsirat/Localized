import React, { useState } from "react";
import { Form } from "react-bootstrap";
import AppColors from "../../Theme/AppColors";
import cameraIcon from "../../../assets/Camera.png";

const CameraUpload = ({ cover, logo, logoOnChange, coverOnChange }) => {
  const [coverPreview, setCoverPreview] = useState(cover);
  const [logoPreview, setLogoPreview] = useState(logo);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="d-flex flex-column align-items-center mt-4">
      {/* Cover Image Section */}
      <div
        style={{
          width: "100%",
          height: "150px",
          border: `1px solid ${AppColors.dividerLine}`,
          borderRadius: "10px",
          backgroundColor: AppColors.grayBackground,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Display Cover Image or Gray Background */}
        {coverPreview ? (
          <img
            src={coverPreview}
            alt="Cover"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: AppColors.grayBackground,
            }}
          />
        )}

        {/* Upload Cover Button */}
        <div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
          <label
            className={`btn ${
              coverPreview ? "btn-outline-light" : "btn-outline-dark"
            }  `}
          >
            Upload Cover
            <Form.Control
              name="cover"
              type="file"
              accept="image/*"
              onChange={(e) => {
                coverOnChange(e);
                handleCoverChange(e);
              }}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>

      {/* Company Logo Section */}
      <div
        style={{
          position: "relative",
          marginTop: "-60px",
          cursor: "pointer",
          border: "2px solid #ddd",
          borderRadius: "50%",
          width: "120px",
          height: "120px",
          backgroundColor: AppColors.grayBackground,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <label
          htmlFor="upload-logo"
          style={{
            cursor: "pointer",
          }}
        >
          <img
            src={logoPreview || cameraIcon}
            alt="Company Logo"
            style={{
              width: "100%",
              objectFit: "cover",
            }}
          />
        </label>
        <Form.Control
          id="upload-logo"
          name="logo"
          type="file"
          accept="image/*"
          onChange={(e) => {
            logoOnChange(e);
            handleLogoChange(e);
          }}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default CameraUpload;
