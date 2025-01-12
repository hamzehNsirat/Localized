import AppColors from "../../Theme/AppColors";
import userIcon from "../../../assets/user.png";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import userType from "../../Models/UserType";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import CustomButton from "../../Common/CustomButton";
import CustomInput from "../../Common/CustomInput";
import backIcon from "../../../assets/adminIcons/back.png";
import { useEffect, useState } from "react";
import LoadingScreen from "../../Common/LoadingScreen";
import penaltyApi from "../../../api/adminAPIs/penalties";

const ViewPenalty = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { penId } = location.state;

  const [loading, setLoading] = useState(true);
  const [penalty, setPenalty] = useState({});

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchpenalty = async () => {
      try {
        const payload = {
          penaltyId: parseInt(penId),
        };

        const response = await penaltyApi.viewPenalty(payload);
        if (response?.body?.success) {
          setPenalty(response.body.penaltyDetails);
          console.log("Fetched penalty successfully");
        } else console.error("Fetched penalty failed ", response);
      } catch (err) {
        console.error("Fetched penalty failed ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchpenalty();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <Container className="px-0 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">View Penalty #{penId}</h3>

        <div className="d-flex align-items-center justify-content-end gap-4 w-50">
          <img
            src={backIcon}
            alt="Back"
            style={{ cursor: "pointer", width: "40px" }}
            onClick={handleGoBack}
          ></img>
        </div>
      </div>
      <div className="d-flex align-items-center gap-3 mt-5">
        <CustomInput
          className="w-100"
          controlId="complaintId"
          label="Complaint Id"
          labelClassName="mb-0 fw-bold"
          placeholder="Search for Complaint Id"
          value={penalty.relatedComplaintId}
          disabled
        />
      </div>
      <div className="d-flex align-items-center gap-3 mt-3 w-100">
        <CustomInput
          controlId="complaintant"
          label="Complainant"
          labelClassName="fw-bold mb-0"
          className="w-100"
          value={
            penalty.submitterType == "RetailStore"
              ? penalty.retailer.establishmentName
              : penalty.supplier.establishmentName
          }
          disabled
        />
        <CustomInput
          controlId="respondent"
          label="Respondent"
          labelClassName="fw-bold mb-0"
          className="w-100"
          value={
            penalty.submitterType == "RetailStore"
              ? penalty.supplier.establishmentName
              : penalty.retailer.establishmentName
          }
          disabled
        />
      </div>
      <div className="d-flex align-items-center gap-3 mt-3 w-100">
        <Form.Group controlId="penaltyTypeId" className="w-100">
          <Form.Label className="mb-0 fw-bold">Penalty Type</Form.Label>
          <Form.Select
            name="penaltyTypeId"
            value={penalty.typeId}
            disabled
            style={{
              height: "2.5rem",
              borderRadius: "3px",
              boxShadow: "none",
              outline: "none",
            }}
          >
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
          </Form.Select>
        </Form.Group>
        <CustomInput
          controlId="penaltyWeight"
          label="Penalty Weight"
          labelClassName="fw-bold mb-0"
          className="w-100"
          value={parseFloat(penalty.weight)}
          disabled
        />
      </div>
      <div className="d-flex align-items-center gap-2 mt-3 w-100">
        <textarea
          name="penaltyNotes"
          disabled
          rows={4}
          style={{
            resize: "none",
            boxShadow: "none",
            outline: "none",
            borderRadius: "3px",
            border: "1px solid gray",
          }}
          value={penalty.notes}
          placeholder="Description"
          className="w-100 p-2"
        ></textarea>
      </div>
    </Container>
  );
};

export default ViewPenalty;
