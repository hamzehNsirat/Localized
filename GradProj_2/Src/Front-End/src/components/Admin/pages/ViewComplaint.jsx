import React, { useState } from "react";
import AppColors from "../../Theme/AppColors";
import companyLogo from "../../../assets/companyLogo.png";
import { Row, Col, Form, Button } from "react-bootstrap";
import StatusColors from "../../Theme/StatusColors";
import complaintStatus from "../../Models/ComplaintStatus";

const fetchedQuotation = {
  id: 1,
  retailerId: "500",
  supplierId: "123",
  statusId: 4,
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
  products: [],
  subtotal: 0,
  shipping: 0,
  total: 0,
  paymentMethod: "Cash",
};

const initialComplaint = {
  id: 1,
  quotationId: 1,
  statusId: 1,
  date: new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  type: "Order",
  description: "This is a sample complaint description.",
  resolutionNote: "This is a sample resolution note.",
};

const ViewComplaint = () => {
  const [complaint, setComplaint] = useState(initialComplaint);

  const handleStatusChange = (newStatusId) => {
    setComplaint((prev) => ({
      ...prev,
      statusId: newStatusId,
    }));
  };

  const handleSubmit = () => {
    console.log("Complaint Updated:", complaint);
    // Handle submission logic here, such as API call
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
              <h6 className="fw-bold">{complaint.date}</h6>
            </Col>
            <Col md="auto" className="px-3">
              <h6 className="text-muted">Quotation Id:</h6>
              <h6 className="fw-bold">#{fetchedQuotation.id}</h6>
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
                StatusColors.complaintStatus[
                  complaintStatus[complaint.statusId]
                ],
              color: "white",
              borderRadius: "3px",
              textAlign: "center",
              minWidth: "170px",
              maxWidth: "200px",
            }}
          >
            {complaintStatus[complaint.statusId]}
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
              {fetchedQuotation.firstName + " " + fetchedQuotation.lastName}
            </h6>
            <h6 className="fw-bold">{fetchedQuotation.retEmail}</h6>
            <h6
              className="fw-bold"
              style={{
                textDecoration: "underline",
                color: AppColors.primaryColor,
              }}
            >
              {fetchedQuotation.retPhoneNumber}
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
            {complaint.type}
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
          {complaint.description}
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
          className="border d-flex align-items-center p-3 fw-bold"
          style={{
            borderRadius: "3px",
            resize: "none",
            width: "100%",
            boxShadow: "none",
          }}
          rows={4}
          // onChange={()}
          value={complaint.resolutionNote}
        />
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <Form.Group controlId="status" className="mb-3 w-25">
          <Form.Select
            value={complaint.statusId}
            onChange={(e) => handleStatusChange(Number(e.target.value))}
            style={{
              height: "2.5rem",
              borderRadius: "3px",
              boxShadow: "none",
              outline: "none",
            }}
          >
            <option value="1">New</option>
            <option value="2">Under Review</option>
            <option value="3">Resolved</option>
            <option value="4">Rejected</option>
          </Form.Select>
        </Form.Group>
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
  );
};

export default ViewComplaint;
