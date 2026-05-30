from django.contrib.auth import authenticate, get_user_model
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer,ProfileSerializer
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': "User created successfully", 'data': serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):

    def post(self, request):

        email = request.data.get("email")
        password = request.data.get("password")

        user = User.objects.filter(email=email).first()

        if user and user.check_password(password):

            refresh = RefreshToken.for_user(user)

            return Response({
                'message': "User logged in successfully",
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'name': user.name,
                    'email': user.email,
                    'phone': user.phone
                }
            })

        return Response(
            {'message': "Invalid credentials!"},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        serializer = ProfileSerializer(
            request.user
        )

        return Response(serializer.data)

    def put(self, request):

        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=400
        )
######################################################################################################################################################################################################################################Daily Horoscope view#################################################

import requests
from datetime import datetime

class DailyHoroscopeView(APIView):

    def post(self, request):

        sign = request.data.get("sign")

        if not sign:
            return Response({
                "error": "sign is required"
            })

        url = (
            "https://horoscope-app-api.vercel.app/api/v1/"
            f"get-horoscope/daily?sign={sign}&day=TODAY"
        )

        response = requests.get(url)

        data = response.json()

        final_data = {
            "sign": data["data"]["sign"],
            "date": data["data"]["date"],
            "horoscope": data["data"]["horoscope"]
        }

        return Response(final_data)
    

from accounts.utils import (
    get_sunrise_sunset,
    get_tithi,
    get_nakshatra,
    get_rahu_kalam
)


class DailyPanchangView2(APIView):

    def get(self, request):

        lat = 28.6139
        lon = 77.2090

        sun_data = get_sunrise_sunset(
            lat,
            lon
        )

        tithi_data = get_tithi()

        nakshatra_data = get_nakshatra()
        rahu_data = get_rahu_kalam(lat,lon)

        final_data = {

            "sunrise":
            sun_data["sunrise"],

            "sunset":
            sun_data["sunset"],

            "tithi":
            tithi_data,

            "nakshatra":
            nakshatra_data,
            "rahu_kalam":
            rahu_data
            
        }

        return Response(final_data)
    

# import os

# from dotenv import load_dotenv

# load_dotenv()
# PANCHANG_API_KEY = os.getenv("PANCHANG_API_KEY")

# class DailyPanchangView(APIView):

#     def post_api(self, endpoint, payload):

#         url = f"https://json.freeastrologyapi.com/{endpoint}"

#         headers = {
#             "Content-Type": "application/json",
#             "x-api-key": PANCHANG_API_KEY
#         }

#         response = requests.post(
#             url,
#             json=payload,
#             headers=headers
#         )

#         return response.json()

#     def get(self, request):

#         now = datetime.now()

#         payload = {
#             "year": now.year,
#             "month": now.month,
#             "date": now.day,
#             "hours": now.hour,
#             "minutes": now.minute,
#             "seconds": now.second,

#             "latitude": 28.6139,
#             "longitude": 77.2090,
#             "timezone": 5.5,

#             "config": {
#                 "observation_point": "topocentric",
#                 "ayanamsha": "lahiri"
#             }
#         }

#         sunrise_data = self.post_api(
#             "getsunriseandset",
#             payload
#         )

#         tithi_data = self.post_api(
#             "tithi-durations",
#             payload
#         )

#         nakshatra_data = self.post_api(
#             "nakshatra-durations",
#             payload
#         )

#         yoga_data = self.post_api(
#             "yoga-durations",
#             payload
#         )

#         weekday_data = self.post_api(
#             "vedicweekday",
#             payload
#         )

#         rahu_data = self.post_api(
#             "rahu-kalam",
#             payload
#         )

#         final_data = {
#             "sunrise": sunrise_data,
#             "tithi": tithi_data,
#             "nakshatra": nakshatra_data,
#             "yoga": yoga_data,
#             "weekday": weekday_data,
#             "rahu_kalam": rahu_data
#         }

#         return Response(final_data)
