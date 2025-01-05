// routes/PrivateRoute.jsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../components/Providers/authProvider";

const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to a "Not Authorized" page if the user's role is not allowed
    return <Navigate to="/unauthorized" />;
  }

  // Render the child route if authenticated and authorized
  return <Outlet />;
};

export default PrivateRoute;
