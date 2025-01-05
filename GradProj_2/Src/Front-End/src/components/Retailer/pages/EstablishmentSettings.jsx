import React, { useState } from "react";
import AppColors from "../../Theme/AppColors";
import userIcon from "../../../assets/user.png";
import jordanFlag from "../../../assets/jordanFlag.png";
import { Row, Col, Form, Button } from "react-bootstrap";
import { CloudUpload, ChevronDown, ChevronUp } from "react-bootstrap-icons";
import CustomInput from "../../Common/CustomInput";
import LoadingScreen from "../../Common/LoadingScreen";
import { useAuth } from "../../Providers/authProvider";
import { toast } from "react-toastify";
import updateApi from "../../../api/retailerAPIs/updates";

const EstablishmentSettings = () => {
  const { userData, setUserData, uploadImage } = useAuth();

  const [loading, setLoading] = useState(false); // when its null it will be loading to fetch the data

  const [fileName, setFileName] = useState(null);
  const [showInfoInputs, setShowInfoInputs] = useState(true);
  const [showAddressInputs, setShowAddressInputs] = useState(true);
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
    logo: userData.establishmentDetails.establishmentLogo || null,
  });

  const [billData, setBillData] = useState({
    taxNum: userData.retailerDetails.retailerTaxIdentificationNumber || "",
    bankAccNum: userData.retailerDetails.retailerBankAccountNumber || "",
    iban: userData.retailerDetails.retailerIBAN || "",
  });

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const toggleInfoInputs = () => {
    setShowInfoInputs(!showInfoInputs);
  };

  const toggleAddressInputs = () => {
    setShowAddressInputs(!showAddressInputs);
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillData({
      ...billData,
      [name]: value,
    });
  };
  const toggleBillingInputs = () => {
    setShowBillingInputs(!showBillingInputs);
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

      setLoading(true);

      const responseRetailStore = await updateApi.updateRetailerStoreDetails(
        estData,
        userData,
        logoUrl
      );
      const responseRetailer = await updateApi.updateRetailerDetails(
        billData,
        userData
      );

      if (
        responseRetailStore.resData.header.errorCode == "0000" &&
        responseRetailer.resData.header.errorCode == "0000"
      ) {
        const updatedRetaileStore = {
          ...userData.establishmentDetails,
          ...responseRetailStore.payload,
        };
        const updatedRetailer = {
          ...userData.retailerDetails,
          ...responseRetailer.payload,
        };

        setUserData((prev) => ({
          ...prev,
          establishmentDetails: updatedRetaileStore,
          retailerDetails: updatedRetailer,
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
              label="Company Name"
              type="text"
              className="mb-3"
              value={estData.companyName}
              onChange={handleInputChange}
            />

            <div className="d-flex gap-3 align-items-center mb-3">
              <CustomInput
                controlId="email"
                label="Email"
                type="email"
                className="w-75"
                value={estData.email}
                onChange={handleInputChange}
              />
              <a href="#" className="text-dark fw-bold">
                Verify
              </a>
            </div>

            <CustomInput
              controlId="regNum"
              label="Registration Number"
              type="text"
              className="mb-3"
              value={estData.regNum}
              onChange={handleInputChange}
            />

            <Form.Group controlId="phoneNumber" className="mb-3">
              <Form.Label className="fw-bold mb-0">Phone Number</Form.Label>
              <div className="d-flex align-items-center border rounded px-2 py-1">
                <img src={jordanFlag} alt="Jordan" style={{ width: "24px" }} />
                <span
                  style={{ padding: "0 7px", borderRight: "1px solid gray" }}
                >
                  +962
                </span>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  style={{ border: "none", outline: "none" }}
                  value={estData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
            </Form.Group>

            <div className="d-flex gap-3 mb-3">
              <CustomInput
                controlId="regDate"
                label="Registration Date"
                type="date"
                value={estData.regDate}
                onChange={handleInputChange}
                disabled
              />

              <CustomInput
                style={{ width: "50%" }}
                controlId="userType"
                label="Est. Type"
                type="text"
                value={"Retail Store"}
                disabled
              />
            </div>
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

            <div
              className="d-flex flex-column mt-4"
              style={{ width: "min-content" }}
            >
              <img
                src={
                  estData.logo instanceof File
                    ? URL.createObjectURL(estData.logo)
                    : estData.logo ?? userIcon
                }
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
              <label
                htmlFor="profileImage"
                className="fw-bold text-center"
                style={{
                  cursor: "pointer",
                  color: "black",
                  textDecoration: "underline",
                  fontSize: "13px",
                }}
              >
                Upload Picture
              </label>
              <Form.Control
                type="file"
                id="profileImage"
                style={{ display: "none" }}
                accept=".jpeg, .jpg, .png" // Restrict file types
                onChange={handleImageChange}
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
              className="mb-3"
              placeholder="Amman"
              value={estData.city}
              onChange={handleInputChange}
            />

            <CustomInput
              controlId="buildNo"
              label="Building No."
              className="mb-3"
              placeholder="15"
              value={estData.buildNo}
              onChange={handleInputChange}
            />
          </Col>
          <Col md={5}>
            <CustomInput
              controlId="street"
              label="Street Address"
              className="mb-3"
              placeholder="King Abdulla street"
              value={estData.street}
              onChange={handleInputChange}
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
    </>
  );
};

export default EstablishmentSettings;
