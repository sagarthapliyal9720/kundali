import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function EditProfile() {
  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    city: "",
    bio: "",
    date_of_birth: "",
    profile_image: null,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
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

      setFormData(response.data);

      if (response.data.profile_image) {
        setPreview(
          `http://127.0.0.1:8000${response.data.profile_image}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setFormData({
      ...formData,
      profile_image: file,
    });

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const data = new FormData();

      data.append("name", formData.name || "");
      data.append("phone", formData.phone || "");
      data.append("gender", formData.gender || "");
      data.append("city", formData.city || "");
      data.append("bio", formData.bio || "");
      data.append(
        "date_of_birth",
        formData.date_of_birth || ""
      );

      if (formData.profile_image instanceof File) {
        data.append(
          "profile_image",
          formData.profile_image
        );
      }

      await axios.put(
        "http://127.0.0.1:8000/api/profile/",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Profile Updated Successfully");

      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#160d28] flex relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-[#3a1c71] opacity-20 blur-3xl rounded-full top-[-120px] left-[-120px]" />

      <div className="absolute w-[400px] h-[400px] bg-[#c9922a] opacity-10 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />

      <Sidebar />

      <div className="flex-1 p-6 relative z-10">
        <form
          onSubmit={handleSubmit}
          className="max-w-5xl mx-auto bg-[#1e1038]/90 border border-[#c9922a] rounded-3xl shadow-xl p-8"
        >
          <h1 className="text-4xl font-bold text-[#f0e6c8] mb-8">
            Edit Profile
          </h1>

          {/* Profile Image */}
          <div className="flex flex-col items-center mb-10">
            <img
              src={
                preview ||
                "https://ui-avatars.com/api/?name=User&background=1e1038&color=f0e6c8&size=256"
              }
              alt=""
              className="w-40 h-40 rounded-full object-cover border-4 border-[#c9922a]"
            />

            <label className="mt-5 cursor-pointer bg-[#c9922a] text-[#160d28] px-5 py-2 rounded-xl font-bold">
              Upload Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Full Name"
              className="bg-[#140b27] border border-[#5b4779] text-white rounded-xl p-4"
            />

            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="Phone Number"
              className="bg-[#140b27] border border-[#5b4779] text-white rounded-xl p-4"
            />

            <input
              type="text"
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              placeholder="Gender"
              className="bg-[#140b27] border border-[#5b4779] text-white rounded-xl p-4"
            />

            <input
              type="text"
              name="city"
              value={formData.city || ""}
              onChange={handleChange}
              placeholder="City"
              className="bg-[#140b27] border border-[#5b4779] text-white rounded-xl p-4"
            />

            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth || ""}
              onChange={handleChange}
              className="bg-[#140b27] border border-[#5b4779] text-white rounded-xl p-4"
            />
          </div>

          <textarea
            name="bio"
            value={formData.bio || ""}
            onChange={handleChange}
            placeholder="Tell us something about yourself..."
            rows="6"
            className="w-full mt-6 bg-[#140b27] border border-[#5b4779] text-white rounded-xl p-4"
          />

          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              className="bg-[#c9922a] hover:bg-[#e0aa3e] text-[#160d28] px-8 py-3 rounded-xl font-bold"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="border border-[#5b4779] text-white px-8 py-3 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}