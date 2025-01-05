import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import AppColors from "../../Theme/AppColors";
import ProfileSettings from "./ProfileSettings";
import EstablishmentSettings from "./EstablishmentSettings";

import userIcon from "../../../assets/profileIcons/userSettings.png";
import estIcon from "../../../assets/profileIcons/establishment.png";
import settingsIcon from "../../../assets/profileIcons/settingsIcon.png";
import policiesIcon from "../../../assets/profileIcons/policiesIcon.png";
import helpIcon from "../../../assets/profileIcons/helpIcon.png";
import logoutIcon from "../../../assets/profileIcons/logoutIcon.png";

import { useAuth } from "../../Providers";

import "../styles/profile.css";
import ProfileSidebarItem from "../components/ProfileSidebarItem";
import Policies from "../../Common/Policies";

/* 
  updateUserData, updateRetailStoreData
  getPolicies
  logout
*/

const Profile = () => {
  const { logout } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleCurrentStep = (step) => setCurrentStep(step);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProfileSettings />;
      case 2:
        return <EstablishmentSettings />;
      case 3:
        return <div>Settings & Privacy</div>;
      case 4:
        return <Policies />;
      case 5:
        return <div>Help & Support</div>;
      default:
        return null;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Dynamically calculate the top offset
      const scrollOffset = Math.min(window.scrollY, 77); // Max scroll offset is 100px
      setIsScrolled(scrollOffset);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const sidebarStyle = {
    backgroundColor: AppColors.blackFont,
    position: "fixed",
    top: `${77 - isScrolled}px`, // Dynamically adjust based on scroll
    height: `calc(100% - ${77 - isScrolled}px)`, // Adjust height accordingly
    transition: "top 0.3s ease, height 0.3s ease",
    width: "17%",
    zIndex: 1000,
    padding: "2rem 0",
  };

  const contentStyle = {
    marginLeft: "20%",
    padding: "2rem 0",
    paddingRight: "10rem",
    width: "85%",
    transition: "margin-left 0.3s ease",
  };

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col md={2} style={sidebarStyle}>
          <div className="d-flex flex-column justify-content-between h-100">
            <div>
              <ProfileSidebarItem
                icon={userIcon}
                label="Profile"
                isActive={currentStep === 1}
                onClick={() => handleCurrentStep(1)}
              />
              <ProfileSidebarItem
                icon={estIcon}
                label="Establishment"
                isActive={currentStep === 2}
                onClick={() => handleCurrentStep(2)}
              />
              <ProfileSidebarItem
                icon={settingsIcon}
                label="Settings & Privacy"
                isActive={currentStep === 3}
                onClick={() => handleCurrentStep(3)}
              />
            </div>
            <div>
              <ProfileSidebarItem
                icon={policiesIcon}
                label="Policies"
                isActive={currentStep === 4}
                onClick={() => handleCurrentStep(4)}
              />
              <ProfileSidebarItem
                icon={helpIcon}
                label="Help & Support"
                isActive={currentStep === 5}
                onClick={() => handleCurrentStep(5)}
              />
              <ProfileSidebarItem
                icon={logoutIcon}
                label="Log Out"
                onClick={logout}
                isDanger
              />
            </div>
          </div>
        </Col>

        {/* Main Content */}
        <Col style={contentStyle}>{renderStep()}</Col>
      </Row>
    </Container>
  );
};

export default Profile;
