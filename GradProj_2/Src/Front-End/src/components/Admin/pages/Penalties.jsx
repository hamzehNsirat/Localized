import AppColors from "../../Theme/AppColors";
import userIcon from "../../../assets/user.png";
import { Row, Col, Card, Toast } from "react-bootstrap";
import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../../Models/Categories";
import CustomButton from "../../Common/CustomButton";
import LoadingScreen from "../../Common/LoadingScreen";
import { formatDateForInput } from "../../Utils/formatters.js";
import penaltyApi from "../../../api/adminAPIs/penalties";
import ConfirmationModal from "../../Common/ConfirmationModal.jsx";
import { toast } from "react-toastify";

const Penalties = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [penalties, setPenalties] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState("No penalties yet!");
  const [loading, setLoading] = useState(true); // when its null it will be loading to fetch the data
  const [totalPenalties, setTotalPenalties] = useState(0); // Track next page availability
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [selectedPenaltyId, setSelectedPenaltyId] = useState(null); // Track selected penalty

  const penaltyPerPage = 5;

  useEffect(() => {
    const fetchpenalties = async () => {
      try {
        setLoading(true);
        const payload = {
          pageSize: penaltyPerPage,
          pageIndex: currentPage,
        };

        const response = await penaltyApi.getPenaltiesList(payload);
        if (response?.body?.success) {
          setPenalties(
            response.body.penaltiesList.penaltyItem.reduce((acc, penalty) => {
              acc[penalty.id] = {
                id: penalty.id,
                date: formatDateForInput(penalty.date),
                title: penalty.title,
                statusId: penalty.statusId,
              };
              return acc;
            }, {})
          );
          if (totalPenalties == 0)
            setTotalPenalties(parseInt(response.body.totalRecordsCount));
        } else {
          setMessage("No more penalties available!");
          setPenalties({});
          console.error("error fetching penalties ", response);
        }
      } catch (err) {
        console.error("error fetching penalties ", err);
        if (err?.response?.data?.body?.details.success == false) {
          setMessage("No more penalties available!");
          setPenalties({});
        }
      } finally {
        setLoading(false);
      }
    };

    fetchpenalties();
  }, [currentPage]);

  const handleSearch = () => {
    setFilteredProducts([]);
    // setCurrentPage(1); // Reset to the first page after searching
  };

  const handleDeletePenalty = async () => {
    try {
      const payload = {
        penaltyId: parseInt(selectedPenaltyId),
      };
      const response = await penaltyApi.deletePenalty(payload);
      if (response?.body?.success) {
        toast.success(`Penalty Deleted Successfully`, {
          progressStyle: { background: AppColors.primaryColor },
        });
      } else {
        console.error("Failed Penalty Deletion ", response);
        toast.error(`Failed Penalty Deletion`, {
          progressStyle: { background: AppColors.primaryColor },
        });
      }
    } catch (err) {
      console.error("Failed Penalty Deletion ", err);
      toast.error(`Failed Penalty Deletion`, {
        progressStyle: { background: AppColors.primaryColor },
      });
    } finally {
      setShowModal(false); // Close the modal after attempting deletion
    }
  };

  const confirmDeletePenalty = (penId) => {
    setSelectedPenaltyId(penId); // Set the selected penalty ID
    setShowModal(true); // Show the confirmation modal
  };

  if (loading) return <LoadingScreen />;
  return (
    <>
      <div className="d-flex justify-content-between g-2 align-items-center w-100">
        <h3 className="fw-bold w-75">Penalties</h3>
        <div className="d-flex gap-3 w-100">
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
                          {formatDateForInput(penalty.date)}
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
                        onClick={() => confirmDeletePenalty(penalty.id)}
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
      <ConfirmationModal
        show={showModal}
        title="Confirm Deletion"
        message="Are you sure you want to delete this penalty? This action cannot be undone."
        onConfirm={handleDeletePenalty}
        onCancel={() => setShowModal(false)}
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default Penalties;
