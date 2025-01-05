import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

import "./styles/signUp.css";
import retailerPic1 from "../../../assets/signup/retailer1.png";
import retailerPic2 from "../../../assets/signup/retailer2.png";
import retailerPic3 from "../../../assets/signup/retailer3.png";

import supplierPic1 from "../../../assets/signup/supplier1.png";
import supplierPic2 from "../../../assets/signup/supplier2.png";
import supplierPic3 from "../../../assets/signup/supplier3.png";

import SignUpStep1 from "./SignUpStep1.jsx";
import SignUpStep2 from "./SignUpStep2.jsx";
import SignUpStep3 from "./SignUpStep3.jsx";
import SignUpStep4 from "./SignUpStep4.jsx";
import SignUpStep5 from "./SignUpStep5.jsx";

import AppColors from "../../Theme/AppColors.jsx";

import { validateField } from "../../Utils/Validators.js";

const SignUp = () => {
  const [formData, setFormData] = useState({
    position: "2",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyEmail: "",
    companyPhoneNumber: "",
    regNumber: "",
    companyAddress: "",
    companyStreet: "",
    companyBuildingNo: "",
    description: "",
    logo: null,
    industryTypes: [],
  });

  const [errors, setErrors] = useState({});

  const pics = {
    retailer: [retailerPic1, retailerPic2, retailerPic3],
    supplier: [supplierPic1, supplierPic2, supplierPic3],
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [isChecked, setIsChecked] = useState(false);

  const handleCurrentStep = (step) => {
    setCurrentStep(step);
  };

  const handleCheckboxChange = (checked) => {
    setIsChecked(checked);
  };

  const handleBlur = (field) => {
    const value = formData[field];

    setErrors((prev) => {
      const updatedErrors = { ...prev };

      const error = validateField(field, value, formData);
      if (error) {
        updatedErrors[field] = error;
      } else {
        delete updatedErrors[field];
      }

      return updatedErrors;
    });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileUpload = (e) => {
    setFormData({
      ...formData,
      logo: e.target.files[0],
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SignUpStep1
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            handleBlur={handleBlur}
            nextStep={nextStep}
            isChecked={isChecked}
            handleCheckboxChange={handleCheckboxChange}
          />
        );
      case 2:
        return (
          <SignUpStep2
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            handleBlur={handleBlur}
            nextStep={nextStep}
          />
        );
      case 3:
        return (
          <SignUpStep3
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            handleBlur={handleBlur}
            handleFileUpload={handleFileUpload}
            nextStep={nextStep}
          />
        );
      case 4:
        return (
          <SignUpStep4
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
          />
        );
      case 5:
        return <SignUpStep5 formData={formData} setErrors={setErrors} />;
      default:
        return null;
    }
  };

  return (
    <div className="d-flex">
      <div
        className={`${
          (currentStep === 1 || currentStep === 2 || currentStep === 3) &&
          "container"
        } px-5 py-2 d-flex justify-content-center text-light`}
        style={{
          backgroundColor: AppColors.primaryColor,
          width: `${
            currentStep === 1 || currentStep === 2 || currentStep === 3
              ? "45vw"
              : "100vw"
          }`,
          height: `${currentStep === 4 || currentStep === 5 ? "100vh" : ""}`,
          flexDirection: "column",
          boxShadow: "5px 0px 6px rgba(0, 0, 0, 0.5)",
        }}
      >
        {renderStep()}
        <div className="d-flex gap-1 mt-2 justify-content-center">
          <div
            onClick={() => handleCurrentStep(1)}
            className="lvl-1"
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: currentStep === 1 ? "white" : "black",
              borderRadius: "100px",
            }}
          ></div>
          <div
            onClick={() => isChecked && handleCurrentStep(2)}
            className="lvl-2"
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: currentStep === 2 ? "white" : "black",
              borderRadius: "100px",
            }}
          ></div>
          <div
            onClick={() => isChecked && handleCurrentStep(3)}
            className="lvl-3"
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: currentStep === 3 ? "white" : "black",
              borderRadius: "100px",
            }}
          ></div>
          <div
            onClick={() => isChecked && handleCurrentStep(4)}
            className="lvl-4"
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: currentStep === 4 ? "white" : "black",
              borderRadius: "100px",
            }}
          ></div>
          <div
            onClick={() => isChecked && handleCurrentStep(5)}
            className="lvl-5"
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: currentStep === 5 ? "white" : "black",
              borderRadius: "100px",
            }}
          ></div>
        </div>
      </div>
      {(currentStep === 1 || currentStep === 2 || currentStep === 3) && (
        <div
          className="w-75 d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <img
            src={
              formData.position === "2"
                ? pics.retailer[currentStep - 1]
                : pics.supplier[currentStep - 1]
            }
            className="w-20"
            style={{ width: "40vw" }}
            alt={formData.position}
          />
        </div>
      )}
    </div>
  );
};

export default SignUp;
