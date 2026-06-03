import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Kundli from "./pages/kundli";
import Birthchart from "./pages/Birthchart";
import DailyHoroscope from "./pages/DailyHoroscope";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import ForgotPassword from "./pages/Forgotpassword";
import ResetPassword from "./pages/Resetpassword";
import VerifyOTP from "./pages/VerifyOTP";
import VerifyRegisterOTP from "./pages/VerifyRegisterOTP";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Kundli" element={<Kundli />} />
        <Route path="/daily-horoscope" element={<DailyHoroscope />} />
        <Route path="/birthchart" element={<Birthchart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp"element={<VerifyOTP />}/>
        <Route
  path="/verify-register-otp"
  element={<VerifyRegisterOTP />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
