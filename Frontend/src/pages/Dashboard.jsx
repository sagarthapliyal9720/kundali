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
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [kundlis, setKundlis] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [panchangData, setPanchangData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchKundlis();
    fetchUserProfile();
    fetchPanchang();
  }, []);

  // Fetch Panchang
  const fetchPanchang = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/accounts/daily-panchang/"
      );
      setPanchangData(response.data);
    } catch (error) {
      console.log("Failed to fetch panchang:", error);
    }
  };

  // Fetch User Profile
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://127.0.0.1:8000/api/profile/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.log("Failed to fetch profile:", error);
    }
  };

  const fetchKundlis = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8000/api/kundali/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setKundlis(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteKundli = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8000/api/kundali/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setKundlis(kundlis.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#160d28] flex relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-[#3a1c71] opacity-20 blur-3xl rounded-full top-[-120px] left-[-120px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-[#c9922a] opacity-10 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 relative z-10 overflow-y-auto">
        {/* Topbar */}
        <div className="bg-[#1e1038]/90 border border-[#c9922a] rounded-3xl shadow-xl p-6 flex items-center justify-between mb-6">
          <div>
            <h2 className="text-4xl font-bold text-[#f0e6c8]">
              Welcome Back 👋 {user?.name ? user.name.split(" ")[0] : ""}
            </h2>
            <p className="text-[#8b7aa0] mt-2 text-lg">
              Manage your kundli reports and astrology insights
            </p>
          </div>

          {/* Profile Image */}
          <div
            className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#c9922a] cursor-pointer hover:border-white transition"
            onClick={() => navigate("/profile")}
          >
            {user?.profile_image ? (
              <img
                src={`http://127.0.0.1:8000${user.profile_image}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#c9922a] flex items-center justify-center">
                <span className="text-[#160d28] font-bold text-2xl">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-[#1e1038]/90 border border-[#c9922a] p-6 rounded-3xl shadow-xl">
            <p className="text-[#8b7aa0] text-sm mb-2">Total Kundlis</p>
            <h1 className="text-5xl font-bold text-[#c9922a]">
              {kundlis.length}
            </h1>
          </div>

          <div className="bg-[#1e1038]/90 border border-pink-500 p-6 rounded-3xl shadow-xl">
            <p className="text-[#8b7aa0] text-sm mb-2">Latest Report</p>
            <h1 className="text-2xl font-bold text-pink-400 truncate">
              {kundlis.length > 0 ? kundlis[0].full_name : "--"}
            </h1>
          </div>

          <div className="bg-[#1e1038]/90 border border-green-500 p-6 rounded-3xl shadow-xl">
            <p className="text-[#8b7aa0] text-sm mb-2">Status</p>
            <h1 className="text-3xl font-bold text-green-400">Active</h1>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-8">
            <div className="bg-[#1e1038]/90 border border-[#c9922a] rounded-3xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-[#f0e6c8]">
                    Recent Kundlis
                  </h2>
                  <p className="text-[#8b7aa0] mt-1">
                    Your generated kundli reports
                  </p>
                </div>

                <button
                  onClick={() => navigate("/Kundli")}
                  className="bg-[#c9922a] hover:bg-[#e0aa3e] text-[#160d28] px-5 py-2 rounded-2xl font-bold transition"
                >
                  + Generate
                </button>
              </div>

              {loading ? (
                <div className="text-center py-16">
                  <div className="w-12 h-12 border-4 border-[#c9922a] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-[#8b7aa0] mt-5">Loading Kundlis...</p>
                </div>
              ) : kundlis.length > 0 ? (
                <div className="space-y-4">
                  {kundlis.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#140b27] border border-[#5b4779] rounded-2xl p-5 hover:border-[#c9922a] transition"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                        <div>
                          <h3 className="text-2xl font-bold text-[#f0e6c8]">
                            {item.full_name}
                          </h3>
                          <div className="mt-2 space-y-1">
                            <p className="text-[#8b7aa0]">📍 {item.place_of_birth}</p>
                            <p className="text-[#8b7aa0]">🎂 {item.date_of_birth}</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => navigate(`/view-kundli/${item.id}`)}
                            className="bg-[#c9922a] hover:bg-[#e0aa3e] text-[#160d28] px-5 py-2 rounded-xl font-bold transition"
                          >
                            View
                          </button>
                          <button
                            onClick={() => deleteKundli(item.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-bold transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-[#5b4779] bg-[#140b27] rounded-3xl p-14 text-center">
                  <div className="text-7xl mb-5">🔮</div>
                  <h3 className="text-3xl font-bold text-[#f0e6c8] mb-3">
                    No Kundlis Found
                  </h3>
                  <p className="text-[#8b7aa0] mb-8 max-w-md mx-auto">
                    Generate your first kundli to unlock detailed astrology insights.
                  </p>
                  <button
                    onClick={() => navigate("/Kundli")}
                    className="bg-[#c9922a] hover:bg-[#e0aa3e] text-[#160d28] px-8 py-4 rounded-2xl font-bold text-lg transition"
                  >
                    Generate Kundli
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-4 space-y-6">

            {/* TODAY'S ENERGY — now shows sunrise & sunset */}
            <div className="bg-[#1e1038]/90 border border-[#c9922a] rounded-3xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-[#f0e6c8]">Today's Energy</h2>
                <span className="text-4xl">🌙</span>
              </div>
              <div className="space-y-4">
                <div className="bg-[#140b27] border border-[#5b4779] rounded-2xl p-4">
                  <p className="text-[#8b7aa0] text-sm mb-1">🌅 Sunrise</p>
                  <h3 className="text-[#f0e6c8] font-bold text-2xl">
                    {panchangData?.sunrise || "--"}
                  </h3>
                </div>
                <div className="bg-[#140b27] border border-[#5b4779] rounded-2xl p-4">
                  <p className="text-[#8b7aa0] text-sm mb-1">🌇 Sunset</p>
                  <h3 className="text-[#f0e6c8] font-bold text-2xl">
                    {panchangData?.sunset || "--"}
                  </h3>
                </div>
              </div>
            </div>

            {/* TODAY'S TITHI — replaces Cosmic Insight */}
            <div className="bg-[#1e1038]/90 border border-pink-500 rounded-3xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-pink-400">Today's Tithi</h2>
                <span className="text-4xl">🔮</span>
              </div>
              <div className="space-y-4">
                <div className="bg-[#140b27] border border-[#5b4779] rounded-2xl p-4">
                  <p className="text-[#8b7aa0] text-sm mb-1">📿 Tithi</p>
                  <h3 className="text-[#f0e6c8] font-bold text-lg">
                    {panchangData?.tithi?.tithi_name || "--"}
                  </h3>
                </div>
                <div className="bg-[#140b27] border border-[#5b4779] rounded-2xl p-4">
                  <p className="text-[#8b7aa0] text-sm mb-1">🌗 Paksha</p>
                  <h3 className="text-[#f0e6c8] font-bold text-lg">
                    {panchangData?.tithi?.paksha || "--"}
                  </h3>
                </div>
                <div className="bg-[#140b27] border border-[#5b4779] rounded-2xl p-4">
                  <p className="text-[#8b7aa0] text-sm mb-1">🔢 Tithi Number</p>
                  <h3 className="text-[#f0e6c8] font-bold text-lg">
                    {panchangData?.tithi?.tithi_number || "--"}
                  </h3>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}