import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import jordanFlag from "../../../assets/jordanFlag.png";
import PaymentComponent from "../components/PaymentComponent.jsx";
import quotationStatus from "../../Models/QuotationStatus.jsx";
import quotationsApi from "../../../api/retailerAPIs/quotations.js";
import { useAuth } from "../../Providers/authProvider.jsx";
import LoadingScreen from "../../Common/LoadingScreen.jsx";

/* 
  rejectQuotation: {retId, statusId}
  accept: {retId, statusId}
  purchase&confirmQuotation: {retId, statusId} : updates payment
*/

const ViewQuotation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const { quoId } = location.state;
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true); // when its null it will be loading to fetch the data
  const [error, setError] = useState(null);

  const { userData } = useAuth();

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const payload = {
          quotationId: parseInt(quoId),
        };
        const response = await quotationsApi.getQuotationDetails(payload);
        if (response?.body?.success) {
          const quo = response.body.quotationDetails;
          setQuotation(quo);
        } else {
          console.error("idk: ", response);
        }
      } catch (err) {
        setError("error fetching quotation data", err);
        console.error("error fetching quotation data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotation();
  }, []);

  const [paymentMethod, setPaymentMethod] = useState("CashOnDelivery");

  const rejectQuotation = async () => {
    try {
      const payload = {
        quotationId: parseInt(quoId),
        quotationStatusId: 5,
      };
      setLoading(true);
      const response = await quotationsApi.updateQuotationStatus(payload);
      if (response?.body?.success) {
        console.log("quotation rejected");
      } else if (response.body.details.success == "false")
        console.log("error reject quotation");
    } catch (err) {
      console.error("error rejecting quotation", err);
      setError("error rejecting quotation", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCurrentStep = (step) => {
    setCurrentStep(step);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) return <LoadingScreen />;

  return (
    <Container className="p-0 mt-5 pb-3">
      <div className="d-flex justify-content-between align-items-center">
        {currentStep == 1 && (
          <>
            <h2 className="fw-bold">Quotation</h2>
            <h2 className="fw-bold">#{quotation.id}</h2>
          </>
        )}
        {currentStep == 2 && (
          <>
            <h2 className="fw-bold">Final Step, Complete your Payment</h2>
            <Button
              variant="dark"
              className="fw-bold py-1 fs-6"
              style={{
                width: "15%",
                boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
                borderRadius: "3px",
              }}
              onClick={() => handleCurrentStep(1)}
            >
              {"Back"}
            </Button>
          </>
        )}
      </div>
      <Row className="mt-3 justify-content-between">
        {currentStep == 1 && (
          <Col md={5}>
            <h4 className="fw-bold">Billing Information</h4>
            <Form style={{ width: "100%" }}>
              <div className="d-flex gap-4 justify-content-between">
                <Form.Group controlId="firstName" className="mb-3 w-100">
                  <Form.Label className="mb-0 fw-bold">First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="First"
                    value={userData.userDetails.firstName}
                    disabled
                  />
                </Form.Group>
                <Form.Group controlId="lastName" className="mb-3 w-100">
                  <Form.Label className="mb-0 fw-bold">Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Last"
                    value={userData.userDetails.lastName}
                    disabled
                  />
                </Form.Group>
              </div>

              <Form.Group controlId="companyName" className="mb-3 w-100">
                <Form.Label className="mb-0 fw-bold">Company Name</Form.Label>
                <Form.Control
                  type="text"
                  value={quotation.retailStore}
                  disabled
                />
              </Form.Group>

              <div className="d-flex gap-4 justify-content-between">
                <Form.Group controlId="city" className="mb-3 w-100">
                  <Form.Label className="mb-0 fw-bold">City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="City"
                    value={quotation.shipToAddress.split()[0]}
                    disabled
                  />
                </Form.Group>
                <Form.Group controlId="address" className="mb-3 w-100">
                  <Form.Label className="mb-0 fw-bold">Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Address"
                    value={quotation.shipToAddress.split()[0]}
                    disabled
                  />
                </Form.Group>
              </div>

              <Form.Group controlId="phoneNumber" className="mb-3">
                <Form.Label className="fw-bold mb-0">Phone Number</Form.Label>
                <div
                  className="d-flex align-items-center border rounded px-2 py-1"
                  style={{ backgroundColor: "#E9ECEF" }}
                >
                  <img
                    src={jordanFlag}
                    alt="Jordan"
                    style={{ width: "24px" }}
                  />
                  <span
                    style={{ padding: "0 7px", borderRight: "1px solid gray" }}
                  >
                    +962
                  </span>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    style={{ border: "none", outline: "none" }}
                    value={
                      userData.establishmentDetails.establishmentContactNumber
                    }
                    disabled
                  />
                </div>
              </Form.Group>

              <Form.Group controlId="email" className="mb-3">
                <Form.Label className="mb-0 fw-bold">Email</Form.Label>
                <Form.Control
                  type="email"
                  value={userData.establishmentDetails.establishmentEmail}
                  disabled
                />
              </Form.Group>
            </Form>
          </Col>
        )}

        {currentStep === 2 && (
          <PaymentComponent
            quotation={quotation}
            paymentMethod={paymentMethod}
            handlePaymentChange={handlePaymentChange}
            setLoading={setLoading}
          />
        )}

        <Col md={6}>
          <h4 className="fw-bold mb-4">Order Information</h4>

          <div className="p-3 border rounded">
            <Row className="fw-bold text-muted border-bottom pb-2">
              <Col xs={4}>Product</Col>
              <Col xs={4} className="text-center">
                Quantity
              </Col>
              <Col xs={4} className="text-end">
                Subtotal
              </Col>
            </Row>

            {quotation.details.detailsItem.map((product) => (
              <Row key={product.id} className="align-items-center py-2">
                <Col xs={4} className="fw-bold">
                  {product.productName}
                </Col>
                <Col xs={4} className="text-center">
                  {product.quantity}
                </Col>
                <Col xs={4} className="text-end">
                  {quotationStatus.Retailer[quotation.statusId] ==
                  quotationStatus.Retailer[0]
                    ? "To be determined"
                    : product.price + " JOD"}
                </Col>
              </Row>
            ))}

            <Row className="fw-bold mt-2 pt-2 border-top">
              <Col xs={6}>Subtotal</Col>
              <Col xs={6} className="text-end">
                {quotationStatus.Retailer[quotation.statusId] ==
                quotationStatus.Retailer[0]
                  ? "To be determined"
                  : quotation.subTotal + " JOD"}
              </Col>
            </Row>
            <Row className="fw-bold mt-2">
              <Col xs={6}>Shipping</Col>
              <Col xs={6} className="text-end">
                {quotationStatus.Retailer[quotation.statusId] ==
                quotationStatus.Retailer[0]
                  ? "To be determined"
                  : `${quotation.shippingCost} JOD`}
              </Col>
            </Row>
            <Row className="fw-bold mt-2">
              <Col xs={6}>Total</Col>
              <Col xs={6} className="text-end">
                {quotationStatus.Retailer[quotation.statusId] ==
                quotationStatus.Retailer[0]
                  ? "To be determined"
                  : quotation.total + " JOD"}
              </Col>
            </Row>
          </div>
          {quotationStatus.Retailer[quotation.statusId] == "Quoted" ? (
            currentStep != 2 && (
              <div className="d-flex w-100 align-items-center mt-3">
                <Button
                  variant="dark"
                  style={{
                    boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
                    borderRadius: "3px",
                  }}
                  className="w-100 py-2 fw-bold fs-6"
                  onClick={() => handleCurrentStep(2)}
                >
                  Accept Quotation
                </Button>
                <Button
                  style={{
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                    color: "red",
                    border: "0",
                  }}
                  className="w-100 fs-6 fw-bold"
                  onClick={rejectQuotation}
                >
                  Reject Quotation
                </Button>
              </div>
            )
          ) : (
            <Button
              variant="dark"
              style={{
                boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
                borderRadius: "3px",
              }}
              className="w-100 py-1 fw-bold fs-6 mt-3"
              onClick={handleGoBack}
            >
              Back
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ViewQuotation;
