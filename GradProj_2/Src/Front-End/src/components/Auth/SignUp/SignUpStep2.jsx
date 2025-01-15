import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { CloudUpload } from "react-bootstrap-icons";
import localizedLogo from "../../../assets/headerLogo.png";
import { CustomInput } from "../../Common";
import jordanLogo from "../../../assets/jordanFlag.png";

const SignUpStep2 = ({
  formData,
  handleInputChange,
  errors,
  handleBlur,
  nextStep,
}) => {
  return (
    <div className="container">
      <img src={localizedLogo} alt="Localized" style={{ width: "40%" }}></img>
      <h6 className="mt-0 mb-2">
        Set up your {formData.position == "2" ? "retailer" : "supplier"} account
      </h6>
      <Form>
        <CustomInput
          className="mb-2"
          label="Company Name"
          controlId="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
          onBlur={() => handleBlur("companyName")}
          error={errors.companyName}
        />
        <CustomInput
          controlId="companyEmail"
          className="mb-2"
          label="Company Email"
          labelClassName="form.lbl"
          value={formData.companyEmail}
          onChange={handleInputChange}
          required
          onBlur={() => handleBlur("companyEmail")}
          error={errors.companyEmail}
        />

        <Form.Group controlId="companyPhoneNumber" className="mb-2">
          <Form.Label className="mb-0 form-lbl">Company Phone</Form.Label>
          <div
            className="d-flex align-items-center border px-2 py-1 bg-white"
            style={{ borderRadius: "3px", height: "2.5rem" }}
          >
            <img src={jordanLogo} alt="Jordan" style={{ width: "24px" }} />
            <span
              style={{
                padding: "0 7px",
                borderRight: "1px solid gray",
                color: "black",
              }}
            >
              +962
            </span>
            <Form.Control
              type="number"
              input="numeric"
              name="companyPhoneNumber"
              style={{ border: "none", outline: "none", boxShadow: "none" }}
              onChange={handleInputChange}
              value={formData.companyPhoneNumber}
              onBlur={() => handleBlur("companyPhoneNumber")}
              error={errors.companyPhoneNumber}
            />
          </div>
          {errors.companyPhoneNumber && (
            <Form.Text
              className="text-light mb-0"
              style={{ fontSize: "0.7rem" }}
            >
              * {errors.companyPhoneNumber}
            </Form.Text>
          )}
        </Form.Group>
        <CustomInput
          controlId="regNumber"
          type="number"
          input="numeric"
          className="mb-2"
          label="Company Registration Number"
          labelClassName="form.lbl"
          value={formData.regNumber}
          onChange={handleInputChange}
          required
          onBlur={() => handleBlur("regNumber")}
          error={errors.regNumber}
        />

        <CustomInput
          controlId="companyAddress"
          className="mb-4"
          label="Company Address"
          labelClassName="form.lbl"
          value={formData.companyAddress}
          onChange={handleInputChange}
          placeholder="City *"
          required
          onBlur={() => handleBlur("companyAddress")}
          error={errors.companyAddress}
        />

        <div className="d-flex gap-4 w-100">
          <CustomInput
            controlId="companyStreet"
            className="mb-2 w-100"
            value={formData.companyStreet}
            onChange={handleInputChange}
            placeholder="Enter street"
            onBlur={() => handleBlur("companyStreet")}
            error={errors.companyStreet}
          />
          <CustomInput
            controlId="companyBuildingNo"
            className="mb-2 w-100"
            value={formData.companyBuildingNo}
            onChange={handleInputChange}
            placeholder="Enter building number"
            onBlur={() => handleBlur("companyBuildingNo")}
            error={errors.companyBuildingNo}
          />
        </div>

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

export default SignUpStep2;
