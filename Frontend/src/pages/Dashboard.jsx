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



export default function Dashboard() {

    const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-[#160d28] flex relative overflow-hidden">

  {/* Background Glow */}
  <div className="absolute w-[500px] h-[500px] bg-[#3a1c71] opacity-20 blur-3xl rounded-full top-[-120px] left-[-120px]"></div>

  <div className="absolute w-[400px] h-[400px] bg-[#c9922a] opacity-10 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

  {/* Sidebar */}
  <div className="w-72 bg-[#1e1038]/95 border-r border-[#c9922a] text-[#f0e6c8] p-6 hidden md:block relative z-10">

    <h1 className="text-3xl font-bold mb-10 text-[#c9922a]">
      Kundli App
    </h1>

    <nav className="space-y-4">

      <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#c9922a] text-[#160d28] hover:bg-[#e0aa3e] transition">
        <LayoutDashboard size={22} />
        Dashboard
      </button>

      <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-[#2d1b4e] transition">
        <User size={22} />
        Profile
      </button>

      <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-[#2d1b4e] transition">
        <Stars size={22} />
        Generate Kundli
      </button>

      <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-[#2d1b4e] transition">
        <Calendar size={22} />
        Horoscope
      </button>

      <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-[#2d1b4e] transition">
        <FileText size={22} />
        Reports
      </button>

      <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-[#2d1b4e] transition">
        <Settings size={22} />
        Settings
      </button>

    </nav>

    {/* Logout */}
    <div className="absolute bottom-8">
      <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2d1b4e] transition">
        <LogOut size={22} />
        Logout
      </button>
    </div>
  </div>

  {/* Main Content */}
  <div className="flex-1 p-6 relative z-10">

    {/* Topbar */}
    <div className="bg-[#1e1038]/90 border border-[#c9922a] rounded-2xl shadow-md p-5 flex items-center justify-between mb-6">

      <div>
        <h2 className="text-3xl font-bold text-[#f0e6c8]">
          Welcome Back 👋
        </h2>

        <p className="text-[#8b7aa0] mt-1">
          Manage your kundli reports and astrology insights
        </p>
      </div>

      <div className="w-12 h-12 rounded-full bg-[#c9922a] text-[#160d28] flex items-center justify-center font-bold text-lg">
        M
      </div>

    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

      <div className="bg-[#1e1038]/90 border border-[#c9922a] p-6 rounded-2xl shadow-md">
        <h3 className="text-[#8b7aa0] text-sm">
          Total Kundlis
        </h3>

        <h1 className="text-4xl font-bold text-[#c9922a] mt-2">
          24
        </h1>
      </div>

      <div className="bg-[#1e1038]/90 border border-[#c9922a] p-6 rounded-2xl shadow-md">
        <h3 className="text-[#8b7aa0] text-sm">
          Horoscope Views
        </h3>

        <h1 className="text-4xl font-bold text-pink-400 mt-2">
          112
        </h1>
      </div>

      <div className="bg-[#1e1038]/90 border border-[#c9922a] p-6 rounded-2xl shadow-md">
        <h3 className="text-[#8b7aa0] text-sm">
          Reports Generated
        </h3>

        <h1 className="text-4xl font-bold text-green-400 mt-2">
          18
        </h1>
      </div>

    </div>

    {/* Main Section */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Left Section */}
      <div className="lg:col-span-2 bg-[#1e1038]/90 border border-[#c9922a] rounded-2xl shadow-md p-6">

        <h2 className="text-2xl font-bold text-[#f0e6c8] mb-5">
          Recent Kundli Reports
        </h2>

        <div className="space-y-4">

          <div className="flex items-center justify-between border border-[#5b4779] bg-[#140b27] rounded-xl p-4 hover:border-[#c9922a] transition">

            <div>
              <h3 className="font-semibold text-[#f0e6c8]">
                Manish Kundli Report
              </h3>

              <p className="text-sm text-[#8b7aa0]">
                Generated on 22 May 2026
              </p>
            </div>

            <button className="bg-[#c9922a] text-[#160d28] font-semibold px-4 py-2 rounded-lg hover:bg-[#e0aa3e] transition">
              View
            </button>

          </div>

          <div className="flex items-center justify-between border border-[#5b4779] bg-[#140b27] rounded-xl p-4 hover:border-[#c9922a] transition">

            <div>
              <h3 className="font-semibold text-[#f0e6c8]">
                Career Prediction Report
              </h3>

              <p className="text-sm text-[#8b7aa0]">
                Generated on 20 May 2026
              </p>
            </div>

            <button className="bg-[#c9922a] text-[#160d28] font-semibold px-4 py-2 rounded-lg hover:bg-[#e0aa3e] transition">
              View
            </button>

          </div>

          <div className="flex items-center justify-between border border-[#5b4779] bg-[#140b27] rounded-xl p-4 hover:border-[#c9922a] transition">

            <div>
              <h3 className="font-semibold text-[#f0e6c8]">
                Marriage Compatibility
              </h3>

              <p className="text-sm text-[#8b7aa0]">
                Generated on 18 May 2026
              </p>
            </div>

            <button className="bg-[#c9922a] text-[#160d28] font-semibold px-4 py-2 rounded-lg hover:bg-[#e0aa3e] transition">
              View
            </button>

          </div>

        </div>
      </div>

      {/* Right Section */}
      <div className="bg-[#1e1038]/90 border border-[#c9922a] rounded-2xl shadow-md p-6">

        <h2 className="text-2xl font-bold text-[#f0e6c8] mb-5">
          Quick Actions
        </h2>

        <div className="space-y-4">

          <button
            onClick={() => navigate("/Kundli")}
            className="w-full bg-[#c9922a] hover:bg-[#e0aa3e] text-[#160d28] font-bold py-3 rounded-xl transition"
          >
            Generate Kundli
          </button>

          <button
            onClick={() => navigate("/daily-horoscope")}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Daily Horoscope
          </button>

          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition">
            Download Reports
          </button>

          <button className="w-full bg-[#2d1b4e] hover:bg-[#3d2964] text-[#f0e6c8] border border-[#5b4779] py-3 rounded-xl font-semibold transition">
            Edit Profile
          </button>

        </div>
      </div>

    </div>
  </div>
</div>
  );
}
