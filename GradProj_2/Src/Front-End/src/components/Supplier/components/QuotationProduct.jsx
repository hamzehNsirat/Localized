import React, { useState } from "react";
import { Card, Button, Col, Row } from "react-bootstrap";
import { BiPlus, BiMinus } from "react-icons/bi";
import AppColors from "../../Theme/AppColors";

const QuotationProduct = ({
  product,
  quantity,
  onDelete,
  onIncrease,
  onDecrease,
}) => {
  const handlePlusQuantity = () => {
    onIncrease();
  };

  const handleMinusQuantity = () => {
    if (quantity > 1) {
      onDecrease();
    }
  };

  return (
    <Card
      className="mb-3 px-2 py-2"
      style={{
        borderRadius: "10px",
        border: "0",
        backgroundColor: "#F2F2F2",
        boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Card.Body>
        <Row className="d-flex align-items-center justify-content-between">
          <Col xs={1} className="d-flex justify-content-center">
            <img
              src={product.image}
              alt="product img"
              style={{ width: "100%", objectFit: "contain" }}
            />
          </Col>

          <Col xs={2}>
            <Card.Title className="fw-bold mb-0">{product.title}</Card.Title>
          </Col>

          <Col
            xs={2}
            className="d-flex align-items-center justify-content-center gap-3 fw-bold"
            style={{ color: AppColors.blackFont }}
          >
            <BiMinus
              onClick={handleMinusQuantity}
              className="p-1 fs-5"
              style={{ borderRadius: "10px", border: "1px solid" }}
            />
            {quantity}
            <BiPlus
              onClick={handlePlusQuantity}
              className="p-1 fs-5"
              style={{ borderRadius: "10px", border: "1px solid" }}
            />
          </Col>

          <Col xs={2}>
            <p className="fw-bold mb-0" style={{ fontSize: "0.8rem" }}>
              {(product.sellingPrice * quantity).toFixed(2)} JOD
            </p>
          </Col>

          <Col xs={2} className="d-flex justify-content-center">
            <Button
              className="rounded-pill px-5 py-2"
              style={{
                backgroundColor: AppColors.primaryColor,
                border: "none",
                boxShadow: "-4px 3px 1px rgba(0, 0, 0, 1)",
                fontSize: "14px",
              }}
              onClick={onDelete}
            >
              {" "}
              Delete
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default QuotationProduct;
