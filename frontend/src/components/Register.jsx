import { useState } from 'react';
import './Register.css';
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const Navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const register = async (e) => {
    e.preventDefault();
    const data = { username, email, password, confirmPassword }
    const response = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
      credentials: "include"
    });
    const result = await response.json();
    if (response.ok === true) {
      alert(result.message)
      Navigate("/")
    } else {
      alert(result.message)
    }
  }


  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={register}>
        <label>
          Username:
          <input type="text" value={username} onChange={handleUsernameChange} required/>
        </label>
        <br />
        <label>
          Email:
          <input type="email" value={email} onChange={handleEmailChange} required/>
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} required/>
        </label>
        <label>
          Confirm Password:
          <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} required/>
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
      <a href="/" className="register-link">Already have an account?</a>
    </div>
  );
}

export default Register;