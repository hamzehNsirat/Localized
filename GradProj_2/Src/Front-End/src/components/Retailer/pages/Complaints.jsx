import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AppColors from "../../Theme/AppColors.jsx";
import StatusColors from "../../Theme/StatusColors.jsx";
import LoadingScreen from "../../Common/LoadingScreen.jsx";
import { useAuth } from "../../Providers/authProvider.jsx";
import { formatDateForInput } from "../../Utils/formatters.js";
import complaintApi from "../../../api/retailerAPIs/complaints.js";
import complaintStatus from "../../Models/ComplaintStatus.jsx";

/* 
  getSupplierComplaintsById: {supId}: list of complaints
  getComplaintById: {compId}: complaint data
*/

const ComplaintsPage = () => {
  const navigate = useNavigate();

  var [complaints, setComplaints] = useState({});
  const [loading, setLoading] = useState(true); // when its null it will be loading to fetch the data
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchComplaints = async () => {
      const retId = parseInt(userData.retailerDetails.retailerId);
      try {
        const payload = {
          retailerId: retId,
          pageSize: 5,
          pageIndex: currentPage,
        };
        const response = await complaintApi.getComplaintsList(payload);
        if (response?.body.success) {
          setComplaints(
            response.body.complaintsList.complaintItem.reduce(
              (acc, complaint) => {
                acc[complaint.id] = {
                  id: complaint.id,
                  title: complaint.title,
                  date: complaint.date,
                  statusId: complaint.statusId,
                };
                return acc;
              },
              {}
            )
          );
        } else console.log("idk: ", response);
      } catch (err) {
        setError("Failed to fetch complaints.", err);
        console.log("Failed to fetch complaints.", err);
      } finally {
        setLoading(false); // Stop the loading screen
      }
    };
    fetchComplaints();
  }, [currentPage]);

  if (loading) return <LoadingScreen />;

  return (
    <Container className="p-4">
      <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
        <h2 className="fw-bold">Complaints</h2>
        <Button
          className="fw-bold"
          onClick={() => {
            navigate("createComplaint");
          }}
          style={{
            width: "max-content",
            padding: "5px 40px",
            backgroundColor: AppColors.primaryColor,
            boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
            border: "0",
            borderRadius: "3px",
          }}
        >
          Add New
        </Button>
      </div>
      {(Object.keys(complaints).length !== 0) != 0 ? (
        Object.keys(complaints).map((key) => {
          const complaint = complaints[key];
          return (
            <Card
              key={complaint.id}
              className="mb-4 px-2 py-2"
              style={{
                borderRadius: "10px",
                border: "0",
                boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Card.Body>
                <Row className="d-flex align-items-center justify-content-between">
                  <Col xs={6} className="d-flex align-items-center gap-5">
                    <Card.Title className="fw-bold mb-0">
                      #{complaint.id}
                    </Card.Title>
                    <p className="fw-bold mb-0" style={{ fontSize: "0.9rem" }}>
                      {complaint.title}
                    </p>
                    <p className="fw-bold mb-0" style={{ fontSize: "0.9rem" }}>
                      {formatDateForInput(complaint.date)}
                    </p>
                  </Col>
                  <Col xs={4} className="d-flex align-items-center">
                    <a
                      className="fw-bold mb-0 w-100"
                      style={{
                        fontSize: "0.9rem",
                        color: "black",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        const compId = complaint.id;
                        navigate(`/retailer/complaints/${complaint.id}`, {
                          state: { compId },
                        });
                      }}
                    >
                      View complaint
                    </a>
                    <div
                      className="fw-bold mb-0"
                      style={{
                        fontSize: "0.8rem",
                        width: "100%",
                        padding: "10px",
                        backgroundColor:
                          StatusColors.complaintStatus[
                            complaintStatus[complaint.statusId]
                          ],
                        color: "white",
                        borderRadius: "5px",
                        textAlign: "center",
                      }}
                    >
                      {complaintStatus[complaint.statusId]}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          );
        })
      ) : (
        <h3 className="d-flex align-content-center justify-content-center mt-5 text-muted">
          No complaints yet!
        </h3>
      )}
    </Container>
  );
};

export default ComplaintsPage;
