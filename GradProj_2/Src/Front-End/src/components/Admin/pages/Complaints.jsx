import AppColors from "../../Theme/AppColors";
import userIcon from "../../../assets/user.png";
import { Row, Col, Card } from "react-bootstrap";
import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";
import StatusColors from "../../Theme/StatusColors";
import complaintStatus from "../../Models/complaintStatus";
import { useNavigate } from "react-router-dom";
import complaintApi from "../../../api/adminAPIs/complaints";
import LoadingScreen from "../../Common/LoadingScreen";
import { formatDateForInput } from "../../Utils/formatters.js";

const Complaints = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState("No users yet!");
  const [loading, setLoading] = useState(true); // when its null it will be loading to fetch the data
  const [totalComplaints, setTotalComplaints] = useState(0); // Track next page availability

  const complaintPerPage = 5;

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const payload = {
          pageSize: complaintPerPage,
          pageIndex: currentPage,
        };

        const response = await complaintApi.getComplaintsList(payload);
        if (response?.body?.success) {
          setComplaints(
            response.body.complaintsList.complaintItem.reduce(
              (acc, complaint) => {
                acc[complaint.id] = {
                  id: complaint.id,
                  date: formatDateForInput(complaint.date),
                  title: complaint.title,
                  status: complaint.status,
                };
                return acc;
              },
              {}
            )
          );
          if (totalComplaints == 0)
            setTotalComplaints(parseInt(response.body.totalRecordsCount));
        } else {
          setMessage("No more complaints available!");
          setComplaints({});
          console.error("error fetching complaints ", response);
        }
      } catch (err) {
        console.error("error fetching complaints ", err);
        if (err?.response?.data?.body?.details.success == false) {
          setMessage("No more complaints available!");
          setComplaints({});
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [currentPage]);

  const handleSearch = () => {
    setFilteredProducts([]);
    // setCurrentPage(1); // Reset to the first page after searching
  };

  if (loading) return <LoadingScreen />;
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
                          const compId = complaint.id;
                          navigate(
                            `/admin/complaints/complaint/${complaint.id}`,
                            {
                              state: { compId },
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
                            StatusColors.complaintStatus[complaint.status],
                          color: "white",
                          borderRadius: "3px",
                          textAlign: "center",
                        }}
                      >
                        {complaint.status}
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
