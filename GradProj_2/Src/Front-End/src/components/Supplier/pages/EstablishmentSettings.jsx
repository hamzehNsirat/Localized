import React, { useState } from "react";
import AppColors from "../../Theme/AppColors";
import userIcon from "../../../assets/user.png";
import jordanFlag from "../../../assets/jordanFlag.png";
import { Row, Col, Form, Button } from "react-bootstrap";
import { CloudUpload, ChevronDown, ChevronUp } from "react-bootstrap-icons";
import CustomInput from "../../Common/CustomInput.jsx";
import CameraUpload from "../components/CameraUpload";
import { useAuth } from "../../Providers/authProvider.jsx";
import { formatDateForInput } from "../../Utils/formatters.js";
import updateApi from "../../../api/supplierAPIs/updates.js";
import { toast } from "react-toastify";
import LoadingScreen from "../../Common/LoadingScreen.jsx";

const EstablishmentSettings = () => {
  const { userData, setUserData, uploadImage } = useAuth();
  const [loading, setLoading] = useState(false); // when its null it will be loading to fetch the data
  const [showInfoInputs, setShowInfoInputs] = useState(true);
  const [showAddressInputs, setShowAddressInputs] = useState(true);
  const [showMediaInputs, setShowMediaInputs] = useState(true);
  const [showBillingInputs, setShowBillingInputs] = useState(true);

  const [estData, setEstData] = useState({
    companyName: userData.establishmentDetails.establishmentName || "",
    email: userData.establishmentDetails.establishmentEmail || "",
    regNum:
      userData.establishmentDetails.establishmentCommercialRegistrationNumber ||
      "",
    desc: userData.establishmentDetails.establishmentDescription || "",
    website: userData.establishmentDetails.establishmentWebsite || "",
    phoneNumber: userData.establishmentDetails.establishmentContactNumber || "",
    regDate: userData.establishmentDetails.establishmentRegistrationDate || "",
    city: userData.establishmentDetails.establishmentCity || "",
    buildNo: userData.establishmentDetails.establishmentBuildingNumber || "",
    street: userData.establishmentDetails.establishmentStreet || "",
    cover: userData.establishmentDetails.establishmentCover || null,
    logo: userData.establishmentDetails.establishmentLogo || null,
  });

  const [billData, setBillData] = useState({
    taxNum: userData.supplierDetails.supplierTaxIdentificationNumber || "",
    bankAccNum: userData.supplierDetails.supplierBankAccountNumber || "",
    iban: userData.supplierDetails.supplierIBAN || "",
  });

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillData({
      ...billData,
      [name]: value,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEstData({
      ...estData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setEstData({
      ...estData,
      logo: e.target.files[0],
    });
  };
  const handleCoverChange = (e) => {
    setEstData({
      ...estData,
      cover: e.target.files[0],
    });
  };

  const toggleInfoInputs = () => {
    setShowInfoInputs(!showInfoInputs);
  };

  const toggleAddressInputs = () => {
    setShowAddressInputs(!showAddressInputs);
  };

  const toggleMediaInputs = () => {
    setShowMediaInputs(!showMediaInputs);
  };
  const toggleBillingInputs = () => {
    setShowBillingInputs(!showBillingInputs);
  };

  const handleSave = async () => {
    try {
      // Determine if the image has changed
      const isLogoChanged =
        userData.establishmentDetails.establishmentLogo !== estData.logo;

      let logoUrl = userData.establishmentDetails.establishmentLogo;
      if (isLogoChanged) {
        logoUrl = await uploadImage(estData.logo);
        if (!logoUrl) {
          console.log("Failed logo upload");
          toast.error("Failed to upload logo", {
            progressStyle: { background: AppColors.primaryColor },
          });
          return;
        }
      }

      const isCoverChanged =
        userData.establishmentDetails.establishmentCover !== estData.cover;

      // Upload image only if it has changed
      let coverUrl = userData.establishmentDetails.establishmentCover;
      if (isCoverChanged) {
        coverUrl = await uploadImage(estData.cover);
        if (!coverUrl) {
          console.log("Failed cover upload");
          toast.error("Failed to upload cover", {
            progressStyle: { background: AppColors.primaryColor },
          });
          return;
        }
      }

      setLoading(true);

      const responseFactory = await updateApi.updateFactoryDetails(
        estData,
        userData,
        coverUrl,
        logoUrl
      );
      const responseSupplier = await updateApi.updateSupplierDetails(
        billData,
        userData
      );

      if (
        responseFactory.resData.header.errorCode == "0000" &&
        responseSupplier.resData.header.errorCode == "0000"
      ) {
        const updatedFactory = {
          ...userData.establishmentDetails,
          ...responseFactory.payload,
        };
        const updatedSupplier = {
          ...userData.supplierDetails,
          ...responseSupplier.payload,
        };

        setUserData((prev) => ({
          ...prev,
          establishmentDetails: updatedFactory,
          supplierDetails: updatedSupplier,
        }));

        toast.success("Your Data Updated Successfully", {
          progressStyle: { background: AppColors.primaryColor },
        });
      } else {
        toast.error("Your Data Failed to Update", {
          progressStyle: { background: AppColors.primaryColor },
        });
      }
    } catch (err) {
      console.error("Error saving data:", err);
      toast.error("An error occurred while updating your data.", {
        progressStyle: { background: AppColors.primaryColor },
      });
    } finally {
      // Hide loading spinner
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <h3 className="fw-bold">Establishment Information</h3>
          <Button
            variant="light"
            onClick={toggleInfoInputs}
            style={{ border: "none", backgroundColor: "transparent" }}
          >
            {showInfoInputs ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
        <Button
          className="fw-bold"
          style={{
            fontSize: "14px",
            letterSpacing: "1px",
            backgroundColor: AppColors.primaryColor,
            width: "20%",
            borderRadius: "5px",
            boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
          }}
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
      {showInfoInputs && (
        <Row className="mt-4 justify-content-between">
          <Col md={5}>
            <CustomInput
              controlId="companyName"
              value={estData.companyName}
              onChange={handleInputChange}
              label="Company Name"
              type="text"
              className="mb-3"
            />

            <div className="d-flex gap-3 align-items-center mb-3">
              <CustomInput
                controlId="email"
                label="Email"
                value={estData.email}
                onChange={handleInputChange}
                type="email"
                className="w-75"
              />
              <a href="#" className="text-dark fw-bold">
                Verify
              </a>
            </div>

            <CustomInput
              controlId="regNum"
              label="Registration Number"
              value={estData.regNum}
              onChange={handleInputChange}
              type="text"
              className="mb-3"
            />

            <Form.Group controlId="phoneNumber" className="mb-3">
              <Form.Label className="fw-bold mb-0">Phone Number</Form.Label>
              <div className="d-flex align-items-center border px-2 py-1">
                <img src={jordanFlag} alt="Jordan" style={{ width: "24px" }} />
                <span
                  style={{ padding: "0 7px", borderRight: "1px solid gray" }}
                >
                  +962
                </span>
                <Form.Control
                  type="number"
                  input="numeric"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  style={{ border: "none", outline: "none", boxShadow: "none" }}
                  value={estData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
            </Form.Group>
          </Col>

          <Col md={6} className="align-items-start">
            <Form.Group controlId="desc" className="mb-3">
              <Form.Label className="mb-0 fw-bold">Description</Form.Label>
              <Form.Control
                as="textarea"
                name="desc"
                rows={4}
                style={{
                  resize: "none",
                  borderRadius: "3px",
                  boxShadow: "none",
                }}
                value={estData.desc}
                onChange={handleInputChange}
              />
            </Form.Group>

            <CustomInput
              controlId="website"
              label="Website"
              className="mb-3"
              value={estData.website}
              onChange={handleInputChange}
            />
            <div className="d-flex gap-3 mb-3">
              <CustomInput
                controlId="dateOfBirth"
                label="Registration Date"
                value={formatDateForInput(estData.regDate)}
                type="date"
                disabled
              />

              <CustomInput
                style={{ width: "50%" }}
                controlId="userType"
                label="Est. Type"
                type="text"
                value="Factory"
                disabled
              />
            </div>
          </Col>
        </Row>
      )}
      <div
        className="d-flex align-items-center pt-4 mt-4"
        style={{ borderTop: `1px solid ${AppColors.dividerLine}` }}
      >
        <h3 className="fw-bold">Establishment Address</h3>
        <Button
          variant="light"
          onClick={toggleAddressInputs}
          style={{ border: "none", backgroundColor: "transparent" }}
        >
          {showAddressInputs ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>
      {showAddressInputs && (
        <Row className="mt-4 justify-content-between">
          <Col md={5}>
            <CustomInput
              controlId="city"
              label="City"
              value={estData.city}
              onChange={handleInputChange}
              className="mb-3"
              placeholder="Amman"
            />

            <CustomInput
              controlId="buildNo"
              label="Building No."
              value={estData.buildNo}
              onChange={handleInputChange}
              className="mb-3"
              placeholder="15"
            />
          </Col>
          <Col md={5}>
            <CustomInput
              controlId="street"
              label="Street Address"
              value={estData.street}
              onChange={handleInputChange}
              className="mb-3"
              placeholder="King Abdulla street"
            />
          </Col>
        </Row>
      )}
      <div
        className="d-flex align-items-center pt-4 mt-4"
        style={{ borderTop: `1px solid ${AppColors.dividerLine}` }}
      >
        <h3 className="fw-bold">Establishment Billing</h3>
        <Button
          variant="light"
          onClick={toggleBillingInputs}
          style={{ border: "none", backgroundColor: "transparent" }}
        >
          {showAddressInputs ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>
      {showBillingInputs && (
        <Row className="mt-4 justify-content-between">
          <Col md={5}>
            <CustomInput
              controlId="taxNum"
              label="Tax Number"
              className="mb-3"
              value={billData.taxNum}
              onChange={handleBillingChange}
            />

            <CustomInput
              controlId="bankAccNum"
              label="Bank Account Number"
              value={billData.bankAccNum}
              onChange={handleBillingChange}
              className="mb-3"
            />
          </Col>
          <Col md={5}>
            <CustomInput
              controlId="iban"
              label="IBAN"
              className="mb-3"
              value={billData.iban}
              onChange={handleBillingChange}
            />
          </Col>
        </Row>
      )}
      <div
        className="d-flex align-items-center pt-4 mt-4"
        style={{ borderTop: `1px solid ${AppColors.dividerLine}` }}
      >
        <h3 className="fw-bold">Establishment Media</h3>
        <Button
          variant="light"
          onClick={toggleMediaInputs}
          style={{ border: "none", backgroundColor: "transparent" }}
        >
          {showMediaInputs ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>
      {showMediaInputs && (
        <CameraUpload
          cover={estData.cover}
          logo={estData.logo}
          logoOnChange={handleImageChange}
          coverOnChange={handleCoverChange}
        />
      )}
    </>
  );
};

export default EstablishmentSettings;
