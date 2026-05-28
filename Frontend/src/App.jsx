import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Kundli from "./pages/kundli";
import DailyHoroscop from "./pages/DailyHoroscop";
import Birthchart from "./pages/Birthchart";
import DailyHoroscope from "./pages/DailyHoroscope";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Kundli" element={<Kundli />} />
        <Route path="/daily-horoscope" element={<DailyHoroscope />}/>
        <Route path="/birthchart" element={<Birthchart/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;