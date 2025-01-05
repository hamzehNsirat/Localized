import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import "./styles/signUp.css";
import "bootstrap/dist/css/bootstrap.min.css";
import localizedLogo from "../../../assets/headerLogo.png";
import jordanLogo from "../../../assets/jordanFlag.png";
import { CustomInput } from "../../Common/index.js";

const SignUpStep1 = ({
  formData,
  handleInputChange,
  errors,
  handleBlur,
  nextStep,
  isChecked,
  handleCheckboxChange,
}) => {
  const onCheckboxChange = () => {
    handleCheckboxChange(!isChecked);
  };

  const isUserNameValid = (username) => {
    return username.length >= 6;
  };

  const checkUniqueUsername = async (username) => {
    const mappedFormData = {
      username: username,
    };

    try {
      const response = await fetch(
        "http://localhost:5055/api/auth/checkusernameavailability",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mappedFormData),
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        data.header.errorCode === "0000" &&
        data.body.success
      ) {
        if (data.body.isAvailable) console.log("Username availabe: ", username);
        else console.log("Username not availabe", username);
        return data;
      } else {
        console.error(
          "Checking uniquness of username failed:",
          data?.header?.message || "Unknown error"
        );
        throw new Error(
          data?.header?.errorDescription || "Please try again later."
        );
      }
    } catch (error) {
      console.error("Error during signup:", error);
      throw error; // Re-throw the error for the calling function to handle
    }
  };
  return (
    <>
      <div className="container mb-2 mt-2">
        <img src={localizedLogo} alt="Localized" style={{ width: "40%" }}></img>
        <h6 className="my-2">Choose your Position:</h6>

        <div className="btn-group-toggle d-flex gap-4" data-toggle="buttons">
          <label
            className={`w-100 btn btn-radio h-25 ${
              formData.position === "2" ? "btn-light" : "btn-dark"
            }`}
            style={{ height: "2.5rem", borderRadius: "3px" }}
          >
            <input
              type="radio"
              name="position"
              value="2"
              autoComplete="off"
              checked={formData.position === "2"}
              onChange={handleInputChange}
              style={{ display: "none" }}
            />
            Retailer
          </label>
          <label
            className={`w-100 btn btn-radio h-25 ${
              formData.position === "3" ? "btn-light" : "btn-dark"
            }`}
            style={{ height: "2.5rem", borderRadius: "3px" }}
          >
            <input
              type="radio"
              name="position"
              value="3"
              autoComplete="off"
              checked={formData.position === "3"}
              onChange={handleInputChange}
              style={{ display: "none" }}
            />
            Supplier
          </label>
        </div>
      </div>
      <div className="container">
        <Form>
          <div className="d-flex gap-4 w-100">
            <CustomInput
              label="First Name"
              className="w-100 mb-2"
              labelClassName="mb-0 form-lbl"
              controlId="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              onBlur={() => handleBlur("firstName")}
              error={errors.firstName}
            />
            <CustomInput
              label="Last Name"
              className="w-100 mb-2"
              labelClassName="mb-0 form-lbl"
              controlId="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              onBlur={() => handleBlur("lastName")}
              error={errors.lastName}
            />
          </div>

          <CustomInput
            label="Username"
            className="mb-2"
            labelClassName="mb-0 form-lbl"
            controlId="username"
            value={formData.username}
            onChange={handleInputChange}
            onBlur={() => handleBlur("username")}
            error={errors.username}
          />
          <Form.Group controlId="phone" className="mb-2">
            <Form.Label className="mb-0 form-lbl">Phone</Form.Label>
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
                name="phone"
                placeholder="Enter phone number"
                style={{ border: "none", outline: "none", boxShadow: "none" }}
                onChange={handleInputChange}
                value={formData.phone}
                onBlur={() => handleBlur("phone")}
                error={errors.phone}
              />
            </div>
            {errors.phone && (
              <Form.Text
                className="text-light mb-0"
                style={{ fontSize: "0.7rem" }}
              >
                * {errors.phone}
              </Form.Text>
            )}
          </Form.Group>
          <CustomInput
            label="Email"
            className="mb-2"
            labelClassName="mb-0 form-lbl"
            controlId="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={() => handleBlur("email")}
            error={errors.email}
          />
          <CustomInput
            label="Password"
            type="password"
            className="mb-2"
            labelClassName="mb-0 form-lbl"
            controlId="password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={() => handleBlur("password")}
            error={errors.password}
          />
          <CustomInput
            label="Confirm Password"
            type="password"
            className="mb-2"
            labelClassName="mb-0 form-lbl"
            controlId="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onBlur={() => handleBlur("confirmPassword")}
            error={errors.confirmPassword}
          />
          <Form.Check
            type="checkbox"
            label="I agree to the terms and conditions"
            checked={isChecked}
            onChange={onCheckboxChange}
            className="mt-2"
          />
          <Button
            disabled={!isChecked}
            onClick={nextStep}
            variant="dark"
            className="mt-2 px-5 py-14 w-100 fw-bold"
            style={{
              boxShadow: "0px 0px 14px rgba(0, 0, 0, 1)",
              outline: "none",
              border: "none",
              borderRadius: "3px",
              height: "2.5rem",
            }}
          >
            Continue
          </Button>
        </Form>
      </div>
    </>
  );
};

export default SignUpStep1;
