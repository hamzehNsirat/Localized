import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import AppColors from "../Theme/AppColors";
import { FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";
import logo from "../../assets/LandingPageLogo.png";

function Footer() {
  return (
    <footer
      className="text-center text-lg-start"
      style={{
        backgroundColor: "white",
        paddingTop: "30px",
      }}
    >
      <div className="d-flex justify-content-around align-items-start">
        <Col
          md={2}
          className="mb-4 d-flex flex-column align-items-center justify-content-center"
        >
          <h3
            className="fw-bold w-100"
            style={{ color: AppColors.primaryColor }}
          >
            <img src={logo} alt="Localized" style={{ width: "100%" }} />
          </h3>
          <div className="d-flex gap-5 justify-content-center justify-content-md-start mt-2">
            <a
              href="https://instagram.com"
              style={{ color: AppColors.primaryColor }}
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://twitter.com"
              style={{ color: AppColors.primaryColor }}
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://facebook.com"
              style={{ color: AppColors.primaryColor }}
            >
              <FaFacebookF size={20} />
            </a>
          </div>
        </Col>

        <Col md="auto" className="mb-4 d-flex flex-column align-items-start">
          <h5 className="fw-bold">Company</h5>
          <ul className="list-unstyled d-flex flex-column align-items-start">
            <li>
              <a href="#about" className="text-dark text-decoration-none">
                About
              </a>
            </li>
            <li>
              <a
                href="#privacy-policy"
                className="text-dark text-decoration-none"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#terms-conditions"
                className="text-dark text-decoration-none"
              >
                Terms of conditions
              </a>
            </li>
          </ul>
        </Col>

        <Col md="auto" className="mb-4 d-flex flex-column align-items-start">
          <h5 className="fw-bold">Contact</h5>
          <ul className="list-unstyled d-flex flex-column align-items-start">
            <li>
              <a href="#faq" className="text-dark text-decoration-none">
                FAQ
              </a>
            </li>
            <li>
              <a href="#support" className="text-dark text-decoration-none">
                Support
              </a>
            </li>
            <li>
              <a href="#careers" className="text-dark text-decoration-none">
                Careers
              </a>
            </li>
          </ul>
        </Col>

        <Col md="auto" className="mb-4 d-flex flex-column align-items-start">
          <h5 className="fw-bold">Members</h5>
          <ul className="list-unstyled d-flex flex-column align-items-start">
            <li>
              <a href="#suppliers" className="text-dark text-decoration-none">
                Suppliers
              </a>
            </li>
            <li>
              <a href="#retailers" className="text-dark text-decoration-none">
                Retailers
              </a>
            </li>
          </ul>
        </Col>
      </div>

      <div
        className="text-center py-3 text-white"
        style={{ backgroundColor: AppColors.primaryColor }}
      >
        Copyright © 2024 Localized. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
