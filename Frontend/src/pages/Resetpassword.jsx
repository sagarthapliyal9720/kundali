import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock } from "lucide-react";

export default function ResetPassword() {

  const [password, setPassword] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const submit = async () => {

    try {

      await axios.post(
        "http://localhost:8000/api/reset-password/",
        {
          email,
          password
        }
      );

      alert("Password Updated");

      navigate("/login");

    } catch (error) {

      alert(
        error.response?.data?.error ||
        "Failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#160d28] px-4">

      <div className="w-full max-w-md bg-[#1e1038]/90 border border-[#c9922a] rounded-3xl p-8 shadow-2xl">

        <h1 className="text-4xl font-bold text-[#f0e6c8] text-center">
          Reset Password
        </h1>

        <p className="text-[#8b7aa0] text-center mt-2 mb-8">
          Enter your new password
        </p>

        <div className="flex items-center border border-[#5b4779] bg-[#140b27] rounded-xl px-4">

          <Lock className="w-5 h-5 text-[#c9922a]" />

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-transparent outline-none text-[#f0e6c8]"
          />
        </div>

        <button
          onClick={submit}
          className="w-full mt-6 bg-[#c9922a] hover:bg-[#e0aa3e] text-[#160d28] font-bold py-3 rounded-xl"
        >
          Reset Password
        </button>

      </div>
    </div>
  );
}