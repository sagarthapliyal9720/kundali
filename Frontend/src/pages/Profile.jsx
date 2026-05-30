import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Calendar, MapPin, FileText, Upload } from "lucide-react";

export default function UpdateProfile() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    city: "",
    bio: "",
    profile_image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentProfile();
  }, []);

  const fetchCurrentProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/api/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData({
        name: res.data.name || "",
        phone: res.data.phone || "",
        gender: res.data.gender || "",
        date_of_birth: res.data.date_of_birth || "",
        city: res.data.city || "",
        bio: res.data.bio || "",
      });

      if (res.data.profile_image) {
        setPreview(`http://127.0.0.1:8000${res.data.profile_image}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile_image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      const token = localStorage.getItem("token");
      await axios.put("http://127.0.0.1:8000/api/profile/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      console.log(error);
      alert("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#160d28] p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#1e1038]/90 border border-[#c9922a] rounded-3xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-[#f0e6c8] text-center mb-8">
            Update Profile
          </h1>

          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-2xl mb-6 text-center">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#c9922a] mb-4">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#3a1c71] flex items-center justify-center">
                    <User className="w-16 h-16 text-[#c9922a]" />
                  </div>
                )}
              </div>

              <label className="cursor-pointer bg-[#c9922a] text-[#160d28] px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-[#e0aa3e]">
                <Upload size={18} />
                Upload Photo
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>

            {/* Other Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-[#f0e6c8] mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#140b27] border border-[#5b4779] rounded-xl px-4 py-3 text-[#f0e6c8]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[#f0e6c8] mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#140b27] border border-[#5b4779] rounded-xl px-4 py-3 text-[#f0e6c8]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[#f0e6c8] mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-[#140b27] border border-[#5b4779] rounded-xl px-4 py-3 text-[#f0e6c8]"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-[#f0e6c8] mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full bg-[#140b27] border border-[#5b4779] rounded-xl px-4 py-3 text-[#f0e6c8]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-[#f0e6c8] mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-[#140b27] border border-[#5b4779] rounded-xl px-4 py-3 text-[#f0e6c8]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-[#f0e6c8] mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-[#140b27] border border-[#5b4779] rounded-xl px-4 py-3 text-[#f0e6c8]"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9922a] hover:bg-[#e0aa3e] text-[#160d28] font-bold py-4 rounded-2xl transition disabled:opacity-70"
            >
              {loading ? "Updating Profile..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}