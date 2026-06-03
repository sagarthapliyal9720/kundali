from django.urls import path
from .views import SendRegisterOTPView, LoginView,DailyHoroscopeView,DailyPanchangView2,ProfileView
from .views import ForgotPasswordView, VerifyOTPView, ResetPasswordView, VerifyRegisterOTPView


urlpatterns = [
    path("send-register-otp/", SendRegisterOTPView.as_view()),
    path( "verify-register-otp/", VerifyRegisterOTPView.as_view()),
    path("login/", LoginView.as_view(), name="login"),
    path('daily-panchang/',DailyPanchangView2.as_view()),
    path('daily-horoscope/',DailyHoroscopeView.as_view()),
    path("profile/",ProfileView.as_view()),
    path("forgot-password/", ForgotPasswordView.as_view()),
    path("verify-otp/",VerifyOTPView.as_view()),
    path("reset-password/", ResetPasswordView.as_view()),

]