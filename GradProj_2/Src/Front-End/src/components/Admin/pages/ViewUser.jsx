import AppColors from "../../Theme/AppColors";
import userIcon from "../../../assets/user.png";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import userType from "../../Models/UserType";
import jordanFlag from "../../../assets/jordanFlag.png";
import CustomInput from "../../Common/CustomInput";
import { useEffect, useState } from "react";
import userStatus from "../../Models/UserStatus";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import CameraUpload from "../../Supplier/components/CameraUpload";
import { toast } from "react-toastify";
import userManagementApi from "../../../api/adminAPIs/userManagement";
import { formatDateForInput } from "../../Utils/formatters";
import LoadingScreen from "../../Common/LoadingScreen";

const ViewUser = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { userId, type } = location.state;
  const [currentUserStatus, setCurrentUserStatus] = useState(1);
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const payload = {
        userId: parseInt(userId),
        userType: type,
      };
      try {
        const response = await userManagementApi.getUserAllData(payload);
        if (response?.body?.success) {
          setUserData(response.body.userData);
        } else console.error("error fetching user", response);
      } catch (err) {
        console.error("error fetching user ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const [showUserInputs, setShowUserInputs] = useState(true);
  const [showInfoInputs, setShowInfoInputs] = useState(true);
  const [showAddressInputs, setShowAddressInputs] = useState(true);
  const [showMediaInputs, setShowMediaInputs] = useState(true);

  // const handleLogoUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setUserData((prevData) => ({
  //       ...prevData,
  //       establishment: {
  //         ...prevData.establishment,
  //         img: URL.createObjectURL(file),
  //         imgName: file.name,
  //       },
  //     }));
  //   }
  // };

  // const handleInputChange = (section, field, value) => {
  //   setUserData((prevData) => ({
  //     ...prevData,
  //     [section]: {
  //       ...prevData[section],
  //       [field]: value,
  //     },
  //   }));
  // };

  const toggleUserInputs = () => setShowUserInputs(!showUserInputs);
  const toggleInfoInputs = () => setShowInfoInputs(!showInfoInputs);
  const toggleAddressInputs = () => setShowAddressInputs(!showAddressInputs);
  const toggleMediaInputs = () => setShowMediaInputs(!showMediaInputs);

  // const handleCoverUpload = (file) => {
  //   console.log("Uploaded Cover:", file);
  // };

  if (loading) return <LoadingScreen />;

  return (
    <div className="px-0 py-2">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <h3 className="fw-bold">User Information</h3>
          <Button
            variant="light"
            onClick={toggleUserInputs}
            style={{ border: "none", backgroundColor: "transparent" }}
          >
            {showUserInputs ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
        <Form.Group controlId="userStatus" className="mb-3  w-25">
          <Form.Select
            value={currentUserStatus}
            onChange={(e) => {
              setCurrentUserStatus(e.target.value);
              const selectedId = e.target.value;
              const selectedType = userStatus[selectedId];
              toast.success(`User set to ${selectedType}`, {
                progressStyle: { background: AppColors.primaryColor },
              });
            }}
            style={{
              height: "2.5rem",
              borderRadius: "3px",
              boxShadow: "none",
              outline: "none",
            }}
          >
            {Object.entries(userStatus).map(([id, type]) => (
              <option key={id} value={id}>
                {`${type}`}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>
      {showUserInputs && (
        <Row className="my-4 justify-content-between">
          <Col md={5}>
            <div>
              <p className="fw-bold mb-0">Full Name</p>
              <div className="d-flex gap-2 mb-3">
                <CustomInput
                  controlId="firstName"
                  className=""
                  placeholder="First"
                  value={userData.userDetails.firstName ?? ""}
                  disabled
                />
                <CustomInput
                  controlId="middleName"
                  className=""
                  placeholder="Middle"
                  value={userData.userDetails.middleName ?? ""}
                  disabled
                />
                <CustomInput
                  controlId="lastName"
                  className=""
                  placeholder="Last"
                  value={userData.userDetails.lastName ?? ""}
                  disabled
                />
              </div>
            </div>

            <CustomInput
              controlId="email"
              type="email"
              label="Email"
              labelClassName="fw-bold mb-0"
              className="mb-3"
              value={userData.userDetails.userEmail ?? ""}
              disabled
            />

            <div className="d-flex gap-3 mb-3">
              <CustomInput
                controlId="nationalNumber"
                type="number"
                label="National Number"
                labelClassName="fw-bold mb-0"
                className="w-75"
                value={userData.userDetails.nationalNumber ?? ""}
                disabled
              />

              <CustomInput
                controlId="taxNumber"
                type="number"
                label="Tax Number"
                labelClassName="fw-bold mb-0"
                className="w-75"
                value={
                  type == "1"
                    ? userData.adminDetails.adminTaxIdentificationNumber ?? ""
                    : type == "2"
                    ? userData.retailerDetails
                        .retailerTaxIdentificationNumber ?? ""
                    : userData.supplierDetails
                        .supplierTaxIdentificationNumber ?? ""
                }
                disabled
              />
            </div>

            <Form.Group controlId="phoneNumber" className="mb-3">
              <Form.Label className="fw-bold mb-0">Phone Number</Form.Label>
              <div
                className="d-flex align-items-center border  px-2 py-1"
                style={{
                  height: "2.5rem",
                  borderRadius: "3px",
                  backgroundColor: "#E9ECEF",
                }}
              >
                <img src={jordanFlag} alt="Jordan" style={{ width: "24px" }} />
                <span
                  style={{ padding: "0 7px", borderRight: "1px solid gray" }}
                >
                  +962
                </span>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={userData.userDetails.userPhone ?? ""}
                  disabled
                  placeholder="Enter phone number"
                  style={{ border: "none", outline: "none", boxShadow: "none" }}
                />
              </div>
            </Form.Group>

            <div className="d-flex gap-3 mb-3">
              <CustomInput
                controlId="dateOfBirth"
                type="date"
                label="Date of Birth"
                labelClassName="fw-bold mb-0"
                className="mb-3"
                value={
                  formatDateForInput(userData.userDetails.dateOfBirth) ?? ""
                }
                disabled
              />

              <CustomInput
                controlId="userType"
                label="User Type"
                labelClassName="fw-bold mb-0"
                value={userType[parseInt(type)]}
                disabled
              />
            </div>
          </Col>

          <Col md={6} className="align-items-start">
            <CustomInput
              controlId="username"
              label="Username"
              labelClassName="fw-bold mb-0"
              className="mb-3"
              value={userData.userDetails.userName ?? ""}
              disabled
            />

            <CustomInput
              controlId="address"
              label="Address"
              labelClassName="fw-bold mb-0"
              className="mb-3"
              value={userData.userDetails.userAddress}
              disabled
            />

            <div
              className="d-flex flex-column mt-4"
              style={{ width: "min-content" }}
            >
              <img
                src={userData.userDetails.userImage ?? userIcon}
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
              {/* <label
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
              /> */}
            </div>
          </Col>
        </Row>
      )}
      {userType[parseInt(type)] != userType[1] && (
        <>
          <div
            className="d-flex align-items-center mt-4 pt-4"
            style={{ borderTop: `1px solid ${AppColors.dividerLine}` }}
          >
            <h3 className="fw-bold">Establishment Information</h3>
            <Button
              variant="light"
              onClick={toggleInfoInputs}
              style={{ border: "none", backgroundColor: "transparent" }}
            >
              {showInfoInputs ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
          {showInfoInputs && (
            <Row className="my-4 justify-content-between">
              <Col md={5}>
                <CustomInput
                  controlId="companyName"
                  label="Company Name"
                  type="text"
                  className="mb-3"
                  labelClassName="fw-bold mb-0"
                  value={userData.establishmentDetails.establishmentName ?? ""}
                  disabled
                />

                <CustomInput
                  controlId="email"
                  label="Email"
                  type="email"
                  className="mb-3"
                  labelClassName="fw-bold mb-0"
                  value={userData.establishmentDetails.establishmentEmail ?? ""}
                  disabled
                />

                <CustomInput
                  controlId="regNum"
                  label="Registration Number"
                  type="text"
                  className="mb-3"
                  labelClassName="fw-bold mb-0"
                  value={
                    userData.establishmentDetails
                      .establishmentCommercialRegistrationNumber ?? ""
                  }
                  disabled
                />

                <Form.Group controlId="phoneNumber" className="mb-3">
                  <Form.Label className="fw-bold mb-0">Phone Number</Form.Label>
                  <div
                    className="d-flex align-items-center border  px-2 py-1"
                    style={{ borderRadius: "3px", backgroundColor: "#E9ECEF" }}
                  >
                    <img
                      src={jordanFlag}
                      alt="Jordan"
                      style={{ width: "24px" }}
                    />
                    <span
                      style={{
                        padding: "0 7px",
                        borderRight: "1px solid gray",
                      }}
                    >
                      +962
                    </span>
                    <Form.Control
                      type="text"
                      name="phoneNumber"
                      placeholder="Enter phone number"
                      style={{
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                      }}
                      value={
                        userData.establishmentDetails
                          .establishmentContactNumber ?? ""
                      }
                      disabled
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col md={6} className="align-items-start">
                <Form.Group controlId="companyDescription" className="mb-3">
                  <Form.Label className="mb-0 fw-bold">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    style={{ resize: "none", borderRadius: "3px" }}
                    value={
                      userData.establishmentDetails.establishmentDescription ??
                      ""
                    }
                    disabled
                  />
                </Form.Group>

                <CustomInput
                  controlId="website"
                  label="Website"
                  className="mb-3"
                  labelClassName="fw-bold mb-0"
                  value={
                    userData.establishmentDetails.establishmentWebsite ?? ""
                  }
                  disabled
                />
                <div className="d-flex gap-3 mb-3">
                  <CustomInput
                    controlId="regDate"
                    label="Registration Date"
                    type="date"
                    labelClassName="fw-bold mb-0"
                    value={
                      formatDateForInput(
                        userData.establishmentDetails
                          .establishmentRegistrationDate
                      ) ?? ""
                    }
                    disabled
                  />

                  <CustomInput
                    style={{ width: "50%" }}
                    controlId="userType"
                    label="Est. Type"
                    type="text"
                    labelClassName="fw-bold mb-0"
                    value={type == "2" ? "Retail Store" : "Factory"}
                    disabled
                  />
                </div>
              </Col>
            </Row>
          )}
          <div
            className="d-flex align-items-center mt-4 pt-4"
            style={{ borderTop: `1px solid ${AppColors.dividerLine}` }}
          >
            <h3 className="fw-bold">Establishment Billing</h3>
            <Button
              variant="light"
              onClick={toggleAddressInputs}
              style={{ border: "none", backgroundColor: "transparent" }}
            >
              {showAddressInputs ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
          {showAddressInputs && (
            <Row className="my-4 justify-content-between">
              <Col md={5}>
                <CustomInput
                  controlId="city"
                  label="City"
                  labelClassName="fw-bold mb-0"
                  className="mb-3"
                  placeholder="Amman"
                  value={userData.establishmentDetails.establishmentCity ?? ""}
                  disabled
                />
                <div className="d-flex gap-3 mb-3">
                  <CustomInput
                    controlId="buildingNum"
                    label="Building No."
                    labelClassName="fw-bold mb-0"
                    className="mb-3"
                    placeholder="15"
                    value={
                      userData.establishmentDetails
                        .establishmentBuildingNumber ?? ""
                    }
                    disabled
                  />

                  <CustomInput
                    controlId="streetAdd"
                    label="Street Address"
                    labelClassName="fw-bold mb-0"
                    className="mb-3"
                    placeholder="King Abdulla street"
                    value={
                      userData.establishmentDetails.establishmentStreet ?? ""
                    }
                    disabled
                  />
                </div>
              </Col>
              <Col md={5}>
                <CustomInput
                  controlId="bankNum"
                  label="Bank Account Number"
                  labelClassName="fw-bold mb-0"
                  className="mb-3"
                  placeholder="9922"
                  value={
                    type == "2"
                      ? userData.retailerDetails.retailerBankAccountNumber ?? ""
                      : userData.supplierDetails.supplierBankAccountNumber ?? ""
                  }
                  disabled
                />
                <CustomInput
                  controlId="ibanNum"
                  label="IBAN Number"
                  labelClassName="fw-bold mb-0"
                  className="mb-3"
                  placeholder="#51325"
                  value={
                    type == "2"
                      ? userData.retailerDetails.retailerIBAN ?? ""
                      : userData.supplierDetails.supplierIBAN ?? ""
                  }
                  disabled
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
          {showMediaInputs && userType[parseInt(type)] == userType[3] && (
            <CameraUpload
              cover={userData.establishmentDetails.establishmentCover}
              logo={userData.establishmentDetails.establishmentLogo}
            />
          )}
          {showMediaInputs && userType[parseInt(type)] == userType[2] && (
            <div className="d-flex flex-column align-items-center justify-content-between">
              <div
                style={{
                  position: "relative",
                  border: "2px solid #ddd",
                  borderRadius: "50%",
                  width: "120px",
                  height: "120px",
                  backgroundColor: AppColors.grayBackground,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <label htmlFor="upload-logo">
                  <img
                    src={userData.establishmentDetails.establishmentLogo}
                    alt="Company Logo"
                    style={{
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </label>
                {/* <Form.Control
                  id="upload-logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: "none" }}
                /> */}
              </div>
              {/* <p>Upload logo</p> */}
            </div>
          )}
        </>
      )}
      {/* <div className="d-flex justify-content-end">
        <CustomButton
          label="Save"
          className="px-5"
          style={{ backgroundColor: AppColors.primaryColor }}
        />
      </div> */}
    </div>
  );
};

export default ViewUser;
