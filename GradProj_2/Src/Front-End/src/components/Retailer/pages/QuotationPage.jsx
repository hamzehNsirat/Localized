import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import { useRequestedProducts } from "../../Providers/requestedProductsProvider";
import QuotationCart from "./QuotationCart";
import RequestQuotationPage from "./RequestQuotationPage";

const QuotationPage = () => {
  const navigate = useNavigate();
  const { requestedProducts, setRequestedProducts } = useRequestedProducts();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // Avoid unnecessary updates to prevent infinite rendering
    const hasMissingQuantities = requestedProducts.some(
      (product) => product.quantity === undefined
    );

    if (hasMissingQuantities) {
      const updatedProducts = requestedProducts.map((product) => ({
        ...product,
        quantity: product.quantity ?? 1,
      }));
      setRequestedProducts(updatedProducts);
    }
  }, [requestedProducts, setRequestedProducts]);

  const handleContinueShopping = () => {
    navigate(-1);
  };

  const handleDelete = (id) => {
    setRequestedProducts(
      requestedProducts.filter((product) => product.id !== id)
    );
  };

  const handleIncreaseQuantity = (id) => {
    setRequestedProducts(
      requestedProducts.map((product) =>
        product.id === id
          ? { ...product, quantity: (product.quantity || 1) + 1 }
          : product
      )
    );
  };

  const handleDecreaseQuantity = (id) => {
    setRequestedProducts(
      requestedProducts.map((product) =>
        product.id === id && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
  };

  const handleCurrentStep = (step) => {
    setCurrentStep(step);
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <QuotationCart
            requestedProducts={requestedProducts}
            handleDelete={handleDelete}
            handleIncreaseQuantity={handleIncreaseQuantity}
            handleDecreaseQuantity={handleDecreaseQuantity}
            handleNextStep={handleNextStep}
          />
        );
      case 2:
        return <RequestQuotationPage requestedProducts={requestedProducts} />;
      default:
        return null;
    }
  };

  return (
    <Container className="p-0 mt-2">
      <div className="mt-4 d-flex justify-content-between align-items-center w-100">
        <div className="d-flex align-content-center align-items-center w-100 gap-3 mt-2">
          <div className="step">
            <input
              type="radio"
              id="cart"
              name="step"
              value="1"
              checked={currentStep === 1}
              onChange={() => handleCurrentStep(1)}
            />
            <label htmlFor="cart">Cart</label>
          </div>
          <div className="line"></div>
          <div className="step">
            <input
              type="radio"
              id="submitQuotation"
              name="step"
              value="2"
              checked={currentStep === 2}
              onChange={() => handleCurrentStep(2)}
            />
            <label htmlFor="submitQuotation">Submit Quotation</label>
          </div>
        </div>

        <Button
          variant="dark"
          className="fw-bold"
          style={{
            width: "18%",
            boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
            borderRadius: "3px",
          }}
          onClick={
            currentStep === 1
              ? handleContinueShopping
              : () => handleCurrentStep(1)
          }
        >
          {currentStep === 1 ? "Continue shopping" : "Back"}
        </Button>
      </div>

      {renderStep()}
    </Container>
  );
};

export default QuotationPage;
