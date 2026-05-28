import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    const response = await axios.post(
      "http://127.0.0.1:8000/api/login/",
      {
        email: formData.email,
        password: formData.password,
      }
    );

    console.log(response.data);

    localStorage.setItem(
      "token",
      response.data.access
    );

    alert("Login Successful");

    navigate("/dashboard");

  } catch (error) {

    console.log(error);

    alert(
      error.response?.data?.message ||
      "Invalid Credentials"
    );
  }
};

  return (
  <div className="min-h-screen flex items-center justify-center bg-[#160d28] px-4 relative overflow-hidden">

    {/* Background Glow */}
    <div className="absolute w-[500px] h-[500px] bg-[#3a1c71] opacity-20 blur-3xl rounded-full top-[-120px] left-[-120px]"></div>

    <div className="absolute w-[400px] h-[400px] bg-[#c9922a] opacity-10 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

    {/* Card */}
    <div className="relative w-full max-w-md bg-[#1e1038]/90 backdrop-blur-md border border-[#c9922a] rounded-3xl shadow-2xl p-8">

      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#f0e6c8]">
          Welcome Back
        </h1>

        <p className="text-[#8b7aa0] mt-2">
          Login to continue
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-[#f0e6c8] mb-2">
            Email Address
          </label>

          <div className="flex items-center border border-[#5b4779] bg-[#140b27] rounded-xl px-4 focus-within:border-[#c9922a] transition">
            <Mail className="w-5 h-5 text-[#c9922a]" />

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 outline-none bg-transparent text-[#f0e6c8] placeholder-[#7f7196]"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-[#f0e6c8] mb-2">
            Password
          </label>

          <div className="flex items-center border border-[#5b4779] bg-[#140b27] rounded-xl px-4 focus-within:border-[#c9922a] transition">
            <Lock className="w-5 h-5 text-[#c9922a]" />

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 outline-none bg-transparent text-[#f0e6c8] placeholder-[#7f7196]"
              required
            />
          </div>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm text-[#c9922a] hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-[#c9922a] hover:bg-[#e0aa3e] text-[#160d28] font-bold py-3 rounded-xl transition duration-300 shadow-lg"
        >
          Login
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-[#8b7aa0] text-sm mt-6">
        Don’t have an account?

        <Link
          to="/"
          className="text-[#c9922a] font-semibold hover:underline ml-1"
        >
          Register
        </Link>
      </p>
    </div>
  </div>
);
}