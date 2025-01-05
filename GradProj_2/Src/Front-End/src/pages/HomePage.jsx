import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import pic from "../assets/LandingPagePic.png";
import "bootstrap/dist/css/bootstrap.min.css";
import AppColors from "../components/Theme/AppColors.jsx";

import durraPic from "../assets/companiesLogos/durra.png";
import mrChipsPic from "../assets/companiesLogos/mrChips.png";
import habibaPic from "../assets/companiesLogos/habiba.png";
import elEmlaqPic from "../assets/companiesLogos/alEmlaq.png";
import aboveAvgPic from "../assets/companiesLogos/aboveAvg.png";

import CustomButton from "../components/Common/CustomButton.jsx";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <div
        style={{ backgroundColor: AppColors.primaryColor }}
        className="d-flex justify-content-center align-items-center position-relative"
      >
        <div className="w-15">
          <h1 className="text-white mb-5 fw-bold">
            Discover, Connect, and <br />
            expand your business.
          </h1>
          <Button
            onClick={() => {
              navigate("/login");
            }}
            variant="light"
            className="rounded-pill px-5 py-14 fw-bold"
            style={{ boxShadow: "-7px 3px 1px rgba(0, 0, 0, 1)" }}
          >
            Sign Up/Log In
          </Button>
        </div>
        <img src={pic} style={{ width: "40vw" }} className="" />
      </div>
      <div
        className="d-flex justify-content-around align-items-center py-3"
        style={{ backgroundColor: "#F2F4F3" }}
      >
        <img
          src={durraPic}
          alt="Durra"
          style={{
            width: "10%",
            filter: "grayscale(100%)",
          }}
        />
        <img
          src={mrChipsPic}
          alt="mrChips"
          style={{ width: "10%", filter: "grayscale(100%)" }}
        />
        <img
          src={habibaPic}
          alt="habiba"
          style={{ width: "10%", filter: "grayscale(100%)" }}
        />
        <img
          src={elEmlaqPic}
          alt="elEmlaq"
          style={{ width: "10%", filter: "grayscale(100%)" }}
        />
        <img
          src={aboveAvgPic}
          alt="aboveAvg"
          style={{ width: "10%", height: "5%", filter: "grayscale(100%)" }}
        />
      </div>
      <Container className="d-flex py-5 align-items-center w-100">
        <div className="w-100">
          <p style={{ color: AppColors.primaryColor }} className="mb-0">
            Who are we?
          </p>
          <h3 style={{ color: "#282C4B" }} className="fw-bold my-3">
            Localized
          </h3>
          <p style={{ color: "#747582" }} className="w-75">
            is a platform dedicated to boosting Jordan’s economy by connecting
            local manufacturers with retailers. It provides tools for product
            discovery, market access, and business growth.
          </p>
        </div>
        <div className="d-flex align-items-center w-75">
          <div className="d-flex flex-column align-items-center">
            <h2 style={{ color: AppColors.primaryColor }}>99+</h2>
            <h4 style={{ color: "#282C4B" }}>Retailers</h4>
          </div>
          <div
            className="d-inline-block mx-5"
            style={{
              width: "0.5px",
              height: "130px",
              backgroundColor: "#858282",
            }}
          ></div>
          <div className="d-flex flex-column align-items-center">
            <h2 style={{ color: AppColors.primaryColor }}>30+</h2>
            <h4 style={{ color: "#282C4B" }}>Suppliers</h4>
          </div>
          <div
            className="d-inline-block mx-5"
            style={{
              width: "0.5px",
              height: "130px",
              backgroundColor: "#858282",
            }}
          ></div>
          <div className="d-flex flex-column align-items-center">
            <h2 style={{ color: AppColors.primaryColor }}>250+</h2>
            <h4 style={{ color: "#282C4B" }}>Products</h4>
          </div>
        </div>
      </Container>
      <div
        className="py-5"
        style={{ backgroundColor: AppColors.primaryColor, color: "white" }}
      >
        <div className="d-flex flex-column align-items-center">
          <h1 className="fw-bold mb-0" style={{ letterSpacing: "1.5px" }}>
            Jordan's First Platform{" "}
          </h1>
          <p className="fw-lighter mt-0">
            for Product Discovery and Local Business Growth
          </p>
        </div>
        <div className="d-flex"></div>
        <div className="d-flex"></div>
        <div className="d-flex"></div>
      </div>
      <div
        className="d-flex align-items-center justify-content-around py-3"
        style={{
          backgroundColor: "#252525",
          color: "white",
          paddingInline: "100px",
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <div className="d-flex flex-column align-items-center">
            <h2 className="fw-bold mb-0" style={{ fontSize: "2rem" }}>
              Let's get to
            </h2>
            <h1 className="fw-bold mb-0" style={{ fontSize: "4rem" }}>
              Work
            </h1>
          </div>
          <h1 className="mb-0" style={{ fontSize: "7rem" }}>
            !
          </h1>
        </div>
        <div>
          <h6>Join Localized today and empower your business. </h6>
          <CustomButton
            label="Sign Up"
            className="px-5 mt-2"
            style={{
              backgroundColor: AppColors.primaryColor,
              boxShadow: "0px 0px 20px rgba(255,255,255,0.15)",
            }}
            onClick={() => {
              navigate("/signUp");
            }}
          />
        </div>
      </div>
    </>
  );
}
