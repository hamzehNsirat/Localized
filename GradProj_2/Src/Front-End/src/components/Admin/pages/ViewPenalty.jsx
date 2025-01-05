import AppColors from "../../Theme/AppColors";
import userIcon from "../../../assets/user.png";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import userType from "../../Models/UserType";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import CustomButton from "../../Common/CustomButton";
import CustomInput from "../../Common/CustomInput";

const penalty = {
  id: 30,
  complaintId: 20,
  supplier_id: 10,
  retailer_id: 1,
  submitter_type: 0,
  type: "",
  weight: 0.01,
  comment: "",
};

const ViewPenalty = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { penId } = location.state || {};

  const justView = penId ?? false;

  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <Container className="px-0 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Penalty #{penalty.id}</h3>

        <div className="d-flex align-items-center justify-content-end gap-4 w-50">
          <ArrowLeftCircle
            size={40}
            color="white"
            style={{
              backgroundColor: "#262626",
              borderRadius: "100%",
              cursor: "pointer",
            }}
            onClick={handleGoBack}
          />
          <CustomButton
            className="w-25"
            label="Save"
            style={{
              backgroundColor: AppColors.primaryColor,
            }}
          />
        </div>
      </div>
      <div className="d-flex align-items-center gap-3 mt-5">
        <CustomInput
          className="w-75"
          cocontrolId="complaintId"
          placeholder="Search for Complaint Id"
          value={penalty.complaintId}
          onChange={{}}
          disabled={justView}
        />

        <CustomButton
          label="Search"
          className="w-25"
          onClick={{}}
          style={{
            backgroundColor: AppColors.primaryColor,
          }}
        />
      </div>
      <div className="d-flex align-items-center gap-3 mt-3 w-100">
        <CustomInput
          controlId="complaintant"
          label="Complainant"
          labelClassName="fw-bold mb-0"
          className="w-100"
          value={
            penalty.submitter_type == 0
              ? penalty.retailer_id
              : penalty.supplier_id
          }
          disabled
        />
        <CustomInput
          controlId="respondent"
          label="Respondent"
          labelClassName="fw-bold mb-0"
          className="w-100"
          value={
            penalty.submitter_type == 0
              ? penalty.supplier_id
              : penalty.retailer_id
          }
          disabled
        />
      </div>
      <div className="d-flex align-items-center gap-3 mt-3 w-100">
        <Form.Group controlId="penaltyType" className="mb-3 w-100">
          <Form.Label>Penalty Type</Form.Label>
          <Form.Select
            onChange={{}}
            style={{
              height: "2.5rem",
              borderRadius: "3px",
              boxShadow: "none",
              outline: "none",
            }}
            disabled={justView}
          >
            <option value="1">hello</option>
            <option value="2">its</option>
            <option value="3">me</option>
            {/* {Object.entries(penaltyTypes).map(([id, type]) => (
              <option key={id} value={id}>
                {`${type}`}
              </option>
            ))} */}
          </Form.Select>
        </Form.Group>
        <CustomInput
          controlId="penaltyWeight"
          label="Penalty Weight"
          labelClassName="fw-bold mb-0"
          className="w-100"
          value={penalty.weight}
          disabled={justView}
        />
      </div>
      <div className="d-flex align-items-center gap-2 mt-3 w-100">
        <textarea
          rows={4}
          style={{
            resize: "none",
            boxShadow: "none",
            outline: "none",
            borderRadius: "3px",
            border: "1px solid gray",
          }}
          value={penalty.description}
          placeholder="Description"
          className="w-100 p-2"
          disabled={justView}
        ></textarea>
      </div>
    </Container>
  );
};

export default ViewPenalty;
