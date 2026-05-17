"""
kundali/serializers.py

Two serializers:
  KundaliInputSerializer   — validates user input (birth details)
  KundaliOutputSerializer  — shapes the saved Kundali for API responses
"""

from datetime import datetime

from rest_framework import serializers

from .models import Kundali


# ---------------------------------------------------------------------------
# Input
# ---------------------------------------------------------------------------

class KundaliInputSerializer(serializers.Serializer):
    """Validates the POST body for /api/kundali/generate/"""

    full_name = serializers.CharField(
        max_length=150,
        error_messages={"blank": "Full name is required."},
    )
    date_of_birth = serializers.DateField(
        input_formats=["%Y-%m-%d"],
        error_messages={"invalid": "Use YYYY-MM-DD format (e.g. 1995-08-15)."},
    )
    time_of_birth = serializers.TimeField(
        input_formats=["%H:%M", "%H:%M:%S"],
        error_messages={"invalid": "Use HH:MM format (e.g. 14:30)."},
    )

    # Either place OR (latitude + longitude) must be provided
    place_of_birth = serializers.CharField(max_length=255, required=False, allow_blank=True)
    latitude       = serializers.FloatField(required=False, allow_null=True)
    longitude      = serializers.FloatField(required=False, allow_null=True)

    # --- Cross-field validation ---
    def validate(self, attrs):
        has_place = bool(attrs.get("place_of_birth", "").strip())
        has_coords = attrs.get("latitude") is not None and attrs.get("longitude") is not None

        if not has_place and not has_coords:
            raise serializers.ValidationError(
                "Provide either a place of birth or latitude + longitude."
            )

        if attrs.get("latitude") is not None:
            if not (-90 <= attrs["latitude"] <= 90):
                raise serializers.ValidationError("Latitude must be between -90 and 90.")
        if attrs.get("longitude") is not None:
            if not (-180 <= attrs["longitude"] <= 180):
                raise serializers.ValidationError("Longitude must be between -180 and 180.")

        # Birth date must not be in the future
        if attrs["date_of_birth"] > datetime.today().date():
            raise serializers.ValidationError("Date of birth cannot be in the future.")

        return attrs

    def get_birth_datetime(self) -> datetime:
        """Helper used by the view to get a combined datetime object."""
        d = self.validated_data["date_of_birth"]
        t = self.validated_data["time_of_birth"]
        return datetime(d.year, d.month, d.day, t.hour, t.minute, t.second)


# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------

class KundaliOutputSerializer(serializers.ModelSerializer):
    """
    Full response shape returned after chart generation.
    The frontend consumes this JSON directly.
    """

    class Meta:
        model = Kundali
        fields = [
            "id",
            "full_name",
            "date_of_birth",
            "time_of_birth",
            "place_of_birth",
            "latitude",
            "longitude",
            "meta",
            "kundali_data",
            "chart_data",
            "ashtakvarga",
            "dasha",
            "created_at",
        ]
        read_only_fields = fields   # output-only serializer


class KundaliListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for the list endpoint (no heavy chart blobs)."""

    lagna_sign = serializers.CharField(source="meta.lagna_sign", default="")

    class Meta:
        model = Kundali
        fields = [
            "id",
            "full_name",
            "date_of_birth",
            "place_of_birth",
            "lagna_sign",
            "created_at",
        ]