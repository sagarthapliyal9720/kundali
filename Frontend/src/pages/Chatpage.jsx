import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

// ── Constants ────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const OTHER_WELCOME =
  "Namaste! 🙏 I'm your Vedic astrology guide. I've studied your birth chart carefully. What would you like to know? You can ask me about:\n\n• Love & relationships\n• Career & business\n• Health & wellness\n• Wealth & finances\n• Education & learning\n• Travel, family, spirituality, and more\n\nWhat's on your mind?";

const TOPIC_ICONS = {
  Relationship: "💞",
  Career: "💼",
  Health: "🌿",
  Wealth: "💰",
  Education: "📚",
  Other: "✨",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem("token") || "";
}

// Translation calls the Django backend which reuses the already-configured Gemini key.
// No new API key or package needed on the frontend.
async function translateToHindi(text) {
  const res = await fetch(`${API_BASE}/api/kundali/translate/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Translation failed");
  const data = await res.json();
  return data.translated;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { kundaliId, kundliData, topic, initialQuestion, topicLabel } =
    location.state || {};

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!kundaliId) { navigate("/birthchart"); return; }
    if (topicLabel === "Other" || !initialQuestion) {
      setMessages([{ role: "ai", text: OTHER_WELCOME }]);
    } else {
      const userMsg = { role: "user", text: initialQuestion };
      setMessages([userMsg]);
      callAskAPI(initialQuestion, topic, [userMsg]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const callAskAPI = async (question, topicToSend, currentMessages) => {
    setIsLoading(true);
    const loadingMsg = { role: "ai", text: "", loading: true };
    setMessages((prev) => [...(currentMessages || prev), loadingMsg]);

    try {
      const res = await fetch(`${API_BASE}/api/kundali/${kundaliId}/ask/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ question, topic: topicToSend || undefined }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Server error");
      }

      const data = await res.json();
      const answer = data.answer || "I could not generate a response. Please try again.";

      setMessages((prev) =>
        prev.map((m) => (m.loading ? { role: "ai", text: answer } : m))
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.loading
            ? { role: "ai", text: `⚠️ ${err.message || "Something went wrong. Please try again."}`, error: true }
            : m
        )
      );
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || isLoading) return;
    const userMsg = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    callAskAPI(text, null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
  <div className="h-screen bg-[#160d28] relative overflow-hidden flex">
    <Sidebar />

    <div className="md:ml-72 flex-1 flex flex-col relative z-10 h-screen">

      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 pt-20 md:pt-4 bg-[#1e1038]/90 border-b border-[#c9922a]/40 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="text-[#c9922a] hover:text-[#e8b84b] transition-colors text-xl"
        >
          ←
        </button>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{TOPIC_ICONS[topicLabel] || "✨"}</span>
          <div>
            <h1 className="text-[#f0e6c8] font-medium text-base">
              {topicLabel || "Astro"} Analysis
            </h1>
            <p className="text-[#8b7aa0] text-xs">
              Based on your D1 Kundali · Vedic Astrology
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} msg={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="px-4 py-4 bg-[#1e1038]/90 border-t border-[#c9922a]/40 flex-shrink-0">
        {!isLoading &&
          messages.length > 0 &&
          messages[messages.length - 1].role === "ai" &&
          !messages[messages.length - 1].loading && (
            <FollowupChips
              topic={topic}
              onChipClick={(q) => {
                const userMsg = { role: "user", text: q };
                setMessages((prev) => [...prev, userMsg]);
                callAskAPI(q, topic);
              }}
            />
          )}

        <div className="flex items-end gap-3 mt-2">
          <textarea
            ref={inputRef}
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a followup question…"
            disabled={isLoading}
            className="
              flex-1 resize-none
              bg-[#241443] border border-[#c9922a]/50
              text-[#f0e6c8] placeholder-[#8b7aa0]
              rounded-2xl px-4 py-3 text-sm
              focus:outline-none focus:border-[#c9922a]
              transition-colors disabled:opacity-50
            "
            style={{ maxHeight: "120px" }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            className="
              w-11 h-11 rounded-full bg-[#c9922a] text-[#160d28]
              flex items-center justify-center font-bold text-lg
              hover:bg-[#e8b84b] transition-colors
              disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0
            "
          >
            ↑
          </button>
        </div>

        <p className="text-center text-[#8b7aa0] text-[10px] mt-2">
          Astrology is a guidance tool. All readings are based on Vedic principles.
        </p>
      </div>

    </div>
  </div>
);
}

// ── Message Bubble ────────────────────────────────────────────────────────────

function MessageBubble({ msg }) {
  // Per-bubble translation state
  const [hindiText, setHindiText] = useState(null);       // null = not translated yet
  const [showHindi, setShowHindi] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [transError, setTransError] = useState(false);

  const handleTranslate = async () => {
    // If already translated, just toggle
    if (hindiText) { setShowHindi((v) => !v); return; }

    setTranslating(true);
    setTransError(false);
    try {
      const result = await translateToHindi(msg.text);
      setHindiText(result);
      setShowHindi(true);
    } catch {
      setTransError(true);
    } finally {
      setTranslating(false);
    }
  };

  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="
          max-w-[75%] bg-[#c9922a] text-[#160d28]
          rounded-2xl rounded-tr-sm px-4 py-3 text-sm font-medium leading-relaxed
        ">
          {msg.text}
        </div>
      </div>
    );
  }

  // AI bubble
  const displayText = showHindi && hindiText ? hindiText : msg.text;

  return (
    <div className="flex justify-start gap-3">
      {/* Avatar */}
      <div className="
        w-8 h-8 rounded-full flex-shrink-0
        bg-[#241443] border border-[#c9922a]/60
        flex items-center justify-center text-sm
      ">
        🔮
      </div>

      <div className="max-w-[78%] flex flex-col gap-2">

        {/* Bubble */}
        <div className={`
          bg-[#1e1038] border rounded-2xl rounded-tl-sm
          px-4 py-3 text-sm text-[#f0e6c8] leading-relaxed
          ${msg.error ? "border-red-500/50" : "border-[#c9922a]/30"}
        `}>
          {msg.loading ? (
            <LoadingDots />
          ) : (
            displayText.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))
          )}
        </div>

        {/* Translate button — only shown on real AI replies, not loading/error bubbles */}
        {!msg.loading && !msg.error && (
          <div className="flex items-center gap-2 pl-1">
            <button
              onClick={handleTranslate}
              disabled={translating}
              className="
                flex items-center gap-1.5
                text-[11px] px-3 py-1
                rounded-full border
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                "
              style={{
                borderColor: showHindi ? "#c9922a" : "#c9922a55",
                background: showHindi ? "#c9922a22" : "transparent",
                color: showHindi ? "#e8b84b" : "#8b7aa0",
              }}
            >
              {translating ? (
                <>
                  <span className="animate-spin inline-block">⟳</span>
                  <span>अनुवाद हो रहा है…</span>
                </>
              ) : showHindi ? (
                <>
                  <span>🔤</span>
                  <span>English</span>
                </>
              ) : (
                <>
                  <span>अ</span>
                  <span>हिंदी में पढ़ें</span>
                </>
              )}
            </button>

            {/* Language indicator pill */}
            {showHindi && hindiText && (
              <span className="text-[10px] text-[#8b7aa0] bg-[#241443] px-2 py-0.5 rounded-full">
                हिंदी
              </span>
            )}

            {/* Translation error */}
            {transError && (
              <span className="text-[10px] text-red-400">
                अनुवाद विफल। पुनः प्रयास करें।
              </span>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// ── Loading Dots ──────────────────────────────────────────────────────────────

function LoadingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-[#c9922a]"
          style={{ animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── Followup Chips ────────────────────────────────────────────────────────────

const FOLLOWUP_CHIPS = {
  relationship: [
    "When will I meet my life partner?",
    "What is my compatibility with Scorpio?",
    "What does my 7th house say?",
  ],
  career: [
    "Which business suits me best?",
    "Will I get a promotion this year?",
    "Is a government job indicated?",
  ],
  health: [
    "Which body parts need more attention?",
    "What does my 6th house indicate?",
    "Best time period for health improvement?",
  ],
  wealth: [
    "When is my best period for financial gains?",
    "Is property investment good for me?",
    "What does my 2nd house say about wealth?",
  ],
  education: [
    "Which field of study suits me?",
    "Will I pursue higher education abroad?",
    "What does my Mercury placement indicate?",
  ],
};

function FollowupChips({ topic, onChipClick }) {
  const chips = FOLLOWUP_CHIPS[topic] || [];
  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {chips.map((chip) => (
        <button
          key={chip}
          onClick={() => onChipClick(chip)}
          className="
            text-xs px-3 py-1.5
            bg-[#241443] border border-[#c9922a]/40
            text-[#c9922a] rounded-full
            hover:border-[#c9922a] hover:text-[#e8b84b]
            transition-all duration-200
          "
        >
          {chip}
        </button>
      ))}
    </div>
  );
}