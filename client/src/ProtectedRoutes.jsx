import React, { useState } from "react";

import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";


export const ProtectedRoutes = () => {
  
  
  const {user, isAuthenticated,loading} = useAuth()
  console.log("isAhtu", isAuthenticated)
  console.log("loading", loading)
  //const navigate = useNavigate();
  if (loading) return <h1>Loading...</h1>;
  if (!isAuthenticated && !loading) return <Navigate to="/login" replace />;
  return <Outlet />;
};

