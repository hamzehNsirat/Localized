import React from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import emailPic from "../../../assets/signup/email.png";
import { useAuth } from "../../Providers";
import localizedLogo from "../../../assets/headerLogo.png";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppColors from "../../Theme/AppColors";
import { validateField } from "../../Utils/Validators";

const SignUpStep5 = ({ formData, setErrors }) => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const validateFormData = () => {
    const newErrors = {};
    // Validate all fields using the validateField function
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field], formData);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);
    // If there are no errors, return true; otherwise, false
    return Object.keys(newErrors).length === 0;
  };

  const handleFinishClick = async () => {
    const isValid = validateFormData(); // Validate all fields before submission
    if (!isValid) {
      alert("Some data are invalid or missing. Please check your inputs.");
      return;
    }
    try {
      const response = await signUp(formData);
      if (response?.body?.success) {
        console.log("user created successfully");
        navigate("/");
        toast.success(
          "Your application has been created. \nYou will receive an email when you're approved.",
          { progressStyle: { background: AppColors.primaryColor } }
        );
      }
    } catch (error) {
      console.error("Signup error:", error.message);
      alert(
        error.message || "An error occurred during signup. Please try again."
      );
    }
  };

  return (
    <>
      <Container className="text-center p-0 mr-0 ml-0">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ flexDirection: "column" }}
        >
          <img
            src={localizedLogo}
            alt="Localized"
            style={{ width: "20%" }}
          ></img>
          <h6 className="mt-0 mb-3">
            Your account is almost ready! Confirm your email to proceed.
          </h6>
        </div>
        <div className="mb-4">
          <img src={emailPic} className="w-25"></img>
          <h3 className="mb-2">We've Sent an Email to {formData.email}</h3>
          <p style={{ fontSize: "0.85rem" }}>
            Confirmation Email Sent! If you haven't received it yet<br></br>,
            please check your spam folder.
          </p>
        </div>
        <Button
          onClick={handleFinishClick}
          variant="dark"
          className="mt-2 mb-2 px-5 py-14 w-50 fw-bold"
          style={{
            boxShadow: "0px 0px 14px rgba(0, 0, 0, 1)",
            borderRadius: "3px",
            border: "none",
            height: "2.5rem",
          }}
        >
          Finish
        </Button>
      </Container>
    </>
  );
};

export default SignUpStep5;
