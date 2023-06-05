import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateAfterLogin = ({ children }) => {
  const cookie = Cookies.get("statusLogin")
  return cookie === "true" ? <Navigate to={"/dashboard"}/> : children;
};

export default PrivateAfterLogin;