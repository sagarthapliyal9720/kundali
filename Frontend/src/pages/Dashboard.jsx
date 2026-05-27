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
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-72 bg-indigo-700 text-white p-6 hidden md:block">
        <h1 className="text-3xl font-bold mb-10">Kundli App</h1>

        <nav className="space-y-4">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/20 hover:bg-white/30 transition">
            <LayoutDashboard size={22} />
            Dashboard
          </button>

          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-white/20 transition">
            <User size={22} />
            Profile
          </button>

          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-white/20 transition">
            <Stars size={22} />
            Generate Kundli
          </button>

          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-white/20 transition">
            <Calendar size={22} />
            Horoscope
          </button>

          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-white/20 transition">
            <FileText size={22} />
            Reports
          </button>

          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-white/20 transition">
            <Settings size={22} />
            Settings
          </button>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-8">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/20 transition">
            <LogOut size={22} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Topbar */}
        <div className="bg-white rounded-2xl shadow-md p-5 flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome Back 👋
            </h2>

            <p className="text-gray-500 mt-1">
              Manage your kundli reports and astrology insights
            </p>
          </div>

          <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
            M
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-gray-500 text-sm">Total Kundlis</h3>

            <h1 className="text-4xl font-bold text-indigo-600 mt-2">24</h1>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-gray-500 text-sm">Horoscope Views</h3>

            <h1 className="text-4xl font-bold text-pink-600 mt-2">112</h1>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-gray-500 text-sm">Reports Generated</h3>

            <h1 className="text-4xl font-bold text-green-600 mt-2">18</h1>
          </div>
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              Recent Kundli Reports
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Manish Kundli Report
                  </h3>

                  <p className="text-sm text-gray-500">
                    Generated on 22 May 2026
                  </p>
                </div>

                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  View
                </button>
              </div>

              <div className="flex items-center justify-between border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Career Prediction Report
                  </h3>

                  <p className="text-sm text-gray-500">
                    Generated on 20 May 2026
                  </p>
                </div>

                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  View
                </button>
              </div>

              <div className="flex items-center justify-between border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Marriage Compatibility
                  </h3>

                  <p className="text-sm text-gray-500">
                    Generated on 18 May 2026
                  </p>
                </div>

                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  View
                </button>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              Quick Actions
            </h2>

            <div className="space-y-4">
              <button
                onClick={() => navigate("/Kundli")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
              >
                Generate Kundli
              </button>

              <button 
               onClick={() => navigate("/daily-horoscope")}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold transition">
                Daily Horoscope
              </button>

              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition">
                Download Reports
              </button>

              <button className="w-full bg-gray-800 hover:bg-black text-white py-3 rounded-xl font-semibold transition">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
