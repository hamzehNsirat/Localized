import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { Card, Container, Row, Col } from "react-bootstrap";
import AppColors from "../../Theme/AppColors.jsx";
import getStatusColor from "../../Utils/getStatusColor.js";
import quotationStatus from "../../Models/QuotationStatus.jsx";
import companyLogo from "../../../assets/companyLogo.png";

import { filterProducts } from "../services/productService";
import StatusColors from "../../Theme/StatusColors.jsx";
import { useAuth } from "../../Providers/authProvider.jsx";
import quotationsApi from "../../../api/supplierAPIs/quotations.js";
import LoadingScreen from "../../Common/LoadingScreen.jsx";

/* 
  getQuotationsBySupId: {pageSize:, pageNumber: supId }: list of Quos with id, retLogo, retailStore, status
  viewQuotationById: {quoId} returns quotation data
*/

const ManageQuotationsPage = () => {
  const navigate = useNavigate();

  const { userData } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  var [quotations, setQuotations] = useState({});
  const [loading, setLoading] = useState(true); // when its null it will be loading to fetch the data
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuotations = async () => {
      const supId = parseInt(userData.supplierDetails.supplierId);
      try {
        const payload = {
          supplierId: supId,
          pageSize: 5,
          pageIndex: currentPage,
        };
        const response = await quotationsApi.getQuotationsList(payload);
        if (response.body.success) {
          setQuotations(
            response.body.quotationsList.quotationItem.reduce(
              (acc, quotation) => {
                acc[quotation.id] = {
                  id: quotation.id,
                  retName: quotation.retailStoreName,
                  logo: quotation.logo || "No image available",
                  statusId: quotation.status,
                };
                return acc;
              },
              {}
            )
          );
        } else console.log("idk: ", response);
      } catch (err) {
        setError("Failed to fetch quotations.", err);
        console.log("Failed to fetch quotations.", err);
      } finally {
        setLoading(false); // Stop the loading screen
      }
    };
    fetchQuotations();
  }, [currentPage]);

  if (loading) return <LoadingScreen />;

  return (
    <Container className="p-4">
      <h2 className="fw-bold mt-4 mb-4">Quotations</h2>
      {Object.keys(quotations).length !== 0 ? (
        Object.keys(quotations).map((key) => {
          const quotation = quotations[key];
          const quotationStatusName =
            quotationStatus.Supplier[quotation.statusId];
          return (
            <Card
              key={quotation.id}
              className="mb-4 px-2 py-2"
              style={{
                borderRadius: "10px",
                border: "0",
                backgroundColor: AppColors.backgroundColor,
                boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Card.Body>
                <Row className="d-flex align-items-center justify-content-between">
                  <Col
                    xs={6}
                    className="d-flex justify-content-between align-items-center gap-4"
                  >
                    <Card.Title className="fw-bold mb-0">
                      #{quotation.id}
                    </Card.Title>
                    <img
                      src={quotation.logo}
                      alt={quotation.retName}
                      style={{ width: "15%", objectFit: "contain" }}
                    ></img>
                    <p
                      className="fw-bold mb-0 w-100"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {quotation.retName}
                    </p>
                  </Col>
                  <Col
                    xs={5}
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
                        const quoId = quotation.id;
                        if (quotationStatusName === "New Request") {
                          navigate(
                            `/supplier/manageQuotations/${quotation.id}/newRequest`,
                            { state: { quoId } }
                          );
                        } else if (quotationStatusName) {
                          navigate(
                            `/supplier/manageQuotations/${quotation.id}`,
                            { state: { quoId } }
                          );
                        }
                      }}
                    >
                      {"View Quotation"}
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
                      {quotationStatusName}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          );
        })
      ) : (
        <h3 className="d-flex align-content-center justify-content-center mt-5 text-muted">
          No quotations requested yet!
        </h3>
      )}
    </Container>
  );
};

export default ManageQuotationsPage;
