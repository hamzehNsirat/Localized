import "bootstrap/dist/css/bootstrap.min.css";
import loginPic from "../../../assets/loginPic.png";
import LoginForm from "./LoginForm";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AppColors from "../../Theme/AppColors";
import { useAuth } from "../../Providers";
import localizedLogo from "../../../assets/headerLogo.png";

const Login = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/signUp");
  };

  const { user, setUser, logout } = useAuth();

  useEffect(() => {
    // Check for persisted user data on refresh
    const token = localStorage.getItem("authToken");
    if (!user && token) {
      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("userRole");
      const persistedUser = { token, role, userId }; // Retrieve the user object
      if (persistedUser) {
        setUser(persistedUser); // Update state with persisted user
        const userNav = {
          1: "/admin",
          2: "/retailer",
          3: "/supplier",
        };
        navigate(userNav[persistedUser.role]); // Navigate to their role page
      }
    } else if (user) {
      // If user state is already set, navigate directly
      const userNav = {
        1: "/admin",
        2: "/retailer",
        3: "/supplier",
      };
      navigate(userNav[user.role]);
    }
  }, [user, navigate, setUser]);

  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      className="d-flex align-items-center"
    >
      <div
        className="container px-5 d-flex justify-content-center align-content text-light"
        style={{
          backgroundColor: AppColors.primaryColor,
          height: "100vh",
          width: "45vw",
          flexDirection: "column",
          boxShadow: "5px 0px 6px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="wlc-msg mb-4">
          <img
            src={localizedLogo}
            alt="Localized"
            style={{ width: "40%" }}
          ></img>
          <h6 className="mb-0">Welcome Back!!</h6>
        </div>
        <LoginForm />
        <p className="mb-2">Don't have an account?</p>
        <Button
          onClick={handleSignUpClick}
          variant="light"
          className="px-5 py-14 w-100 fw-bolder"
          style={{
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
            height: "2.5rem",
            borderRadius: "3px",
          }}
        >
          Register
        </Button>
      </div>
      <div
        className="w-75 d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <img src={loginPic} className="w-20" style={{ width: "40vw" }} />
      </div>
    </div>
  );
};

export default Login;
