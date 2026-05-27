import swisseph as swe

from datetime import datetime, timedelta




# =========================
# TIME CONVERTER
# =========================

def convert_utc_to_ist(decimal_hour):

    hours = int(decimal_hour)

    minutes = int(
        (decimal_hour - hours) * 60
    )

    seconds = int(
        (
            (
                decimal_hour - hours
            ) * 60 - minutes
        ) * 60
    )

    utc_time = datetime(
        2026,
        1,
        1,
        hours,
        minutes,
        seconds
    )

    ist_time = utc_time + timedelta(
        hours=5,
        minutes=30
    )

    return ist_time.strftime(
        "%I:%M:%S %p"
    )




# =========================
# SUNRISE SUNSET
# =========================

def get_sunrise_sunset(lat, lon):

    now = datetime.now()

    jd = swe.julday(
        now.year,
        now.month,
        now.day
    )

    geopos = (lon, lat, 0)

    sunrise = swe.rise_trans(
        jd,
        swe.SUN,
        swe.CALC_RISE,
        geopos
    )

    sunset = swe.rise_trans(
        jd,
        swe.SUN,
        swe.CALC_SET,
        geopos
    )

    sunrise_jd = sunrise[1][0]

    sunset_jd = sunset[1][0]

    sunrise_time = swe.revjul(
        sunrise_jd
    )[3]

    sunset_time = swe.revjul(
        sunset_jd
    )[3]

    return {

        "sunrise":
        convert_utc_to_ist(
            sunrise_time
        ),

        "sunset":
        convert_utc_to_ist(
            sunset_time
        )
    }




# =========================
# TITHI
# =========================

def get_tithi():

    now = datetime.now()

    jd = swe.julday(
        now.year,
        now.month,
        now.day,
        now.hour
    )

    sun_long = swe.calc_ut(
        jd,
        swe.SUN
    )[0][0]

    moon_long = swe.calc_ut(
        jd,
        swe.MOON
    )[0][0]

    angle = (
        moon_long - sun_long
    ) % 360

    tithi_number = int(
        angle / 12
    ) + 1

    tithi_names = [

        "Pratipada",
        "Dwitiya",
        "Tritiya",
        "Chaturthi",
        "Panchami",
        "Shashthi",
        "Saptami",
        "Ashtami",
        "Navami",
        "Dashami",
        "Ekadashi",
        "Dwadashi",
        "Trayodashi",
        "Chaturdashi",
        "Purnima",

        "Pratipada",
        "Dwitiya",
        "Tritiya",
        "Chaturthi",
        "Panchami",
        "Shashthi",
        "Saptami",
        "Ashtami",
        "Navami",
        "Dashami",
        "Ekadashi",
        "Dwadashi",
        "Trayodashi",
        "Chaturdashi",
        "Amavasya"
    ]

    paksha = (
        "Shukla Paksha"
        if tithi_number <= 15
        else "Krishna Paksha"
    )

    return {

        "tithi_number":
        tithi_number,

        "tithi_name":
        tithi_names[
            tithi_number - 1
        ],

        "paksha":
        paksha
    }




# =========================
# NAKSHATRA
# =========================

def get_nakshatra():

    now = datetime.now()

    jd = swe.julday(
        now.year,
        now.month,
        now.day,
        now.hour
    )

    moon_long = swe.calc_ut(
        jd,
        swe.MOON
    )[0][0]

    nakshatra_number = int(
        moon_long / 13.333333
    ) + 1

    nakshatra_names = [

        "Ashwini",
        "Bharani",
        "Krittika",
        "Rohini",
        "Mrigashira",
        "Ardra",
        "Punarvasu",
        "Pushya",
        "Ashlesha",
        "Magha",
        "Purva Phalguni",
        "Uttara Phalguni",
        "Hasta",
        "Chitra",
        "Swati",
        "Vishakha",
        "Anuradha",
        "Jyeshtha",
        "Mula",
        "Purva Ashadha",
        "Uttara Ashadha",
        "Shravana",
        "Dhanishta",
        "Shatabhisha",
        "Purva Bhadrapada",
        "Uttara Bhadrapada",
        "Revati"
    ]

    return {

        "nakshatra_number":
        nakshatra_number,

        "nakshatra_name":
        nakshatra_names[
            nakshatra_number - 1
        ]
    }

# =========================
# RAHU KALAM
# =========================

def get_rahu_kalam(lat, lon):

    now = datetime.now()

    # Get sunrise sunset
    sun_data = get_sunrise_sunset(
        lat,
        lon
    )

    sunrise = datetime.strptime(
        sun_data["sunrise"],
        "%I:%M:%S %p"
    )

    sunset = datetime.strptime(
        sun_data["sunset"],
        "%I:%M:%S %p"
    )

    # Total daytime minutes
    total_minutes = (
        sunset - sunrise
    ).seconds / 60

    # Divide into 8 parts
    segment_duration = (
        total_minutes / 8
    )

    # Rahu Kalam table
    rahu_table = {

        0: 2,  # Monday
        1: 7,  # Tuesday
        2: 5,  # Wednesday
        3: 6,  # Thursday
        4: 4,  # Friday
        5: 3,  # Saturday
        6: 8   # Sunday
    }

    weekday = now.weekday()

    rahu_segment = rahu_table[
        weekday
    ]

    rahu_start = sunrise + timedelta(
        minutes=(
            rahu_segment - 1
        ) * segment_duration
    )

    rahu_end = sunrise + timedelta(
        minutes=(
            rahu_segment
        ) * segment_duration
    )

    return {

        "rahu_kalam_start":
        rahu_start.strftime(
            "%I:%M %p"
        ),

        "rahu_kalam_end":
        rahu_end.strftime(
            "%I:%M %p"
        )
    }