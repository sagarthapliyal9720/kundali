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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Welcome Back</h1>

          <p className="text-gray-500 mt-2">Login to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>

            <div className="flex items-center border border-gray-300 rounded-xl px-4 focus-within:ring-2 focus-within:ring-indigo-500 transition">
              <Mail className="w-5 h-5 text-gray-400" />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>

            <div className="flex items-center border border-gray-300 rounded-xl px-4 focus-within:ring-2 focus-within:ring-indigo-500 transition">
              <Lock className="w-5 h-5 text-gray-400" />

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-lg"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Don’t have an account?
          <Link
            to="/"
            className="text-indigo-600 font-semibold hover:underline ml-1"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
