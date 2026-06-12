import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import KundliChart from "../components/KundliChart";

export default function ViewKundli() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [kundli, setKundli] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKundli();
  }, []);

  const fetchKundli = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:8000/api/kundali/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setKundli(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#160d28] flex justify-center items-center">
        <div className="w-14 h-14 border-4 border-[#c9922a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!kundli) {
    return (
      <div className="min-h-screen bg-[#160d28] flex justify-center items-center text-white">
        Kundli not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#160d28] relative overflow-hidden">
      <Sidebar />

      <div className="md:ml-72 pt-20 md:pt-6 px-6 pb-6 relative z-10">

        {/* Header */}
        <div className="bg-[#1e1038]/90 border border-[#c9922a] rounded-3xl p-8 mb-8">

          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-4xl font-bold text-[#f0e6c8]">
                {kundli.full_name}
              </h1>

              <p className="text-[#8b7aa0] mt-2">
                Complete Birth Chart Analysis
              </p>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-[#c9922a] text-[#160d28] px-5 py-2 rounded-xl font-bold"
            >
              Back
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-8">

            <div className="bg-[#140b27] border border-[#5b4779] rounded-2xl p-5">
              <p className="text-[#8b7aa0] text-sm">
                Date of Birth
              </p>

              <h3 className="text-white font-semibold mt-1">
                {kundli.date_of_birth}
              </h3>
            </div>

            <div className="bg-[#140b27] border border-[#5b4779] rounded-2xl p-5">
              <p className="text-[#8b7aa0] text-sm">
                Place of Birth
              </p>

              <h3 className="text-white font-semibold mt-1">
                {kundli.place_of_birth}
              </h3>
            </div>

            <div className="bg-[#140b27] border border-[#5b4779] rounded-2xl p-5">
              <p className="text-[#8b7aa0] text-sm">
                Lagna Sign
              </p>

              <h3 className="text-white font-semibold mt-1">
                {kundli.meta?.lagna_sign || "N/A"}
              </h3>
            </div>

          </div>
        </div>

        {/* Kundli Chart Section */}
        <div className="bg-[#1e1038]/90 border border-[#c9922a] rounded-3xl p-8">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#f0e6c8]">
              Lagna Chart
            </h2>

            <p className="text-[#8b7aa0] mt-2">
              D1 · Janma Kundali · Lahiri Ayanamsa
            </p>
          </div>

          <div className="flex justify-center">
            <KundliChart kundliData={kundli} />
          </div>

        </div>

      </div>

    </div>
  );
}