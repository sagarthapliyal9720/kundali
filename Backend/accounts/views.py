from django.contrib.auth import authenticate, get_user_model
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer,ProfileSerializer
from rest_framework.permissions import IsAuthenticated
import uuid
from django.core.mail import send_mail
from django.conf import settings
from random import randint
from django.utils import timezone
from datetime import timedelta 
from random import randint




User = get_user_model()

class SendRegisterOTPView(APIView):

    def post(self, request):

        email = request.data.get("email")

        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already registered"},
                status=400
            )

        otp = str(randint(100000, 999999))

        request.session["register_otp"] = otp
        request.session["register_email"] = email
        request.session["register_name"] = request.data.get("name")
        request.session["register_phone"] = request.data.get("phone")
        request.session["register_password"] = request.data.get("password")

        request.session.save()

        print("OTP =", otp)
        print("SESSION OTP =", request.session.get("register_otp"))
        print("SESSION KEY =", request.session.session_key)

        send_mail(
            "Email Verification OTP",
            f"Your OTP is: {otp}",
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False
        )

        return Response({
            "message": "OTP Sent"
        })
    
class VerifyRegisterOTPView(APIView):

    def post(self, request):

        print("VERIFY REGISTER OTP HIT")

        print("VERIFY SESSION KEY =", request.session.session_key)

        otp = request.data.get("otp")

        saved_otp = request.session.get("register_otp")

        print("USER OTP =", otp)
        print("SESSION OTP =", saved_otp)

        if not saved_otp:
            return Response(
                {"error": "Session Expired. Request OTP Again."},
                status=400
            )

        if otp != saved_otp:
            return Response(
                {"error": "Invalid OTP"},
                status=400
            )

        email = request.session.get("register_email")
        name = request.session.get("register_name")
        phone = request.session.get("register_phone")
        password = request.session.get("register_password")

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            phone=phone,
            name=name
        )

        user.is_verified = True
        user.save()

        request.session.flush()

        return Response({
            "message": "Registration Successful"
        })

# class RegisterView(APIView):

#     def post(self, request):

#         name = request.data.get("name")
#         email = request.data.get("email")
#         phone = request.data.get("phone")
#         password = request.data.get("password")

#         if User.objects.filter(email=email).exists():
#             return Response(
#                 {"error": "Email already exists"},
#                 status=400
#             )

#         otp = str(randint(100000, 999999))

#         user = User.objects.create_user(
#             email=email,
#             username=email,
#             name=name,
#             phone=phone,
#             password=password,
#         )

#         user.otp = otp
#         user.otp_created_at = timezone.now()
#         user.otp_verified = False
#         user.save()

#         send_mail(
#             "Email Verification OTP",
#             f"Your OTP is: {otp}",
#             settings.DEFAULT_FROM_EMAIL,
#             [email],
#             fail_silently=False
#         )

#         return Response({
#             "message": "OTP sent to email",
#             "email": email
#         })


class LoginView(APIView):

    def post(self, request):

        email = request.data.get("email")
        password = request.data.get("password")

        user = User.objects.filter(email=email).first()

        if user and not user.is_verified:
            return Response(
        {
            "error": "Please verify your email first"
        },
        status=400
    )

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

class ForgotPasswordView(APIView):

    def post(self, request):

        email = request.data.get("email")

        try:

            user = User.objects.get(email=email)

            otp = str(randint(100000, 999999))

            user.otp = otp
            user.otp_created_at = timezone.now()
            user.otp_verified = False
            user.save()

            send_mail(
                "Password Reset OTP",
                f"Your OTP is: {otp}",
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False
            )

            return Response({
                "message": "OTP Sent"
            })

        except User.DoesNotExist:

            return Response(
                {"error": "User not found"},
                status=404
            )
              
class VerifyOTPView(APIView):

    def post(self, request):

        email = request.data.get("email")
        otp = request.data.get("otp")

        try:

            user = User.objects.get(email=email)

            if user.otp != otp:
                return Response(
                    {"error": "Invalid OTP"},
                    status=400
                )

            if timezone.now() - user.otp_created_at > timedelta(minutes=5):
                return Response(
                    {"error": "OTP Expired"},
                    status=400
                )

            user.otp_verified = True
            user.save()

            return Response({
                "message": "OTP Verified"
            })

        except User.DoesNotExist:

            return Response(
                {"error": "User not found"},
                status=404
            )
        
class ResetPasswordView(APIView):

    def post(self, request):

        email = request.data.get("email")
        password = request.data.get("password")

        try:

            user = User.objects.get(email=email)

            if not user.otp_verified:
                return Response(
                    {"error": "Verify OTP first"},
                    status=400
                )

            user.set_password(password)

            user.otp = None
            user.otp_created_at = None
            user.otp_verified = False

            user.save()

            return Response({
                "message": "Password Updated"
            })

        except User.DoesNotExist:

            return Response(
                {"error": "User not found"},
                status=404
            )