import { useState } from "react";
import AppColors from "../../Theme/AppColors";
import userIcon from "../../../assets/user.png";
import jordanFlag from "../../../assets/jordanFlag.png";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useAuth } from "../../Providers/authProvider";
import { toast } from "react-toastify";
import LoadingScreen from "../../Common/LoadingScreen";
import updateApi from "../../../api/retailerAPIs/updates";
import { formatDateForInput } from "../../Utils/formatters";

const ProfileSettings = () => {
  const [loading, setLoading] = useState(false); // when its null it will be loading to fetch the data
  const [error, setError] = useState(null);
  const { userData, setUserData, uploadImage } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: userData.userDetails.firstName || "",
    middleName: userData.userDetails.middleName || "",
    lastName: userData.userDetails.lastName || "",
    username: userData.userDetails.userName || "",
    email: userData.userDetails.userEmail || "",
    nationalNumber: userData.userDetails.nationalNumber || "",
    userType: "supplier",
    phoneNumber: userData.userDetails.userPhone || "",
    dateOfBirth: userData.userDetails.dateOfBirth || "",
    address: userData.userDetails.userAddress || "",
    profileImage: userData.userDetails.userImage || null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setProfileData({
      ...profileData,
      profileImage: e.target.files[0],
    });
  };

  const handleSave = async () => {
    try {
      // Determine if the image has changed
      const isImageChanged =
        userData.userDetails.userImage !== profileData.profileImage;

      // Upload image only if it has changed
      let imgUrl = userData.userDetails.userImage;
      if (isImageChanged) {
        imgUrl = await uploadImage(profileData.profileImage);
        if (!imgUrl) {
          console.log("Failed image upload");
          toast.error("Failed to upload image", {
            progressStyle: { background: AppColors.primaryColor },
          });
          return;
        }
      }

      setLoading(true);

      const response = await updateApi.updateUser(
        profileData,
        userData,
        imgUrl
      );
      if (response.resData.header.errorCode == "0000") {
        const updatedDetails = {
          ...userData.userDetails,
          ...response.payload.user,
        };

        setUserData((prev) => ({
          ...prev,
          userDetails: updatedDetails,
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
        <h3 className="fw-bold">Profile Information</h3>
        <Button
          className="fw-bold"
          onClick={handleSave}
          style={{
            fontSize: "14px",
            letterSpacing: "1px",
            backgroundColor: AppColors.primaryColor,
            width: "20%",
            borderRadius: "5px",
            boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          Save
        </Button>
      </div>
      <Row className="mt-4 justify-content-between">
        <Col md={5}>
          <h6 className="fw-bold mb-0">Full Name</h6>
          <div className="d-flex gap-3 mb-3">
            <Form.Group controlId="firstName">
              <Form.Control
                type="text"
                placeholder="First"
                name="firstName"
                value={profileData.firstName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="firstName">
              <Form.Control
                type="text"
                placeholder="Middle"
                name="middleName"
                value={profileData.middleName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="lastName">
              <Form.Control
                type="text"
                name="lastName"
                placeholder="Last"
                value={profileData.lastName}
                onChange={handleInputChange}
              />
            </Form.Group>
          </div>

          <div className="d-flex gap-3 align-items-center mb-3">
            <Form.Group controlId="email" className="w-100">
              <Form.Label className="fw-bold mb-0">Email</Form.Label>
              <div className="d-flex justify-content-between gap-3 align-items-center w-100">
                <Form.Control
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-100"
                />
                <a href="#" className="text-dark fw-bold mb-2 w-25">
                  Verify
                </a>
              </div>
            </Form.Group>
          </div>

          <div className="d-flex gap-3 mb-3">
            <Form.Group controlId="nationalNumber" className="w-75">
              <Form.Label className="fw-bold mb-0">National Number</Form.Label>
              <Form.Control
                type="text"
                name="nationalNumber"
                value={profileData.nationalNumber}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="userType" style={{ width: "50%" }}>
              <Form.Label className="fw-bold mb-0">User Type</Form.Label>
              <Form.Control
                type="text"
                name="userType"
                value={"Retailer"}
                readOnly
                disabled
              />
            </Form.Group>
          </div>

          <Form.Group controlId="phoneNumber" className="mb-3">
            <Form.Label className="fw-bold mb-0">Phone Number</Form.Label>
            <div className="d-flex align-items-center border rounded px-2 py-1">
              <img src={jordanFlag} alt="Jordan" style={{ width: "24px" }} />
              <span style={{ padding: "0 7px", borderRight: "1px solid gray" }}>
                +962
              </span>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                style={{ border: "none", outline: "none" }}
              />
            </div>
          </Form.Group>

          <Form.Group controlId="dateOfBirth" className="mb-3">
            <Form.Label className="fw-bold mb-0">Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="dateOfBirth"
              value={formatDateForInput(profileData.dateOfBirth)}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>

        <Col md={6} className="align-items-start">
          <Form.Group controlId="username" className="mb-3">
            <Form.Label className="fw-bold mb-0">Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={profileData.username}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="address" className="mb-3">
            <Form.Label className="fw-bold mb-0">Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
            />
          </Form.Group>

          <div
            className="d-flex flex-column mt-4"
            style={{ width: "min-content" }}
          >
            <img
              src={
                profileData.profileImage instanceof File
                  ? URL.createObjectURL(profileData.profileImage)
                  : profileData.profileImage ?? userIcon
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
              onChange={handleFileChange}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ProfileSettings;
