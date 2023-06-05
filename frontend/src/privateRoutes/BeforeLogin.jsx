import Cookies from "js-cookie";
// import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateBeforeLogin = ({ children }) => {
  const cookie = Cookies.get("statusLogin")
  return cookie === "true" ? children : <Navigate to={"/"}/>; 
};

export default PrivateBeforeLogin;