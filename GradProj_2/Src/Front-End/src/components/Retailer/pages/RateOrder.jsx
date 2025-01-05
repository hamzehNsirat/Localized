import React, { useEffect, useState } from "react";
import { Row, Col, Button, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuotations } from "../../Providers/quotationProvider.jsx";
import AppColors from "../../Theme/AppColors.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import LoadingScreen from "../../Common/LoadingScreen.jsx";
import quotationsApi from "../../../api/retailerAPIs/quotations.js";
import { formatDateForInput } from "../../Utils/formatters.js";

/* 
  submitReview: {retId, supId, review:{rating, description}}:
*/

const RateOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quoId } = location.state;
  const handleDone = () => {
    navigate("/retailer/manageQuotations");
  };
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true); // when its null it will be loading to fetch the data
  const [error, setError] = useState(null);

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const [reviewIsDone, setReviewIsDone] = useState(null);

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
          setReviewIsDone(response.body.quotationDetails.isReveiwed);
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

  const submitReview = async () => {
    if (rating === 0 || feedback.trim() === "") {
      alert("Please provide both a rating and feedback.");
      return;
    }
    try {
      const payload = {
        retailerId: quotation.requesterId,
        supplierId: quotation.supplierId,
        quotationId: parseInt(quoId),
        rating: rating,
        reviewComment: feedback,
      };
      setLoading(true);
      const response = await quotationsApi.submitReview(payload);
      if (response?.body.success) {
        setReviewIsDone(true);
      } else console.log("Error submitting review: ", response);
    } catch (err) {
      setError("Error submitting review: ", err);
      console.log("Error submitting review: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (index) => {
    setRating(index + 1); // Rating is 1-based
  };
  if (loading) return <LoadingScreen />;

  return (
    <Container className="p-0 pb-3">
      {!reviewIsDone ? (
        <>
          <div className="d-flex justify-content-between mb-2 mt-5">
            <h2 className="fw-bold">Rate your order!</h2>
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
          <h5 className="text-muted fw-bold mb-3">
            How satisfied, with your order?
          </h5>
          <Row className="mb-4">
            <Col xs="auto" className="d-flex gap-2">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  onClick={() => handleStarClick(index)}
                  viewBox="0 0 24 24"
                  fill={index < rating ? "black" : "none"} // Filled if selected
                  stroke="black"
                  strokeWidth="2"
                  style={{
                    cursor: "pointer",
                    width: "30px",
                    height: "30px",
                  }}
                >
                  <polygon points="12 2 15 8.5 22 9.5 17 14 18.5 21 12 17.5 5.5 21 7 14 2 9.5 9 8.5" />
                </svg>
              ))}
            </Col>
          </Row>
          <Row className="mb-4">
            <Col md={5}>
              <textarea
                rows="5"
                className="form-control"
                placeholder="Write your feedback here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                style={{ boxShadow: "none", resize: "none" }}
              />
            </Col>
          </Row>
          <Row className="mb-4">
            <Col xs="auto">
              <Button
                variant="dark"
                className="fw-bold py-2 px-4"
                style={{
                  boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
                  borderRadius: "3px",
                  fontSize: "15px",
                }}
                onClick={submitReview}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </>
      ) : (
        <h3 className="d-flex align-content-center justify-content-center text-muted text-center p-5">
          Thank You!<br></br>
          Your feedback has been submitted.
        </h3>
      )}

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
          <h6 className="fw-bold">
            {formatDateForInput(quotation.requestDate)}
          </h6>
        </Col>
        <Col
          md={2}
          style={{ borderRight: `1px solid ${AppColors.dividerLine}` }}
          className="px-3"
        >
          <h6 className="text-muted">Payment Method:</h6>
          <h6 className="fw-bold">
            {quotation.paymentMethod === "CashOnDelivery"
              ? "Cash On Delivery"
              : "Credit / Debit"}
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
                {quotation.paymentMethod === "CashOnDelivery"
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

export default RateOrder;
