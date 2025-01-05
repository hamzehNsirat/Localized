import { Nav, Navbar, NavDropdown, Container, Button } from "react-bootstrap";
import { Outlet, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AppColors from "../Theme/AppColors";
import logo from "../../assets/landingPageLogo.png";
import Footer from "./Footer";

export default function Header() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <>
      <Navbar
        expand="lg"
        className="bg-body-tertiary"
        style={{ padding: "17px 0" }}
      >
        <Container className="d-flex justify-content-between align-content-center">
          <Navbar.Brand
            href="#home"
            className="fw-bold"
            style={{ width: "10vw", textAlign: "center" }}
          >
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <img src={logo} alt="Localized" width="100%"></img>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-center"
            style={{ textAlign: "right" }}
          >
            <Nav className="w-100 d-flex justify-content-center gap-4 fw-bold text-dark">
              <Nav.Link as="span">
                <Link
                  to="/about"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  About
                </Link>
              </Nav.Link>
              <Nav.Link as="span">
                <Link
                  to="/contactUs"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Contact Us
                </Link>
              </Nav.Link>
              <NavDropdown title="Members" id="basic-nav-dropdown">
                <NavDropdown.Item
                  href="#action1"
                  className="dropdown-item-hover"
                >
                  Retailer
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="#action2"
                  className="dropdown-item-hover"
                >
                  Supplier
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
          <Button
            onClick={handleLoginClick}
            className="rounded-pill px-4 py-2"
            style={{
              backgroundColor: AppColors.primaryColor,
              border: "none",
              boxShadow: "-4px 3px 1px rgba(0, 0, 0, 1)",
              fontSize: "14px",
            }}
          >
            Sign Up/Log In
          </Button>
        </Container>
      </Navbar>
      <Outlet />
      <Footer></Footer>
    </>
  );
}
