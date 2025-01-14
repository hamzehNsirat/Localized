import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useComplaints } from "../../Providers/complaintProvider.jsx";
import { useQuotations } from "../../Providers/quotationProvider.jsx";
import CustomInput from "../../Common/CustomInput.jsx";
import complaintStatus from "../../Models/ComplaintStatus.jsx";
import jordanFlag from "../../../assets/jordanFlag.png";
import CustomButton from "../../Common/CustomButton.jsx";
import { useAuth } from "../../Providers/authProvider.jsx";
import LoadingScreen from "../../Common/LoadingScreen.jsx";
import complaintApi from "../../../api/retailerAPIs/complaints.js";
import quotationsApi from "../../../api/retailerAPIs/quotations.js";
import CustomModal from "../../Common/CustomModal.jsx";
import { useNavigate } from "react-router-dom";

/* 
  getAllQuotationsByRetId: {supId}: list of quotations
  getAllComplaintTypes()
  SubmitComplaint: {supId, submitterType:"sup", quoId, compType, compDesc}
*/

const AddComplaintPage = () => {
  const { addComplaint } = useComplaints();

  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [complaintTypes, setComplaintTypes] = useState(null);
  const [complaintData, setComplaintData] = useState({
    complaintTitle: null,
    complaintTypeId: null,
    supplierId: parseInt(userData.retailerDetails.retailerId),
    retailerId: null,
    complaintNotes: null,
    quotationId: null,
    submitterType: true,
  });

  const [quotations, setQuotations] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setComplaintData({
      ...complaintData,
      [name]: value,
    });
  };

  const fetchComplaintTypes = async () => {
    try {
      const response = await complaintApi.getComplaintTypes();
      if (response?.body.success) {
        setComplaintTypes(
          response.body.complaintTypes.reduce((acc, compType) => {
            acc[compType.id] = {
              id: parseInt(compType.id),
              type: compType.type,
            };
            return acc;
          }, {})
        );
      }
    } catch (err) {
      console.error("error getting complaint types", err);
    }
  };

  const fetchSupQuotations = async () => {
    try {
      const payload = {
        retailerId: parseInt(userData.retailerDetails.retailerId),
      };
      const response = await quotationsApi.getQuotationActors(payload);
      if (response?.body?.details?.success == false) {
        setQuotations(null);
        return;
      }
      if (response?.body?.success) {
        setQuotations(
          response.body.quotationActors.quotationItem.reduce(
            (acc, quotation) => {
              acc[quotation.quotationId] = {
                id: parseInt(quotation.quotationId),
                supId: parseInt(quotation.supplierId),
                retId: parseInt(quotation.retailerId),
              };
              return acc;
            },
            {}
          )
        );
      } else console.log("idk: ", response);
    } catch (err) {
      console.error("error fetching retailer's quotations ", err);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await fetchComplaintTypes();
      await fetchSupQuotations();
      setLoading(false);
    };

    initializeData();
  }, []);

  const createComplaint = async () => {
    try {
      const payload = {
        complaintTitle: complaintTypes[complaintData.complaintTypeId].type,
        complaintTypeId: parseInt(complaintData.complaintTypeId),
        quotationId: parseInt(complaintData.quotationId),
        retailerId: parseInt(userData.retailerDetails.retailerId),
        supplierId: parseInt(quotations[complaintData.quotationId].supId),
        complaintNotes:
          complaintData.complaintNotes == ""
            ? null
            : complaintData.complaintNotes,
        submitterType: true,
      };
      const response = await complaintApi.createComplaint(payload);
      if (response?.body?.success) {
        console.error("Complaint created successfully ");
        setShowModal(true);
      } else console.error("failed creating complaint ", response);
    } catch (err) {
      console.error("failed creating complaint ", err);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  if (loading) return <LoadingScreen />;
  return (
    <Container className="p-4">
      <CustomModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          navigate("/retailer/complaints");
        }}
        title="Complaint Creation"
        bodyContent="Complaint has been created"
        onCloseText="Close"
      />
      <h2 className="fw-bold mt-4 mb-4">Complaint</h2>
      <Row className="mt-4 justify-content-between">
        <Col md={5}>
          <Form style={{ width: "100%" }}>
            <CustomInput
              controlId="companyName"
              className="mb-3 w-100"
              label="Complaint Issuer"
              type="text"
              placeholder="Retailer"
              disabled
            />

            <CustomInput
              controlId="name"
              className="mb-3"
              label="Name"
              placeholder="Auto filled name"
              value={userData.userDetails.firstName}
              disabled
            />
            <CustomInput
              controlId="email"
              className="mb-3"
              label="Email"
              type="email"
              placeholder="Email"
              value={userData.userDetails.userEmail}
              disabled
            />

            <Form.Group controlId="phoneNumber" className="mb-3">
              <Form.Label className="fw-bold mb-0">Phone Number</Form.Label>
              <div
                className="d-flex align-items-center border px-2 py-1"
                style={{
                  borderRadius: "3px",
                  height: "2.5rem",
                  backgroundColor: "#E9ECEF",
                }}
              >
                <img src={jordanFlag} alt="Jordan" style={{ width: "24px" }} />
                <span
                  style={{ padding: "0 7px", borderRight: "1px solid gray" }}
                >
                  +962
                </span>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  style={{ border: "none", outline: "none", boxShadow: "none" }}
                  value={userData.userDetails.userPhone}
                  disabled
                />
              </div>
            </Form.Group>

            <Form.Group controlId="quotationId" className="mb-3">
              <Form.Label className="mb-0 fw-bold">
                Order/Quotation Reference Number
              </Form.Label>
              <Form.Select
                value={complaintData.quotationId ?? "Not Selected"}
                onChange={handleInputChange}
                name="quotationId"
                style={{
                  height: "2.5rem",
                  borderRadius: "3px",
                  boxShadow: "none",
                }}
              >
                <option value="select quotation">Select a Quotation</option>
                {quotations &&
                  Object.values(quotations).map((quotation) => (
                    <option key={quotation.id} value={quotation.id}>
                      #{quotation.id}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Col>

        <Col md={6}>
          <Form className="d-flex flex-column justify-content-end">
            <Form.Group controlId="complaintTypeId" className="mb-3">
              <Form.Label className="mb-0 fw-bold">Complaint Type</Form.Label>
              <Form.Select
                value={complaintData.complaintTypeId || ""}
                onChange={handleInputChange}
                name="complaintTypeId"
                style={{
                  height: "2.5rem",
                  borderRadius: "3px",
                  boxShadow: "none",
                }}
              >
                <option value="">Select a Complaint Type</option>
                {complaintTypes &&
                  Object.values(complaintTypes).map((compType) => (
                    <option value={compType.id} key={compType.id}>
                      {compType.type || "Unknown Type"}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="complaintNotes" className="mb-3">
              <Form.Label className="mb-0 fw-bold">
                Complaint Description
              </Form.Label>
              <Form.Control
                as="textarea"
                name="complaintNotes"
                rows={3}
                value={complaintData.complaintNotes || ""}
                onChange={handleInputChange}
                style={{
                  borderRadius: "3px",
                  resize: "none",
                  boxShadow: "none",
                }}
              />
            </Form.Group>
          </Form>
          <CustomButton
            label="Submit"
            onClick={createComplaint}
            className="w-25 py-2 fw-bold mt-2"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AddComplaintPage;
