from django.apps import AppConfig

class KundaliConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'kundali'

    def ready(self):
        """Load ephemeris files when Django starts."""
        from django.conf import settings
        from .calculations import setup_ephemeris
        setup_ephemeris(str(settings.SWISSEPH_PATH))