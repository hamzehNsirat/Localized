import AppColors from "../../Theme/AppColors";
import userIcon from "../../../assets/user.png";
import { Row, Col, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import StatusColors from "../../Theme/StatusColors";
import userType from "../../Models/UserType";
import { useEffect, useState } from "react";
import applicationsApi from "../../../api/adminAPIs/applications";
import industryTypes from "../../Models/IndustryTypes";
import LoadingScreen from "../../Common/LoadingScreen";
import "../styles/buttons.css";
import CustomModal from "../../Common/CustomModal";
import RegistrationBlock from "../components/RegistrationBlock";
import { formatDateForInput } from "../../Utils/formatters";

const ViewApplication = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { appId, status } = location.state;
  const [valid, setValid] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [modalMessage, setModalMessage] = useState(""); // State for modal message

  const [application, setApplication] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      const payload = {
        applicationId: parseInt(appId),
      };
      try {
        const response = await applicationsApi.getApplicationById(payload);
        if (response?.body?.success) {
          setApplication(response.body.application);
        } else console.error("error fetching application ", response);
      } catch (err) {
        console.error("error fetching application ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, []);

  const handleVerifyRegNum = async () => {
    if (valid != null) return;
    setLoading(true);

    try {
      const payload = {
        establishmentCommercialRegistrationNumber:
          application.establihsmentCommercialRegistrationNumber,
      };

      const response = await applicationsApi.checkEstablishmentEligibility(
        payload
      );
      if (response?.body?.success) {
        console.log(response.body.isValid);
        setValid(response.body.isValid);
      } else {
        console.error("error verifying reg number ", response);
        setValid(false);
      }
    } catch (err) {
      console.error("error verifying reg number ", err);
    } finally {
      setLoading(false);
    }
  };

  const approveApplication = async () => {
    try {
      setLoading(true);
      const payload = {
        applicationId: parseInt(appId),
        status: "APPROVED",
      };
      const response = await applicationsApi.updateApplicationStatus(payload);
      if (response?.body?.success) {
        console.log("approved");
        setModalMessage(`User ${application.id} has been approved.`);
        setShowModal(true); // Show success modal
      } else {
        console.error("error approving application ", response);
        setModalMessage("Something went wrong");
        setShowModal(true);
      }
    } catch (err) {
      console.error("error approving application ", err);
      setModalMessage("Something went wrong");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) return <LoadingScreen />;
  return (
    <div className="px-0 py-4">
      {/* Success Modal */}
      <CustomModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          navigate("/admin/applications");
        }}
        title="Application Approval"
        bodyContent={modalMessage}
        onCloseText="Close"
      />
      <div
        className="p-3 mb-4 border d-flex  align-items-center justify-content-between"
        style={{
          backgroundColor: AppColors.grayBackground,
          borderRadius: "3px",
        }}
      >
        <Col md="auto">
          <Row>
            <Col
              md="auto"
              style={{ borderRight: `1px solid ${AppColors.dividerLine}` }}
            >
              <h6 className="text-muted">Application Id:</h6>
              <h6 className="fw-bold">#{application.id}</h6>
            </Col>
            <Col
              md="auto"
              style={{ borderRight: `1px solid ${AppColors.dividerLine}` }}
              className="px-3"
            >
              <h6 className="text-muted">Date:</h6>
              <h6 className="fw-bold">
                {formatDateForInput(application.applicationDate)}
              </h6>
            </Col>
            <Col md="auto" className="px-3">
              <h6 className="text-muted">User Type:</h6>
              <h6 className="fw-bold">{userType[application.userType]}</h6>
            </Col>
          </Row>
        </Col>
        <Col md="auto">
          <div
            className="fw-bold"
            style={{
              fontSize: "0.8rem",
              height: "2.5rem",
              padding: "10px",
              backgroundColor: StatusColors.applicationStatus[status],
              color: "white",
              borderRadius: "3px",
              textAlign: "center",
              minWidth: "170px",
              maxWidth: "200px",
            }}
          >
            {status}
          </div>
        </Col>
      </div>
      <h4 className="mb-3 fw-bold">Company details</h4>
      <div className="mb-4 d-flex align-items-start justify-content-between gap-4">
        <Col className="px-0">
          <div
            className="border rounded p-3 d-flex flex-column justify-content-center"
            style={{
              backgroundColor: AppColors.grayBackground,
              borderRadius: "3px",
            }}
          >
            <h6 className="fw-bold">{application.establishmentName}</h6>
            <h6 className="fw-bold">{application.userEmail}</h6>
            <h6
              className="fw-bold"
              style={{
                textDecoration: "underline",
                color: AppColors.primaryColor,
              }}
            >
              {application.establishmentContactNumber}
            </h6>
            <h6 className="fw-bold">{application.establishmentEmail}</h6>
          </div>
        </Col>
        <Col className="px-0">
          <div
            className="border rounded p-3 d-flex flex-column justify-content-center"
            style={{
              backgroundColor: AppColors.grayBackground,
              borderRadius: "3px",
            }}
          >
            <h6 className="fw-bold">
              {application.firstName + " " + application.lastName}
            </h6>
            <h6 className="fw-bold">{application.establishmentCity}</h6>
            <h6 className="fw-bold">{application.establishmentStreet}</h6>
            <h6 className="fw-bold">
              {application.estbalishmentBuildingNumber}
            </h6>
          </div>
        </Col>
      </div>
      <div className="mb-4 d-flex align-items-start justify-content-between gap-4">
        <Col className="px-0">
          <h4 className="mb-3 fw-bold">Company Description</h4>
          <div
            className="border rounded p-3"
            style={{
              backgroundColor: AppColors.grayBackground,
              borderRadius: "3px",
              minHeight: "140px",
            }}
          >
            <h6 className="fw-bold">{application.establishmentDescription}</h6>
          </div>
        </Col>
        <Col className="px-0">
          <h4 className="mb-3 fw-bold">Business Categories</h4>
          <div
            className="border p-3 fw-bold"
            style={{
              backgroundColor: AppColors.grayBackground,
              borderRadius: "3px",
              minHeight: "140px",
            }}
          >
            {application.establishmentIndustryTypes.map((key) => {
              return <h6 className="fw-bold">{industryTypes[key]}</h6>;
            })}
          </div>
        </Col>
      </div>
      <div className="mb-4 d-flex align-items-start justify-content-between gap-4">
        <Col className="px-0">
          <div
            className="d-flex flex-column mt-4"
            style={{ width: "min-content" }}
          >
            <img
              src={application.establishmentLogo ?? userIcon}
              alt="User Profile"
              className="rounded mb-3"
              style={{
                width: "170px",
                height: "170px",
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "8px",
              }}
            />
          </div>
        </Col>
        <Col className="px-0">
          <h4 className="mb-3 fw-bold">Registration Number</h4>
          <RegistrationBlock
            valid={valid}
            regNumber={application.establihsmentCommercialRegistrationNumber}
            loading={loading}
            handleVerifyRegNum={handleVerifyRegNum}
          />
        </Col>
      </div>
      {status == "NEW" && (
        <div className="d-flex align-items-center justify-content-end">
          <Button
            style={{
              backgroundColor: "transparent",
              textDecoration: "underline",
              color: "red",
              border: "0",
            }}
            className="fs-6 fw-bold"
            onClick={handleGoBack}
          >
            Reject
          </Button>
          <Button
            variant="dark"
            style={{
              boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
              borderRadius: "3px",
              marginLeft: "40px",
            }}
            className="y-2 w-25 fw-bold fs-6"
            onClick={approveApplication}
          >
            Approve
          </Button>
        </div>
      )}
    </div>
  );
};

export default ViewApplication;
