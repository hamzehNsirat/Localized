import AppColors from "../../Theme/AppColors";
import userIcon from "../../../assets/user.png";
import { Row, Col, Card } from "react-bootstrap";
import SearchBar from "../components/SearchBar";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { categories } from "../../Models/Categories";
const Categories = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApplications, setFilteredApplications] = useState([]);

  const handleSearch = () => {
    setFilteredProducts([]);
    // setCurrentPage(1); // Reset to the first page after searching
  };

  return (
    <>
      <div className="d-flex justify-content-between g-2 align-items-center w-100">
        <h3 className="fw-bold">Categories</h3>
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
        />
      </div>
      <div className="px-0 py-4">
        {categories.map((category, index) => (
          <Card
            key={index + 1}
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
                      #{index + 1}
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
                      {category.name}
                    </p>
                  </Col>
                  <Col md="auto">
                    <p className="mb-0 w-100" style={{ fontSize: "0.9rem" }}>
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
                      navigate(`/admin/categories/category/${index + 1}`, {
                        state: { category },
                      });
                    }}
                  >
                    {"Edit"}
                  </a>
                  {/* <div
                    className="d-inline-block text-dark mx-3"
                    style={{
                      width: "1px",
                      height: "30px",
                      backgroundColor: "#9A9A9A",
                    }}
                  ></div>
                  industryTypes.subCategories = body.subCategories;
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
                  </a> */}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Categories;
