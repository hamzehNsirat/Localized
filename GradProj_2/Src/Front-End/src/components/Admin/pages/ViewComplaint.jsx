import React, { useEffect, useState } from "react";
import AppColors from "../../Theme/AppColors";
import companyLogo from "../../../assets/companyLogo.png";
import { Row, Col, Form, Button, ProgressBar } from "react-bootstrap";
import StatusColors from "../../Theme/StatusColors";
import complaintStatus from "../../Models/ComplaintStatus";
import complaintApi from "../../../api/adminAPIs/complaints";
import LoadingScreen from "../../Common/LoadingScreen";
import { formatDateForInput } from "../../Utils/formatters.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Providers";
import { toast } from "react-toastify";

const ViewComplaint = () => {
  const [complaint, setComplaint] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { compId } = location.state;
  const [loading, setLoading] = useState(true); // when its null it will be loading to fetch the data
  const { userData } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        const payload = {
          complaintId: parseInt(compId),
        };
        const response = await complaintApi.getComplaintDetails(payload);
        if (response?.body?.success) {
          setComplaint(response.body.complaintDetails);
        } else console.error("failed fetching complaint ", response);
      } catch (err) {
        console.error("failed fetching complaint ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, []);

  if (loading) return <LoadingScreen />;

  const handleStatusChange = (newStatusId) => {
    setComplaint((prev) => ({
      ...prev,
      statusId: newStatusId,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplaint((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      complaintId: parseInt(complaint.id),
      resolutionNotes: complaint.resolutionNotes,
      reviewerId: parseInt(userData.adminDetails.adminId),
      complaintStatus: complaint.complaintStatus.toUpperCase(),
      submitterType: complaint.submitterType == "RETAILER" ? true : false,
    };
    console.log(payload);
    try {
      const response = await complaintApi.updateComplaint(payload);
      if (response?.body?.success) {
        toast.success(`Complaint Updated`, {
          progressStyle: { background: AppColors.primaryColor },
        });
        navigate("/admin/complaints");
      } else {
        console.error("failed updating complaint ", response);
        toast.error(`Failed to update complaint`, {
          progressStyle: { background: AppColors.primaryColor },
        });
      }
    } catch (err) {
      console.error("failed updating complaint ", err);
      toast.error(`Failed to update complaint`, {
        progressStyle: { background: AppColors.primaryColor },
      });
    } finally {
    }
  };

  return (
    <div className="px-0 py-4">
      <div
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
              <h6 className="text-muted">Quotation Id:</h6>
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
      </div>
      <div className="mb-4 d-flex align-items-start justify-content-between gap-4">
        <Col className="px-0">
          <h4 className="mb-3 fw-bold">Complaint details</h4>
          <div
            className="border rounded p-3 d-flex flex-column justify-content-center"
            style={{
              backgroundColor: AppColors.grayBackground,
              borderRadius: "3px",
            }}
          >
            <h6 className="fw-bold">
              {complaint.submitterType == "RETAILER"
                ? complaint.retailer.FullName
                : complaint.supplier.FullName}
            </h6>
            <h6 className="fw-bold">
              {complaint.submitterType == "RETAILER"
                ? complaint.retailer.EstablishmentEmail
                : complaint.supplier.EstablishmentEmail}
            </h6>
            <h6
              className="fw-bold"
              style={{
                textDecoration: "underline",
                color: AppColors.primaryColor,
              }}
            >
              {complaint.submitterType == "RETAILER"
                ? complaint.retailer.EstablishmentContact
                : complaint.supplier.EstablishmentContact}
            </h6>
            <h6 className="mb-0 fw-bold">{complaint.submitterType}</h6>
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
      </div>
      <div className="px-0 mb-4 w-100">
        <h4 className="mb-3 fw-bold px-0">Complaint description</h4>
        <textarea
          className="border d-flex align-items-center p-3 fw-bold"
          style={{
            backgroundColor: AppColors.grayBackground,
            borderRadius: "3px",
            resize: "none",
            width: "100%",
          }}
          rows={4}
          disabled
        >
          {complaint.complaintNotes}
        </textarea>
      </div>

      <div className="px-0 mb-4">
        <h4
          className="mb-3 fw-bold px-0"
          style={{ color: AppColors.primaryColor }}
        >
          Resolution Note
        </h4>
        <textarea
          name="resolutionNotes"
          className="border d-flex align-items-center p-3 fw-bold"
          style={{
            borderRadius: "3px",
            resize: "none",
            width: "100%",
            boxShadow: "none",
          }}
          rows={4}
          onChange={handleChange}
          value={complaint.resolutionNotes ?? ""}
        />
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <Form.Group controlId="complaintStatus" className="mb-3 w-25">
          <Form.Select
            value={complaint.statusId}
            name="complaintStatus"
            onChange={handleChange}
            style={{
              height: "2.5rem",
              borderRadius: "3px",
              boxShadow: "none",
              outline: "none",
            }}
          >
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </Form.Select>
        </Form.Group>
        <div className="d-flex align-items-center justify-content-end w-75">
          <Button
            variant="danger"
            style={{
              boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
              borderRadius: "3px",
              marginLeft: "40px",
            }}
            className="y-2 w-25 fw-bold fs-6"
            onClick={() => {
              navigate("/admin/penalties/newPenalty", {
                state: { complaint },
              });
            }}
          >
            Apply Penalty
          </Button>
          <Button
            variant="dark"
            style={{
              boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
              borderRadius: "3px",
              marginLeft: "40px",
            }}
            className="y-2 w-25 fw-bold fs-6"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewComplaint;
