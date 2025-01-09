import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import axios from "axios";
import { toast } from "react-toastify";
import AppColors from "../Theme/AppColors";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("userRole");
    if (token && role && userId) {
      setUser({ token, role, userId });
    }
  }, []);

  const login = async (userEmail, userName, userPassword) => {
    try {
      const user = { user: { userEmail, userName, userPassword } };
      const data = await authApi.login(user);
      if (data.body.success) {
        localStorage.setItem("authToken", data.body.token);
        localStorage.setItem("userId", data.body.userId);
        localStorage.setItem("userRole", data.body.userType);
        setUser({
          token: data.body.token,
          role: data.body.userType,
          userId: data.body.userId,
        });
        const userNav = {
          1: "/admin",
          2: "/retailer",
          3: "/supplier",
        };
        navigate(userNav[data.body.userType]);
      } else {
        console.log("Login failed:", data.header.errorCode);
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error?.response?.data.body.details.success == false)
        toast.error(`Login Failed, username or password are wrong`, {
          progressStyle: { background: AppColors.primaryColor },
        });
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file); // Key must match `upload.single("image")`

    try {
      const response = await axios.post(
        "http://localhost:5055/uploads/images/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data.imageUrl;
    } catch (error) {
      console.error(
        "Error uploading image:",
        error.response?.data || error.message
      );
      return false;
    }
  };

  const signUp = async (formData) => {
    const logoUrl = uploadImage(formData.logo);
    if (!logoUrl || logoUrl == null) {
      console.log("failed image upload");
      return false;
    }
    const mappedFormData = {
      userType: formData.position,
      firstName: formData.firstName,
      lastName: formData.lastName,
      userName: formData.username,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phone,
      establishmentName: formData.companyName,
      establishmentContactNumber: formData.companyPhoneNumber,
      establishmentEmail: formData.companyEmail,
      establishmentDescription: formData.description,
      establishmentCommercialRegistrationNum: formData.regNumber,
      establishmentCity: formData.companyAddress,
      establishmentStreet: formData.companyStreet,
      establishmentBuildingNum: formData.companyBuildingNo,
      establishmentIndustryType: formData.industryTypes,
      establishmentLogo: logoUrl,
    };
    try {
      const data = await authApi.signUp(mappedFormData);
      console.log("Sign up successful:", data);
      return true;
    } catch (error) {
      console.error("Sign up failed:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const response = await authApi.logout();
      if (response.body.success) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userData");
        setUser(null);
        setUserData(null);
        navigate("/");
      } else {
        console.log("failed logging out", response.header.errorCode);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        userData,
        setUserData,
        uploadImage,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
