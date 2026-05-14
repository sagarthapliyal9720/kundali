from django.db import models
from django.conf import settings

class Kundali(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='kundalis')
    full_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    time_of_birth = models.TimeField()
    place_of_birth = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    kundali_data = models.JSONField()   # stores the full result
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.date_of_birth}"