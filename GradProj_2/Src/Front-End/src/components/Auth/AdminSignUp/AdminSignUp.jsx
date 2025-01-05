import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "../../Providers";

const AdminSignUp = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { signUp } = useAuth();
  // Validate the token
  useEffect(() => {
    signUp();

    const validateToken = async () => {
      try {
        const response = await fetch(`/api/admin/validate-token/${token}`);
        const result = await response.json();
        setIsValidToken(result.isValid);
      } catch (error) {
        console.error("Token validation failed:", error);
        setIsValidToken(false);
      }
    };

    validateToken();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/adminLogin");
      } else {
        console.error("Sign-up failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (!isValidToken) {
    return <p>Invalid or expired link. Please contact support.</p>;
  }

  return (
    <div className="container">
      <h2>Admin Sign-Up</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Button type="submit" className="mt-3">
          Sign Up
        </Button>
      </Form>
    </div>
  );
};

export default AdminSignUp;
