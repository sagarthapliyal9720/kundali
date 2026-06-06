import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Birthchart() {

  const location = useLocation();

  const kundliData = location.state?.kundliData;

  const d1 = kundliData?.kundali_data?.D1 || {};

  const houses = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
  };

  Object.entries(d1).forEach(([planet, data]) => {

    const house = data.house;

    if (houses[house]) {
      houses[house].push(planet);
    }

  });

  const renderPlanets = (house) => (
    houses[house].map((p, i) => (
      <p key={i} className="text-[11px] leading-[14px] font-semibold text-[#e8b84b]">
        {p}
      </p>
    ))
  );

  return (
    <div className="min-h-screen bg-[#160d28] flex relative overflow-hidden">

      <Sidebar />

      <div className="flex-1 flex justify-center items-center p-6 relative z-10">

        <div className="flex flex-col items-center gap-6">
        {/* Heading */}
        <div className="bg-[#1e1038]/90 border border-[#c9922a] rounded-3xl p-8 text-center">
          <h1 className="text-xl font-medium text-[#f0e6c8] tracking-wide">
            Lagna Chart
          </h1>
           <p className="text-xs text-[#8b7aa0] mt-1">
            D1 · Janma Kundali · Lahiri Ayanamsa
          </p>
        </div>

        {/* Chart Container */}
         <div className="relative w-[520px] h-[520px] bg-[#1e1038] border-2 border-[#c9922a] overflow-hidden rounded-md">

          {/* Main Diagonal Lines */}
          <div className="absolute top-0 left-0 w-full h-full border-t-[1px] border-[#c9922a] rotate-45 origin-top-left"></div>
          <div className="absolute top-0 right-0 w-full h-full border-t-[1px] border-[#c9922a] -rotate-45 origin-top-right"></div>

          {/* Cross Lines */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              fill="none"
              stroke="#c9922a"
              strokeWidth="0.4"
            />
            <line
              x1="50"
              y1="0"
              x2="100"
              y2="50"
              stroke="#c9922a"
              strokeWidth="0.4"
            />
            <line
              x1="100"
              y1="50"
              x2="50"
              y2="100"
              stroke="#c9922a"
              strokeWidth="0.4"
            />
            <line
              x1="50"
              y1="100"
              x2="0"
              y2="50"
              stroke="#c9922a"
              strokeWidth="0.4"
            />
            <line
              x1="0"
              y1="50"
              x2="50"
              y2="0"
              stroke="#c9922a"
              strokeWidth="0.4"
            />
            <line
              x1="0"
              y1="0"
              x2="100"
              y2="100"
              stroke="#c9922a"
              strokeWidth="0.4"
            />
            <line
              x1="100"
              y1="0"
              x2="0"
              y2="100"
              stroke="#c9922a"
              strokeWidth="0.4"
            />
          </svg>

          {/* HOUSE 1 */}
          <div className="absolute top-[24%] left-[50%] -translate-x-1/2 text-center">
            <h2 className="font-bold text-[#c9922a]">1</h2>
            {renderPlanets(1)}
          </div>

          {/* HOUSE 2 */}
          <div className="absolute top-[6%] left-[24%] -translate-x-1/2 text-center">
            <h2 className="font-bold text-[#c9922a]">2</h2>
            {renderPlanets(2)}
          </div>

          {/* HOUSE 3 */}
          <div className="absolute top-[24%] left-[6%] text-center">
            <h2 className="font-bold text-[#c9922a]">3</h2>
            {renderPlanets(3)}
          </div>

          {/* HOUSE 4 */}
          <div className="absolute top-[50%] left-[20%] -translate-x-1/2 -translate-y-1/2 text-center">
            <h2 className="font-bold text-[#c9922a]">4</h2>
            {renderPlanets(4)}
          </div>

          {/* HOUSE 5 */}
          <div className="absolute bottom-[24%] left-[6%] text-center">
            <h2 className="font-bold text-[#c9922a]">5</h2>
            {renderPlanets(5)}
          </div>

          {/* HOUSE 6 */}
          <div className="absolute bottom-[12%] left-[24%] -translate-x-1/2 text-center">
            <h2 className="font-bold text-[#c9922a]">6</h2>
            {renderPlanets(6)}
          </div>

          {/* HOUSE 7 */}
          <div className="absolute bottom-[18%] left-[50%] -translate-x-1/2 text-center">
            <h2 className="font-bold text-[#c9922a]">7</h2>
            {renderPlanets(7)}
          </div>

          {/* HOUSE 8 */}
          <div className="absolute bottom-[6%] right-[24%] translate-x-1/2 text-center">
            <h2 className="font-bold text-[#c9922a]">8</h2>
            {renderPlanets(8)}
          </div>

          {/* HOUSE 9 */}
          <div className="absolute bottom-[24%] right-[6%] text-center">
            <h2 className="font-bold text-[#c9922a]">9</h2>
            {renderPlanets(9)}
          </div>

          {/* HOUSE 10 */}
          <div className="absolute top-[50%] right-[20%] translate-x-1/2 -translate-y-1/2 text-center">
            <h2 className="font-bold text-[#c9922a]">10</h2>
            {renderPlanets(10)}
          </div>

          {/* HOUSE 11 */}
          <div className="absolute top-[24%] right-[4%] text-center">
            <h2 className="font-bold text-[#c9922a]">11</h2>
            {renderPlanets(11)}
          </div>

          {/* HOUSE 12 */}
          <div className="absolute top-[6%] right-[24%] translate-x-1/2 text-center">
            <h2 className="font-bold text-[#c9922a]">12</h2>
            {renderPlanets(12)}
          </div>
        </div>
        {/* Analysis Tabs */}
<div className="flex flex-wrap justify-center gap-3 mt-6">
  {[
    "Relationship",
    "Career",
    "Health",
    "Wealth",
    "Education",
    "Other"
  ].map((item) => (
    <button
      key={item}
      className="
        px-5 py-2
        bg-[#241443]
        border border-[#c9922a]
        text-[#f0e6c8]
        rounded-full
        hover:bg-[#c9922a]
        hover:text-[#160d28]
        transition-all duration-300
        font-medium
      "
    >
      {item}
    </button>
  ))}
</div>
      
      </div>
    </div>
    
    </div>
  );
}