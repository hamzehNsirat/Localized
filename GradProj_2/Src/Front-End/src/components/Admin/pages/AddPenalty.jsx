import AppColors from "../../Theme/AppColors";
import userIcon from "../../../assets/user.png";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import userType from "../../Models/UserType";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import CustomButton from "../../Common/CustomButton";
import CustomInput from "../../Common/CustomInput";
import backIcon from "../../../assets/adminIcons/back.png";
import penaltyApi from "../../../api/adminAPIs/penalties";
import { useAuth } from "../../Providers";
import { useState } from "react";
import { toast } from "react-toastify";

const AddPenalty = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { complaint } = location.state;
  const { userData } = useAuth();

  const [penalty, setPenalty] = useState({
    penaltyTypeId: "1",
    penaltyNotes: "",
    penaltyTitle: complaint.title,
    penaltyWeight: 0,
    compId: complaint.id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPenalty((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmitPenalty = async () => {
    try {
      const payload = {
        penaltyTypeId: parseInt(penalty.penaltyTypeId),
        establishmentId:
          complaint.submitterType == "RETAILER"
            ? parseInt(complaint.supplier.EstablishmentId)
            : parseInt(complaint.retailer.EstablishmentId),
        penaltyInitiatorId: parseInt(userData.adminDetails.adminId),
        penaltyNotes: penalty.penaltyNotes,
        penaltyTitle: penalty.penaltyTitle,
        penaltyWeight: parseFloat(penalty.penaltyWeight / 100),
        relatedComplaintId: parseInt(penalty.compId),
      };
      const response = await penaltyApi.addPenalty(payload);
      if (response?.body?.success) {
        toast.success(`Penalty Applied`, {
          progressStyle: { background: AppColors.primaryColor },
        });
        navigate("/admin/penalties");
      } else {
        console.error("Failed Penalty Applied ", response);
        toast.error(`Failed Penalty Applied`, {
          progressStyle: { background: AppColors.primaryColor },
        });
      }
    } catch (err) {
      console.error("Failed Penalty Applied ", err);
      toast.error(`Failed Penalty Applied`, {
        progressStyle: { background: AppColors.primaryColor },
      });
    }
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
              boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.2)",
              borderRadius: "3px",
              marginLeft: "40px",
              backgroundColor: AppColors.primaryColor,
            }}
            onClick={handleSubmitPenalty}
          />
        </div>
      </div>
      <div className="d-flex align-itemscenter gap-3 mt-5">
        <CustomInput
          className="w-100"
          controlId="complaintId"
          label="Complaint Id"
          labelClassName="mb-0 fw-bold"
          placeholder="Search for Complaint Id"
          value={complaint.id}
          disabled
        />
        <CustomInput
          className="w-100"
          controlId="penaltyTitle"
          label="Penalty Title"
          labelClassName="mb-0 fw-bold"
          value={penalty.penaltyTitle}
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
              ? complaint.retailer.EstablishmentName
              : complaint.supplier.EstablishmentName
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
              ? complaint.supplier.EstablishmentName
              : complaint.retailer.EstablishmentName
          }
          disabled
        />
      </div>
      <div className="d-flex align-items-center gap-3 mt-3 w-100">
        <Form.Group controlId="penaltyTypeId" className="w-100">
          <Form.Label className="mb-0 fw-bold">Penalty Type</Form.Label>
          <Form.Select
            name="penaltyTypeId"
            value={penalty.penaltyTypeId}
            onChange={handleChange}
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
          onChange={handleChange}
          value={penalty.penaltyWeight ?? 0}
        />
      </div>
      <div className="d-flex align-items-center gap-2 mt-3 w-100">
        <textarea
          name="penaltyNotes"
          onChange={handleChange}
          rows={4}
          style={{
            resize: "none",
            boxShadow: "none",
            outline: "none",
            borderRadius: "3px",
            border: "1px solid gray",
          }}
          value={penalty.penaltyNotes}
          placeholder="Description"
          className="w-100 p-2"
        ></textarea>
      </div>
    </Container>
  );
};

export default AddPenalty;
