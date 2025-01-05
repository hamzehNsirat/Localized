import AppColors from "../../Theme/AppColors";
import userIcon from "../../../assets/user.png";
import { Row, Col, Card } from "react-bootstrap";
import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";
import StatusColors from "../../Theme/StatusColors";
import applicationStatus from "../../Models/ApplicationStatus";
import { useNavigate } from "react-router-dom";
import userType from "../../Models/UserType";
import applicationsApi from "../../../api/adminAPIs/applications";
const Applications = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [applications, setApplications] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const payload = {
          pageSize: 5,
          pageIndex: currentPage,
        };
        const response = await applicationsApi.getApplicationsList(payload);
        if (response?.body?.success) {
          setApplications(
            response.body.applicationList.applicationItem.reduce(
              (acc, application) => {
                acc[application.id] = {
                  id: application.id,
                  estName: application.establishmentName,
                  logo: application.establishmentLogo, // Fallback for empty descriptions
                  status: application.status,
                };
                return acc; // Always return the accumulator
              },
              {}
            )
          );
        } else {
          console.error("error fetching applications ", response);
        }
      } catch (err) {
        console.error("error fetching applications ", err);
      }
    };

    fetchApplications();
  }, [currentPage]);

  const handleSearch = () => {
    setFilteredProducts([]);
    // setCurrentPage(1); // Reset to the first page after searching
  };

  return (
    <>
      <div className="d-flex justify-content-between g-2 align-items-center w-100">
        <h3 className="fw-bold">Applications</h3>
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
        />
      </div>
      <div className="px-0 py-4">
        {Object.keys(applications).length !== 0 ? (
          Object.keys(applications).map((key) => {
            const application = applications[key];
            return (
              <Card
                key={application.id}
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
                          #{application.id}
                        </Card.Title>
                      </Col>
                      <Col md={2}>
                        <img
                          src={application.logo}
                          alt={application.estName}
                          style={{ width: "100%", objectFit: "contain" }}
                        ></img>
                      </Col>
                      <Col>
                        <p
                          className="fw-bold mb-0 w-100"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {application.estName}
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
                          const appId = application.id;
                          const status = application.status;
                          navigate(
                            `/admin/applications/application/${application.id}`,
                            {
                              state: { appId, status },
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
                            StatusColors.applicationStatus[application.status],
                          color: "white",
                          borderRadius: "3px",
                          textAlign: "center",
                        }}
                      >
                        {application.status}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            );
          })
        ) : (
          <h3 className="d-flex align-content-center justify-content-center mt-5 text-muted">
            No applications yet!
          </h3>
        )}
      </div>
    </>
  );
};

export default Applications;
