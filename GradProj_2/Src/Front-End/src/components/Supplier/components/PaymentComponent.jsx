import React from "react";
import { Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useQuotations } from "../../Providers/quotationProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import visaPic from "../../../assets/payment/visa.png";
import masterPic from "../../../assets/payment/mastercard.png";
import codPic from "../../../assets/payment/cod.png";

const PaymentComponent = ({
  quotation,
  paymentMethod,
  handlePaymentChange,
}) => {
  const navigate = useNavigate();

  const { updateQuotationPaymentMethod } = useQuotations();

  const handleUpdatePaymentMethod = (quotationId, newPaymentMethod) => {
    return updateQuotationPaymentMethod(quotationId, newPaymentMethod);
  };

  const handlePurchase = () => {
    handleUpdatePaymentMethod(quotation.id, paymentMethod);
    navigate(`/supplier/manageQuotations/${quotation.id}/finishPurchase`, {
      state: { quotation },
    });
  };

  return (
    <Col md={5}>
      <h4 className="fw-bold">Payment</h4>
      <div className="d-flex gap-3 my-2 py-2" style={{ height: "50px" }}>
        <img src={visaPic} alt="Visa" />
        <img src={masterPic} alt="MasterCard" />
        <img src={codPic} alt="Cash On Delivary" />
      </div>
      <Form className="py-2 border rounded">
        <Form.Group controlId="paymentCash" className="border-bottom pb-2 step">
          <Form.Check
            type="radio"
            id="Cash"
            name="paymentMethod"
            value="Cash"
            label="Cash On Delivery"
            defaultChecked
            onChange={handlePaymentChange}
          />
        </Form.Group>
        <Form.Group controlId="paymentCredit" className="pt-2 step">
          <Form.Check
            type="radio"
            id="CreditOrDebit"
            name="paymentMethod"
            value="CreditOrDebit"
            label="Credit / Debit Card"
            onChange={handlePaymentChange}
          />
        </Form.Group>
        {paymentMethod === "CreditOrDebit" ? (
          <>
            <div className="d-flex justify-content-between mt-3 px-4 gap-3">
              <Button
                className="w-50 py-2"
                style={{
                  backgroundColor: "#FFC439",
                  color: "black",
                  fontWeight: "bold",
                  border: "none",
                  boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                <img
                  src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                  alt="PayPal"
                  style={{ width: "20px", marginRight: "10px" }}
                />
                PayPal
              </Button>
              <Button
                className="py-2 w-50"
                style={{
                  backgroundColor: "black",
                  color: "white",
                  fontWeight: "bold",
                  border: "none",
                  boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
                }}
                onClick={handlePurchase}
              >
                <i className="fas fa-credit-card"></i>
                Debit or Credit Card
              </Button>
            </div>
            <p className="text-center mt-3" style={{ fontSize: "12px" }}>
              Powered by{" "}
              <span style={{ color: "#003087", fontWeight: "bold" }}>
                PayPal
              </span>
            </p>
          </>
        ) : (
          <div className="px-4 py-2 mt-3 d-flex justify-content-center">
            <Button
              variant="dark"
              style={{
                boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
                borderRadius: "3px",
              }}
              className="w-75 py-1 fw-bold fs-6"
              onClick={handlePurchase}
            >
              Purchase
            </Button>
          </div>
        )}
      </Form>
    </Col>
  );
};

export default PaymentComponent;
