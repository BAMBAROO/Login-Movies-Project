import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import PrivateAfterLogin from "./privateRoutes/AfterLogin.jsx";
import PrivateBeforeLogin from "./privateRoutes/BeforeLogin.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={
            <PrivateAfterLogin>
              <Login />
            </PrivateAfterLogin>
          } />
        <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={
            <PrivateBeforeLogin>
              <Dashboard />
            </PrivateBeforeLogin>
          } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
