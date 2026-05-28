import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DailyHoroscope() {

    // Panchang State

    const [pachangdata, setPachnagdata] = useState({})


    // Horoscope State

    const [horoscopeData, setHoroscopeData] = useState(null)


    // Form State

    const [sign, setSign] = useState("leo")


    // Loading & Error

    const [loading, setLoading] = useState(false)

    const [error, setError] = useState("")


    // =========================
    // FETCH PANCHANG
    // =========================

    async function Fetchdailypachnag() {

        try {

            const response = await axios.get(
                "http://127.0.0.1:8000/accounts/daily-panchang/"
            )

            console.log(response.data)

            setPachnagdata(response.data)

        } catch (e) {

            console.log(e)

            setError("Failed to fetch Panchang")
        }
    }



    // =========================
    // FETCH HOROSCOPE
    // =========================

    async function FetchHoroscope() {

        try {

            setLoading(true)

            const response = await axios.post(
                "http://127.0.0.1:8000/accounts/daily-horoscope/",
                {
                    sign: sign
                }
            )

            console.log(response.data)

            setHoroscopeData(response.data)

        } catch (e) {

            console.log(e)

            setError("Failed to fetch Horoscope")

        } finally {

            setLoading(false)
        }
    }



    // =========================
    // USE EFFECT
    // =========================

    useEffect(() => {

        Fetchdailypachnag()

    }, [])



    return (

        <div className="min-h-screen bg-gray-100 p-6">

            <h1 className="text-4xl font-bold text-indigo-700 mb-8">

                Daily Horoscope & Panchang

            </h1>



            {
                error && (

                    <h2 className="text-red-500 mb-4">

                        {error}

                    </h2>
                )
            }



            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">



                {/* ================================= */}
                {/* LEFT SIDE */}
                {/* ================================= */}

                <div className="bg-white rounded-2xl shadow-md p-6 h-fit">

                    <h2 className="text-2xl font-bold text-indigo-700 mb-6">

                        Today's Horoscope

                    </h2>



                    {/* Select Rashi */}

                    <select
                        value={sign}
                        onChange={(e) => setSign(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl p-3 mb-4 outline-none"
                    >

                        <option value="aries">Aries</option>

                        <option value="taurus">Taurus</option>

                        <option value="gemini">Gemini</option>

                        <option value="cancer">Cancer</option>

                        <option value="leo">Leo</option>

                        <option value="virgo">Virgo</option>

                        <option value="libra">Libra</option>

                        <option value="scorpio">Scorpio</option>

                        <option value="sagittarius">Sagittarius</option>

                        <option value="capricorn">Capricorn</option>

                        <option value="aquarius">Aquarius</option>

                        <option value="pisces">Pisces</option>

                    </select>



                    {/* Generate Button */}

                    <button
                        onClick={FetchHoroscope}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
                    >

                        Generate Horoscope

                    </button>



                    {/* Loading */}

                    {
                        loading && (

                            <h3 className="mt-4">

                                Loading...

                            </h3>
                        )
                    }



                    {/* Horoscope Result */}

                    {
                        horoscopeData && (

                            <div className="mt-6 bg-gray-100 rounded-xl p-5">

                                <h2 className="text-2xl font-bold text-pink-600 mb-2">

                                    {horoscopeData.sign}

                                </h2>

                                <p className="text-sm text-gray-500 mb-4">

                                    {horoscopeData.date}

                                </p>

                                <p className="text-gray-700 leading-7">

                                    {horoscopeData.horoscope}

                                </p>

                            </div>
                        )
                    }

                </div>





                {/* ================================= */}
                {/* RIGHT SIDE */}
                {/* ================================= */}

                <div className="lg:col-span-2">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">



                        {/* SUN TIMINGS */}

                        <div className="bg-white rounded-2xl shadow-md p-6">

                            <h2 className="text-2xl font-bold text-orange-600 mb-4">

                                Sun Timings

                            </h2>

                            <p className="mb-3">

                                🌅 Sunrise:
                                {" "}
                                {pachangdata?.sunrise}

                            </p>

                            <p>

                                🌇 Sunset:
                                {" "}
                                {pachangdata?.sunset}

                            </p>

                        </div>





                        {/* TITHI */}

                        <div className="bg-white rounded-2xl shadow-md p-6">

                            <h2 className="text-2xl font-bold text-pink-600 mb-4">

                                Tithi

                            </h2>

                            <div className="space-y-2">

                                <p>

                                    📿
                                    {" "}
                                    {pachangdata?.tithi?.tithi_name}

                                </p>

                                <p>

                                    🌗
                                    {" "}
                                    {pachangdata?.tithi?.paksha}

                                </p>

                                <p>

                                    🔢 Number:
                                    {" "}
                                    {pachangdata?.tithi?.tithi_number}

                                </p>

                            </div>

                        </div>





                        {/* NAKSHATRA */}

                        <div className="bg-white rounded-2xl shadow-md p-6">

                            <h2 className="text-2xl font-bold text-green-600 mb-4">

                                Nakshatra

                            </h2>

                            <div className="space-y-2">

                                <p>

                                    🌙
                                    {" "}
                                    {
                                        pachangdata
                                        ?.nakshatra
                                        ?.nakshatra_name
                                    }

                                </p>

                                <p>

                                    🔢 Number:
                                    {" "}
                                    {
                                        pachangdata
                                        ?.nakshatra
                                        ?.nakshatra_number
                                    }

                                </p>

                            </div>

                        </div>





                        {/* RAHU KALAM */}

                        <div className="bg-white rounded-2xl shadow-md p-6">

                            <h2 className="text-2xl font-bold text-red-600 mb-4">

                                Rahu Kalam

                            </h2>

                            <div className="space-y-2">

                                <p>

                                    ⏳ Start:
                                    {" "}
                                    {
                                        pachangdata
                                        ?.rahu_kalam
                                        ?.rahu_kalam_start
                                    }

                                </p>

                                <p>

                                    ⏳ End:
                                    {" "}
                                    {
                                        pachangdata
                                        ?.rahu_kalam
                                        ?.rahu_kalam_end
                                    }

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}