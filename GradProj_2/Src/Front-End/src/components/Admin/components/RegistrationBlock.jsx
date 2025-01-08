import React from "react";
import { Button } from "react-bootstrap";
import AppColors from "../../Theme/AppColors";

const RegistrationBlock = ({
  valid,
  regNumber,
  loading,
  handleVerifyRegNum,
}) => {
  return (
    <div className="d-flex align-items-center gap-3">
      <div
        className={`p-3 d-flex flex-column justify-content-center fw-bold w-75 ${
          valid === null
            ? "border-transparent"
            : valid
            ? "border-green"
            : "border-red"
        }`}
        style={{
          backgroundColor: AppColors.grayBackground,
          borderRadius: "3px",
          height: "2.5rem",
        }}
      >
        <h6 className="fw-bold mb-0">{regNumber}</h6>
      </div>
      <Button
        style={{
          backgroundColor: AppColors.primaryColor,
          boxShadow: "0px 3px 7px rgba(0, 0, 0, 0.15)",
          borderRadius: "3px",
          height: "2.5rem",
        }}
        className="y-2 w-50 fw-bold fs-6"
        onClick={!loading ? handleVerifyRegNum : null}
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify"}
      </Button>
    </div>
  );
};

export default RegistrationBlock;
