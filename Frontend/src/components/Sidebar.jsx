import {
  LayoutDashboard,
  User,
  Stars,
  Calendar,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {

  const navigate = useNavigate();

  // LOGOUT POPUP STATE
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // HANDLE LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/login");
  };

  return (

    <>
    
      {/* SIDEBAR */}
      <div className="w-72 bg-[#1e1038]/95 border-r border-[#c9922a] text-[#f0e6c8] p-6 hidden md:flex flex-col justify-between relative z-10">

        <div>

          <h1 className="text-3xl font-bold mb-10 text-[#c9922a]">
            Kundli App
          </h1>

          <nav className="space-y-3">

            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-[#2d1b4e] transition"
            >
              <LayoutDashboard size={22} />
              Dashboard
            </button>

            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-[#2d1b4e] transition"
             onClick={() => navigate("/profile")}>
              <User size={22} />
              Profile
            </button>

            <button
              onClick={() => navigate("/Kundli")}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-[#2d1b4e] transition"
            >
              <Stars size={22} />
              Generate Kundli
            </button>

            <button
              onClick={() => navigate("/daily-horoscope")}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-[#2d1b4e] transition"
            >
              <Calendar size={22} />
              Horoscope
            </button>

            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-[#2d1b4e] transition">
              <FileText size={22} />
              Reports
            </button>

            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-[#2d1b4e] transition">
              <Settings size={22} />
              Settings
            </button>

          </nav>

        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={() => setShowLogoutPopup(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#2d1b4e] transition"
        >
          <LogOut size={22} />
          Logout
        </button>

      </div>

      {/* LOGOUT POPUP */}
      {
        showLogoutPopup && (

          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-[#1e1038] border border-[#c9922a] rounded-3xl p-8 w-[90%] max-w-md shadow-2xl text-center">

              <h2 className="text-3xl font-bold text-[#f0e6c8] mb-4">
                Logout
              </h2>

              <p className="text-[#8b7aa0] mb-8">
                Are you sure you want to logout?
              </p>

              <div className="flex gap-4 justify-center">

                {/* YES */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition"
                >
                  Yes
                </button>

                {/* NO */}
                <button
                  onClick={() => setShowLogoutPopup(false)}
                  className="bg-[#c9922a] hover:bg-[#e0aa3e] text-[#160d28] px-6 py-3 rounded-xl font-bold transition"
                >
                  No
                </button>

              </div>

            </div>

          </div>
        )
      }

    </>
  );
}