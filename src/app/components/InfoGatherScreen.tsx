import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { speakText, stopSpeech } from "../services/elevenlabs";
import { AudioReactiveGradient } from "./AudioReactiveGradient";

// ── Public type — returned via onComplete ─────────────────────────────────────
export interface PartyDetails {
  guests: number;
  date: string;       // long form  e.g. "26th March"
  dateShort: string;  // short form e.g. "26th Mar"
  time: string;       // e.g. "7PM"
  venue: string;      // e.g. "At Home"
  budgetPerHead: number;
}

interface Props { onComplete: (d: PartyDetails) => void; }

// ── Static options ─────────────────────────────────────────────────────────────
const GUEST_OPTIONS = [2, 4, 6, 8, 10, 12];
const TIME_OPTIONS  = ["5PM", "6PM", "7PM", "8PM", "9PM", "10PM"];
const VENUE_OPTIONS = [
  { label: "At Home",      sub: "intimate setting"    },
  { label: "Private Bar",  sub: "behind closed doors" },
  { label: "Event Space",  sub: "room for suspects"   },
  { label: "Venue TBC",    sub: "mystery location"    },
];

function ordinal(n: number): string {
  if ([11, 12, 13].includes(n % 100)) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

function generateDates() {
  const dNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const mShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const mFull  = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const out: { date: string; dateShort: string; day: string; num: number; month: string }[] = [];
  const today = new Date();
  for (let i = 1; i <= 21; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const n = d.getDate();
    out.push({
      date:      `${ordinal(n)} ${mFull[d.getMonth()]}`,
      dateShort: `${ordinal(n)} ${mShort[d.getMonth()]}`,
      day:       dNames[d.getDay()],
      num:       n,
      month:     mShort[d.getMonth()],
    });
  }
  return out;
}

const DATES = generateDates();

// ── Panels ─────────────────────────────────────────────────────────────────────
type Panel = "guests" | "date" | "time" | "venue" | "budget";
const PANELS: Panel[] = ["guests", "date", "time", "venue", "budget"];

const QUESTIONS: Record<Panel, string> = {
  guests: "How many guests\nare we expecting?",
  date:   "What night\nare we talking?",
  time:   "What time does\nthe curtain rise?",
  venue:  "Where's\nthe scene?",
  budget: "How deep\nare the pockets?",
};

const VOICE_LINES: Record<Panel, string> = {
  guests: "How many guests are we expecting? And don't say a few — I like specifics.",
  date:   "Good. And what night are we talking?",
  time:   "What time does the curtain rise?",
  venue:  "And where's the scene?",
  budget: "Last question — how deep are the pockets? I need to know what we're working with.",
};

// ── Component ─────────────────────────────────────────────────────────────────
export function InfoGatherScreen({ onComplete }: Props) {
  const [panelIdx, setPanelIdx] = useState(0);
  const [guests,   setGuests]   = useState<number | null>(null);
  const [dateIdx,  setDateIdx]  = useState<number | null>(null);
  const [time,     setTime]     = useState<string | null>(null);
  const [venue,    setVenue]    = useState<string | null>(null);
  const [budget,   setBudget]   = useState(60);
  const scrollRef = useRef<HTMLDivElement>(null);

  const panel = PANELS[panelIdx];

  // Speak voice line for each panel
  useEffect(() => {
    speakText(VOICE_LINES[panel]);
    return () => stopSpeech();
  }, [panelIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll date strip to show selected card
  useEffect(() => {
    if (panel === "date" && dateIdx !== null && scrollRef.current) {
      const el = scrollRef.current.children[dateIdx] as HTMLElement;
      el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [dateIdx, panel]);

  function advance() {
    if (panelIdx < PANELS.length - 1) {
      setPanelIdx(p => p + 1);
    } else {
      const d = DATES[dateIdx!];
      onComplete({
        guests:        guests!,
        date:          d.date,
        dateShort:     d.dateShort,
        time:          time!,
        venue:         venue!,
        budgetPerHead: budget,
      });
    }
  }

  function pick(setter: () => void, delay = 160) {
    setter();
    setTimeout(advance, delay);
  }

  return (
    <div className="info-gather" style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <AudioReactiveGradient />

      {/* ── Progress dots ── */}
      <div style={{
        position: "absolute", top: 58, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 6, zIndex: 10,
      }}>
        {PANELS.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === panelIdx ? 20 : 5,
              backgroundColor: i < panelIdx
                ? "rgba(255,255,255,0.55)"
                : i === panelIdx
                  ? "rgba(255,255,255,0.85)"
                  : "rgba(255,255,255,0.18)",
            }}
            transition={{ duration: 0.32 }}
            style={{ height: 4, borderRadius: 2 }}
          />
        ))}
      </div>

      {/* ── Panel ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={panel}
          initial={{ x: 56, opacity: 0 }}
          animate={{ x: 0,  opacity: 1 }}
          exit={{    x: -56, opacity: 0 }}
          transition={{ duration: 0.36, ease: [0.32, 0.72, 0, 1] }}
          style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            padding: "92px 26px 28px",
          }}
        >
          {/* Question */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.1, ease: "easeOut" }}
            style={{
              fontFamily: "Spectral, serif",
              fontWeight: 400,
              fontSize: 30,
              color: "white",
              lineHeight: 1.28,
              margin: "0 0 32px",
              whiteSpace: "pre-wrap",
            }}
          >
            {QUESTIONS[panel]}
          </motion.p>

          {/* ── GUESTS ──────────────────────────────────────────────────────── */}
          {panel === "guests" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {GUEST_OPTIONS.map((n, i) => {
                const sel = guests === n;
                return (
                  <motion.button
                    key={n}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.055, ease: "easeOut" }}
                    onClick={() => pick(() => setGuests(n))}
                    whileTap={{ scale: 0.92 }}
                    style={{
                      height: 86,
                      background: sel ? "white" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${sel ? "white" : "rgba(255,255,255,0.12)"}`,
                      borderRadius: 16,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                    }}
                  >
                    <span style={{
                      fontFamily: "Spectral, serif",
                      fontWeight: 700,
                      fontSize: 36,
                      color: sel ? "black" : "white",
                      lineHeight: 1,
                    }}>
                      {n === 12 ? "12+" : n}
                    </span>
                    <span style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 10,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      color: sel ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.35)",
                    }}>
                      {n === 1 ? "guest" : "guests"}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* ── DATE ────────────────────────────────────────────────────────── */}
          {panel === "date" && (
            <div
              ref={scrollRef}
              style={{
                display: "flex",
                gap: 10,
                overflowX: "auto",
                paddingBottom: 6,
                scrollbarWidth: "none",
                WebkitOverflowScrolling: "touch",
              } as React.CSSProperties}
            >
              {DATES.map((d, i) => {
                const sel = dateIdx === i;
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, delay: Math.min(i * 0.025, 0.35) }}
                    onClick={() => pick(() => setDateIdx(i), 200)}
                    whileTap={{ scale: 0.91 }}
                    style={{
                      flexShrink: 0,
                      width: 68,
                      height: 96,
                      background: sel ? "white" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${sel ? "white" : "rgba(255,255,255,0.12)"}`,
                      borderRadius: 16,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                    }}
                  >
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: sel ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.38)" }}>{d.day}</span>
                    <span style={{ fontFamily: "Spectral, serif", fontWeight: 700, fontSize: 30, color: sel ? "black" : "white", lineHeight: 1 }}>{d.num}</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: sel ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.42)" }}>{d.month}</span>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* ── TIME ────────────────────────────────────────────────────────── */}
          {panel === "time" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {TIME_OPTIONS.map((t, i) => {
                const sel = time === t;
                return (
                  <motion.button
                    key={t}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06, ease: "easeOut" }}
                    onClick={() => pick(() => setTime(t))}
                    whileTap={{ scale: 0.92 }}
                    style={{
                      height: 72,
                      background: sel ? "white" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${sel ? "white" : "rgba(255,255,255,0.12)"}`,
                      borderRadius: 16,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{
                      fontFamily: "Spectral, serif",
                      fontWeight: 600,
                      fontSize: 22,
                      color: sel ? "black" : "white",
                    }}>
                      {t}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* ── VENUE ───────────────────────────────────────────────────────── */}
          {panel === "venue" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {VENUE_OPTIONS.map((v, i) => {
                const sel = venue === v.label;
                return (
                  <motion.button
                    key={v.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.07, ease: "easeOut" }}
                    onClick={() => pick(() => setVenue(v.label), 210)}
                    whileTap={{ scale: 0.92 }}
                    style={{
                      height: 106,
                      background: sel ? "white" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${sel ? "white" : "rgba(255,255,255,0.12)"}`,
                      borderRadius: 16,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "flex-end",
                      padding: "0 14px 14px",
                    }}
                  >
                    <span style={{
                      fontFamily: "Spectral, serif",
                      fontWeight: 600,
                      fontStyle: "italic",
                      fontSize: 17,
                      color: sel ? "black" : "white",
                      lineHeight: 1.2,
                    }}>
                      {v.label}
                    </span>
                    <span style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 11,
                      color: sel ? "rgba(0,0,0,0.48)" : "rgba(255,255,255,0.38)",
                      marginTop: 5,
                    }}>
                      {v.sub}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* ── BUDGET ──────────────────────────────────────────────────────── */}
          {panel === "budget" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              {/* Price display */}
              <div style={{ textAlign: "center", marginBottom: 36 }}>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={budget}
                    initial={{ opacity: 0.5, scale: 0.9 }}
                    animate={{ opacity: 1,   scale: 1 }}
                    transition={{ duration: 0.1 }}
                    style={{
                      display: "block",
                      fontFamily: "Spectral, serif",
                      fontWeight: 700,
                      fontSize: 84,
                      color: "white",
                      lineHeight: 1,
                    }}
                  >
                    £{budget}
                  </motion.span>
                </AnimatePresence>
                <p style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: 2.8,
                  margin: "10px 0 0",
                  textTransform: "uppercase",
                }}>
                  per head
                </p>
              </div>

              {/* Slider */}
              <div style={{ width: "100%", marginBottom: 36 }}>
                <input
                  type="range"
                  min={20}
                  max={200}
                  step={10}
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  style={{ width: "100%", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7 }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.28)" }}>£20</span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.28)" }}>£200</span>
                </div>
              </div>

              {/* Confirm button */}
              <motion.button
                onClick={advance}
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                style={{
                  width: "100%",
                  height: 58,
                  background: "white",
                  border: "none",
                  borderRadius: 16,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: 2.2,
                  color: "black",
                }}
              >
                SET THE SCENE →
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Range slider styles ── */}
      <style>{`
        .info-gather input[type=range] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          height: 4px;
        }
        .info-gather input[type=range]::-webkit-slider-runnable-track {
          background: rgba(255,255,255,0.18);
          height: 4px;
          border-radius: 2px;
        }
        .info-gather input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          margin-top: -10px;
          box-shadow: 0 2px 14px rgba(0,0,0,0.45);
          cursor: pointer;
        }
        .info-gather input[type=range]::-moz-range-track {
          background: rgba(255,255,255,0.18);
          height: 4px;
          border-radius: 2px;
        }
        .info-gather input[type=range]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: none;
          box-shadow: 0 2px 14px rgba(0,0,0,0.45);
          cursor: pointer;
        }
      `}</style>

    </div>
  );
}
