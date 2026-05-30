from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    phone = models.CharField(max_length=12, unique=True)
    name = models.CharField(max_length=50)

    profile_image = models.ImageField(
        upload_to="profiles/",
        blank=True,
        null=True
    )

    gender = models.CharField(
        max_length=20,
        blank=True
    )

    date_of_birth = models.DateField(
        blank=True,
        null=True
    )

    city = models.CharField(
        max_length=100,
        blank=True
    )

    bio = models.TextField(
        blank=True
    )