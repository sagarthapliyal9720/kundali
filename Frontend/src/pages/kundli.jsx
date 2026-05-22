import { useState } from "react";
import {
  User,
  Calendar,
  Clock3,
  MapPin,
  Star,
} from "lucide-react";

export default function Kundli() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    tob: "",
    birthplace: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    // API CALL HERE
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Top Heading */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Generate Kundli
        </h1>

        <p className="text-gray-500 mt-2">
          Enter birth details to generate kundli
        </p>
      </div>

      {/* Main Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Left Side */}
          <div className="bg-indigo-600 text-white p-10 flex flex-col justify-center">

            <div className="mb-6">
              <Star size={50} />
            </div>

            <h2 className="text-4xl font-bold leading-tight">
              Discover Your
              <br />
              Cosmic Journey ✨
            </h2>

            <p className="mt-5 text-indigo-100 leading-relaxed">
              Generate your detailed kundli with accurate planetary
              positions, divisional charts, doshas, yogas, and
              astrological insights.
            </p>

            <div className="mt-10 space-y-4">

              <div className="bg-white/10 rounded-xl p-4">
                ✔ Accurate Birth Chart
              </div>

              <div className="bg-white/10 rounded-xl p-4">
                ✔ Horoscope & Predictions
              </div>

              <div className="bg-white/10 rounded-xl p-4">
                ✔ Vedic Astrology Analysis
              </div>
            </div>
          </div>

          {/* Right Side Form */}
          <div className="p-10">

            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Birth Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>

                <div className="flex items-center border border-gray-300 rounded-xl px-4 focus-within:ring-2 focus-within:ring-indigo-500 transition">
                  <User className="w-5 h-5 text-gray-400" />

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* DOB */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date of Birth
                </label>

                <div className="flex items-center border border-gray-300 rounded-xl px-4 focus-within:ring-2 focus-within:ring-indigo-500 transition">
                  <Calendar className="w-5 h-5 text-gray-400" />

                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-3 outline-none bg-transparent text-gray-700"
                    required
                  />
                </div>
              </div>

              {/* TOB */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Time of Birth
                </label>

                <div className="flex items-center border border-gray-300 rounded-xl px-4 focus-within:ring-2 focus-within:ring-indigo-500 transition">
                  <Clock3 className="w-5 h-5 text-gray-400" />

                  <input
                    type="time"
                    name="tob"
                    value={formData.tob}
                    onChange={handleChange}
                    className="w-full px-4 py-3 outline-none bg-transparent text-gray-700"
                    required
                  />
                </div>
              </div>

              {/* Birth Place */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Birth Place
                </label>

                <div className="flex items-center border border-gray-300 rounded-xl px-4 focus-within:ring-2 focus-within:ring-indigo-500 transition">
                  <MapPin className="w-5 h-5 text-gray-400" />

                  <input
                    type="text"
                    name="birthplace"
                    placeholder="Enter birth place"
                    value={formData.birthplace}
                    onChange={handleChange}
                    className="w-full px-4 py-3 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl transition duration-300 shadow-lg text-lg"
              >
                Generate Kundli
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}