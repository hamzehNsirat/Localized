import { Container, Row, Col, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import AppColors from "../../Theme/AppColors";
import companyLogo from "../../../assets/companyLogo.png";
import { filterProducts } from "../services/productService.js";
import StatusColors from "../../Theme/StatusColors.jsx";
import complaintStatus from "../../Models/ComplaintStatus.jsx";
import LoadingScreen from "../../Common/LoadingScreen.jsx";
import { useEffect, useState } from "react";
import { useAuth } from "../../Providers/authProvider.jsx";
import complaintApi from "../../../api/supplierAPIs/complaints.js";
import { formatDateForInput } from "../../Utils/formatters.js";

const ViewComplaint = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { compId } = location.state;

  var [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true); // when its null it will be loading to fetch the data
  const [error, setError] = useState(null);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const payload = {
          complaintId: parseInt(compId),
        };
        const response = await complaintApi.getComplaintDetails(payload);
        if (response?.body.success) {
          setComplaint(response.body.complaintDetails);
        } else console.log("idk: ", response);
      } catch (err) {
        setError("Failed to fetch complaints.", err);
        console.log("Failed to fetch complaints.", err);
      } finally {
        setLoading(false); // Stop the loading screen
      }
    };
    fetchComplaint();
  }, []);

  if (loading) return <LoadingScreen />;

  const handleDone = () => {
    navigate("/supplier/complaints");
  };

  return (
    <Container className="p-0 mt-5 pb-3">
      <Row
        className="p-3 mb-4 border d-flex align-items-center justify-content-between"
        style={{
          backgroundColor: AppColors.grayBackground,
          borderRadius: "3px",
        }}
      >
        <Col md="auto">
          <Row>
            <Col
              md="auto"
              style={{ borderRight: `1px solid ${AppColors.dividerLine}` }}
            >
              <h6 className="text-muted">Complaint Id:</h6>
              <h6 className="fw-bold">#{complaint.id}</h6>
            </Col>
            <Col
              md="auto"
              style={{ borderRight: `1px solid ${AppColors.dividerLine}` }}
              className="px-3"
            >
              <h6 className="text-muted">Date:</h6>
              <h6 className="fw-bold">
                {formatDateForInput(complaint.creationDate)}
              </h6>
            </Col>
            <Col md="auto" className="px-3">
              <h6 className="text-muted">Order/Quotation Reference Number:</h6>
              <h6 className="fw-bold">#{complaint.quotationId}</h6>
            </Col>
          </Row>
        </Col>
        <Col md="auto">
          <div
            className="fw-bold"
            style={{
              fontSize: "0.8rem",
              height: "2.5rem",
              padding: "10px",
              backgroundColor:
                StatusColors.complaintStatus[complaint.complaintStatus],
              color: "white",
              borderRadius: "3px",
              textAlign: "center",
              minWidth: "170px",
              maxWidth: "200px",
            }}
          >
            {complaint.complaintStatus}
          </div>
        </Col>
      </Row>
      <Row className="mb-4 d-flex align-items-start justify-content-between gap-4">
        <Col className="px-0">
          <h4 className="mb-3 fw-bold">Complaint details</h4>
          <div
            className="border rounded p-3 d-flex flex-column justify-content-center"
            style={{
              backgroundColor: AppColors.grayBackground,
              borderRadius: "3px",
            }}
          >
            <h6 className="fw-bold">{complaint.supplier.FullName}</h6>
            <h6 className="fw-bold">{complaint.supplier.EstablishmentEmail}</h6>
            <h6
              className="fw-bold"
              style={{
                textDecoration: "underline",
                color: AppColors.primaryColor,
              }}
            >
              {complaint.supplier.EstablishmentContact}
            </h6>
            <h6 className="mb-0">Supplier</h6>
          </div>
        </Col>
        <Col className="px-0">
          <h4 className="mb-3 fw-bold">Complaint type</h4>
          <div
            className="border d-flex align-items-center p-3 fw-bold"
            style={{
              backgroundColor: AppColors.grayBackground,
              height: "2.5rem",
              borderRadius: "3px",
            }}
          >
            {complaint.title}
          </div>
        </Col>
      </Row>
      <Row className="px-0 mb-4">
        <h4 className="mb-3 fw-bold px-0">Complaint description</h4>
        <textarea
          className="border d-flex align-items-center p-3 fw-bold"
          style={{
            backgroundColor: AppColors.grayBackground,
            borderRadius: "3px",
            resize: "none",
          }}
          rows={4}
          disabled
        >
          {complaint.complaintNotes}
        </textarea>
      </Row>
      {complaint.complaintStatus == "RESOLVED" && (
        <Row className="px-0 mb-4">
          <h4
            className="mb-3 fw-bold px-0"
            style={{ color: AppColors.primaryColor }}
          >
            Resolution Note
          </h4>
          <textarea
            className="border d-flex align-items-center p-3 fw-bold"
            style={{
              backgroundColor: AppColors.grayBackground,
              borderRadius: "3px",
              resize: "none",
            }}
            rows={4}
            disabled
          >
            {complaint.resolutionNotes}
          </textarea>
        </Row>
      )}
      <Row className="d-flex justify-content-end">
        <Button
          variant="dark"
          className="fw-bold py-1"
          style={{
            width: "15%",
            height: "2.5rem",
            boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
          }}
          onClick={handleDone}
        >
          {"Back"}
        </Button>
      </Row>
    </Container>
  );
};

export default ViewComplaint;
