import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Toast,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import AppColors from "../../Theme/AppColors";
import quotationStatus from "../../Models/QuotationStatus";
import getStatusColor from "../../Utils/getStatusColor";
import { useEffect, useState } from "react";
import quotationsApi from "../../../api/supplierAPIs/quotations";
import LoadingScreen from "../../Common/LoadingScreen";
import EditableModal from "../components/EditableModal";
import ConfirmationModal from "../../Common/ConfirmationModal";
import CustomModal from "../../Common/CustomModal";
import { toast } from "react-toastify";

/* 
  getQuotationData:{quoId:}
  rejectQuotation:{quoId:, statusId:}
  SubmitQuotation:{quoId:, statusId:, quoData to be updated}
*/

const NewRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [quotation, setQuotations] = useState(null);
  const [loading, setLoading] = useState(true); // when its null it will be loading to fetch the data
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAccpetModal, setShowAccpetModal] = useState(false);

  const [modalContext, setModalContext] = useState(null); // Context for the modal
  const [modalValue, setModalValue] = useState("");

  const { quoId } = location.state;

  useEffect(() => {
    const fetchQuotationDetails = async () => {
      try {
        const payload = { quotationId: quoId };
        const response = await quotationsApi.getQuotationDetails(payload);
        if (response?.body.success) {
          setQuotations(response.body.quotationDetails);
        }
      } catch (err) {
        console.error("error fetching quotation details", err);
      } finally {
        setLoading(false); // Stop the loading screen
      }
    };

    fetchQuotationDetails();
  }, []);

  const openModal = (context, value) => {
    setModalContext(context); // Set the context (product or shipping)
    setModalValue(value || ""); // Initialize the modal value
    setShowModal(true); // Show the modal
  };

  const handleSave = () => {
    if (modalContext === "shippingCost") {
      // Update the shipping cost
      setQuotations((prev) => ({
        ...prev,
        shippingCost: modalValue,
      }));
    } else if (modalContext?.type === "productPrice") {
      // Update the product price
      setQuotations((prev) => ({
        ...prev,
        details: {
          ...prev.details,
          detailsItem: prev.details.detailsItem.map((item) =>
            item.productId === modalContext.productId
              ? { ...item, price: modalValue }
              : item
          ),
        },
      }));
    }

    setShowModal(false); // Close the modal
    setModalContext(null);
    setModalValue("");
  };

  const handleDone = () => {
    navigate(-1);
  };

  const submitQuotation = async () => {
    if (quotation.shippingCost == null || quotation.shippingCost === "") {
      toast.error("Shipping cost should not be empty.");
      return; // Stop execution if invalid
    }

    // Check if any product price is null or empty
    const hasInvalidPrice = quotation.details.detailsItem.some(
      (product) => product.price == null || product.price === ""
    );

    if (hasInvalidPrice) {
      toast.error("Each product must have a valid price.");
      return; // Stop execution if invalid
    }
    try {
      // Dynamically build the payload from the quotation state
      const payload = {
        quotationId: parseInt(quoId),
        details: {
          detailsItem: quotation.details.detailsItem.map((product) => ({
            productId: parseInt(product.productId),
            quantity: product.quantity,
            price: product.price, // Use the current price or null if not set
            orderId: product.orderId, // Include orderId if it exists
            productName: product.productName,
            productImage: product.productImage,
          })),
        },
        quotationAttachments: null, // Include attachments if available
        shippingCost: quotation.shippingCost, // Use the current shipping cost or default to 0
        subTotal: calculateSubTotal(quotation.details.detailsItem), // Calculate the subtotal dynamically
        total: calculateTotal(
          calculateSubTotal(quotation.details.detailsItem),
          quotation.shippingCost
        ), // Calculate the total dynamically
      };

      // Call the API
      const response = await quotationsApi.submitQuotation(payload);

      if (response?.body?.success) {
        console.log("Quotation submitted successfully:", response.body);
        setShowAccpetModal(true); // Show success modal
      } else {
        console.error("Failed to submit quotation:", response.body.error);
      }
    } catch (err) {
      console.error("Error submitting quotation:", err.message);
    } finally {
      console.log("Quotation submission complete.");
      setShowAccpetModal(true); // Show success modal
    }
  };

  // Helper function to calculate subtotal
  const calculateSubTotal = (detailsItem) => {
    return detailsItem.reduce(
      (total, product) => total + (product.price * product.quantity || 0),
      0
    );
  };

  // Helper function to calculate total
  const calculateTotal = (subTotal, shippingCost) => {
    return subTotal + (shippingCost || 0);
  };

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
        setShowRejectModal(false);
        navigate("/supplier/manageQuotations");
      } else if (response.body.details.success == "false")
        console.log("error reject quotation");
    } catch (err) {
      console.error("error rejecting quotation", err);
      setError("error rejecting quotation", err);
    } finally {
      setLoading(false);
      setShowRejectModal(false);
    }
  };

  const confirmDeleteQuotation = () => {
    setShowRejectModal(true); // Show the confirmation modal
  };

  if (loading) return <LoadingScreen />;

  return (
    <Container className="p-0 mt-5 pb-3">
      <ConfirmationModal
        show={showRejectModal}
        title="Confirm Rejection"
        message="Are you sure you want to reject this quotations? This action cannot be undone."
        onConfirm={rejectQuotation}
        onCancel={() => setShowRejectModal(false)}
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />

      <CustomModal
        show={showAccpetModal}
        onHide={() => {
          setShowAccpetModal(false);
          navigate("/supplier/manageQuotations");
        }}
        title="Quotation Acceptance"
        bodyContent="Quotation have been Approved"
        onCloseText="Close"
      />
      <div className="px-0 mb-5 d-flex justify-content-between align-items-center">
        <h2 className="fw-bold">Quotation</h2>
        <h2 className="fw-bold">#{quotation.id}</h2>
      </div>

      <div className="mb-5 d-flex align-items-start justify-content-between gap-4">
        <Col className="px-0">
          <h4 className="mb-3 fw-bold">Company Info</h4>
          <div
            className="border p-3 d-flex flex-column justify-content-center"
            style={{
              backgroundColor: AppColors.grayBackground,
              borderRadius: "3px",
            }}
          >
            <h6 className="fw-bold">{"Marouf"}</h6>
            <h6 className="fw-bold">{quotation.retailStore}</h6>
            <h6
              className="fw-bold"
              style={{
                textDecoration: "underline",
                color: AppColors.primaryColor,
              }}
            >
              {quotation.retailContactNumber}
            </h6>
            {/* <h6 className="fw-bold">
              {quotation.firstName ?? "Mr" + " " + quotation.lastName ?? "Ms"}
            </h6> */}
          </div>
        </Col>
        <Col className="px-0">
          <h4 className="mb-3 fw-bold">Billing Info</h4>
          <div
            className="border p-3 d-flex flex-column justify-content-center"
            style={{
              backgroundColor: AppColors.grayBackground,
              borderRadius: "3px",
            }}
          >
            <h6 className="fw-bold">{quotation.shipToAddress.split()[0]}</h6>
            <h6 className="fw-bold mb-0">
              {quotation.shipToAddress.split()[0]}
            </h6>
          </div>
        </Col>
      </div>
      <Row className="mx-0 mb-5 w-100">
        <h4 className="mb-3 fw-bold px-0">Quotation Details</h4>
        <div
          className="px-5 justify-content-between w-100"
          style={{
            backgroundColor: AppColors.backgroundColor,
            borderRadius: "5px",

            boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          {quotation.details.detailsItem.map((product, index) => {
            return (
              <Row
                key={product.productId}
                className="py-4 align-items-center justify-content-between"
                style={{
                  borderBottom:
                    index != quotation.details.detailsItem.length - 1 &&
                    `1px solid ${AppColors.dividerLine}`,
                }}
              >
                <Col md="3" style={{ minWidth: "70%" }}>
                  <Row className="align-items-center">
                    <Col
                      md={2}
                      className="border p-0"
                      style={{ width: "12%", marginRight: "10px" }}
                    >
                      <img
                        src={product.productImage}
                        style={{ width: "100%", objectFit: "contain" }}
                      />
                    </Col>
                    <Col md={3} className="fw-bold text-center">
                      {product.productName}
                    </Col>
                    <Col md={4} className="text-center">
                      {product.quantity}
                    </Col>
                    <Col md={3} className="fw-bold text-center">
                      {product.price == null ? "null" : `${product.price} JOD`}
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
                      minWidth: "170px",
                      maxWidth: "200px",
                      boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.3)",
                    }}
                    onClick={() =>
                      openModal(
                        { type: "productPrice", productId: product.productId },
                        product.price
                      )
                    }
                  >
                    {"Set Price"}
                  </Button>
                </Col>
              </Row>
            );
          })}
        </div>
      </Row>
      <div
        className="p-3 px-4 mb-5 d-flex align-items-center justify-content-between"
        style={{
          boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
          borderRadius: "5px",
        }}
      >
        <Col md="auto" style={{ minWidth: "70%" }}>
          <Row className="align-items-center">
            <Col md={3} className="fw-bold text-center">
              {quotation.shipToAddress.split()[0]}
            </Col>
            <Col md={3} className="fw-bold text-center">
              {quotation.shipToAddress.split()[0]}
            </Col>
            <Col md={4} className="fw-bold text-center">
              {quotation.shippingCost == null
                ? "null"
                : `${quotation.shippingCost} JOD`}
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
              minWidth: "200px",
              maxWidth: "250px",
              boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.3)",
              border: "none",
            }}
            onClick={() => openModal("shippingCost", quotation.shippingCost)}
          >
            {"Set Shipping Price"}
          </Button>
        </Col>
      </div>

      <EditableModal
        show={showModal}
        title={
          modalContext?.type === "productPrice"
            ? "Set Product Price"
            : "Set Shipping Price"
        }
        label={
          modalContext?.type === "productPrice"
            ? "Price (JOD)"
            : "Shipping Cost (JOD)"
        }
        value={modalValue}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        onChange={(e) => setModalValue(parseFloat(e.target.value))}
      />
      <div className="d-flex justify-content-start">
        <Button
          variant="dark"
          className="fw-bold py-1"
          style={{
            width: "15%",
            height: "2.5rem",
            boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
            borderRadius: "3px",
          }}
          onClick={submitQuotation}
        >
          {"Send Quotation"}
        </Button>
        <Button
          variant="dark"
          className="fw-bold py-1"
          style={{
            width: "15%",
            height: "2.5rem",
            backgroundColor: "transparent",
            textDecoration: "underline",
            color: "red",
            boxShadow: "none",
            border: "none",
          }}
          onClick={confirmDeleteQuotation}
        >
          {"Reject Quotation"}
        </Button>
      </div>
    </Container>
  );
};

export default NewRequest;
