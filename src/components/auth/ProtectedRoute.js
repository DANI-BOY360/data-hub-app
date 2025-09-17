import React from "react";
import { useAuth } from "../../context/AuthContext";
import Login from "./Login";
import LoadingSpinner from "../common/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Login />;
  }

  return children;
};

export default ProtectedRoute;
