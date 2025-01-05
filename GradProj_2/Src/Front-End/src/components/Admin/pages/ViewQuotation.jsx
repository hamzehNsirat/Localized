import AppColors from "../../Theme/AppColors";
import { Row, Col, Button, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import StatusColors from "../../Theme/StatusColors";
import companyLogo from "../../../assets/companyLogo.png";
import { filterProducts } from "../../Supplier/services/productService";
import quotationStatus from "../../Models/QuotationStatus";

const quotation = {
  id: 1,
  retailerId: "500",
  supplierId: "123",
  statusId: 2,
  requestDate: new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  supLogo: companyLogo,
  firstName: "Mohammad",
  lastName: "Abuayyash",
  retEstName: "ketab",
  retPhoneNumber: "079",
  retEmail: "ret@gmail.com",
  supEstName: "Supplier",
  shipToAdd: {
    city: "city",
    address: "address",
  },
  billToAdd: "billTo",
  supplierAddress: "Al-Jandweel",
  products: filterProducts("Food-company").map((product) => ({
    id: product.id,
    image: product.image,
    name: product.title,
    quantity: product.quantity || 1,
    sellingPrice: product.sellingPrice,
    subtotal: (product.sellingPrice * (product.quantity || 1)).toFixed(2),
  })),
  subtotal: 0,
  shipping: 0,
  total: 0,
  paymentMethod: "Cash",
};

const ViewQuotation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appId } = location.state;

  const QuotationStatus = quotationStatus.Supplier[quotation.statusId];

  const handleGoBack = () => {
    navigate(-1);
  };
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
              <h6 className="fw-bold">{quotation.requestDate}</h6>
            </Col>
            <Col
              md="auto"
              style={{ borderRight: `1px solid ${AppColors.dividerLine}` }}
              className="px-3"
            >
              <h6 className="text-muted">Payment Method:</h6>
              <h6 className="fw-bold">
                {quotation.paymentMethod == ""
                  ? "-"
                  : quotation.paymentMethod == "Cash"
                  ? "Cash on Delivery"
                  : "Credit / Debit"}
              </h6>
            </Col>
            <Col md="auto" className="px-3">
              <h6 className="text-muted">Total:</h6>
              <h6 className="fw-bold">{quotation.total} JOD</h6>
            </Col>
          </Row>
        </Col>
        {QuotationStatus == "Declined" && (
          <Col md="auto">
            <div
              className="fw-bold"
              style={{
                fontSize: "0.8rem",
                height: "2.5rem",
                padding: "10px",
                backgroundColor:
                  StatusColors.quotationStatus[
                    quotationStatus.Supplier[quotation.statusId]
                  ],
                color: "white",
                borderRadius: "3px",
                textAlign: "center",
                minWidth: "170px",
                maxWidth: "200px",
              }}
            >
              {QuotationStatus}
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
            <Col xs={4}>Product</Col>
            <Col xs={4} className="text-center">
              Quantity
            </Col>
            <Col xs={4} className="text-end">
              Subtotal
            </Col>
          </Row>

          {quotation.products.map((product) => (
            <Row
              key={product.id}
              className="align-items-center justify-content-between py-2 m-0 px-3"
            >
              <Col md={3}>
                <img
                  src={product.image}
                  style={{
                    width: "30%",
                    objectFit: "contain",
                    marginRight: "30px",
                  }}
                />
                {product.name}
              </Col>
              <Col md={3} className="text-center">
                {product.quantity}
              </Col>
              <Col md={3} className="text-end">
                {product.subtotal} JOD
              </Col>
            </Row>
          ))}

          <Row className="fw-bold mt-3 py-1 pt-3 m-0 px-3 border-top">
            <Col xs={6}>Subtotal</Col>
            <Col xs={6} className="text-end">
              {quotation.subtotal} JOD
            </Col>
          </Row>
          <Row className="fw-bold mt-2 py-1 m-0 px-3">
            <Col xs={6}>Shipping</Col>
            <Col xs={6} className="text-end">
              {quotation.shipping} JOD
            </Col>
          </Row>
          <Row className="fw-bold mt-2 py-1 m-0 px-3">
            <Col xs={6}>Payment Method</Col>
            <Col xs={6} className="text-end">
              {quotation.paymentMethod == "Cash"
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
            <h6 className="fw-bold">{quotation.retEmail}</h6>
            <h6
              className="fw-bold"
              style={{
                textDecoration: "underline",
                color: AppColors.primaryColor,
              }}
            >
              {quotation.retPhoneNumber}
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
              {quotation.firstName + " " + quotation.lastName}
            </h6>
            <h6 className="fw-bold">{quotation.shipToAdd.city}</h6>
            <h6 className="fw-bold">{quotation.shipToAdd.address}</h6>
          </div>
        </Col>
      </div>
    </div>
  );
};

export default ViewQuotation;
