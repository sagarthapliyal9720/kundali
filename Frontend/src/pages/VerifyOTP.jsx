import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyOTP() {

  const [otp, setOtp] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const submit = async () => {

    try {

      await axios.post(
        "http://localhost:8000/api/verify-otp/",
        {
          email,
          otp
        }
      );

      alert("OTP Verified");

      navigate("/reset-password", {
        state: { email }
      });

    } catch (error) {

      alert(
        error.response?.data?.error ||
        "Invalid OTP"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#160d28] px-4">

      <div className="w-full max-w-md bg-[#1e1038]/90 border border-[#c9922a] rounded-3xl p-8 shadow-2xl">

        <h1 className="text-4xl font-bold text-[#f0e6c8] text-center">
          Verify OTP
        </h1>

        <p className="text-[#8b7aa0] text-center mt-2 mb-8">
          Enter OTP sent to your email
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-[#5b4779] bg-[#140b27] text-[#f0e6c8] outline-none"
        />

        <button
          onClick={submit}
          className="w-full mt-6 bg-[#c9922a] hover:bg-[#e0aa3e] text-[#160d28] font-bold py-3 rounded-xl"
        >
          Verify OTP
        </button>

      </div>
    </div>
  );
}