import AppColors from "../../Theme/AppColors";
import userIcon from "../../../assets/user.png";
import { Row, Col, Form, Button } from "react-bootstrap";
import userType from "../../Models/UserType";
import jordanFlag from "../../../assets/jordanFlag.png";
import CustomInput from "../../Common/CustomInput";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import CustomButton from "../../Common/CustomButton";

const AddUser = () => {
  const [newUserType, setNewUserType] = useState(1);

  const [showUserInputs, setShowUserInputs] = useState(true);
  const [showInfoInputs, setShowInfoInputs] = useState(true);
  const [showAddressInputs, setShowAddressInputs] = useState(true);

  const toggleUserInputs = () => setShowUserInputs(!showUserInputs);
  const toggleInfoInputs = () => setShowInfoInputs(!showInfoInputs);
  const toggleAddressInputs = () => setShowAddressInputs(!showAddressInputs);

  return (
    <div className="px-0 py-2">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <h3 className="fw-bold">User Information</h3>
          {newUserType != 1 && (
            <Button
              variant="light"
              onClick={toggleUserInputs}
              style={{ border: "none", backgroundColor: "transparent" }}
            >
              {showUserInputs ? <ChevronUp /> : <ChevronDown />}
            </Button>
          )}
        </div>
        <Form.Group controlId="userStatus" className="mb-3  w-25">
          <Form.Select
            value={newUserType}
            onChange={(e) => setNewUserType(e.target.value)}
            style={{
              height: "2.5rem",
              borderRadius: "3px",
              boxShadow: "none",
              outline: "none",
            }}
          >
            {Object.entries(userType).map(([id, type]) => (
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
                />
                <CustomInput
                  controlId="lastName"
                  className=""
                  placeholder="Last"
                />
              </div>
            </div>

            <CustomInput
              controlId="email"
              type="email"
              label="Email"
              labelClassName="fw-bold mb-0"
              className="mb-3"
            />
            <CustomInput
              controlId="password"
              label="password"
              type="password"
              labelClassName="fw-bold mb-0"
              className="mb-3"
            />
          </Col>

          <Col md={6} className="align-items-start">
            <CustomInput
              controlId="username"
              label="Username"
              labelClassName="fw-bold mb-0"
              className="mb-3"
            />
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
                  placeholder="Enter phone number"
                  style={{ border: "none", outline: "none", boxShadow: "none" }}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
      )}
      {newUserType != 1 && (
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
                />

                <CustomInput
                  controlId="email"
                  label="Email"
                  type="email"
                  className="mb-3"
                  labelClassName="fw-bold mb-0"
                />

                <CustomInput
                  controlId="regNum"
                  label="Registration Number"
                  type="text"
                  className="mb-3"
                  labelClassName="fw-bold mb-0"
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
                  />
                </Form.Group>

                <CustomInput
                  style={{ width: "50%" }}
                  controlId="userType"
                  label="Est. Type"
                  type="text"
                  labelClassName="fw-bold mb-0"
                  value={newUserType == 2 ? "Retail Store" : "Factory"}
                  disabled
                />
                <div className="d-flex flex-column align-items-center justify-content-between mt-4">
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
                        src={userIcon}
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
                      style={{ display: "none" }}
                    />
                  </div>
                  <p>Upload logo</p>
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
                />

                <CustomInput
                  controlId="streetAdd"
                  label="Street Address"
                  labelClassName="fw-bold mb-0"
                  className="mb-3"
                  placeholder="King Abdulla street"
                />
              </Col>
              <Col md={6}>
                <CustomInput
                  controlId="streetAdd"
                  label="Street Address"
                  labelClassName="fw-bold mb-0"
                  className="mb-3"
                  placeholder="King Abdulla street"
                />
              </Col>
            </Row>
          )}
        </>
      )}
      <div className="d-flex justify-content-end">
        <CustomButton
          label="Save"
          className="px-5"
          style={{ backgroundColor: AppColors.primaryColor }}
        />
      </div>
    </div>
  );
};

export default AddUser;
