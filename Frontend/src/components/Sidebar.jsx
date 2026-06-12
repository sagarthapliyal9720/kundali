import {
  LayoutDashboard,
  User,
  Stars,
  Calendar,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-5 left-5 z-50 bg-[#1e1038] border border-[#c9922a] p-3 rounded-xl text-[#f0e6c8] shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* SIDEBAR */}
      {/* SIDEBAR */}
<div
  className={`
    fixed
    top-0 left-0
    h-screen
    w-72
    bg-[#1e1038]/95
    border-r border-[#c9922a]
    text-[#f0e6c8]
    pt-16 md:pt-6 pb-6 px-6
    flex flex-col
    z-50
    transform
    transition-transform
    duration-300
    ${
      mobileOpen
        ? "translate-x-0"
        : "-translate-x-full md:translate-x-0"
    }
  `}
>
        <div>
          {/* MOBILE CLOSE BUTTON */}
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-5 right-5 md:hidden text-[#f0e6c8]"
          >
            <X size={24} />
          </button>

          <h1 className="text-3xl font-bold mb-10 text-[#c9922a]">
            Kundli App
          </h1>

          <nav className="space-y-3">
            <button
              onClick={() => {
                navigate("/dashboard");
                setMobileOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-[#2d1b4e] transition"
            >
              <LayoutDashboard size={22} />
              Dashboard
            </button>

            <button
              onClick={() => {
                navigate("/profile");
                setMobileOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-[#2d1b4e] transition"
            >
              <User size={22} />
              Profile
            </button>

            <button
              onClick={() => {
                navigate("/Kundli");
                setMobileOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-[#2d1b4e] transition"
            >
              <Stars size={22} />
              Generate Kundli
            </button>

            <button
              onClick={() => {
                navigate("/daily-horoscope");
                setMobileOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-[#2d1b4e] transition"
            >
              <Calendar size={22} />
              Horoscope
            </button>
          </nav>
        </div>

        {/* LOGOUT BUTTON */}
       {/* LOGOUT BUTTON */}
{/* LOGOUT BUTTON */}
<div className="mt-10">
  <button
    onClick={() => setShowLogoutPopup(true)}
    className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-[#2d1b4e] transition"
  >
    <LogOut size={22} />
    Logout
  </button>
</div>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* LOGOUT POPUP */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-[#1e1038] border border-[#c9922a] rounded-3xl p-8 w-[90%] max-w-md shadow-2xl text-center">
            <h2 className="text-3xl font-bold text-[#f0e6c8] mb-4">
              Logout
            </h2>

            <p className="text-[#8b7aa0] mb-8">
              Are you sure you want to logout?
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition"
              >
                Yes
              </button>

              <button
                onClick={() => setShowLogoutPopup(false)}
                className="bg-[#c9922a] hover:bg-[#e0aa3e] text-[#160d28] px-6 py-3 rounded-xl font-bold transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}