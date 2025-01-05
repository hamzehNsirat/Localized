import { Button, Form } from "react-bootstrap";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../Providers";

const LoginForm = () => {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  // Check if the input is an email
  const isEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  // Handle login logic
  const handleLogin = async (e) => {
    e.preventDefault();
    const loginType = isEmail(input) ? "email" : "username";
    console.log(`Logging in with ${loginType}:`, input); // for debugging mode
    const userEmail = loginType == "email" ? input : null;
    const userName = loginType == "username" ? input : null;
    const userPassword = password;
    try {
      const response = await login(userEmail, userName, userPassword);
      if (response?.body.success) {
        console.log("Login successful");
      } else console.log("something happened: ", response.body);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Form autoComplete="on" onSubmit={handleLogin}>
      <Form.Group className="mb-3" controlId="input">
        <Form.Label className="mb-0">Email / Username</Form.Label>
        <Form.Control
          type="text"
          name="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-1" controlId="password">
        <Form.Label className="mb-0">Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <a
        href="/forgot-password"
        style={{ color: "inherit", fontSize: "0.9rem" }}
      >
        Forgot Password?
      </a>
      <br />
      <Button
        type="submit"
        variant="dark"
        className="my-4 px-5 py-14 w-100 fw-bold"
        style={{ boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.8)" }}
      >
        Log In
      </Button>
    </Form>
  );
};

export default LoginForm;
