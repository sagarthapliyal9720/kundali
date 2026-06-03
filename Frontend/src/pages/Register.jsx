import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { User, Mail, Phone, Lock } from "lucide-react";

import axios from "axios";



export default function Register() {



  const [formData, setFormData] = useState({

    name: "",

    email: "",

    phone: "",

    password: "",

    confirmPassword: "",

  });



  const [error, setError] = useState("");
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate();



  // INPUT CHANGE

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };



  // FORM SUBMIT

  const handleSubmit = async (e) => {



    e.preventDefault();



    if (formData.password !== formData.confirmPassword) {

      setError("Passwords do not match");

      return;

    }



    try {

      setLoading(true)

      const response = await axios.post(
  "http://localhost:8000/api/send-register-otp/",
  {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    password: formData.password,
  },
  {
    withCredentials: true,
  }
);


      console.log(response.data);



      // alert("Registration Successful");



      localStorage.setItem("registerEmail", formData.email);
      navigate("/verify-register-otp");



    } catch (error) {



      console.log(error);



      setError(

        error.response?.data?.message ||

        "Something went wrong"

      );

    }finally{
      setLoading(false)
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

            Create Account

          </h1>



          <p className="text-[#8b7aa0] mt-2">

            Sign up to get started

          </p>



        </div>



        {/* Error */}

        {error && (

          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-xl mb-5 text-sm">

            {error}

          </div>

        )}



        {/* Form */}

        <form onSubmit={handleSubmit} className="space-y-5">



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

                placeholder="Enter your full name"

                value={formData.name}

                onChange={handleChange}

                className="w-full px-4 py-3 outline-none bg-transparent text-[#f0e6c8] placeholder-[#7f7196]"

                required

              />



            </div>

          </div>



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



          {/* Phone */}

          <div>



            <label className="block text-sm font-semibold text-[#f0e6c8] mb-2">

              Phone Number

            </label>



            <div className="flex items-center border border-[#5b4779] bg-[#140b27] rounded-xl px-4 focus-within:border-[#c9922a] transition">



              <Phone className="w-5 h-5 text-[#c9922a]" />



              <input

                type="tel"

                name="phone"

                placeholder="Enter your phone number"

                value={formData.phone}

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



          {/* Confirm Password */}

          <div>



            <label className="block text-sm font-semibold text-[#f0e6c8] mb-2">

              Confirm Password

            </label>



            <div className="flex items-center border border-[#5b4779] bg-[#140b27] rounded-xl px-4 focus-within:border-[#c9922a] transition">



              <Lock className="w-5 h-5 text-[#c9922a]" />



              <input

                type="password"

                name="confirmPassword"

                placeholder="Confirm your password"

                value={formData.confirmPassword}

                onChange={handleChange}

                className="w-full px-4 py-3 outline-none bg-transparent text-[#f0e6c8] placeholder-[#7f7196]"

                required

              />



            </div>

          </div>



          {/* Button */}

           <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#c9922a] hover:bg-[#e0aa3e] text-[#160d28] font-bold py-3 rounded-xl transition duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-[#160d28] border-t-transparent rounded-full animate-spin"></div>
              Loading please wait...
            </div>
          ) : (
            "Create Account"
          )}
      </button>



        </form>



        {/* Footer */}

        <p className="text-center text-[#8b7aa0] text-sm mt-6">



          Already have an account?



          <Link

            to="/login"

            className="text-[#c9922a] font-semibold hover:underline ml-1"

          >

            Login

          </Link>



        </p>



      </div>

    </div>

  );

}

