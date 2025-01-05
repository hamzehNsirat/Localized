import React, { useEffect } from "react";
import { Row, Col, Button, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import AppColors from "../../Theme/AppColors.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quotation, paymentMethod } = location.state;

  const handleDone = () => {
    navigate("/retailer/manageQuotations");
  };
  return (
    <Container className="p-0 mt-5 pb-3">
      <div className="d-flex justify-content-between mb-2">
        <h2 className="fw-bold">Thank You</h2>
        <Button
          variant="dark"
          className="fw-bold py-1"
          style={{
            boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
            borderRadius: "3px",
            fontSize: "15px",
            width: "15%",
            height: "100%",
          }}
          onClick={handleDone}
        >
          Done
        </Button>
      </div>
      <h5 className="text-muted fw-bold mb-3" style={{ width: "60%" }}>
        Your order has been received. We'll work diligently to ensure your order
        is processed promptly.
      </h5>
      <Row
        className="p-3 mb-4 border rounded"
        style={{ backgroundColor: AppColors.grayBackground }}
      >
        <Col
          md="auto"
          style={{ borderRight: `1px solid ${AppColors.dividerLine}` }}
        >
          <h6 className="text-muted">Order Id:</h6>
          <h6 className="fw-bold">#{quotation.id}</h6>
        </Col>
        <Col
          md={2}
          style={{ borderRight: `1px solid ${AppColors.dividerLine}` }}
          className="px-3"
        >
          <h6 className="text-muted">Date:</h6>
          <h6 className="fw-bold">{quotation.requestDate}</h6>
        </Col>
        <Col
          md={2}
          style={{ borderRight: `1px solid ${AppColors.dividerLine}` }}
          className="px-3"
        >
          <h6 className="text-muted">Payment Method:</h6>
          <h6 className="fw-bold">
            {paymentMethod == "Cash" ? "Cash On Delivery" : "Credit / Debit"}
          </h6>
        </Col>
        <Col md={2} className="px-3">
          <h6 className="text-muted">Total:</h6>
          <h6 className="fw-bold">{quotation.total} JOD</h6>
        </Col>
      </Row>
      <Row
        className="justify-content-center border rounded p-3"
        style={{ backgroundColor: AppColors.grayBackground }}
      >
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold">Order Details</h4>
            <Button
              variant="dark"
              className="fw-bold"
              style={{
                boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
                borderRadius: "3px",
                fontSize: "15px",
                width: "17%",
              }}
            >
              Export
            </Button>
          </div>
          <div className="p-0 border rounded py-2">
            <Row className="fw-bold text-muted border-bottom pb-2 m-0 px-3">
              <Col xs={4}>Product</Col>
              <Col xs={4} className="text-center">
                Quantity
              </Col>
              <Col xs={4} className="text-end">
                Subtotal
              </Col>
            </Row>

            {quotation.details.detailsItem.map((product) => (
              <Row
                key={product.productId}
                className="align-items-center py-2 m-0 px-3"
              >
                <Col xs={4} className="fw-bold">
                  {product.productName}
                </Col>
                <Col xs={4} className="text-center">
                  {product.quantity}
                </Col>
                <Col xs={4} className="text-end">
                  {product.price} JOD
                </Col>
              </Row>
            ))}

            <Row className="fw-bold mt-2 py-1 pt-3 m-0 px-3 border-top">
              <Col xs={6}>Subtotal</Col>
              <Col xs={6} className="text-end">
                {quotation.subTotal} JOD
              </Col>
            </Row>
            <Row className="fw-bold mt-2 py-1 m-0 px-3">
              <Col xs={6}>Shipping</Col>
              <Col xs={6} className="text-end">
                {quotation.shippingCost} JOD
              </Col>
            </Row>
            <Row className="fw-bold mt-2 py-1 m-0 px-3">
              <Col xs={6}>Payment Method</Col>
              <Col xs={6} className="text-end">
                {paymentMethod == "Cash"
                  ? "Cash On Delivery"
                  : "Credit / Debit"}
              </Col>
            </Row>
            <Row className="fw-bold mt-2 py-1 m-0 px-3">
              <Col xs={6}>Total</Col>
              <Col xs={6} className="text-end">
                {quotation.total} JOD
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ThankYouPage;
