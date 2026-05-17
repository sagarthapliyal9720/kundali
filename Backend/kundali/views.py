"""
kundali/views.py

Endpoints
─────────
POST   /api/kundali/generate/          → generate + save a new Kundali
GET    /api/kundali/                   → list all Kundalis for current user
GET    /api/kundali/<id>/              → retrieve one full Kundali
DELETE /api/kundali/<id>/              → delete a Kundali
POST   /api/kundali/<id>/ask/          → ask an LLM question about a Kundali
"""

import json
import logging

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .calculations import generate_kundali
from .models import Kundali
from .serializers import (
    KundaliInputSerializer,
    KundaliListSerializer,
    KundaliOutputSerializer,
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Helper — build the LLM prompt from a saved Kundali
# ---------------------------------------------------------------------------

def _build_llm_prompt(kundali: Kundali, question: str, topic: str | None) -> str:
    """
    Construct a structured prompt that gives the LLM enough chart context
    to answer the user's question accurately.

    Only the charts most relevant to the topic are included to keep the
    prompt concise and within token limits.
    """
    meta = kundali.meta
    d1   = kundali.d1_chart

    # Topic → which divisional charts to include
    topic_charts = {
        "health":       ["D1", "D6"],
        "wealth":       ["D1", "D2", "D11"],
        "relationship": ["D1", "D7", "D9"],
        "career":       ["D1", "D10"],
        "education":    ["D1", "D24"],
        "spirituality": ["D1", "D20"],
        "children":     ["D1", "D7"],
        "property":     ["D1", "D4"],
    }
    include_charts = topic_charts.get(topic, ["D1", "D9", "D10"])

    chart_lines = []
    for key in include_charts:
        chart = kundali.kundali_data.get(key, {})
        if not chart:
            continue
        chart_lines.append(f"\n{key} Chart:")
        for planet, entry in chart.items():
            chart_lines.append(
                f"  {planet:12s} → {entry['sign']:12s} | House {entry['house']:2d} | "
                f"{entry['degree']}°{entry['minute']}'{entry['second']}\""
            )

    dasha = kundali.dasha
    current_maha = dasha.get("mahadasha", [{}])[0]
    current_antar = dasha.get("current_antardasha", [{}])[0]

    prompt = f"""You are an expert Vedic astrologer. Analyze the following birth chart and answer the user's question in clear, compassionate language.

═══════════════════════════════
BIRTH DETAILS
═══════════════════════════════
Name        : {kundali.full_name}
Birth Date  : {kundali.date_of_birth}
Birth Time  : {kundali.time_of_birth}
Birth Place : {kundali.place_of_birth or meta.get('place', 'Not specified')}
Latitude    : {meta.get('latitude')}
Longitude   : {meta.get('longitude')}
Sunrise     : {meta.get('sunrise')} IST
Sunset      : {meta.get('sunset')} IST
Ayanamsa    : {meta.get('ayanamsa')}° (Lahiri)

LAGNA (Ascendant): {meta.get('lagna_sign')} at {meta.get('lagna_degree')}°

═══════════════════════════════
CURRENT DASHA
═══════════════════════════════
Nakshatra     : {dasha.get('nakshatra')} (Lord: {dasha.get('ruling_planet')})
Mahadasha     : {current_maha.get('planet')} ({current_maha.get('start')} → {current_maha.get('end')})
Antardasha    : {current_antar.get('planet')} ({current_antar.get('start')} → {current_antar.get('end')})

═══════════════════════════════
ASHTAKVARGA SUMMARY
═══════════════════════════════
Strong Signs : {', '.join(kundali.ashtakvarga.get('strong_signs', []))}
Weak Signs   : {', '.join(kundali.ashtakvarga.get('weak_signs', []))}

═══════════════════════════════
PLANETARY POSITIONS
═══════════════════════════════
{''.join(chart_lines)}

═══════════════════════════════
USER QUESTION
═══════════════════════════════
Topic    : {topic or 'General'}
Question : {question}

Please give a detailed but concise Vedic astrological interpretation. Focus on the specific topic. Avoid vague generalities. If the chart shows both positive and challenging influences, mention both honestly.
"""
    return prompt.strip()


# ---------------------------------------------------------------------------
# View 1 — Generate & save a new Kundali
# ---------------------------------------------------------------------------

class GenerateKundaliView(APIView):
    """
    POST /api/kundali/generate/

    Body (JSON):
        full_name      : str
        date_of_birth  : "YYYY-MM-DD"
        time_of_birth  : "HH:MM"
        place_of_birth : str  (optional if lat/lon provided)
        latitude       : float (optional)
        longitude      : float (optional)
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = KundaliInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        vd            = serializer.validated_data
        birth_datetime = serializer.get_birth_datetime()

        try:
            result = generate_kundali(
                birth_datetime=birth_datetime,
                place=vd.get("place_of_birth") or None,
                latitude=vd.get("latitude"),
                longitude=vd.get("longitude"),
            )
        except ValueError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except RuntimeError as exc:
            logger.error("Kundali calculation error: %s", exc)
            return Response({"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Persist to DB
        kundali = Kundali.objects.create(
            user=request.user,
            full_name=vd["full_name"],
            date_of_birth=vd["date_of_birth"],
            time_of_birth=vd["time_of_birth"],
            place_of_birth=vd.get("place_of_birth", ""),
            latitude=result["meta"]["latitude"],
            longitude=result["meta"]["longitude"],
            meta=result["meta"],
            kundali_data=result["kundali_data"],
            chart_data=result["chart_data"],
            ashtakvarga=result["ashtakvarga"],
            dasha=result["dasha"],
        )

        return Response(
            KundaliOutputSerializer(kundali).data,
            status=status.HTTP_201_CREATED,
        )


# ---------------------------------------------------------------------------
# View 2 — List & Detail
# ---------------------------------------------------------------------------

class KundaliListView(APIView):
    """
    GET /api/kundali/   → list all Kundalis belonging to the logged-in user
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        kundalis = Kundali.objects.filter(user=request.user)
        return Response(KundaliListSerializer(kundalis, many=True).data)


class KundaliDetailView(APIView):
    """
    GET    /api/kundali/<id>/  → full Kundali detail
    DELETE /api/kundali/<id>/  → delete
    """
    permission_classes = [IsAuthenticated]

    def _get_kundali(self, pk, user):
        return get_object_or_404(Kundali, pk=pk, user=user)

    def get(self, request, pk):
        kundali = self._get_kundali(pk, request.user)
        return Response(KundaliOutputSerializer(kundali).data)

    def delete(self, request, pk):
        kundali = self._get_kundali(pk, request.user)
        kundali.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ---------------------------------------------------------------------------
# View 3 — Ask the LLM about a Kundali
# ---------------------------------------------------------------------------

class AskKundaliView(APIView):
    """
    POST /api/kundali/<id>/ask/

    Body (JSON):
        question : str          (required)
        topic    : str          (optional — "health" | "wealth" | "relationship" |
                                 "career" | "education" | "spirituality" |
                                 "children" | "property")

    Returns:
        { "answer": "..." }

    The view builds a Vedic astrology prompt from the saved chart data and
    sends it to your configured LLM backend.  The LLM call is intentionally
    kept in a separate helper (_call_llm) so you can swap providers easily.
    """
    permission_classes = [IsAuthenticated]

    # Allowed topics for the pre-built question buttons on the frontend
    VALID_TOPICS = {
        "health", "wealth", "relationship", "career",
        "education", "spirituality", "children", "property",
    }

    def post(self, request, pk):
        kundali  = get_object_or_404(Kundali, pk=pk, user=request.user)
        question = request.data.get("question", "").strip()
        topic    = request.data.get("topic", "").strip().lower() or None

        if not question:
            return Response(
                {"error": "Question cannot be empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if topic and topic not in self.VALID_TOPICS:
            return Response(
                {"error": f"Invalid topic. Choose from: {', '.join(sorted(self.VALID_TOPICS))}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        prompt = _build_llm_prompt(kundali, question, topic)

        try:
            answer = _call_llm(prompt)
        except Exception as exc:
            logger.error("LLM call failed: %s", exc)
            return Response(
                {"error": "LLM service unavailable. Please try again later."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response({"answer": answer})


# ---------------------------------------------------------------------------
# LLM caller — swap this for any provider (OpenAI, Anthropic, Gemini, etc.)
# ---------------------------------------------------------------------------

def _call_llm(prompt: str) -> str:
    """
    Send the prompt to your LLM and return the text response.

    Currently wired to OpenAI (gpt-4o-mini) as an example.
    To switch:
      - Anthropic Claude : use anthropic.Anthropic().messages.create(...)
      - Google Gemini    : use google.generativeai.GenerativeModel(...)
      - Local Ollama     : call http://localhost:11434/api/generate

    Set OPENAI_API_KEY (or equivalent) in your .env / Django settings.
    
    Google Gemini — free tier, perfect for testing."""
    
    import google.generativeai as genai
    from django.conf import settings                                 # pip install openai

    genai.configure(api_key=settings.GEMINI_API_KEY)
    model    = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    return response.text
    # response = client.chat.completions.create(
    #     messages=[
    #         {
    #             "role": "system",
    #             "content": (
    #                 "You are an expert Vedic astrologer with deep knowledge of "
    #                 "Jyotisha. Provide accurate, respectful, and helpful readings "
    #                 "based on the chart data provided. Always note that astrology "
    #                 "is a guidance tool, not a definitive prediction."
    #             ),
    #         },
    #         {"role": "user", "content": prompt},
    #     ],
    #     temperature=0.7,
    #     max_tokens=1000,
    # )
    # return response.choices[0].message.content.strip()