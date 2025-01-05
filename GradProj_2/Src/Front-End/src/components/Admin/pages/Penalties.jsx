import AppColors from "../../Theme/AppColors";
import userIcon from "../../../assets/user.png";
import { Row, Col, Card } from "react-bootstrap";
import SearchBar from "../components/SearchBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../../Models/Categories";
import CustomButton from "../../Common/CustomButton";
const Penalties = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApplications, setFilteredApplications] = useState([]);

  const handleSearch = () => {
    setFilteredProducts([]);
    // setCurrentPage(1); // Reset to the first page after searching
  };

  const penalties = {
    1: {
      id: 51,
      title: "penalty_title",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      statusId: 1,
    },
    2: {
      id: 52,
      title: "penalty_title",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      statusId: 2,
    },
    3: {
      id: 5309,
      title: "penalty_title",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      statusId: 3,
    },
  };
  return (
    <>
      <div className="d-flex justify-content-between g-2 align-items-center w-100">
        <h3 className="fw-bold w-75">Penalties</h3>
        <div className="d-flex gap-3 w-100">
          <CustomButton
            label="Add"
            className="px-5"
            onClick={() => {
              navigate("/admin/penalties/newPenalty");
            }}
            style={{
              backgroundColor: AppColors.primaryColor,
              boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.2)",
              outline: "none",
            }}
          />
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
            width="w-100"
          />
        </div>
      </div>
      <div className="px-0 py-4">
        {Object.keys(penalties).length !== 0 ? (
          Object.keys(penalties).map((key) => {
            const penalty = penalties[key];
            return (
              <Card
                key={penalty.id}
                className="mb-4 px-3 py-2"
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
                          #{penalty.id}
                        </Card.Title>
                      </Col>
                      <Col md={5}>
                        <p
                          className="mb-0 w-100 fw-bold"
                          style={{
                            fontSize: "0.9rem",
                            color: AppColors.primaryColor,
                          }}
                        >
                          {penalty.title}
                        </p>
                      </Col>
                      <Col md="auto">
                        <p
                          className="mb-0 w-100"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {new Date().toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </Col>
                    </Col>
                    <Col
                      xs={4}
                      className="d-flex align-items-center justify-content-end px-4"
                    >
                      <a
                        className="fw-bold mb-0"
                        style={{
                          fontSize: "0.9rem",
                          color: "black",
                          cursor: "pointer",
                          textAlign: "center",
                          textDecoration: "none",
                        }}
                        onClick={() => {
                          const penId = penalty.id;
                          navigate(`/admin/penalties/penalty/${penalty.id}`, {
                            state: { penId },
                          });
                        }}
                      >
                        {"Edit"}
                      </a>
                      <div
                        className="d-inline-block text-dark mx-3"
                        style={{
                          width: "1px",
                          height: "30px",
                          backgroundColor: "#9A9A9A",
                        }}
                      ></div>
                      <a
                        className="fw-bold mb-0"
                        style={{
                          fontSize: "0.9rem",
                          color: "red",
                          cursor: "pointer",
                          textAlign: "center",
                          textDecoration: "none",
                        }}
                        onClick={() => {}}
                      >
                        {"Delete"}
                      </a>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            );
          })
        ) : (
          <h3 className="d-flex align-content-center justify-content-center mt-5 text-muted">
            No penalties applied yet!
          </h3>
        )}
      </div>
    </>
  );
};

export default Penalties;
