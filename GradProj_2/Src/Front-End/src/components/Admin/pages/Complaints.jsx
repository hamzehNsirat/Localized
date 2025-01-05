import AppColors from "../../Theme/AppColors";
import userIcon from "../../../assets/user.png";
import { Row, Col, Card } from "react-bootstrap";
import SearchBar from "../components/SearchBar";
import { useState } from "react";
import StatusColors from "../../Theme/StatusColors";
import complaintStatus from "../../Models/complaintStatus";
import { useNavigate, useLocation } from "react-router-dom";
const Complaints = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApplications, setFilteredApplications] = useState([]);

  const handleSearch = () => {
    setFilteredProducts([]);
    // setCurrentPage(1); // Reset to the first page after searching
  };

  const complaints = {
    1: {
      id: 51,
      title: "complaint_title",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      statusId: 1,
    },
    2: {
      id: 52,
      title: "complaint_title",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      statusId: 2,
    },
    3: {
      id: 5309,
      title: "complaint_title",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      statusId: 3,
    },
    4: {
      id: 5319,
      title: "complaint_title",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      statusId: 4,
    },
    5: {
      id: 5509,
      userImg: userIcon,
      title: "complaint_title",

      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      statusId: 4,
    },
  };
  return (
    <>
      <div className="d-flex justify-content-between g-2 align-items-center w-100">
        <h3 className="fw-bold">Complaints</h3>
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
        />
      </div>
      <div className="px-0 py-4">
        {Object.keys(complaints).length !== 0 ? (
          Object.keys(complaints).map((key) => {
            const complaint = complaints[key];
            return (
              <Card
                key={complaint.id}
                className="mb-4 px-3 py-0"
                style={{
                  borderRadius: "10px",
                  border: "0",
                  backgroundColor: AppColors.backgroundColor,
                  boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Card.Body>
                  <Row className="d-flex align-items-center justify-content-between">
                    <Col
                      xs={6}
                      className="d-flex justify-content-between align-items-center gap-4"
                    >
                      <Col md={2}>
                        <Card.Title className="fw-bold mb-0">
                          #{complaint.id}
                        </Card.Title>
                      </Col>
                      <Col md={4}>
                        <p
                          className="mb-0 w-100"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {complaint.title}
                        </p>
                      </Col>
                      <Col>
                        <p
                          className="mb-0 w-100"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {complaint.date}
                        </p>
                      </Col>
                    </Col>
                    <Col
                      xs={4}
                      className="d-flex align-items-center justify-content-between gap-3"
                    >
                      <a
                        className="fw-bold mb-0 w-100"
                        style={{
                          fontSize: "0.8rem",
                          color: "black",
                          cursor: "pointer",
                          textAlign: "center",
                        }}
                        onClick={() => {
                          navigate(
                            `/admin/complaints/complaint/${complaint.id}`,
                            {
                              state: { complaint },
                            }
                          );
                        }}
                      >
                        {"View"}
                      </a>
                      <div
                        className="fw-bold mb-0"
                        style={{
                          fontSize: "0.8rem",
                          width: "100%",
                          padding: "8px 10px",
                          backgroundColor:
                            StatusColors.complaintStatus[
                              complaintStatus[complaint.statusId]
                            ],
                          color: "white",
                          borderRadius: "3px",
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
            No complaint requested yet!
          </h3>
        )}
      </div>
    </>
  );
};

export default Complaints;
