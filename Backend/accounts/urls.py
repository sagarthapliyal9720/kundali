from django.urls import path
from .views import RegisterView, LoginView,DailyHoroscopeView,DailyPanchangView2,ProfileView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path('daily-panchang/',DailyPanchangView2.as_view()),
    path('daily-horoscope/',DailyHoroscopeView.as_view()),
    path(
    "profile/",ProfileView.as_view()
),
]