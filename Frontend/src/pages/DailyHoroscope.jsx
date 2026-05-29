import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DailyHoroscope() {
  // Panchang State

  const [pachangdata, setPachnagdata] = useState({});

  // Horoscope State

  const [horoscopeData, setHoroscopeData] = useState(null);

  // Form State

  const [sign, setSign] = useState("leo");

  // Loading & Error

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =========================
  // FETCH PANCHANG
  // =========================

  async function Fetchdailypachnag() {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/accounts/daily-panchang/",
      );

      console.log(response.data);

      setPachnagdata(response.data);
    } catch (e) {
      console.log(e);

      setError("Failed to fetch Panchang");
    }
  }

  // =========================
  // FETCH HOROSCOPE
  // =========================

  async function FetchHoroscope() {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/accounts/daily-horoscope/",
        {
          sign: sign,
        },
      );

      console.log(response.data);

      setHoroscopeData(response.data);
    } catch (e) {
      console.log(e);

      setError("Failed to fetch Horoscope");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // USE EFFECT
  // =========================

  useEffect(() => {
    Fetchdailypachnag();
  }, []);

  return (
    <div className="min-h-screen bg-[#160d28] p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-[#3a1c71] opacity-20 blur-3xl rounded-full top-[-120px] left-[-120px]"></div>

      <div className="absolute w-[400px] h-[400px] bg-[#c9922a] opacity-10 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

      {/* Header */}
      <div className="relative z-10 mb-10 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#f0e6c8] mb-2">
            Daily Horoscope & Panchang
          </h1>

          <p className="text-[#8b7aa0] text-lg">
            Explore your cosmic guidance for today ✨
          </p>
        </div>

        <div className="mt-5 md:mt-0 bg-[#1e1038]/80 border border-[#c9922a] px-5 py-3 rounded-2xl">
          <p className="text-[#8b7aa0] text-sm">Today's Date</p>

          <h2 className="text-[#f0e6c8] font-bold text-lg">
            {new Date().toDateString()}
          </h2>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-xl mb-6 relative z-10">
          {error}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* LEFT PANEL */}
        <div className="lg:col-span-4">
          <div className="bg-[#1e1038]/90 border border-[#c9922a] rounded-3xl shadow-2xl p-6 sticky top-6">
            {/* Title */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-[#f0e6c8] mb-2">
                Horoscope
              </h2>

              <p className="text-[#8b7aa0]">Select your zodiac sign</p>
            </div>

            {/* Zodiac Select */}
            <div className="mb-5">
              <label className="block text-[#f0e6c8] mb-2 font-semibold">
                Zodiac Sign
              </label>

              <select
                value={sign}
                onChange={(e) => setSign(e.target.value)}
                className="w-full border border-[#5b4779] bg-[#140b27] text-[#f0e6c8] rounded-2xl p-4 outline-none focus:border-[#c9922a]"
              >
                <option value="aries">♈ Aries</option>

                <option value="taurus">♉ Taurus</option>

                <option value="gemini">♊ Gemini</option>

                <option value="cancer">♋ Cancer</option>

                <option value="leo">♌ Leo</option>

                <option value="virgo">♍ Virgo</option>

                <option value="libra">♎ Libra</option>

                <option value="scorpio">♏ Scorpio</option>

                <option value="sagittarius">♐ Sagittarius</option>

                <option value="capricorn">♑ Capricorn</option>

                <option value="aquarius">♒ Aquarius</option>

                <option value="pisces">♓ Pisces</option>
              </select>
            </div>

            {/* Button */}
            <button
              onClick={FetchHoroscope}
              className="w-full bg-[#c9922a] hover:bg-[#e0aa3e] text-[#160d28] py-4 rounded-2xl font-bold text-lg transition shadow-lg"
            >
              Generate Horoscope
            </button>

            {/* Loading */}
            {loading && (
              <div className="mt-5 text-center text-[#8b7aa0]">
                Loading Horoscope...
              </div>
            )}

            {/* Result */}
            {horoscopeData && (
              <div className="mt-8 bg-[#140b27] border border-[#5b4779] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-[#c9922a]">
                      {horoscopeData.sign}
                    </h2>

                    <p className="text-[#8b7aa0] text-sm mt-1">
                      {horoscopeData.date}
                    </p>
                  </div>

                  <div className="text-5xl">✨</div>
                </div>

                <p className="text-[#f0e6c8] leading-8 text-[16px]">
                  {horoscopeData.horoscope}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-8">
          {/* Panchang Heading */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-[#f0e6c8] mb-2">
              Today's Panchang
            </h2>

            <p className="text-[#8b7aa0]">
              Important astrological timings and details
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SUN TIMINGS */}
            <div className="bg-[#1e1038]/90 border border-[#c9922a] rounded-3xl p-6 shadow-xl hover:border-[#e0aa3e] transition">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-[#c9922a]">
                  Sun Timings
                </h2>

                <div className="text-4xl">☀️</div>
              </div>

              <div className="space-y-4 text-[#f0e6c8]">
                <div className="bg-[#140b27] rounded-xl p-4 border border-[#5b4779]">
                  🌅 Sunrise: {pachangdata?.sunrise}
                </div>

                <div className="bg-[#140b27] rounded-xl p-4 border border-[#5b4779]">
                  🌇 Sunset: {pachangdata?.sunset}
                </div>
              </div>
            </div>

            {/* TITHI */}
            <div className="bg-[#1e1038]/90 border border-pink-500 rounded-3xl p-6 shadow-xl hover:border-pink-400 transition">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-pink-400">Tithi</h2>

                <div className="text-4xl">🌙</div>
              </div>

              <div className="space-y-4 text-[#f0e6c8]">
                <div className="bg-[#140b27] rounded-xl p-4 border border-[#5b4779]">
                  📿 {pachangdata?.tithi?.tithi_name}
                </div>

                <div className="bg-[#140b27] rounded-xl p-4 border border-[#5b4779]">
                  🌗 {pachangdata?.tithi?.paksha}
                </div>

                <div className="bg-[#140b27] rounded-xl p-4 border border-[#5b4779]">
                  🔢 Number: {pachangdata?.tithi?.tithi_number}
                </div>
              </div>
            </div>

            {/* NAKSHATRA */}
            <div className="bg-[#1e1038]/90 border border-green-500 rounded-3xl p-6 shadow-xl hover:border-green-400 transition">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-green-400">Nakshatra</h2>

                <div className="text-4xl">⭐</div>
              </div>

              <div className="space-y-4 text-[#f0e6c8]">
                <div className="bg-[#140b27] rounded-xl p-4 border border-[#5b4779]">
                  🌙 {pachangdata?.nakshatra?.nakshatra_name}
                </div>

                <div className="bg-[#140b27] rounded-xl p-4 border border-[#5b4779]">
                  🔢 Number: {pachangdata?.nakshatra?.nakshatra_number}
                </div>
              </div>
            </div>

            {/* RAHU KALAM */}
            <div className="bg-[#1e1038]/90 border border-red-500 rounded-3xl p-6 shadow-xl hover:border-red-400 transition">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-red-400">Rahu Kalam</h2>

                <div className="text-4xl">⏳</div>
              </div>

              <div className="space-y-4 text-[#f0e6c8]">
                <div className="bg-[#140b27] rounded-xl p-4 border border-[#5b4779]">
                  ⏳ Start: {pachangdata?.rahu_kalam?.rahu_kalam_start}
                </div>

                <div className="bg-[#140b27] rounded-xl p-4 border border-[#5b4779]">
                  ⏳ End: {pachangdata?.rahu_kalam?.rahu_kalam_end}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
