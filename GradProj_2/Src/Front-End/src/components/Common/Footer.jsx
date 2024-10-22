import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-light text-center text-lg-start">
      <Container className="p-4">
        <Row>
          <Col lg={6} md={12} className="mb-4">
            <h5 className="text-uppercase">About Us</h5>
            <p>
              Localized is committed to bridging the gap between suppliers and retailers in Jordan.
            </p>
          </Col>

          <Col lg={3} md={6} className="mb-4">
            <h5 className="text-uppercase">Links</h5>
            <ul className="list-unstyled">
              <li><a href="#home" className="text-dark">Home</a></li>
              <li><a href="#about" className="text-dark">About</a></li>
              <li><a href="#contact" className="text-dark">Contact</a></li>
              <li><a href="#members" className="text-dark">Members</a></li>
            </ul>
          </Col>

          <Col lg={3} md={6} className="mb-4">
            <h5 className="text-uppercase">Contact</h5>
            <ul className="list-unstyled">
              <li>Email: info@localized.com</li>
              <li>Phone: +962 7 1234 5678</li>
            </ul>
          </Col>
        </Row>
      </Container>

      <div className="text-center p-3 bg-dark text-white">
        © 2024 Localized. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
