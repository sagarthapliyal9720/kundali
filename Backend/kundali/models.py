"""
kundali/models.py

Stores one Kundali record per request.  The heavy JSON blobs (divisional
charts, ashtakvarga, dasha) are kept in JSONField so the frontend/LLM layer
can query exactly what it needs without re-running calculations every time.
"""

from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Kundali(models.Model):
    """One birth-chart record per user submission."""

    # --- Owner ---
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="kundalis",
    )

    # --- Birth details (stored so we can recalculate if logic changes) ---
    full_name      = models.CharField(max_length=150)
    date_of_birth  = models.DateField()
    time_of_birth  = models.TimeField()
    place_of_birth = models.CharField(max_length=255, blank=True)
    latitude       = models.FloatField()
    longitude      = models.FloatField()

    # --- Resolved meta (ayanamsa, lagna, sunrise, etc.) ---
    # Stored as a flat JSON dict; see calculations.generate_kundali → "meta"
    meta = models.JSONField(default=dict)

    # --- Divisional chart data ---
    # kundali_data: D1…D60 → planet → {sign, degree, house, …}
    kundali_data = models.JSONField(default=dict)

    # chart_data: D1…D60 → house layout for frontend SVG rendering
    chart_data = models.JSONField(default=dict)

    # --- Derived tables ---
    ashtakvarga = models.JSONField(default=dict)
    dasha       = models.JSONField(default=dict)

    # --- Timestamps ---
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name        = "Kundali"
        verbose_name_plural = "Kundalis"

    def __str__(self):
        return f"{self.full_name} — {self.date_of_birth} ({self.user.username})"

    # ------------------------------------------------------------------
    # Convenience properties (used by the LLM prompt builder in views.py)
    # ------------------------------------------------------------------

    @property
    def lagna_sign(self) -> str:
        return self.meta.get("lagna_sign", "")

    @property
    def lagna_degree(self) -> float:
        return self.meta.get("lagna_degree", 0.0)

    @property
    def d1_chart(self) -> dict:
        """Shortcut to the D1 (Rashi) chart — the most-used chart."""
        return self.kundali_data.get("D1", {})

    @property
    def d9_chart(self) -> dict:
        """D9 Navamsa — relationships, spouse."""
        return self.kundali_data.get("D9", {})

    @property
    def d10_chart(self) -> dict:
        """D10 Dasamsa — career, profession."""
        return self.kundali_data.get("D10", {})