from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):

    phone = models.CharField(max_length=12, unique=True)
    name = models.CharField(max_length=50)

    email = models.EmailField(unique=True)

    otp = models.CharField(
    max_length=6,
    blank=True,
    null=True
)

    otp_created_at = models.DateTimeField(
    blank=True,
    null=True
)
    otp_verified = models.BooleanField(
        default=False
    )

    is_verified = models.BooleanField(
        default=False
    )

    reset_token = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

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

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email