import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { speakText, stopSpeech } from "../services/elevenlabs";
import { AudioReactiveGradient } from "./AudioReactiveGradient";
import svgMicPaths from "../../imports/svg-p5gailxsrc";

// ── Public type ───────────────────────────────────────────────────────────────
export interface PartyDetails {
  name: string;
  guests: number;
  area: string;
  date: string;
  dateShort: string;
  time: string;
  budgetPerHead: number;
}

interface Props {
  playerName: string;
  onComplete: (d: PartyDetails) => void;
}

// ── Options ───────────────────────────────────────────────────────────────────
const GUEST_OPTIONS = [6, 7, 8, 9, 10, 11] as const;
const TIME_OPTIONS  = ["7:00pm", "8:00pm", "9:00pm", "10:00pm", "5:00pm", "6:00pm"] as const;

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

// ── Panels ─────────────────────────────────────────────────────────────────────
type Panel = "guests" | "map" | "datetime" | "budget";
const PANELS: Panel[] = ["guests", "map", "datetime", "budget"];

const QUESTIONS: Record<Panel, string> = {
  guests:   "First up, how many suspects...\nI mean... guests are we expecting??",
  map:      "Where's the scene being set?\nWhat's your address",
  datetime: "Alrighty, what date and time?",
  budget:   "How deep are your pockets?",
};

const VOICE_LINES: Record<Panel, string> = {
  guests:   "First up, how many suspects... I mean, guests are we expecting?",
  map:      "Where's the scene being set? What's your address?",
  datetime: "Alrighty, what date and time are we talking?",
  budget:   "Last question — how deep are the pockets?",
};

// ── Shared styles ─────────────────────────────────────────────────────────────
const GAP  = 12;
const TILE_W = 138;
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

// ── Icons (same as PartyPlannerScreen bottom bar) ─────────────────────────────
function MicIcon({ color = "white" }: { color?: string }) {
  return (
    <svg style={{ display: "block", width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 24.0714 33">
      <rect height="22.6854" rx="5.15519" stroke={color} strokeWidth="2.06462" width="10.3104" x="6.87606" y="1.03231" />
      <path d={svgMicPaths.p27f3cf60} stroke={color} strokeLinecap="round" strokeWidth="2.0625" />
      <line stroke={color} strokeLinecap="round" strokeWidth="2.0625" x1="11.6875" x2="11.6875" y1="29.2188" y2="31.9688" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg style={{ display: "block", width: 12, height: 12 }} fill="none" viewBox="0 0 13 12.5">
      <line stroke="#838383" strokeLinecap="round" x1="1.20711" x2="12.5"  y1="0.5"  y2="11.7929" />
      <line stroke="#838383" strokeLinecap="round" transform="matrix(-0.707107 0.707107 0.707107 0.707107 12.5 0.5)" x1="0.5" x2="16.4706" y1="-0.5" y2="-0.5" />
    </svg>
  );
}
function GridIcon() {
  return (
    <div style={{ position: "relative", width: 19, height: 14 }}>
      {[0,5,10,15].flatMap(l => [0,5].map(t => (
        <div key={`${l}-${t}`} style={{ position: "absolute", left: l, top: t, width: 4, height: 4, border: "0.5px solid #838383", borderRadius: 0.5 }} />
      )))}
      <div style={{ position: "absolute", left: 0, top: 10, width: 19, height: 2, border: "0.5px solid #838383", borderRadius: 0.5 }} />
    </div>
  );
}

// ── Pegman SVG (yellow Google Maps figure) ────────────────────────────────────
function PegmanFigure({ dead = false }: { dead?: boolean }) {
  return (
    <svg
      width="32" height="52"
      viewBox="0 0 32 52"
      fill="none"
      style={{
        display: "block",
        transform: dead ? "rotate(90deg)" : "none",
        transformOrigin: "16px 26px",
        transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1)",
        filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.7))",
      }}
    >
      {/* Head */}
      <circle cx="16" cy="7" r="6.5" fill="#F9C400" stroke="#c9a000" strokeWidth="1" />
      {dead
        ? /* X eyes */ (<>
            <line x1="12" y1="5" x2="15" y2="8" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="15" y1="5" x2="12" y2="8" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="17" y1="5" x2="20" y2="8" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="20" y1="5" x2="17" y2="8" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
          </>)
        : /* Normal eyes */ (<>
            <circle cx="13" cy="6" r="1.2" fill="#333" />
            <circle cx="19" cy="6" r="1.2" fill="#333" />
          </>)
      }
      {/* Body */}
      <rect x="11" y="14" width="10" height="16" rx="4" fill="#F9C400" stroke="#c9a000" strokeWidth="1" />
      {/* Left arm */}
      <line x1="11" y1="18" x2="4" y2="26" stroke="#F9C400" strokeWidth="3.5" strokeLinecap="round" />
      {/* Right arm */}
      <line x1="21" y1="18" x2="28" y2="26" stroke="#F9C400" strokeWidth="3.5" strokeLinecap="round" />
      {/* Left leg */}
      <line x1="13" y1="30" x2="9"  y2="44" stroke="#F9C400" strokeWidth="3.5" strokeLinecap="round" />
      {/* Right leg */}
      <line x1="19" y1="30" x2="23" y2="44" stroke="#F9C400" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Texas dark map ─────────────────────────────────────────────────────────────
function TexasMap({
  playerName,
  onDrop,
  dropPos,
  isDead,
}: {
  playerName: string;
  onDrop: (x: number, y: number) => void;
  dropPos: { x: number; y: number } | null;
  isDead: boolean;
}) {
  const mapRef = useRef<HTMLDivElement>(null);

  const handleMapTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (dropPos) return; // already dropped
    const el = mapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let cx: number, cy: number;
    if ("touches" in e) {
      cx = e.touches[0].clientX;
      cy = e.touches[0].clientY;
    } else {
      cx = (e as React.MouseEvent).clientX;
      cy = (e as React.MouseEvent).clientY;
    }
    const xPct = Math.max(10, Math.min(90, ((cx - rect.left) / rect.width) * 100));
    const yPct = Math.max(10, Math.min(80, ((cy - rect.top)  / rect.height) * 100));
    onDrop(xPct, yPct);
  };

  return (
    <div
      ref={mapRef}
      onClick={handleMapTap}
      style={{
        position: "relative",
        width: "100%",
        height: 210,
        borderRadius: 14,
        overflow: "hidden",
        cursor: dropPos ? "default" : "crosshair",
      }}
    >
      {/* SVG map base */}
      <svg width="100%" height="210" viewBox="0 0 320 210" style={{ display: "block" }}>
        <rect width="320" height="210" fill="#1a1a1a" />
        {/* Parks */}
        <rect x="22" y="18"  width="55" height="38" rx="4" fill="#1e2b1e" />
        <rect x="195" y="95" width="48" height="32" rx="4" fill="#1e2b1e" />
        <rect x="135" y="158" width="75" height="28" rx="4" fill="#1e2b1e" />
        {/* River */}
        <path d="M0 178 Q45 168 88 180 Q128 192 162 174 Q202 156 244 170 Q282 182 320 168"
          fill="none" stroke="#1a3040" strokeWidth="15" strokeLinecap="round" />
        {/* Street grid horizontal */}
        {[38, 62, 86, 110, 134].map((y, i) => (
          <line key={`h${i}`} x1="0" y1={y} x2="320" y2={y}
            stroke={i % 2 === 0 ? "#2c2c2c" : "#252525"} strokeWidth={i % 2 === 0 ? 2 : 1} />
        ))}
        {/* Street grid vertical */}
        {[48, 90, 132, 174, 216, 264].map((x, i) => (
          <line key={`v${i}`} x1={x} y1="0" x2={x} y2="210"
            stroke={i % 3 === 0 ? "#2c2c2c" : "#252525"} strokeWidth={i % 3 === 0 ? 2 : 1} />
        ))}
        {/* Major roads */}
        <line x1="0" y1="86" x2="320" y2="86" stroke="#383838" strokeWidth="3.5" />
        <line x1="132" y1="0" x2="132" y2="210" stroke="#383838" strokeWidth="3.5" />
        {/* City label */}
        <text x="160" y="15" textAnchor="middle"
          fontFamily="Inter, sans-serif" fontSize="8" fontWeight="700"
          letterSpacing="2.5" fill="rgba(255,255,255,0.25)">
          TEXAS
        </text>
      </svg>

      {/* Tap-to-place instruction (shown when not yet dropped) */}
      {!dropPos && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          pointerEvents: "none", gap: 8,
        }}>
          <span style={{ fontSize: 28 }}>📍</span>
          <p style={{
            fontFamily: "Inter, sans-serif", fontSize: 11,
            color: "rgba(255,255,255,0.5)", letterSpacing: 1.5,
            margin: 0, textTransform: "uppercase",
          }}>
            Tap to drop your location
          </p>
        </div>
      )}

      {/* Dropped pegman */}
      {dropPos && (
        <div style={{
          position: "absolute",
          left: `${dropPos.x}%`,
          top:  `${dropPos.y}%`,
          transform: "translate(-50%, -100%)",
          zIndex: 5,
          pointerEvents: "none",
        }}>
          <PegmanFigure dead={isDead} />
          {/* House label */}
          <AnimatePresence>
            {isDead && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.3 }}
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginTop: 6,
                  background: "rgba(0,0,0,0.75)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 6,
                  padding: "4px 9px",
                  whiteSpace: "nowrap",
                }}
              >
                <p style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "white",
                  margin: 0,
                  letterSpacing: 0.5,
                }}>
                  {playerName ? `${playerName}'s House` : "My House"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 14, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.5) 100%)",
      }} />
    </div>
  );
}

// ── Draggable Pegman holder (at top, user drags from here) ─────────────────────
function PegmanHolder({
  onDragToMap,
  dropped,
}: {
  onDragToMap: (mapX: number, mapY: number) => void;
  dropped: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const [pos, setPos]           = useState({ x: 0, y: 0 });
  const startRef = useRef({ x: 0, y: 0 });
  const holdRef  = useRef<HTMLDivElement>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if (dropped) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY };
    setPos({ x: 0, y: 0 });
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setPos({ x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging(false);
    // Find map element and calculate relative position
    const mapEl = document.getElementById("texas-map-drop");
    if (mapEl) {
      const rect = mapEl.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top  && e.clientY <= rect.bottom) {
        const xPct = Math.max(10, Math.min(90, ((e.clientX - rect.left) / rect.width)  * 100));
        const yPct = Math.max(10, Math.min(80, ((e.clientY - rect.top)  / rect.height) * 100));
        onDragToMap(xPct, yPct);
        return;
      }
    }
    setPos({ x: 0, y: 0 });
  };

  return (
    <div
      ref={holdRef}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        opacity: dropped ? 0.25 : 1,
        transition: "opacity 0.3s",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      <motion.div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        animate={dragging
          ? { x: pos.x, y: pos.y, scale: 1.18 }
          : { x: 0, y: 0, scale: 1 }
        }
        transition={dragging ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }}
        style={{
          cursor: dropped ? "default" : dragging ? "grabbing" : "grab",
          zIndex: dragging ? 999 : 1,
          position: "relative",
        }}
      >
        <PegmanFigure dead={false} />
      </motion.div>
      {!dropped && (
        <p style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 9,
          color: "rgba(255,255,255,0.4)",
          letterSpacing: 1.8,
          textTransform: "uppercase",
          margin: 0,
          pointerEvents: "none",
        }}>
          Drag me
        </p>
      )}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export function InfoGatherScreen({ playerName, onComplete }: Props) {
  const [panelIdx, setPanelIdx] = useState(0);
  const [guests,   setGuests]   = useState<number | null>(null);
  const [dropPos,  setDropPos]  = useState<{ x: number; y: number } | null>(null);
  const [isDead,   setIsDead]   = useState(false);
  const [dateIdx,  setDateIdx]  = useState<number | null>(null);
  const [time,     setTime]     = useState<string | null>(null);
  const [budget,   setBudget]   = useState(60);
  const scrollRef = useRef<HTMLDivElement>(null);

  const panel = PANELS[panelIdx];

  // Speak question on panel entry
  useEffect(() => {
    const id = setTimeout(() => speakText(VOICE_LINES[panel]), 120);
    return () => { clearTimeout(id); stopSpeech(); };
  }, [panelIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll selected date into view
  useEffect(() => {
    if (panel === "datetime" && dateIdx !== null && scrollRef.current) {
      const el = scrollRef.current.children[dateIdx] as HTMLElement;
      el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [dateIdx, panel]);

  // When pegman is dropped, trigger dead animation after bounce
  const handleDrop = (x: number, y: number) => {
    setDropPos({ x, y });
    setTimeout(() => setIsDead(true), 380);
  };

  const canAdvance =
    panel === "guests"   ? guests !== null :
    panel === "map"      ? isDead :
    panel === "datetime" ? dateIdx !== null && time !== null :
    true;

  const advance = () => {
    if (!canAdvance) return;
    if (panelIdx < PANELS.length - 1) {
      setPanelIdx(p => p + 1);
    } else {
      const d = DATES[dateIdx!];
      onComplete({
        name:          playerName,
        guests:        guests!,
        area:          "Texas",
        date:          d.date,
        dateShort:     d.dateShort,
        time:          time!,
        budgetPerHead: budget,
      });
    }
  };

  const PAD = 53;

  return (
    <div className="info-gather" style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <AudioReactiveGradient />

      {/* Bottom red glow */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 380,
        background: "radial-gradient(ellipse 460px 380px at 50% 100%, rgba(151,21,26,0.55) 0%, rgba(151,21,26,0.15) 55%, transparent 75%)",
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* Progress dots */}
      <div style={{
        position: "absolute", top: 54, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 6, zIndex: 10,
      }}>
        {PANELS.map((_, i) => (
          <motion.div key={i}
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

      {/* Panel content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={panel}
          initial={{ x: 48, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -48, opacity: 0 }}
          transition={{ duration: 0.34, ease: [0.32, 0.72, 0, 1] }}
          style={{
            position: "absolute",
            top: 96, left: PAD, right: PAD,
            bottom: 130,
            zIndex: 5,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Heading */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.08 }}
            style={HEADING}
          >
            {QUESTIONS[panel]}
          </motion.p>

          {/* Content area */}
          <div style={{ flex: 1, marginTop: 28, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>

            {/* ── GUESTS ── */}
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
                        fontFamily: "Spectral, serif", fontWeight: 700,
                        fontSize: 32, color: sel ? "black" : "white", lineHeight: 1,
                      }}>
                        {n === 11 ? "11+" : n}
                      </span>
                      <span style={{
                        fontFamily: "Inter, sans-serif", fontWeight: 700,
                        fontSize: 8, letterSpacing: 2.24, textTransform: "uppercase",
                        color: "#6f6f6f",
                      }}>
                        GUESTS
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* ── MAP ── */}
            {panel === "map" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {/* Pegman source + instruction row */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <PegmanHolder onDragToMap={handleDrop} dropped={isDead} />
                  {!isDead && (
                    <p style={{
                      fontFamily: "Inter, sans-serif", fontSize: 12,
                      color: "rgba(255,255,255,0.5)", lineHeight: 1.4,
                      margin: 0, flex: 1,
                    }}>
                      Drag the figure onto the map — or just tap to drop
                    </p>
                  )}
                  {isDead && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        fontFamily: "Spectral, serif", fontSize: 14,
                        color: "rgba(255,255,255,0.7)", lineHeight: 1.4,
                        margin: 0, flex: 1, fontStyle: "italic",
                      }}
                    >
                      Perfect. We'll start the trail from {playerName ? `${playerName}'s` : "your"} place.
                    </motion.p>
                  )}
                </div>

                {/* Map */}
                <div id="texas-map-drop">
                  <TexasMap
                    playerName={playerName}
                    onDrop={handleDrop}
                    dropPos={dropPos}
                    isDead={isDead}
                  />
                </div>
              </motion.div>
            )}

            {/* ── DATE / TIME ── */}
            {panel === "datetime" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Time tiles — shown FIRST per the screenshot */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: GAP }}>
                  {TIME_OPTIONS.map((t, i) => {
                    const sel = time === t;
                    return (
                      <motion.button
                        key={t}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28, delay: i * 0.05 }}
                        onClick={() => setTime(t)}
                        whileTap={{ scale: 0.94 }}
                        style={tileStyle(sel, TILE_H_SM)}
                      >
                        <span style={{
                          fontFamily: "Spectral, serif",
                          fontWeight: sel ? 700 : 500,
                          fontSize: 18,
                          color: sel ? "black" : "white",
                        }}>{t}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Date strip */}
                <div
                  ref={scrollRef}
                  style={{
                    display: "flex", gap: 10, overflowX: "auto",
                    paddingBottom: 4, scrollbarWidth: "none",
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
                          flexShrink: 0, width: 64, height: 80, borderRadius: 10,
                          border: "1px solid white", background: sel ? "white" : "black",
                          cursor: "pointer", display: "flex", flexDirection: "column",
                          alignItems: "center", justifyContent: "center", gap: 2,
                        }}
                      >
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: sel ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)" }}>{d.day}</span>
                        <span style={{ fontFamily: "Spectral, serif", fontWeight: 700, fontSize: 26, color: sel ? "black" : "white", lineHeight: 1 }}>{d.num}</span>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, color: sel ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.45)" }}>{d.month}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── BUDGET ── */}
            {panel === "budget" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.12 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
              >
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
                        fontWeight: 700, fontSize: 96,
                        letterSpacing: -1.92, lineHeight: 1.1, color: "white",
                      }}
                    >
                      ${budget}
                    </motion.span>
                  </AnimatePresence>
                  <p style={{
                    fontFamily: "Inter, sans-serif", fontWeight: 700,
                    fontSize: 10, color: "#6f6f6f", letterSpacing: 2.8,
                    margin: "6px 0 0", textTransform: "uppercase",
                  }}>
                    PER HEAD
                  </p>
                </div>

                <div style={{ width: "100%", marginBottom: 24 }}>
                  <input
                    type="range" min={20} max={200} step={10}
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
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom bar: X · Mic · Grid ── */}
      {/* X button */}
      <div style={{
        position: "absolute", left: 107, top: 778, width: 45, height: 45,
        borderRadius: 22.5, border: "1px dashed #838383",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", zIndex: 20,
      }}>
        <XIcon />
      </div>

      {/* Ready pulse ring */}
      <AnimatePresence>
        {canAdvance && (
          <motion.div
            key={`ring-${panel}`}
            style={{
              position: "absolute", left: 160, top: 759, width: 82, height: 82,
              borderRadius: 41, border: "1.5px solid rgba(255,255,255,0.28)",
              pointerEvents: "none", zIndex: 19,
            }}
            animate={{ scale: [1, 1.55], opacity: [0.55, 0] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Mic / advance button */}
      <motion.button
        onClick={advance}
        disabled={!canAdvance}
        style={{
          position: "absolute", left: 168, top: 767, width: 66, height: 66,
          borderRadius: 33, border: "none",
          cursor: canAdvance ? "pointer" : "default",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px 22px", boxSizing: "border-box", zIndex: 20,
        }}
        animate={{
          backgroundColor: canAdvance ? ["#383838", "#444", "#383838"] : "#383838",
          opacity: canAdvance ? 1 : 0.45,
        }}
        transition={canAdvance ? { duration: 2.2, repeat: Infinity } : {}}
        whileTap={canAdvance ? { scale: 0.88 } : {}}
      >
        <MicIcon />
      </motion.button>

      {/* Grid button */}
      <div style={{
        position: "absolute", left: 250, top: 778, width: 45, height: 45,
        borderRadius: 22.5, border: "1px dashed #838383",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", zIndex: 20,
      }}>
        <GridIcon />
      </div>

      {/* Slider styles */}
      <style>{`
        .info-gather input[type=range] { -webkit-appearance:none; appearance:none; background:transparent; height:4px; }
        .info-gather input[type=range]::-webkit-slider-runnable-track { background:rgba(255,255,255,0.22); height:4px; border-radius:2px; }
        .info-gather input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:24px; height:24px; border-radius:50%; background:white; margin-top:-10px; box-shadow:0 2px 14px rgba(0,0,0,0.45); cursor:pointer; }
        .info-gather input[type=range]::-moz-range-track { background:rgba(255,255,255,0.22); height:4px; border-radius:2px; }
        .info-gather input[type=range]::-moz-range-thumb { width:24px; height:24px; border-radius:50%; background:white; border:none; box-shadow:0 2px 14px rgba(0,0,0,0.45); cursor:pointer; }
      `}</style>
    </div>
  );
}
