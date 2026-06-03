import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const submit = async () => {

    await axios.post(
      "http://localhost:8000/api/forgot-password/",
      { email }
    );

    localStorage.setItem("resetEmail", email);

    navigate("/verify-otp", {
      state: { email }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#160d28] px-4 relative overflow-hidden">

      <div className="absolute w-[500px] h-[500px] bg-[#3a1c71] opacity-20 blur-3xl rounded-full top-[-120px] left-[-120px]" />

      <div className="absolute w-[400px] h-[400px] bg-[#c9922a] opacity-10 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />

      <div className="w-full max-w-md bg-[#1e1038]/90 border border-[#c9922a] rounded-3xl p-8 shadow-2xl">

        <h1 className="text-4xl font-bold text-[#f0e6c8] text-center">
          Forgot Password
        </h1>

        <p className="text-[#8b7aa0] text-center mt-2 mb-8">
          Enter your registered email
        </p>

        <div className="flex items-center border border-[#5b4779] bg-[#140b27] rounded-xl px-4">

          <Mail className="w-5 h-5 text-[#c9922a]" />

          <input
            type="email"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-transparent outline-none text-[#f0e6c8]"
          />
        </div>

        <button
          onClick={submit}
          className="w-full mt-6 bg-[#c9922a] hover:bg-[#e0aa3e] text-[#160d28] font-bold py-3 rounded-xl"
        >
          Send OTP
        </button>

      </div>
    </div>
  );
}