import AppColors from "../../Theme/AppColors";
import userIcon from "../../../assets/user.png";
import { Row, Col, Card } from "react-bootstrap";
import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";
import StatusColors from "../../Theme/StatusColors";
import quotationStatus from "../../Models/QuotationStatus";
import { useLocation, useNavigate } from "react-router-dom";
import quotationApi from "../../../api/adminAPIs/quotations";
import LoadingScreen from "../../Common/LoadingScreen";
import PaginationComponent from "../../Common/PaginationComponent";

const Quotations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState("No quotations yet!");
  const [loading, setLoading] = useState(true); // when its null it will be loading to fetch the data
  const [totalQuotations, setTotalQuotations] = useState(0); // Track next page availability

  const quotationPerPage = 5;

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        setLoading(true);
        const payload = {
          pageSize: quotationPerPage,
          pageIndex: currentPage,
        };

        const response = await quotationApi.getQuotationsList(payload);
        if (response?.body?.success) {
          setQuotations(
            response.body.quotationsList.quotationItem.reduce(
              (acc, quotation) => {
                acc[quotation.id] = {
                  id: quotation.id,
                  image: quotation.logo,
                  name: quotation.retailStoreName,
                  statusId: parseInt(quotation.statusId),
                };
                return acc;
              },
              {}
            )
          );
          if (totalQuotations == 0)
            setTotalQuotations(parseInt(response.body.totalRecordsCount));
        } else {
          setMessage("No more quotations available!");
          setQuotations({});
          console.error("error fetching quotations ", response);
        }
      } catch (err) {
        console.error("error fetching quotations ", err);
        if (err?.response?.data?.body.details.success == false) {
          setMessage("No more quotations available!");
          setQuotations({});
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, [currentPage]);

  const handleSearch = () => {
    setFilteredProducts([]);
    // setCurrentPage(1); // Reset to the first page after searching
  };

  if (loading) return <LoadingScreen />;
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
                          src={quotation.image}
                          alt={quotation.name}
                          style={{ width: "60%", objectFit: "contain" }}
                        ></img>
                      </Col>
                      <Col>
                        <p
                          className="fw-bold mb-0 w-100"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {quotation.name}
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
                          const quoId = quotation.id;
                          navigate(
                            `/admin/quotations/quotation/${quotation.id}`,
                            {
                              state: { quoId },
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
                              quotationStatus.Retailer[quotation.statusId]
                            ],
                          color: "white",
                          borderRadius: "3px",
                          textAlign: "center",
                        }}
                      >
                        {quotationStatus.Retailer[quotation.statusId]}
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
        <PaginationComponent
          currentPage={currentPage}
          totalPages={Math.ceil(totalQuotations / quotationPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default Quotations;
