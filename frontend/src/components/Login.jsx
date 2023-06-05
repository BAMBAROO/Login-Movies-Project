import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Cookies from "js-cookie";


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState("");
  const Navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email, password };
    const dataForm = JSON.stringify(data);
    const response = await fetch("http://localhost:8000/login",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: dataForm,
      credentials: "include"
    })
    const result = await response.json();
    if (response.ok === true) {
      Cookies.set('statusLogin', 'true', { expires: 7 })
      return Navigate("/dashboard")
    } else {
      return setMsg(result.message)
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
        <p style={{color: "red"}}>{msg}</p>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={handleEmailChange} required/>
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} required/>
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      <a href="/register" className="register-link">Don't have an account?</a>
    </div>
  );
}

export default Login;
