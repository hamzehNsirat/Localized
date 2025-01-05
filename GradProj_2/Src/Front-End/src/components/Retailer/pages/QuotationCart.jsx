import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import QuotationProduct from "../components/QuotationProduct.jsx";
import "../styles/QuotationProcess.css";
import AppColors from "../../Theme/AppColors.jsx";

const QuotationCart = ({
  requestedProducts,
  handleDelete,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
  handleNextStep,
}) => {
  const numOfProducts = requestedProducts.length;

  return (
    <>
      {requestedProducts.length !== 0 ? (
        <div
          className="my-4 mb-5 px-5 justify-content-between w-100"
          style={{
            backgroundColor: AppColors.backgroundColor,
            borderRadius: "5px",

            boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          {requestedProducts.map((product, index) => (
            <QuotationProduct
              key={product.id}
              product={product}
              quantity={product.quantity || 1}
              onIncrease={() => handleIncreaseQuantity(product.id)}
              onDecrease={() => handleDecreaseQuantity(product.id)}
              onDelete={() => handleDelete(product.id)}
              index={index}
              numOfProducts={numOfProducts}
            />
          ))}
        </div>
      ) : (
        <h3 className="d-flex align-content-center justify-content-center mt-5 text-muted">
          Your cart is empty!
        </h3>
      )}

      {requestedProducts.length !== 0 && (
        <Row
          className="fixed-bottom py-4 px-5 m-2 mb-0"
          style={{ backgroundColor: "transparent", border: "0" }}
        >
          <Col className="d-flex justify-content-end align-items-center">
            <Button
              onClick={() => handleNextStep()}
              variant="dark"
              className="p-2 fw-bold"
              style={{
                width: "20%",
                boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
                borderRadius: "3px",
              }}
            >
              Proceed to checkout
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
};

export default QuotationCart;
