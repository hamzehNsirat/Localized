import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { CloudUpload } from "react-bootstrap-icons";
import localizedLogo from "../../../assets/headerLogo.png";

const SignUpStep3 = ({
  formData,
  handleInputChange,
  errors,
  handleBlur,
  handleFileUpload,
  nextStep,
}) => {
  const [fileName, setFileName] = useState(null);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      handleFileUpload(e);
    }
  };
  return (
    <div className="container">
      <img src={localizedLogo} alt="Localized" style={{ width: "40%" }}></img>
      <h6 className="mt-0 mb-2">
        Set up your {formData.position == "2" ? "retailer" : "supplier"} account
      </h6>
      <Form>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label className="mb-0 form-lbl">Company Description</Form.Label>
          <Form.Control
            style={{ fontSize: "0.85rem", resize: "none" }}
            as="textarea"
            name="description"
            placeholder="Add brief description describing your company and what you resell"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="logo">
          <Form.Label className="mb-0 form-lbl">Company Logo</Form.Label>
          <div className="file-drop-area">
            <div className="file-drop-content">
              <CloudUpload size={30} />
              <p className="mb-0">
                {fileName ? fileName : "Choose a file or drag & drop it here"}
              </p>
              <span>JPEG, PNG, up to 18MB</span>
              <label className="btn btn-outline-dark mt-1">
                Browse File
                <Form.Control
                  type="file"
                  name="logo"
                  onChange={onFileChange}
                  accept=".jpeg, .jpg, .png" // Restrict file types
                  style={{ display: "none" }}
                  required
                />
              </label>
            </div>
          </div>
        </Form.Group>

        <Button
          onClick={nextStep}
          variant="dark"
          className="mt-2 px-5 py-14 w-100 fw-bold"
          style={{
            boxShadow: "0px 0px 14px rgba(0, 0, 0, 1)",
            height: "2.5rem",
            borderRadius: "3px",
            border: "none",
          }}
        >
          Continue
        </Button>
      </Form>
    </div>
  );
};

export default SignUpStep3;
