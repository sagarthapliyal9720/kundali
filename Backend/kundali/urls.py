"""
kundali/urls.py

Mount this in your project's backend/urls.py with:
    path("api/kundali/", include("kundali.urls")),
"""

from django.urls import path

from .views import (
    AskKundaliView,
    GenerateKundaliView,
    KundaliDetailView,
    KundaliListView,
    TranslateView, 
)

urlpatterns = [
    # Generate a new Kundali
    path("generate/",GenerateKundaliView.as_view(), name="kundali-generate"),

    # List all Kundalis for the current user
    path("",KundaliListView.as_view(),     name="kundali-list"),

    # Retrieve or delete a specific Kundali
    path("<int:pk>/",    KundaliDetailView.as_view(),   name="kundali-detail"),

    # Ask the LLM a question about a specific Kundali
    path("<int:pk>/ask/", AskKundaliView.as_view(),     name="kundali-ask"),
    
    path('translate/', TranslateView.as_view(), name='translate'),

]