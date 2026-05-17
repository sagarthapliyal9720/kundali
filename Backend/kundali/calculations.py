"""
kundali/calculations.py

Pure astrological calculation functions — no Django dependencies.
All functions here are framework-agnostic and can be unit-tested independently.

Libraries required:
    pip install pyswisseph geopy astral
"""

import os
from datetime import datetime, timedelta

import swisseph as swe
from astral import LocationInfo
from astral.sun import sun
from geopy.exc import GeocoderUnavailable
from geopy.geocoders import Nominatim

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]

ZODIAC_SIGNS_SHORT = [
    "Ari", "Tau", "Gem", "Can", "Leo", "Vir",
    "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis",
]

PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]

NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
    "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
    "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
    "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
]

NAKSHATRA_LORDS = [
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
]

DASHA_PERIODS = {
    "Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10,
    "Mars": 7, "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17,
}

DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]

# Vedic Ashtakvarga benefic positions (relative offsets from planet's own sign)
ASHTAKVARGA_RULES = {
    "Sun":     [1, 2, 4, 7, 8, 9, 10, 11],
    "Moon":    [1, 3, 6, 7, 10, 11],
    "Mars":    [1, 2, 4, 7, 8, 11],
    "Mercury": [1, 3, 5, 6, 9, 10, 11],
    "Jupiter": [1, 2, 3, 4, 7, 8, 9, 10, 11],
    "Venus":   [1, 2, 3, 4, 5, 8, 9, 11],
    "Saturn":  [1, 2, 4, 7, 8, 11],
}

DIVISIONAL_CHARTS = [1, 2, 3, 4, 5, 7, 8, 9, 10, 12, 16, 20, 24, 27, 30, 40, 45, 60]

NAKSHATRA_SIZE = 13 + 20 / 60  # 13°20′


# ---------------------------------------------------------------------------
# Ephemeris setup
# ---------------------------------------------------------------------------

def setup_ephemeris(ephe_path: str = "swisseph") -> None:
    """
    Point Swiss Ephemeris at the folder containing the .se1 data files.
    Call once at app startup (e.g. in apps.py → ready()).
    """
    swe.set_ephe_path(ephe_path)
    required = ["sepl_18.se1", "semo_18.se1"]
    for f in required:
        if not os.path.exists(os.path.join(ephe_path, f)):
            raise FileNotFoundError(
                f"Ephemeris file '{f}' not found in '{ephe_path}'. "
                "Download from https://www.astro.com/swisseph/"
            )


# ---------------------------------------------------------------------------
# Geocoding
# ---------------------------------------------------------------------------

def geocode_place(place: str) -> tuple[float, float]:
    """
    Return (latitude, longitude) for a place name string.
    Raises ValueError with a user-friendly message on failure.
    """
    geolocator = Nominatim(user_agent="kundali_django_app", timeout=10)
    try:
        location = geolocator.geocode(place)
    except GeocoderUnavailable:
        raise ValueError("Geocoding service is unavailable. Please enter latitude and longitude manually.")
    except Exception as exc:
        raise ValueError(f"Geocoding error: {exc}")

    if not location:
        raise ValueError(f"Could not find '{place}'. Try a more specific name or enter coordinates manually.")

    return float(location.latitude), float(location.longitude)


# ---------------------------------------------------------------------------
# Ayanamsa
# ---------------------------------------------------------------------------

def calculate_ayanamsa(julian_day: float) -> float:
    """Return Lahiri ayanamsa (degrees) for a Julian Day number."""
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    return float(swe.get_ayanamsa_ut(julian_day))


# ---------------------------------------------------------------------------
# Sunrise / Sunset
# ---------------------------------------------------------------------------

def _fallback_sunrise_sunset(latitude: float, longitude: float, date: datetime) -> tuple[str, str]:
    """Astral-based fallback when Swiss Ephemeris rise_trans fails."""
    loc = LocationInfo("", "", "UTC", latitude, longitude)
    s = sun(loc.observer, date=date)
    def to_ist(utc_dt):
        ist_dt = utc_dt + timedelta(hours=5, minutes=30)
        return ist_dt.strftime("%H:%M")
    return to_ist(s["sunrise"]), to_ist(s["sunset"])


def calculate_sunrise_sunset(julian_day: float, latitude: float, longitude: float) -> tuple[str, str]:
    """
    Return (sunrise_IST, sunset_IST) as "HH:MM" strings.
    Falls back to Astral if Swiss Ephemeris fails.
    """
    year, month, day, _ = swe.revjul(julian_day)
    base_jd = swe.julday(year, month, day, 0.0)
    geopos = [float(longitude), float(latitude), 0.0]

    def _jd_to_ist(jd: float) -> str:
        _, _, _, utc_hour = swe.revjul(jd)
        total_min = int(utc_hour * 60) + 330          # +5:30 → IST
        return f"{(total_min // 60) % 24:02d}:{total_min % 60:02d}"

    try:
        ret_rise, rise_jd = swe.rise_trans(base_jd, swe.SUN, swe.CALC_RISE, swe.FLG_SWIEPH, geopos)
        ret_set, set_jd  = swe.rise_trans(base_jd, swe.SUN, swe.CALC_SET,  swe.FLG_SWIEPH, geopos)
        if ret_rise < 0 or ret_set < 0:
            raise ValueError("rise_trans returned error code")
        return _jd_to_ist(rise_jd), _jd_to_ist(set_jd)
    except Exception:
        return _fallback_sunrise_sunset(latitude, longitude, datetime(year, month, day))


# ---------------------------------------------------------------------------
# Divisional chart sign mapping
# ---------------------------------------------------------------------------

def get_divisional_sign_index(sign_index: int, degree_in_sign: float, division: int) -> int:
    """
    Given the D1 sign index (0–11), the degree within that sign, and the
    divisional number, return the sign index (0–11) in the divisional chart.
    """
    seg = 30 / division
    seg_idx = int(degree_in_sign // seg) if division != 30 else 0

    match division:
        case 1:
            return sign_index
        case 2:
            odd_sign = sign_index % 2 == 1
            return 4 if (odd_sign and seg_idx == 0) or (not odd_sign and seg_idx == 1) else 5
        case 3:
            offsets = [0, 4, 8]
            return (sign_index + offsets[seg_idx]) % 12
        case 4:
            return (sign_index + seg_idx * 3) % 12
        case 5:
            return (4 if sign_index % 2 == 0 else 5 + seg_idx) % 12
        case 7:
            base = sign_index if sign_index % 2 == 0 else (sign_index + 6) % 12
            return (base + seg_idx) % 12
        case 8:
            if sign_index in [0, 3, 6, 9]:  base = 0
            elif sign_index in [1, 4, 7, 10]: base = 8
            else: base = 4
            return (base + seg_idx) % 12
        case 9:
            starts = {0: 0, 1: 9, 2: 6, 3: 3, 4: 0, 5: 9, 6: 6, 7: 3, 8: 0, 9: 9, 10: 6, 11: 3}
            return (starts[sign_index] + seg_idx) % 12
        case 10:
            base = sign_index if sign_index % 2 == 0 else (sign_index + 8) % 12
            return (base + seg_idx) % 12
        case 12:
            return (sign_index + seg_idx) % 12
        case 16:
            if sign_index in [0, 3, 6, 9]:  base = 0
            elif sign_index in [1, 4, 7, 10]: base = 4
            else: base = 8
            return (base + seg_idx) % 12
        case 20:
            starts = {0: 8, 1: 4, 2: 0, 3: 8, 4: 4, 5: 0, 6: 8, 7: 4, 8: 0, 9: 8, 10: 4, 11: 0}
            return (starts[sign_index] + seg_idx) % 12
        case 24:
            return (4 if sign_index % 2 == 0 else 5 + seg_idx) % 12
        case 27:
            starts = {0: 0, 1: 3, 2: 6, 3: 9, 4: 0, 5: 3, 6: 6, 7: 9, 8: 0, 9: 3, 10: 6, 11: 9}
            return (starts[sign_index] + seg_idx) % 12
        case 30:
            # Shastiamsa — fixed degree boundaries per odd/even sign
            is_odd = sign_index % 2 == 1
            if is_odd:
                if degree_in_sign < 5:  return 0
                elif degree_in_sign < 10: return 10
                elif degree_in_sign < 18: return 8
                elif degree_in_sign < 25: return 2
                else: return 6
            else:
                if degree_in_sign < 5:  return 7
                elif degree_in_sign < 10: return 9
                elif degree_in_sign < 18: return 11
                elif degree_in_sign < 25: return 5
                else: return 1
        case 40:
            return (0 if sign_index % 2 == 0 else 6 + seg_idx) % 12
        case 45:
            starts = {0: 0, 1: 4, 2: 8, 3: 0, 4: 4, 5: 8, 6: 0, 7: 4, 8: 8, 9: 0, 10: 4, 11: 8}
            return (starts[sign_index] + seg_idx) % 12
        case 60:
            return (sign_index + seg_idx) % 12
        case _:
            return 0


# ---------------------------------------------------------------------------
# Ashtakvarga
# ---------------------------------------------------------------------------

def calculate_ashtakvarga(
    planets: dict,
    ascendant_sign_index: int,
) -> dict:
    """
    Calculate Bhinnashtakvarga and Sarvashtakvarga.

    Args:
        planets: dict of planet_name → {"longitude": float (sidereal, 0–360)}
        ascendant_sign_index: 0-based sign index of the Lagna in D1
    """
    bhinnashtakvarga = {p: {s: 0 for s in ZODIAC_SIGNS_SHORT} for p in PLANETS}
    planet_signs = {p: int(planets[p]["longitude"] // 30) % 12 for p in PLANETS}
    asc_sign = ascendant_sign_index % 12

    for planet in PLANETS:
        planet_pos = planet_signs[planet]

        # Planet's own contribution
        for offset in ASHTAKVARGA_RULES[planet]:
            idx = (planet_pos + offset - 1) % 12
            bhinnashtakvarga[planet][ZODIAC_SIGNS_SHORT[idx]] += 1

        # Contributions from every other planet and the Ascendant
        for other in PLANETS + ["Ascendant"]:
            if other == planet:
                continue
            other_pos = asc_sign if other == "Ascendant" else planet_signs[other]
            offsets = ASHTAKVARGA_RULES[planet] if other == "Ascendant" else ASHTAKVARGA_RULES[other]
            for offset in offsets:
                idx = (other_pos + offset - 1) % 12
                bhinnashtakvarga[planet][ZODIAC_SIGNS_SHORT[idx]] += 1

    sarvashtakvarga = {
        sign: sum(bhinnashtakvarga[p][sign] for p in PLANETS)
        for sign in ZODIAC_SIGNS_SHORT
    }
    totals = {p: sum(bhinnashtakvarga[p].values()) for p in PLANETS}
    totals["Sarvashtakvarga"] = sum(sarvashtakvarga.values())

    return {
        "bhinnashtakvarga": bhinnashtakvarga,
        "sarvashtakvarga": sarvashtakvarga,
        "strong_signs": [s for s in ZODIAC_SIGNS_SHORT if sarvashtakvarga[s] > 28],
        "weak_signs":   [s for s in ZODIAC_SIGNS_SHORT if sarvashtakvarga[s] < 25],
        "totals": totals,
    }


# ---------------------------------------------------------------------------
# Vimshottari Dasha
# ---------------------------------------------------------------------------

def calculate_vimshottari_dasha(moon_longitude: float, birth_datetime: datetime) -> dict:
    """
    Calculate Vimshottari Mahadasha and Antardasha from Moon's sidereal longitude.

    Args:
        moon_longitude: Moon's sidereal longitude in degrees (0–360)
        birth_datetime: local birth datetime (used as the epoch reference)
    """
    nakshatra_index  = int(moon_longitude // NAKSHATRA_SIZE) % 27
    nakshatra_name   = NAKSHATRAS[nakshatra_index]
    ruling_planet    = NAKSHATRA_LORDS[nakshatra_index].strip()   # strip stray space in original
    total_period     = DASHA_PERIODS[ruling_planet]

    degrees_elapsed  = moon_longitude % NAKSHATRA_SIZE
    years_elapsed    = degrees_elapsed / (NAKSHATRA_SIZE / total_period)
    dasha_start      = birth_datetime - timedelta(days=years_elapsed * 365.25)

    # Build all 9 Mahadashas
    mahadasha = []
    current   = dasha_start
    start_idx = DASHA_ORDER.index(ruling_planet)
    for i in range(9):
        planet  = DASHA_ORDER[(start_idx + i) % 9]
        period  = DASHA_PERIODS[planet]
        end     = current + timedelta(days=period * 365.25)
        mahadasha.append({
            "planet":   planet,
            "start":    current.strftime("%Y-%m-%d"),
            "end":      end.strftime("%Y-%m-%d"),
            "duration": period,
        })
        current = end

    # Antardasha within the current (first) Mahadasha
    antardasha = []
    ad_start = dasha_start
    for planet in DASHA_ORDER:
        ad_years = (DASHA_PERIODS[planet] / 120) * total_period
        ad_end   = ad_start + timedelta(days=ad_years * 365.25)
        antardasha.append({
            "planet":   planet,
            "start":    ad_start.strftime("%Y-%m-%d"),
            "end":      ad_end.strftime("%Y-%m-%d"),
            "duration": round(ad_years, 2),
        })
        ad_start = ad_end

    return {
        "nakshatra":          nakshatra_name,
        "ruling_planet":      ruling_planet,
        "mahadasha":          mahadasha,
        "current_antardasha": antardasha,
    }


# ---------------------------------------------------------------------------
# Planet position helpers
# ---------------------------------------------------------------------------

def _calc_planet_positions(julian_day: float, ayanamsa: float) -> dict:
    """
    Return sidereal longitudes for all 9 Vedic planets + Ascendant placeholder.
    Keys: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu
    Values: {"longitude": float}  — sidereal degrees 0–360
    """
    planet_ids = {
        "Sun":     swe.SUN,
        "Moon":    swe.MOON,
        "Mars":    swe.MARS,
        "Mercury": swe.MERCURY,
        "Jupiter": swe.JUPITER,
        "Venus":   swe.VENUS,
        "Saturn":  swe.SATURN,
        "Rahu":    swe.MEAN_NODE,
    }
    result = {}
    for name, pid in planet_ids.items():
        raw = swe.calc_ut(julian_day, pid, swe.FLG_SPEED)
        # raw[0] is either a float or a tuple depending on pyswisseph version
        ecl_lon = raw[0] if isinstance(raw[0], (int, float)) else float(raw[0][0])
        result[name] = {"longitude": (ecl_lon - ayanamsa) % 360}

    rahu_lon = result["Rahu"]["longitude"]
    result["Ketu"] = {"longitude": (rahu_lon + 180) % 360}
    return result


def _build_planet_entry(planet_lon: float, asc_div_sign_index: int, division: int) -> dict:
    """Convert a sidereal longitude into a chart entry dict."""
    sign_index      = int(planet_lon // 30) % 12
    degree_in_sign  = planet_lon % 30
    div_sign_index  = get_divisional_sign_index(sign_index, degree_in_sign, division)

    seg_size        = 30 / division
    degree_in_div   = (degree_in_sign % seg_size) * division
    deg             = int(degree_in_div)
    min_total       = (degree_in_div - deg) * 60
    minute          = int(min_total)
    second          = int((min_total - minute) * 60)
    house           = ((div_sign_index - asc_div_sign_index) % 12) + 1

    return {
        "sign":        ZODIAC_SIGNS[div_sign_index],
        "sign_number": div_sign_index + 1,
        "degree":      deg,
        "minute":      minute,
        "second":      second,
        "house":       house,
    }


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def generate_kundali(
    birth_datetime: datetime,
    place: str | None = None,
    latitude: float | None = None,
    longitude: float | None = None,
) -> dict:
    """
    Full Kundali calculation.

    Provide either `place` (city name) OR `latitude` + `longitude`.

    Returns a dict with keys:
        kundali_data, chart_data, sunrise, sunset, ashtakvarga, dasha,
        ascendant, meta

    Raises ValueError on invalid input.
    Raises RuntimeError on ephemeris calculation failure.
    """
    # --- Resolve coordinates ---
    if latitude is not None and longitude is not None:
        lat = float(latitude)
        lon = float(longitude)
    elif place:
        lat, lon = geocode_place(place)
    else:
        raise ValueError("Provide either a place name or latitude/longitude.")

    # --- Julian Day (convert IST → UTC) ---
    utc_dt   = birth_datetime - timedelta(hours=5, minutes=30)
    utc_hour = utc_dt.hour + utc_dt.minute / 60 + utc_dt.second / 3600
    jd       = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, utc_hour)

    swe.set_sid_mode(swe.SIDM_LAHIRI)

    # --- Ascendant ---
    try:
        houses_data = swe.houses(jd, lat, lon, b"P")   # Placidus
    except Exception as exc:
        raise RuntimeError(f"House calculation failed: {exc}")

    ayanamsa         = calculate_ayanamsa(jd)
    tropical_asc     = float(houses_data[0][0])
    sidereal_asc     = (tropical_asc - ayanamsa) % 360

    sunrise, sunset  = calculate_sunrise_sunset(jd, lat, lon)

    # --- Planet positions ---
    planets          = _calc_planet_positions(jd, ayanamsa)
    planets["Ascendant"] = {"longitude": sidereal_asc}

    # --- Build all divisional charts ---
    kundali_data = {}   # D1…D60 → planet → entry dict
    chart_data   = {}   # D1…D60 → house layout for frontend rendering

    for div in DIVISIONAL_CHARTS:
        key = f"D{div}"

        asc_sign_idx     = int(sidereal_asc // 30)
        asc_deg_in_sign  = sidereal_asc % 30
        asc_div_idx      = get_divisional_sign_index(asc_sign_idx, asc_deg_in_sign, div)

        kundali_data[key] = {}
        for planet_name, pdata in planets.items():
            kundali_data[key][planet_name] = _build_planet_entry(
                pdata["longitude"], asc_div_idx, div
            )

        # House layout (for frontend chart rendering)
        chart_data[key] = {
            "ascendant_sign_number": asc_div_idx + 1,
            "houses": {
                h: {
                    "sign_number": ((asc_div_idx + h - 1) % 12) + 1,
                    "planets": [],
                }
                for h in range(1, 13)
            },
        }
        for planet_name, entry in kundali_data[key].items():
            chart_data[key]["houses"][entry["house"]]["planets"].append({
                "name":   planet_name,
                "degree": entry["degree"],
                "minute": entry["minute"],
                "second": entry["second"],
            })

    # --- Ashtakvarga (uses D1 planet positions) ---
    d1_planets          = {p: planets[p] for p in PLANETS}
    asc_sign_index_d1   = int(sidereal_asc // 30)
    ashtakvarga         = calculate_ashtakvarga(d1_planets, asc_sign_index_d1)

    # --- Vimshottari Dasha ---
    dasha = calculate_vimshottari_dasha(planets["Moon"]["longitude"], birth_datetime)

    # --- Meta (useful for display / LLM prompt) ---
    meta = {
        "latitude":  lat,
        "longitude": lon,
        "place":     place or f"{lat:.4f}, {lon:.4f}",
        "sunrise":   sunrise,
        "sunset":    sunset,
        "ayanamsa":  round(ayanamsa, 6),
        "lagna_sign": ZODIAC_SIGNS[int(sidereal_asc // 30)],
        "lagna_degree": round(sidereal_asc % 30, 4),
    }

    return {
        "kundali_data": kundali_data,
        "chart_data":   chart_data,
        "ashtakvarga":  ashtakvarga,
        "dasha":        dasha,
        "meta":         meta,
    }