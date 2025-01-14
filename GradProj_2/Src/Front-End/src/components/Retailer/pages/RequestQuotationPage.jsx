import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useQuotations } from "../../Providers/quotationProvider.jsx";
import companyLogo from "../dumpAssets/companyLogo.png";
import jordanFlag from "../../../assets/jordanFlag.png";
import { useAuth } from "../../Providers/authProvider.jsx";
import quotationsApi from "../../../api/retailerAPIs/quotations.js";
import { useLocation, useNavigate } from "react-router-dom";
import CustomModal from "../../Common/CustomModal.jsx";

/* 
  getRetailer&EstInfo: {retId:}
  requestQuotation: {}
    "quotaionDetails": {
      "order":
      [
        {
          productId:,
          quantity:,
          totalPrice: null, 
        },
        {
        },
      ]
    }
  requestQuotation: 
    {
      retailerId: ,
      supplierId: ,
      statusId: 1,
      requestDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      retEstName: formData.companyName,
      supEstName: requestedProducts[0].company,
      shipToAdd: {
        city: formData.city,
        address: formData.address,
      },
      quotationDetails: requestedProducts.map((product) => ({
        id: product.id,
        quantity: product.quantity || 1,
      })),
    }
*/

const RequestQuotationPage = ({ requestedProducts }) => {
  const { userData } = useAuth();
  const location = useLocation();
  const { supId, supplierData } = location.state;
  const [formData, setFormData] = useState({
    firstName: userData.userDetails.firstName,
    lastName: userData.userDetails.lastName,
    companyName: userData.establishmentDetails.establishmentName,
    city: userData.establishmentDetails.establishmentCity,
    address: userData.establishmentDetails.establishmentStreet,
    phoneNumber: userData.establishmentDetails.establishmentContactNumber,
    email: userData.establishmentDetails.establishmentEmail,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(""); // State for modal message

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const createQuotation = async () => {
    try {
      // Map the requestedProducts array to create the detailsItem array
      const detailsItem = requestedProducts.map((product) => ({
        productId: parseInt(product.id), // Map the product ID
        quantity: product.quantity, // Map the quantity
        price: null, // Map the price
        productName: product.name,
        productImage: product.image,
      }));
      // Construct the payload
      const payload = {
        retailerId: parseInt(userData.retailerDetails.retailerId),
        supplierId: parseInt(supId),
        retailerEstablishmentName:
          userData.establishmentDetails.establishmentName,
        supplierEstablishmentName: supplierData.supplierEstablishmentName,
        shippingAddress: userData.establishmentDetails.establishmentStreet,
        billingAddress: userData.establishmentDetails.establishmentStreet,
        quotationDetails: { detailsItem },
      };
      // Send the API request
      const response = await quotationsApi.requestQuotation(payload);
      if (response?.body?.success) {
        console.log("Quotation created successfully:", response);
        setModalMessage(`Quotation has been created`);
        setShowModal(true); // Show success modal
      } else {
        setModalMessage("Something went wrong");
        setShowModal(true);
      }
    } catch (err) {
      console.error("Error creating quotation:", err);
      setModalMessage("Something went wrong");
      setShowModal(true);
    }
  };

  // const createQuotation = () => {
  //   const newQuotation = {
  //     shipToAdd: {
  //       city: formData.city,
  //       address: formData.address,
  //     },
  //     billToAdd: formData.address,
  //     supplierAddress: "Al-Jandweel",
  //     products: requestedProducts.map((product) => ({
  //       id: product.id,
  //       name: product.title,
  //       quantity: product.quantity || 1,
  //       subtotal: 0,
  //     })),
  //   };

  //   addQuotation(newQuotation);
  // };

  return (
    <Row className="mt-4 mb-4 justify-content-between">
      <CustomModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          navigate("/retailer/manageQuotations");
        }}
        title="Application Approval"
        bodyContent={modalMessage}
        onCloseText="Close"
      />
      <Col md={5}>
        <h4 className="fw-bold">Billing Information</h4>
        <Form style={{ width: "100%" }}>
          <div className="d-flex gap-4 justify-content-between">
            <Form.Group controlId="firstName" className="mb-3 w-100">
              <Form.Label className="mb-0 fw-bold">First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled
              />
            </Form.Group>
            <Form.Group controlId="lastName" className="mb-3 w-100">
              <Form.Label className="mb-0 fw-bold">Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Last"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled
              />
            </Form.Group>
          </div>

          <Form.Group controlId="companyName" className="mb-3 w-100">
            <Form.Label className="mb-0 fw-bold">Company Name</Form.Label>
            <Form.Control
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              disabled
            />
          </Form.Group>

          <div className="d-flex gap-4 justify-content-between">
            <Form.Group controlId="city" className="mb-3 w-100">
              <Form.Label className="mb-0 fw-bold">City</Form.Label>
              <Form.Control
                type="text"
                placeholder="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled
              />
            </Form.Group>
            <Form.Group controlId="address" className="mb-3 w-100">
              <Form.Label className="mb-0 fw-bold">Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled
              />
            </Form.Group>
          </div>

          <Form.Group controlId="phoneNumber" className="mb-3">
            <Form.Label className="fw-bold mb-0">Phone Number</Form.Label>
            <div
              className="d-flex align-items-center border rounded px-2 py-1"
              style={{ backgroundColor: "#e9ecef" }}
            >
              <img src={jordanFlag} alt="Jordan" style={{ width: "24px" }} />
              <span style={{ padding: "0 7px", borderRight: "1px solid gray" }}>
                +962
              </span>
              <Form.Control
                type="text"
                name="phoneNumber"
                placeholder="Enter phone number"
                style={{ border: "none", outline: "none" }}
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled
              />
            </div>
          </Form.Group>

          <Form.Group controlId="email" className="mb-3">
            <Form.Label className="mb-0 fw-bold">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled
            />
          </Form.Group>
        </Form>
      </Col>

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

          {requestedProducts.map((product) => (
            <Row key={product.id} className="align-items-center py-2">
              <Col md={4}>
                <img
                  src={product.image}
                  style={{
                    width: "30%",
                    objectFit: "contain",
                    marginRight: "30px",
                  }}
                />
                {product.title}
              </Col>
              <Col xs={4} className="text-center">
                {product.quantity}
              </Col>
              <Col xs={4} className="text-end">
                To be determined
              </Col>
            </Row>
          ))}

          <Row className="fw-bold mt-2 pt-2 border-top">
            <Col xs={6}>Subtotal</Col>
            <Col xs={6} className="text-end">
              To be determined
            </Col>
          </Row>
          <Row className="fw-bold mt-2">
            <Col xs={6}>Shipping</Col>
            <Col xs={6} className="text-end">
              To be determined
            </Col>
          </Row>
          <Row className="fw-bold mt-2">
            <Col xs={6}>Total</Col>
            <Col xs={6} className="text-end">
              To be determined
            </Col>
          </Row>
        </div>

        <Button
          onClick={createQuotation}
          variant="dark"
          style={{
            boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
            borderRadius: "3px",
          }}
          className="w-100 py-2 fw-bold fs-6 mt-3"
        >
          Request Quotation
        </Button>
      </Col>
    </Row>
  );
};

export default RequestQuotationPage;
