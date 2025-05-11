import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import MainLayout from "../layouts/MainLayout";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

export default ProtectedRoute;
