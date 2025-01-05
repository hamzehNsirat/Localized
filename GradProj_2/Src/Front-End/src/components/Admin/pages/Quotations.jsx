import AppColors from "../../Theme/AppColors";
import userIcon from "../../../assets/user.png";
import { Row, Col, Card } from "react-bootstrap";
import SearchBar from "../components/SearchBar";
import { useState } from "react";
import StatusColors from "../../Theme/StatusColors";
import quotationStatus from "../../Models/QuotationStatus";
import { useLocation, useNavigate } from "react-router-dom";

const Quotations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApplications, setFilteredApplications] = useState([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    setFilteredProducts([]);
    // setCurrentPage(1); // Reset to the first page after searching
  };

  const quotations = {
    1: {
      id: 51,
      userImg: userIcon,
      estName: "Retailer1",
      statusId: 1,
    },
    2: {
      id: 52,
      userImg: userIcon,
      estName: "Supplier2",
      statusId: 2,
    },
    3: {
      id: 5309,
      userImg: userIcon,
      estName: "Supplier3",
      statusId: 3,
    },
    4: {
      id: 5319,
      userImg: userIcon,
      estName: "Supplier3",
      statusId: 4,
    },
    5: {
      id: 5509,
      userImg: userIcon,
      estName: "Supplier3",
      statusId: 5,
    },
  };
  return (
    <>
      <div className="d-flex justify-content-between g-2 align-items-center w-100">
        <h3 className="fw-bold">Quotations</h3>
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          width="w-50"
        />
      </div>
      <div className="px-0 py-4">
        {Object.keys(quotations).length !== 0 ? (
          Object.keys(quotations).map((key) => {
            const quotation = quotations[key];
            return (
              <Card
                key={quotations.id}
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
                          #{quotation.id}
                        </Card.Title>
                      </Col>
                      <Col md={2}>
                        <img
                          src={quotation.userImg}
                          alt="img"
                          style={{ width: "60%", objectFit: "contain" }}
                        ></img>
                      </Col>
                      <Col>
                        <p
                          className="fw-bold mb-0 w-100"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {quotation.estName}
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
                            `/admin/quotations/quotation/${quotation.id}`,
                            {
                              state: { quotation },
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
                            StatusColors.quotationStatus[
                              quotationStatus.Supplier[quotation.statusId]
                            ],
                          color: "white",
                          borderRadius: "3px",
                          textAlign: "center",
                        }}
                      >
                        {quotationStatus.Supplier[quotation.statusId]}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            );
          })
        ) : (
          <h3 className="d-flex align-content-center justify-content-center mt-5 text-muted">
            No quotation requested yet!
          </h3>
        )}
      </div>
    </>
  );
};

export default Quotations;
