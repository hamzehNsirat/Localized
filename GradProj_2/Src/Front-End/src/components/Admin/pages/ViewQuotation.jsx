import AppColors from "../../Theme/AppColors";
import { Row, Col, Button, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import StatusColors from "../../Theme/StatusColors";
import companyLogo from "../../../assets/companyLogo.png";
import { filterProducts } from "../../Supplier/services/productService";
import quotationStatus from "../../Models/QuotationStatus";
import { useEffect, useState } from "react";
import quotationApi from "../../../api/adminAPIs/quotations";
import LoadingScreen from "../../Common/LoadingScreen";
import { formatDateForInput } from "../../Utils/formatters";

const ViewQuotation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quoId } = location.state;
  const [loading, setLoading] = useState(true); // when its null it will be loading to fetch the data
  const [quotation, setQuotation] = useState({});

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        setLoading(true);
        const payload = {
          quotationId: parseInt(quoId),
        };
        const response = await quotationApi.getQuotationDetails(payload);
        if (response?.body?.success) {
          setQuotation(response.body.quotationDetails);
        } else console.error("failed fetching quotation ", response);
      } catch (err) {
        console.error("failed fetching quotation ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotation();
  }, []);

  if (loading) return <LoadingScreen />;
  return (
    <div className="px-0 py-4">
      <div
        className="p-3 mb-4 border rounded d-flex justify-content-between align-items-center"
        style={{ backgroundColor: AppColors.grayBackground }}
      >
        <Col md="auto">
          <Row>
            <Col
              md="auto"
              style={{
                borderRight: `1px solid ${AppColors.dividerLine}`,
                paddingRight: "20px",
              }}
            >
              <h6 className="text-muted">Quotation Id:</h6>
              <h6 className="fw-bold">#{quotation.id}</h6>
            </Col>
            <Col
              md="auto"
              style={{ borderRight: `1px solid ${AppColors.dividerLine}` }}
              className="px-3"
            >
              <h6 className="text-muted">Date:</h6>
              <h6 className="fw-bold">
                {formatDateForInput(quotation.requestDate)}
              </h6>
            </Col>
            <Col
              md="auto"
              style={{ borderRight: `1px solid ${AppColors.dividerLine}` }}
              className="px-3"
            >
              <h6 className="text-muted">Payment Method:</h6>
              <h6 className="fw-bold">
                {quotation.paymentMethod == null
                  ? "-"
                  : quotation.paymentMethod == "CashOnDelivery"
                  ? "Cash on Delivery"
                  : "Credit / Debit"}
              </h6>
            </Col>
            <Col md="auto" className="px-3">
              <h6 className="text-muted">Total:</h6>
              <h6 className="fw-bold">
                {quotation.total != null
                  ? `${quotation.total} JOD`
                  : "undetermined"}
              </h6>
            </Col>
          </Row>
        </Col>
        {quotationStatus.Retailer[parseInt(quotation.statusId)] ==
          "Declined" && (
          <Col md="auto">
            <div
              className="fw-bold"
              style={{
                fontSize: "0.8rem",
                height: "2.5rem",
                padding: "10px",
                backgroundColor:
                  StatusColors.quotationStatus[
                    quotationStatus.Retailer[parseInt(quotation.statusId)]
                  ],
                color: "white",
                borderRadius: "3px",
                textAlign: "center",
                minWidth: "170px",
                maxWidth: "200px",
              }}
            >
              {quotationStatus.Retailer[parseInt(quotation.statusId)]}
            </div>
          </Col>
        )}
      </div>
      <div
        className="justify-content-center border rounded p-4 mb-5"
        style={{ backgroundColor: AppColors.grayBackground }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold">Order Details</h4>
          <Button
            className="fw-bold"
            style={{
              boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
              borderRadius: "3px",
              fontSize: "15px",
              width: "17%",
              backgroundColor: AppColors.primaryColor,
            }}
          >
            Export
          </Button>
        </div>
        <div className="px-3 py-4 border rounded">
          <Row className="fw-bold text-muted border-bottom pb-2 m-0 px-3 mb-3">
            <Col xs={5}>Product</Col>
            <Col xs={3} className="text-center">
              Quantity
            </Col>
            <Col xs={4} className="text-end">
              Subtotal
            </Col>
          </Row>

          {quotation.details.detailsItem.map((product) => (
            <Row
              key={product.productId}
              className="align-items-center justify-content-between py-2 m-0 px-3"
            >
              <Col
                md={2}
                className="d-flex align-items-center"
                style={{ minWidth: "35%" }}
              >
                <img
                  src={product.productImage}
                  style={{
                    maxWidth: "25%",
                    objectFit: "contain",
                    marginRight: "30px",
                  }}
                />
                <p className="m-0"> {product.productName}</p>
              </Col>
              <Col md={2} className="text-center">
                {product.quantity}
              </Col>
              <Col md={3} className="text-end fw-bold">
                {product.price != null
                  ? `${product.price} JOD`
                  : "undetermined"}{" "}
              </Col>
            </Row>
          ))}

          <Row className="fw-bold mt-3 py-1 pt-3 m-0 px-3 border-top">
            <Col xs={6}>Subtotal</Col>
            <Col xs={6} className="text-end">
              {quotation.subTotal != null
                ? `${quotation.subTotal} JOD`
                : "undetermined"}{" "}
            </Col>
          </Row>
          <Row className="fw-bold mt-2 py-1 m-0 px-3">
            <Col xs={6}>Shipping</Col>
            <Col xs={6} className="text-end">
              {quotation.shippingCost != null
                ? `${quotation.shippingCost} JOD`
                : "undetermined"}
            </Col>
          </Row>
          <Row className="fw-bold mt-2 py-1 m-0 px-3">
            <Col xs={6}>Payment Method</Col>
            <Col xs={6} className="text-end">
              {quotation.paymentMethod == null
                ? "-"
                : quotation.paymentMethod == "CashOnDelivery"
                ? "Cash on Delivery"
                : "Credit / Debit"}
            </Col>
          </Row>
          <Row className="fw-bold mt-2 py-1 m-0 px-3">
            <Col xs={6}>Total</Col>
            <Col xs={6} className="text-end">
              {quotation.total != null
                ? `${quotation.total} JOD`
                : "undetermined"}
            </Col>
          </Row>
        </div>
      </div>
      <div className="mb-5 d-flex align-items-start justify-content-between gap-4">
        <Col
          className="p-3 border"
          style={{
            backgroundColor: AppColors.grayBackground,
            borderRadius: "3px",
          }}
        >
          <h4 className="mb-3 fw-bold">Company Info</h4>
          <div className="d-flex flex-column justify-content-center">
            <h6 className="fw-bold">{"Marouf"}</h6>
            <h6 className="fw-bold">{quotation.retailStoreEmail}</h6>
            <h6
              className="fw-bold"
              style={{
                textDecoration: "underline",
                color: AppColors.primaryColor,
              }}
            >
              {quotation.retailContactNumber}
            </h6>
          </div>
        </Col>
        <Col
          className="p-3 border"
          style={{
            backgroundColor: AppColors.grayBackground,
            borderRadius: "3px",
          }}
        >
          <h4 className="mb-3 fw-bold">Billing Info</h4>
          <div className="d-flex flex-column justify-content-center">
            <h6 className="fw-bold">
              {quotation?.firstName + " " + quotation?.lastName}
            </h6>
            <h6 className="fw-bold">{quotation.shipToAddress.split()[0]}</h6>
            <h6 className="fw-bold">{quotation.shipToAddress.split()[0]}</h6>
          </div>
        </Col>
      </div>
    </div>
  );
};

export default ViewQuotation;
