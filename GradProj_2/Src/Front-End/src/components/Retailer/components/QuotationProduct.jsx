import React from "react";
import { Card, Button, Col, Row } from "react-bootstrap";
import { BiPlus, BiMinus } from "react-icons/bi";
import AppColors from "../../Theme/AppColors";

const QuotationProduct = ({
  product,
  quantity,
  onDelete,
  onIncrease,
  onDecrease,
  index,
  numOfProducts,
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
    <Row
      className="py-4 align-items-center justify-content-between"
      style={{
        borderBottom:
          index != numOfProducts - 1 && `1px solid ${AppColors.dividerLine}`,
      }}
    >
      <Col md="auto" style={{ width: "80%" }}>
        <Row className="align-items-center">
          <Col
            md={2}
            className="p-0"
            style={{ width: "12%", marginRight: "10px" }}
          >
            <img
              src={product.image}
              style={{ width: "100%", objectFit: "contain" }}
            />
          </Col>

          <Col md={3} className="fw-bold text-center">
            {product.title}
          </Col>

          <Col
            md={3}
            className="text-center d-flex align-items-center justify-content-center gap-3 fw-bold"
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

          <Col md={3} className="fw-bold text-center">
            Price to be determined
          </Col>
        </Row>
      </Col>

      <Col md="auto">
        <Button
          className="fw-bold"
          style={{
            fontSize: "0.8rem",
            height: "2.5rem",
            padding: "10px",
            backgroundColor: AppColors.primaryColor,
            color: "white",
            borderRadius: "3px",
            textAlign: "center",
            minWidth: "140px",
            maxWidth: "160px",
            boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.3)",
          }}
          onClick={onDelete}
        >
          Delete
        </Button>
      </Col>
    </Row>
  );
};

export default QuotationProduct;
