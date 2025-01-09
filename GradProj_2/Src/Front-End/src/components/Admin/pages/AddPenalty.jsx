import AppColors from "../../Theme/AppColors";
import userIcon from "../../../assets/user.png";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import userType from "../../Models/UserType";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import CustomButton from "../../Common/CustomButton";
import CustomInput from "../../Common/CustomInput";
import backIcon from "../../../assets/adminIcons/back.png";

const AddPenalty = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { complaint } = location.state;

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container className="px-0 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Add Penalty</h3>

        <div className="d-flex align-items-center justify-content-end gap-4 w-50">
          <img
            src={backIcon}
            alt="Back"
            style={{ cursor: "pointer", width: "40px" }}
            onClick={handleGoBack}
          ></img>
          <CustomButton
            className="w-25"
            label="Submit"
            style={{
              backgroundColor: AppColors.primaryColor,
            }}
          />
        </div>
      </div>
      <div className="d-flex align-items-center gap-3 mt-5">
        <CustomInput
          className="w-75"
          controlId="complaintId"
          label="Complaint Id"
          labelClassName="mb-0 fw-bold"
          placeholder="Search for Complaint Id"
          value={complaint.id}
          onChange={{}}
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
            complaint.submitterType == "RETAILER"
              ? complaint.retailer.EstablishmentId
              : complaint.supplier.EstablishmentId
          }
          disabled
        />
        <CustomInput
          controlId="respondent"
          label="Respondent"
          labelClassName="fw-bold mb-0"
          className="w-100"
          value={
            complaint.submitterType == "RETAILER"
              ? complaint.supplier.EstablishmentId
              : complaint.retailer.EstablishmentId
          }
          disabled
        />
      </div>
      <div className="d-flex align-items-center gap-3 mt-3 w-100">
        <Form.Group controlId="penaltyType" className="w-100">
          <Form.Label className="mb-0 fw-bold">Penalty Type</Form.Label>
          <Form.Select
            onChange={{}}
            style={{
              height: "2.5rem",
              borderRadius: "3px",
              boxShadow: "none",
              outline: "none",
            }}
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
          value={0}
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
          value={""}
          placeholder="Description"
          className="w-100 p-2"
        ></textarea>
      </div>
    </Container>
  );
};

export default AddPenalty;
