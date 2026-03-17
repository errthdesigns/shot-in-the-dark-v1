import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { speakText, stopSpeech } from "../services/elevenlabs";
import { AudioReactiveGradient } from "./AudioReactiveGradient";

// ── Public type ───────────────────────────────────────────────────────────────
export interface PartyDetails {
  name: string;
  guests: number;
  area: string;       // "Central" | "North" | "South" | "East" | "West" | "Surprise Me"
  date: string;       // long  e.g. "26th March"
  dateShort: string;  // short e.g. "26th Mar"
  time: string;       // e.g. "7:00pm"
  budgetPerHead: number;
}

interface Props { onComplete: (d: PartyDetails) => void; }

// ── Options ───────────────────────────────────────────────────────────────────
const GUEST_OPTIONS = [6, 7, 8, 9, 10, 11] as const; // 11 renders as "11+"
const AREA_OPTIONS  = ["Central", "North", "South", "East", "West", "Surprise Me"] as const;
const TIME_OPTIONS  = ["5:00pm", "6:00pm", "7:00pm", "8:00pm", "9:00pm", "10:00pm"] as const;
const TEXAS_CITIES  = ["Austin", "Dallas", "Houston", "San Antonio", "Fort Worth", "San Marcos"] as const;

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
  const today  = new Date();
  return Array.from({ length: 21 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i + 1);
    const n = d.getDate();
    return {
      date:      `${ordinal(n)} ${mFull[d.getMonth()]}`,
      dateShort: `${ordinal(n)} ${mShort[d.getMonth()]}`,
      day:       dNames[d.getDay()],
      num:       n,
      month:     mShort[d.getMonth()],
    };
  });
}

const DATES = generateDates();

// ── Venue suggestions per city ────────────────────────────────────────────────
const VENUE_SUGGESTIONS: Record<string, { name: string; type: string; rating: number; distance: string; desc: string }[]> = {
  Austin:        [{ name: "The Elephant Room", type: "Jazz Bar", rating: 4.7, distance: "0.3mi", desc: "Underground jazz den with killer cocktails and a dark, moody vibe." }],
  Dallas:        [{ name: "The Rustic",         type: "Outdoor Bar", rating: 4.6, distance: "0.8mi", desc: "Sprawling outdoor venue with live music and a massive whiskey selection." }],
  Houston:       [{ name: "The Pastry War",     type: "Mezcal Bar", rating: 4.8, distance: "0.5mi", desc: "Award-winning mezcal bar hidden in the heart of downtown Houston." }],
  "San Antonio": [{ name: "The Esquire Tavern", type: "Historic Bar", rating: 4.7, distance: "0.4mi", desc: "San Antonio's oldest bar on the River Walk, pouring since 1933." }],
  "Fort Worth":  [{ name: "Righteous",          type: "Craft Bar",   rating: 4.5, distance: "0.6mi", desc: "Craft cocktails and southern hospitality in Fort Worth's Sundance Square." }],
  "San Marcos":  [{ name: "The Junction",       type: "River Bar",   rating: 4.4, distance: "0.7mi", desc: "Breezy river-side bar perfect for a mysterious night with friends." }],
};

// ── Panels ────────────────────────────────────────────────────────────────────
type Panel = "name" | "guests" | "location" | "venue" | "datetime" | "budget";
const PANELS: Panel[] = ["name", "guests", "location", "venue", "datetime", "budget"];

const QUESTIONS: Record<Panel, string> = {
  name:     "First things first,\nwhat do they call you?",
  guests:   "First up, how many suspects...\nI mean... guests are we expecting??",
  location: "Where's the scene being set?",
  venue:    "Pick your poison...\nwhere shall we strike?",
  datetime: "Alrighty, what date and time?",
  budget:   "How deep are your pockets?",
};

const VOICE_LINES: Record<Panel, string> = {
  name:     "First things first — what do they call you?",
  guests:   "First up, how many suspects... I mean, guests are we expecting?",
  location: "And where's the scene being set?",
  venue:    "Pick your poison — where shall we strike?",
  datetime: "Alrighty, what date and time are we talking?",
  budget:   "Last question — how deep are the pockets?",
};

// ── Shared styles (Figma spec) ────────────────────────────────────────────────
const PAD = 53;
const TILE_W = 138;
const GAP    = 12;
const TILE_H_LG = 72;
const TILE_H_SM = 60;

const HEADING: React.CSSProperties = {
  fontFamily: "Spectral, serif",
  fontWeight: 500,
  fontSize: 26,
  letterSpacing: -0.52,
  lineHeight: 1.18,
  color: "white",
  textAlign: "center",
  margin: 0,
  whiteSpace: "pre-wrap",
};

const NEXT_BTN: React.CSSProperties = {
  width: 279,
  height: 57,
  borderRadius: 60,
  border: "1px solid white",
  background: "transparent",
  cursor: "pointer",
  fontFamily: "Inter, sans-serif",
  fontWeight: 700,
  fontSize: 16,
  letterSpacing: 1.2,
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  boxShadow: "0px 10px 34px rgba(0,0,0,0.25)",
};

// ── Tile helpers ──────────────────────────────────────────────────────────────
function tileStyle(selected: boolean, h: number): React.CSSProperties {
  return {
    width: TILE_W,
    height: h,
    borderRadius: 10,
    border: "1px solid white",
    background: selected ? "white" : "black",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    flexShrink: 0,
  };
}

// ── Texas Map SVG Component ───────────────────────────────────────────────────
function TexasMap({ city }: { city: string }) {
  // Skull pin positions (venue markers) keyed loosely by city
  const skullPins: { x: number; y: number }[] = [
    { x: 140, y: 95 },
    { x: 210, y: 130 },
    { x: 100, y: 155 },
    { x: 260, y: 85 },
  ];
  const userPos = { x: 185, y: 145 };

  return (
    <div style={{ position: "relative", width: "100%", height: 200, borderRadius: 14, overflow: "hidden" }}>
      <svg
        width="100%"
        height="200"
        viewBox="0 0 320 200"
        style={{ display: "block", background: "#1a1a1a" }}
      >
        {/* Dark map base */}
        <rect width="320" height="200" fill="#1a1a1a" />

        {/* Park / green areas */}
        <rect x="30" y="20" width="60" height="40" rx="4" fill="#1f2b1f" />
        <rect x="200" y="100" width="50" height="35" rx="4" fill="#1f2b1f" />
        <rect x="140" y="160" width="80" height="30" rx="4" fill="#1f2b1f" />

        {/* Water / river winding at bottom */}
        <path
          d="M0 175 Q40 165 80 178 Q120 190 160 172 Q200 155 240 168 Q280 180 320 165"
          fill="none" stroke="#1e3a4a" strokeWidth="14" strokeLinecap="round"
        />

        {/* Street grid — horizontal */}
        {[40, 65, 90, 115, 140].map((y, i) => (
          <line key={`h${i}`} x1="0" y1={y} x2="320" y2={y}
            stroke="#2e2e2e" strokeWidth={i % 2 === 0 ? 2 : 1} />
        ))}
        {/* Street grid — vertical */}
        {[50, 95, 140, 185, 230, 275].map((x, i) => (
          <line key={`v${i}`} x1={x} y1="0" x2={x} y2="200"
            stroke="#2e2e2e" strokeWidth={i % 3 === 0 ? 2 : 1} />
        ))}

        {/* Major road highlights */}
        <line x1="0" y1="90" x2="320" y2="90" stroke="#3a3a3a" strokeWidth="3" />
        <line x1="140" y1="0" x2="140" y2="200" stroke="#3a3a3a" strokeWidth="3" />

        {/* City label */}
        <text x="160" y="16" textAnchor="middle"
          fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700"
          letterSpacing="2" fill="rgba(255,255,255,0.3)" textTransform="uppercase">
          {city.toUpperCase()}
        </text>

        {/* User position marker background circle */}
        <circle cx={userPos.x} cy={userPos.y} r="14" fill="rgba(151,21,26,0.35)" />
        <circle cx={userPos.x} cy={userPos.y} r="8" fill="rgba(151,21,26,0.7)" />
      </svg>

      {/* Skull pins — absolutely positioned over SVG */}
      {skullPins.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${(p.x / 320) * 100}%`,
            top: `${(p.y / 200) * 100}%`,
            transform: "translate(-50%, -50%)",
            fontSize: 18,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.8))",
            zIndex: 2,
          }}
        >
          💀
        </div>
      ))}

      {/* User character marker */}
      <div
        style={{
          position: "absolute",
          left: `${(userPos.x / 320) * 100}%`,
          top: `${(userPos.y / 200) * 100}%`,
          transform: "translate(-50%, -50%)",
          fontSize: 20,
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.9))",
          zIndex: 3,
        }}
      >
        🧍
      </div>

      {/* Subtle vignette overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)",
        borderRadius: 14,
        pointerEvents: "none",
        zIndex: 4,
      }} />
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export function InfoGatherScreen({ onComplete }: Props) {
  const [panelIdx, setPanelIdx] = useState(0);
  const [name,     setName]     = useState("");
  const [guests,   setGuests]   = useState<number | null>(null);
  const [city,     setCity]     = useState<string>("Austin");
  const [cityOpen, setCityOpen] = useState(false);
  const [area,     setArea]     = useState<string | null>(null);
  const [venueIdx, setVenueIdx] = useState(0);
  const [dateIdx,  setDateIdx]  = useState<number | null>(null);
  const [time,     setTime]     = useState<string | null>(null);
  const [budget,   setBudget]   = useState(60);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nameRef   = useRef<HTMLInputElement>(null);

  const panel = PANELS[panelIdx];

  // Voice on panel change
  useEffect(() => {
    const id = setTimeout(() => speakText(VOICE_LINES[panel]), 100);
    return () => { clearTimeout(id); stopSpeech(); };
  }, [panelIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus name input when on name panel
  useEffect(() => {
    if (panel === "name") setTimeout(() => nameRef.current?.focus(), 400);
  }, [panel]);

  // Scroll selected date into view
  useEffect(() => {
    if (panel === "datetime" && dateIdx !== null && scrollRef.current) {
      const el = scrollRef.current.children[dateIdx] as HTMLElement;
      el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [dateIdx, panel]);

  // Reset venue index when city changes
  useEffect(() => { setVenueIdx(0); }, [city]);

  const canAdvance =
    panel === "name"     ? name.trim().length > 0 :
    panel === "guests"   ? guests !== null :
    panel === "location" ? area !== null :
    panel === "venue"    ? true :
    panel === "datetime" ? dateIdx !== null && time !== null :
    true; // budget always OK

  function advance() {
    if (!canAdvance) return;
    if (panelIdx < PANELS.length - 1) {
      setPanelIdx(p => p + 1);
    } else {
      const d = DATES[dateIdx!];
      onComplete({
        name:          name.trim(),
        guests:        guests!,
        area:          area!,
        date:          d.date,
        dateShort:     d.dateShort,
        time:          time!,
        budgetPerHead: budget,
      });
    }
  }

  const venues = VENUE_SUGGESTIONS[city] ?? VENUE_SUGGESTIONS["Austin"];
  const venue  = venues[venueIdx % venues.length];

  return (
    <div className="info-gather" style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <AudioReactiveGradient />

      {/* ── Bottom red glow ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 380,
        background: "radial-gradient(ellipse 460px 380px at 50% 100%, rgba(151,21,26,0.55) 0%, rgba(151,21,26,0.15) 55%, transparent 75%)",
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* ── Progress dots ── */}
      <div style={{
        position: "absolute", top: 54, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 6, zIndex: 10,
      }}>
        {PANELS.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === panelIdx ? 20 : 5,
              backgroundColor: i < panelIdx
                ? "rgba(255,255,255,0.5)"
                : i === panelIdx
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.18)",
            }}
            transition={{ duration: 0.3 }}
            style={{ height: 4, borderRadius: 2 }}
          />
        ))}
      </div>

      {/* ── Panel ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={panel}
          initial={{ x: 48, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -48, opacity: 0 }}
          transition={{ duration: 0.34, ease: [0.32, 0.72, 0, 1] }}
          style={{
            position: "absolute", inset: 0, zIndex: 5,
            display: "flex", flexDirection: "column",
            paddingTop: 96,
            paddingLeft: PAD,
            paddingRight: PAD,
            paddingBottom: 26,
          }}
        >
          {/* Question */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.08 }}
            style={HEADING}
          >
            {QUESTIONS[panel]}
          </motion.p>

          {/* ── Content ── */}
          <div style={{ flex: 1, marginTop: 28, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>

            {/* NAME ─────────────────────────────────────────────────────── */}
            {panel === "name" && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                style={{ marginTop: 20 }}
              >
                <input
                  ref={nameRef}
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && advance()}
                  placeholder="Your name..."
                  style={{
                    width: "100%",
                    padding: "16px",
                    boxSizing: "border-box",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid #838383",
                    borderRadius: 10,
                    fontFamily: "Inter, sans-serif",
                    fontSize: 18,
                    color: "white",
                    textAlign: "center",
                    outline: "none",
                    caretColor: "rgba(151,21,26,0.9)",
                  }}
                />
              </motion.div>
            )}

            {/* GUESTS ───────────────────────────────────────────────────── */}
            {panel === "guests" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: GAP }}>
                {GUEST_OPTIONS.map((n, i) => {
                  const sel = guests === n;
                  return (
                    <motion.button
                      key={n}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, delay: i * 0.05 }}
                      onClick={() => setGuests(n)}
                      whileTap={{ scale: 0.94 }}
                      style={tileStyle(sel, TILE_H_LG)}
                    >
                      <span style={{
                        fontFamily: "Spectral, serif",
                        fontWeight: 700,
                        fontSize: 32,
                        color: sel ? "black" : "white",
                        lineHeight: 1,
                      }}>
                        {n === 11 ? "11+" : n}
                      </span>
                      <span style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                        fontSize: 8,
                        letterSpacing: 2.24,
                        textTransform: "uppercase",
                        color: "#6f6f6f",
                      }}>
                        GUESTS
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* LOCATION ─────────────────────────────────────────────────── */}
            {panel === "location" && (
              <div>
                {/* City dropdown */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  style={{ position: "relative", marginBottom: 16 }}
                >
                  <button
                    onClick={() => setCityOpen(o => !o)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingBottom: 12,
                      paddingTop: 4,
                      borderBottom: "1px solid rgba(255,255,255,0.25)",
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.25)",
                      cursor: "pointer",
                    } as React.CSSProperties}
                  >
                    <span style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 16,
                      color: "white",
                      letterSpacing: -0.32,
                      lineHeight: 2,
                    }}>
                      {city}
                    </span>
                    <motion.svg
                      animate={{ rotate: cityOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      width="20" height="20" viewBox="0 0 20 20" fill="none"
                    >
                      <path d="M5 8L10 13L15 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  </button>

                  <AnimatePresence>
                    {cityOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          background: "#1a1a1a",
                          border: "1px solid rgba(255,255,255,0.15)",
                          borderRadius: 10,
                          overflow: "hidden",
                          zIndex: 20,
                        }}
                      >
                        {TEXAS_CITIES.map((c) => (
                          <button
                            key={c}
                            onClick={() => { setCity(c); setCityOpen(false); }}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "12px 16px",
                              background: c === city ? "rgba(255,255,255,0.08)" : "transparent",
                              border: "none",
                              borderBottom: "1px solid rgba(255,255,255,0.06)",
                              color: "white",
                              fontFamily: "Inter, sans-serif",
                              fontSize: 15,
                              cursor: "pointer",
                            }}
                          >
                            {c}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Area tiles */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: GAP }}>
                  {AREA_OPTIONS.map((a, i) => {
                    const sel = area === a;
                    return (
                      <motion.button
                        key={a}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28, delay: i * 0.05 + 0.1 }}
                        onClick={() => setArea(a)}
                        whileTap={{ scale: 0.94 }}
                        style={{
                          ...tileStyle(false, TILE_H_SM),
                          background: sel ? "white" : "black",
                        }}
                      >
                        <span style={{
                          fontFamily: "Spectral, serif",
                          fontWeight: 500,
                          fontSize: 20,
                          color: sel ? "black" : "white",
                          lineHeight: 1,
                        }}>
                          {a}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VENUE ────────────────────────────────────────────────────── */}
            {panel === "venue" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {/* Map */}
                <TexasMap city={city} />

                {/* Venue card */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 }}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 14,
                    padding: "14px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{
                      fontFamily: "Spectral, serif",
                      fontWeight: 600,
                      fontSize: 18,
                      color: "white",
                      letterSpacing: -0.3,
                    }}>
                      {venue.name}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 12, color: "#FFD700" }}>★</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                        {venue.rating}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      color: "rgba(151,21,26,0.9)",
                      background: "rgba(151,21,26,0.15)",
                      padding: "3px 8px",
                      borderRadius: 4,
                    }}>
                      {venue.type}
                    </span>
                    <span style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.45)",
                    }}>
                      {venue.distance} away
                    </span>
                  </div>
                  <p style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.55)",
                    margin: 0,
                    lineHeight: 1.5,
                  }}>
                    {venue.desc}
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* DATE / TIME ──────────────────────────────────────────────── */}
            {panel === "datetime" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Date strip */}
                <div
                  ref={scrollRef}
                  style={{
                    display: "flex",
                    gap: 10,
                    overflowX: "auto",
                    paddingBottom: 4,
                    scrollbarWidth: "none",
                    WebkitOverflowScrolling: "touch",
                  } as React.CSSProperties}
                >
                  {DATES.map((d, i) => {
                    const sel = dateIdx === i;
                    return (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.3) }}
                        onClick={() => setDateIdx(i)}
                        whileTap={{ scale: 0.92 }}
                        style={{
                          flexShrink: 0,
                          width: 64,
                          height: 88,
                          borderRadius: 10,
                          border: "1px solid white",
                          background: sel ? "white" : "black",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 2,
                        }}
                      >
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: sel ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)" }}>{d.day}</span>
                        <span style={{ fontFamily: "Spectral, serif", fontWeight: 700, fontSize: 28, color: sel ? "black" : "white", lineHeight: 1 }}>{d.num}</span>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, color: sel ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.45)" }}>{d.month}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Time tiles — 2 × 3 grid */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: GAP }}>
                  {TIME_OPTIONS.map((t, i) => {
                    const sel = time === t;
                    return (
                      <motion.button
                        key={t}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28, delay: i * 0.05 + 0.1 }}
                        onClick={() => setTime(t)}
                        whileTap={{ scale: 0.94 }}
                        style={tileStyle(sel, TILE_H_SM)}
                      >
                        <span style={{
                          fontFamily: "Spectral, serif",
                          fontWeight: sel ? 700 : 500,
                          fontSize: 20,
                          color: sel ? "black" : "white",
                        }}>
                          {t}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* BUDGET ───────────────────────────────────────────────────── */}
            {panel === "budget" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.12 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}
              >
                {/* Price */}
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={budget}
                      initial={{ opacity: 0.5, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.1 }}
                      style={{
                        display: "block",
                        fontFamily: "Spectral, serif",
                        fontWeight: 700,
                        fontSize: 96,
                        letterSpacing: -1.92,
                        lineHeight: 1.1,
                        color: "white",
                      }}
                    >
                      ${budget}
                    </motion.span>
                  </AnimatePresence>
                  <p style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: 10,
                    color: "#6f6f6f",
                    letterSpacing: 2.8,
                    margin: "6px 0 0",
                    textTransform: "uppercase",
                  }}>
                    PER HEAD
                  </p>
                </div>

                {/* Slider */}
                <div style={{ width: "100%", marginBottom: 24 }}>
                  <input
                    type="range"
                    min={20} max={200} step={10}
                    value={budget}
                    onChange={e => setBudget(Number(e.target.value))}
                    style={{ width: "100%", cursor: "pointer" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 10, color: "#6f6f6f", letterSpacing: 2.8 }}>$20</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 10, color: "#6f6f6f", letterSpacing: 2.8 }}>$200</span>
                  </div>
                </div>
              </motion.div>
            )}

          </div>

          {/* ── NEXT button ── */}
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 16 }}>
            <motion.button
              onClick={advance}
              whileTap={canAdvance ? { scale: 0.96 } : {}}
              animate={{ opacity: canAdvance ? 1 : 0.32 }}
              transition={{ duration: 0.2 }}
              style={NEXT_BTN}
            >
              NEXT
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Slider styles ── */}
      <style>{`
        .info-gather input[type=range] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          height: 4px;
        }
        .info-gather input[type=range]::-webkit-slider-runnable-track {
          background: rgba(255,255,255,0.22);
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
          background: rgba(255,255,255,0.22);
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
        .info-gather input::placeholder { color: rgba(255,255,255,0.3); }
        .info-gather button:last-child { border-bottom: none !important; }
      `}</style>
    </div>
  );
}
