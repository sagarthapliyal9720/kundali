import { useState } from "react";
import { User, Calendar, Clock3, MapPin, Star } from "lucide-react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Kundli() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    tob: "",
    birthplace: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const payload = {
        full_name: formData.name,
        date_of_birth: formData.dob,
        time_of_birth: formData.tob,
        place_of_birth: formData.birthplace,
      };

      const response = await axios.post(
        "http://localhost:8000/kundali/generate/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log(response.data);

      navigate("/birthchart", {
        state: {
          kundliData: response.data,
        },
      });
    } catch (error) {
      console.log(error.response?.data || error);

      alert("Error generating kundli");
    }
  };

  return (
<div className="min-h-screen bg-[#160d28] flex relative overflow-hidden">

  {/* Sidebar */}
  <Sidebar />

  {/* Main Content */}
  <div className="flex-1 p-6 relative ">

    {/* Background Glow */}
    <div className="absolute w-[500px] h-[500px] bg-[#3a1c71] opacity-20 blur-3xl rounded-full top-[-120px] left-[-120px]"></div>

    <div className="absolute w-[400px] h-[400px] bg-[#c9922a] opacity-10 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

    {/* Top Heading */}
    <div className="mb-8 relative z-10">
      <h1 className="text-4xl font-bold text-[#f0e6c8]">
        Generate Kundli
      </h1>

      <p className="text-[#8b7aa0] mt-2">
        Enter birth details to generate kundli
      </p>
    </div>

    {/* Main Card */}
    <div className="max-w-5xl mx-auto bg-[#1e1038]/90 border border-[#c9922a] rounded-3xl shadow-xl overflow-hidden relative z-10">

      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* Left Side */}
        <div className="bg-[#140b27] text-[#f0e6c8] p-10 flex flex-col justify-center border-r border-[#5b4779]">

          <div className="mb-6">
            <Star size={50} className="text-[#c9922a]" />
          </div>

          <h2 className="text-4xl font-bold leading-tight">
            Discover Your
            <br />
            Cosmic Journey ✨
          </h2>

          <p className="mt-5 text-[#8b7aa0] leading-relaxed">
            Generate your detailed kundli with accurate planetary positions,
            divisional charts, doshas, yogas, and astrological insights.
          </p>

          <div className="mt-10 space-y-4">

            <div className="bg-[#1e1038] border border-[#5b4779] rounded-xl p-4">
              ✔ Accurate Birth Chart
            </div>

            <div className="bg-[#1e1038] border border-[#5b4779] rounded-xl p-4">
              ✔ Horoscope & Predictions
            </div>

            <div className="bg-[#1e1038] border border-[#5b4779] rounded-xl p-4">
              ✔ Vedic Astrology Analysis
            </div>

          </div>
        </div>

        {/* Right Side Form */}
        <div className="p-10">

          <h2 className="text-3xl font-bold text-[#f0e6c8] mb-8">
            Birth Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-[#f0e6c8] mb-2">
                Full Name
              </label>

              <div className="flex items-center border border-[#5b4779] bg-[#140b27] rounded-xl px-4 focus-within:border-[#c9922a] transition">

                <User className="w-5 h-5 text-[#c9922a]" />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 outline-none bg-transparent text-[#f0e6c8] placeholder-[#7f7196]"
                  required
                />
              </div>
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-semibold text-[#f0e6c8] mb-2">
                Date of Birth
              </label>

              <div className="flex items-center border border-[#5b4779] bg-[#140b27] rounded-xl px-4 focus-within:border-[#c9922a] transition">

                <Calendar className="w-5 h-5 text-[#c9922a]" />

                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-3 outline-none bg-transparent text-[#f0e6c8]"
                  required
                />
              </div>
            </div>

            {/* TOB */}
            <div>
              <label className="block text-sm font-semibold text-[#f0e6c8] mb-2">
                Time of Birth
              </label>

              <div className="flex items-center border border-[#5b4779] bg-[#140b27] rounded-xl px-4 focus-within:border-[#c9922a] transition">

                <Clock3 className="w-5 h-5 text-[#c9922a]" />

                <input
                  type="time"
                  name="tob"
                  value={formData.tob}
                  onChange={handleChange}
                  className="w-full px-4 py-3 outline-none bg-transparent text-[#f0e6c8]"
                  required
                />
              </div>
            </div>

            {/* Birth Place */}
            <div>
              <label className="block text-sm font-semibold text-[#f0e6c8] mb-2">
                Birth Place
              </label>

              <div className="flex items-center border border-[#5b4779] bg-[#140b27] rounded-xl px-4 focus-within:border-[#c9922a] transition">

                <MapPin className="w-5 h-5 text-[#c9922a]" />

                <input
                  type="text"
                  name="birthplace"
                  placeholder="Enter birth place"
                  value={formData.birthplace}
                  onChange={handleChange}
                  className="w-full px-4 py-3 outline-none bg-transparent text-[#f0e6c8] placeholder-[#7f7196]"
                  required
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-[#c9922a] hover:bg-[#e0aa3e] text-[#160d28] font-bold py-4 rounded-xl transition duration-300 shadow-lg text-lg"
            >
              Generate Kundli
            </button>

          </form>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
