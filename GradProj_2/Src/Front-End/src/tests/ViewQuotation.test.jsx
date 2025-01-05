import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../components/Auth/Login/LoginForm"; // Adjust path accordingly
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../components/Providers/authProvider"; // Adjust path accordingly
import authApi from "../api/authApi"; // Mock API

jest.mock("../api/authApi");

describe("Login Component", () => {
  test("allows user to log in", async () => {
    authApi.login.mockResolvedValue({
      data: {
        body: {
          success: true,
          userId: "30",
          userType: "3",
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMCIsInVzZXJUeXBlIjoiMyIsInVzZXJuYW1lIjoiaGFtU3VwQDEiLCJ0b2tlblZlcnNpb24iOjEyLCJpYXQiOjE3MzU5OTcxMjksImV4cCI6MTczNjA4MzUyOX0.UN5Zn9--ooxq8oxIrcO9OmVrusF9ml0IzThEVllK_nc",
        },
      },
    });

    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "hamSup@1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Sup@1234" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({
        username: "hamSup@1",
        password: "Sup@1234",
      });
    });
  });
});
