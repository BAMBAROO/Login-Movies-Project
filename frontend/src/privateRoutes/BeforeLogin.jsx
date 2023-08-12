import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const PrivateBeforeLogin = ({ children }) => {
  const cookie = Cookies.get("statusLogin")
  return cookie === "true" ? children : <Navigate to={"/"}/>; 
};

export default PrivateBeforeLogin;
