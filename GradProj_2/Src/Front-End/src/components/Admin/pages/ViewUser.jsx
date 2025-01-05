import AppColors from "../../Theme/AppColors";
import userIcon from "../../../assets/user.png";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import userType from "../../Models/UserType";
import jordanFlag from "../../../assets/jordanFlag.png";
import CustomInput from "../../Common/CustomInput";
import { useState } from "react";
import userStatus from "../../Models/UserStatus";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import CameraUpload from "../../Supplier/components/CameraUpload";
import CustomButton from "../../Common/CustomButton";
import { toast } from "react-toastify";

const initialUserData = {
  id: 51,
  statusId: 1,
  userTypeId: 2,
  establishment: {
    name: "Retailer1",
    email: "ret@gmail.com",
    phone: "079787978",
    img: userIcon,
    imgName: "userIcon",
    city: "Amman",
    street: "Jubaiha",
    buildingNo: "16",
    description: "No description available",
    industryTypes: [1, 2],
    regNumber: "23049832049",
    regDate: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    website: "logo.com",
    bankNum: "3298423",
    ibanNum: "4342343",
  },
  user: {
    firstName: "Sadam",
    middleName: "",
    lastName: "Hussain",
    username: "moh123",
    email: "Sadam@gmail.com",
    address: "Amman, Jordan",
    nationalNumber: "2000442402",
    phoneNumber: "0797857727",
    dateOfBirth: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    profileImg: userIcon,
    taxNumber: "93249",
  },
};

const ViewUser = () => {
  const [userData, setUserData] = useState(initialUserData);

  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state;
  const [currentUserStatus, setCurrentUserStatus] = useState(1);

  const [fileName, setFileName] = useState(null);

  const [showUserInputs, setShowUserInputs] = useState(true);
  const [showInfoInputs, setShowInfoInputs] = useState(true);
  const [showAddressInputs, setShowAddressInputs] = useState(true);
  const [showMediaInputs, setShowMediaInputs] = useState(true);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData((prevData) => ({
        ...prevData,
        establishment: {
          ...prevData.establishment,
          img: URL.createObjectURL(file),
          imgName: file.name,
        },
      }));
    }
  };

  const handleInputChange = (section, field, value) => {
    setUserData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  };

  const toggleUserInputs = () => setShowUserInputs(!showUserInputs);
  const toggleInfoInputs = () => setShowInfoInputs(!showInfoInputs);
  const toggleAddressInputs = () => setShowAddressInputs(!showAddressInputs);
  const toggleMediaInputs = () => setShowMediaInputs(!showMediaInputs);

  const handleCoverUpload = (file) => {
    console.log("Uploaded Cover:", file);
  };

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
                  value={userData.user.firstName}
                  onChange={(e) =>
                    handleInputChange("user", "firstName", e.target.value)
                  }
                />
                <CustomInput
                  controlId="middleName"
                  className=""
                  placeholder="Middle"
                  value={userData.user.middleName}
                  onChange={(e) =>
                    handleInputChange("user", "middleName", e.target.value)
                  }
                />
                <CustomInput
                  controlId="lastName"
                  className=""
                  placeholder="Last"
                  value={userData.user.lastName}
                  onChange={(e) =>
                    handleInputChange("user", "lastName", e.target.value)
                  }
                />
              </div>
            </div>

            <CustomInput
              controlId="email"
              type="email"
              label="Email"
              labelClassName="fw-bold mb-0"
              className="mb-3"
              value={userData.user.email}
              onChange={(e) =>
                handleInputChange("user", "email", e.target.value)
              }
            />

            <div className="d-flex gap-3 mb-3">
              <CustomInput
                controlId="nationalNumber"
                type="number"
                label="National Number"
                labelClassName="fw-bold mb-0"
                className="w-75"
                value={userData.user.nationalNumber}
                onChange={(e) =>
                  handleInputChange("user", "nationalNumber", e.target.value)
                }
              />

              <CustomInput
                controlId="taxNumber"
                type="number"
                label="Tax Number"
                labelClassName="fw-bold mb-0"
                className="w-75"
                value={userData.user.taxNumber}
                onChange={(e) =>
                  handleInputChange("user", "taxNumber", e.target.value)
                }
              />
            </div>

            <Form.Group controlId="phoneNumber" className="mb-3">
              <Form.Label className="fw-bold mb-0">Phone Number</Form.Label>
              <div
                className="d-flex align-items-center border  px-2 py-1"
                style={{
                  height: "2.5rem",
                  borderRadius: "3px",
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
                  value={userData.user.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("user", "phoneNumber", e.target.value)
                  }
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
                value={userData.user.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("user", "dateOfBirth", e.target.value)
                }
              />

              <CustomInput
                controlId="userType"
                label="User Type"
                labelClassName="fw-bold mb-0"
                value={userType[userData.userTypeId]}
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
              value={userData.user.username}
              onChange={(e) =>
                handleInputChange("user", "username", e.target.value)
              }
            />

            <CustomInput
              controlId="address"
              label="Address"
              labelClassName="fw-bold mb-0"
              className="mb-3"
              value={userData.user.address}
              onChange={(e) =>
                handleInputChange("user", "address", e.target.value)
              }
            />

            <div
              className="d-flex flex-column mt-4"
              style={{ width: "min-content" }}
            >
              <img
                src={userData.user.profileImg}
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
              />
            </div>
          </Col>
        </Row>
      )}
      {userType[userData.userTypeId] != userType[1] && (
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
                  value={userData.establishment.name}
                  onChange={(e) =>
                    handleInputChange("establishment", "name", e.target.value)
                  }
                />

                <CustomInput
                  controlId="email"
                  label="Email"
                  type="email"
                  className="mb-3"
                  labelClassName="fw-bold mb-0"
                  value={userData.establishment.email}
                  onChange={(e) =>
                    handleInputChange("establishment", "email", e.target.value)
                  }
                />

                <CustomInput
                  controlId="regNum"
                  label="Registration Number"
                  type="text"
                  className="mb-3"
                  labelClassName="fw-bold mb-0"
                  value={userData.establishment.regNumber}
                  onChange={(e) =>
                    handleInputChange(
                      "establishment",
                      "regNumber",
                      e.target.value
                    )
                  }
                />

                <Form.Group controlId="phoneNumber" className="mb-3">
                  <Form.Label className="fw-bold mb-0">Phone Number</Form.Label>
                  <div
                    className="d-flex align-items-center border  px-2 py-1"
                    style={{ borderRadius: "3px" }}
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
                      value={userData.establishment.phone}
                      onChange={(e) =>
                        handleInputChange(
                          "establishment",
                          "phone",
                          e.target.value
                        )
                      }
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
                    value={userData.establishment.description}
                    onChange={(e) =>
                      handleInputChange(
                        "establishment",
                        "description",
                        e.target.value
                      )
                    }
                  />
                </Form.Group>

                <CustomInput
                  controlId="website"
                  label="Website"
                  className="mb-3"
                  labelClassName="fw-bold mb-0"
                  value={userData.establishment.website}
                  onChange={(e) =>
                    handleInputChange(
                      "establishment",
                      "website",
                      e.target.value
                    )
                  }
                />
                <div className="d-flex gap-3 mb-3">
                  <CustomInput
                    controlId="regDate"
                    label="Registration Date"
                    type="date"
                    labelClassName="fw-bold mb-0"
                    value={userData.establishment.regDate}
                    disabled
                  />

                  <CustomInput
                    style={{ width: "50%" }}
                    controlId="userType"
                    label="Est. Type"
                    type="text"
                    labelClassName="fw-bold mb-0"
                    value={
                      userData.userTypeId == 2 ? "Retail Store" : "Factory"
                    }
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
                  value={userData.establishment.city}
                  onChange={(e) =>
                    handleInputChange("establishment", "city", e.target.value)
                  }
                />
                <div className="d-flex gap-3 mb-3">
                  <CustomInput
                    controlId="buildingNum"
                    label="Building No."
                    labelClassName="fw-bold mb-0"
                    className="mb-3"
                    placeholder="15"
                    value={userData.establishment.buildingNo}
                    onChange={(e) =>
                      handleInputChange(
                        "establishment",
                        "buildingNo",
                        e.target.value
                      )
                    }
                  />

                  <CustomInput
                    controlId="streetAdd"
                    label="Street Address"
                    labelClassName="fw-bold mb-0"
                    className="mb-3"
                    placeholder="King Abdulla street"
                    value={userData.establishment.street}
                    onChange={(e) =>
                      handleInputChange(
                        "establishment",
                        "street",
                        e.target.value
                      )
                    }
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
                  value={userData.establishment.bankNum}
                  onChange={(e) =>
                    handleInputChange(
                      "establishment",
                      "bankNum",
                      e.target.value
                    )
                  }
                />
                <CustomInput
                  controlId="ibanNum"
                  label="IBAN Number"
                  labelClassName="fw-bold mb-0"
                  className="mb-3"
                  placeholder="#51325"
                  value={userData.establishment.ibanNum}
                  onChange={(e) =>
                    handleInputChange(
                      "establishment",
                      "ibanNum",
                      e.target.value
                    )
                  }
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
          {showMediaInputs && userType[userData.userTypeId] == userType[3] && (
            <CameraUpload
              onCoverChange={handleCoverUpload}
              onLogoChange={handleLogoUpload}
            />
          )}
          {showMediaInputs && userType[userData.userTypeId] == userType[2] && (
            <div className="d-flex flex-column align-items-center justify-content-between">
              <div
                style={{
                  position: "relative",
                  cursor: "pointer",
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
                <label
                  htmlFor="upload-logo"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={userData.establishment.img}
                    alt="Company Logo"
                    style={{
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </label>
                <Form.Control
                  id="upload-logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: "none" }}
                />
              </div>
              <p>Upload logo</p>
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
