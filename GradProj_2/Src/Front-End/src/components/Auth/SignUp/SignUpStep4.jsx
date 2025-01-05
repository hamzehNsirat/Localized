import React, { useState } from "react";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import localizedLogo from "../../../assets/headerLogo.png";
import { categories } from "../../Models/Categories";

const SignUpStep4 = ({ formData, handleInputChange, nextStep }) => {
  const [selectedIndustryTypes, setSelectedIndustryTypes] = useState(
    formData.industryTypes || []
  );

  const handleIndustryTypesClick = (industryType) => {
    if (formData.position === "3") {
      // Supplier can select only one industryType
      setSelectedIndustryTypes([industryType]);
      handleInputChange({
        target: { name: "industryTypes", value: [industryType] },
      });
    } else {
      // Retailer can select multiple Industry Types
      const isSelected = selectedIndustryTypes.includes(industryType);
      const newSelection = isSelected
        ? selectedIndustryTypes.filter((cat) => cat !== industryType)
        : [...selectedIndustryTypes, industryType];
      setSelectedIndustryTypes(newSelection);
      handleInputChange({
        target: { name: "industryTypes", value: newSelection },
      });
    }
  };

  return (
    <Container className="text-center">
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ flexDirection: "column" }}
      >
        <img src={localizedLogo} alt="Localized" style={{ width: "20%" }}></img>
        <h6 className="mt-0 mb-2">
          Set up your {formData.position == "2" ? "retailer" : "supplier"}
          account
        </h6>
      </div>
      <Row>
        {categories.map((industryType, index) => (
          <Col key={index} md={4} className="mb-3 h-100">
            <Card
              className={`category-card p-0 justify-content-center ${
                selectedIndustryTypes.includes(index + 1) ? "active" : ""
              }`}
              onClick={() => handleIndustryTypesClick(index + 1)}
              style={{
                height: "90%",
                cursor: "pointer",
                backgroundColor: "#FFFFFF",
                border: selectedIndustryTypes.includes(index + 1)
                  ? "4px solid black"
                  : "",
                borderRadius: "3px",
                textAlign: "center",
                color: "#000",
                transition: "all 0.3s ease",
              }}
            >
              <div className="category-icon align-items-start">
                <img
                  src={industryType.icon}
                  alt={industryType.name}
                  className="w-25"
                  style={{ fontSize: "0.7rem" }}
                />
              </div>
              <h5 className="category-name">{industryType.name}</h5>
            </Card>
          </Col>
        ))}
      </Row>
      <Button
        onClick={nextStep}
        disabled={selectedIndustryTypes.length === 0}
        variant="dark"
        className="mt-2 mb-2 px-5 py-14 w-50 fw-bold"
        style={{
          boxShadow: "0px 0px 14px rgba(0, 0, 0, 1)",
          borderRadius: "3px",
          border: "none",
          height: "2.5rem",
        }}
      >
        Continue
      </Button>
    </Container>
  );
};

export default SignUpStep4;
