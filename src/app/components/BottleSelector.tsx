import { useState, useRef, useEffect } from "react";
import { speakText, stopSpeech } from "../services/elevenlabs";
import { motion, AnimatePresence } from "motion/react";
import imgCristalino from "../../assets/don cristalino.png";
import imgReposado   from "../../assets/don 1.png";
import imgBlanco     from "../../assets/don blanco.png";

const SELECTABLE_ID = "reposado";

const BOTTLE_LINES: Record<string, string> = {
  cristalino: "Cristalino. Triple filtered, crystal clear. The one you pour when you want the room to notice.",
  reposado:   "Reposado. Aged in oak. Golden, a little smoky, smooth finish. This is the one.",
  blanco:     "Blanco. Raw, bold, nothing to hide. Pure Don Julio — no apology.",
};

export interface BottleData {
  id: string;
  name: string;
  mood: string;
}

export const BOTTLES: BottleData[] = [
  { id: "cristalino", name: "Cristalino",  mood: "1920's Masquerade" },
  { id: "reposado",   name: "Reposado",    mood: "Western Noir"      },
  { id: "blanco",     name: "Blanco",      mood: "White Lotus"       },
];

const IMG_MAP: Record<string, string> = {
  cristalino: imgCristalino,
  reposado:   imgReposado,
  blanco:     imgBlanco,
};

interface Props {
  onSelect: (id: string) => void;
}

export function BottleSelector({ onSelect }: Props) {
  const [activePage, setActivePage]   = useState(0);
  const [breaking, setBreaking]       = useState(false);
  const scrollRef                     = useRef<HTMLDivElement>(null);
  const pointerDownScrollX            = useRef(0);

  // Speak bottle description whenever the active page changes
  useEffect(() => {
    stopSpeech();
    const id = setTimeout(() => speakText(BOTTLE_LINES[BOTTLES[activePage].id]), 400);
    return () => clearTimeout(id);
  }, [activePage]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const page = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
    setActivePage(Math.min(Math.max(page, 0), BOTTLES.length - 1));
  };

  const handlePointerDown = () => {
    pointerDownScrollX.current = scrollRef.current?.scrollLeft ?? 0;
  };

  const handleCardClick = (bottleId: string) => {
    const scrolled = Math.abs((scrollRef.current?.scrollLeft ?? 0) - pointerDownScrollX.current);
    if (scrolled > 5) return;
    if (bottleId !== SELECTABLE_ID) return;
    // Flash-break transition: white flash, then advance
    setBreaking(true);
    setTimeout(() => onSelect(bottleId), 520);
  };

  return (
    <div style={{ position: "absolute", inset: 0 }}>

      {/* ── Scrollable pages ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          overflowX: "scroll",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch" as never,
          scrollbarWidth: "none" as never,
          msOverflowStyle: "none" as never,
        }}
      >
        {BOTTLES.map((bottle) => {
          const selectable = bottle.id === SELECTABLE_ID;
          return (
            <div
              key={bottle.id}
              onClick={() => handleCardClick(bottle.id)}
              style={{
                flexShrink: 0,
                width: "100%",
                height: "100%",
                scrollSnapAlign: "start",
                position: "relative",
                cursor: selectable ? "pointer" : "default",
              }}
            >
              {/* Full-bleed image */}
              <img
                src={IMG_MAP[bottle.id]}
                alt={bottle.name}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
              />

              {/* Bottom gradient */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.82) 100%)",
              }} />

              {/* Name + mood — bottom of card */}
              <div style={{ position: "absolute", bottom: 108, left: 0, right: 0, textAlign: "center", pointerEvents: "none" }}>
                <p style={{
                  fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10,
                  color: "rgba(255,255,255,0.5)", letterSpacing: 4, textTransform: "uppercase",
                  margin: "0 0 8px",
                }}>
                  {bottle.mood}
                </p>
                <p style={{
                  fontFamily: "Spectral, serif", fontWeight: 400, fontStyle: "italic",
                  fontSize: 36, color: "white", letterSpacing: -0.5, margin: 0, lineHeight: 1,
                }}>
                  {bottle.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Page dots + swipe hint ── */}
      <div style={{
        position: "absolute", bottom: 72, left: 0, right: 0,
        display: "flex", justifyContent: "center", alignItems: "center", gap: 12, pointerEvents: "none",
      }}>
        <motion.p
          animate={{ opacity: activePage === 0 ? 0.38 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ fontFamily: "Inter, sans-serif", fontSize: 9, color: "white", letterSpacing: 2.5, textTransform: "uppercase", margin: 0 }}
        >swipe</motion.p>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {BOTTLES.map((_, i) => (
            <div key={i} style={{
              width: i === activePage ? 18 : 6, height: 6, borderRadius: 3,
              backgroundColor: i === activePage ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.28)",
              transition: "all 0.25s ease",
            }} />
          ))}
        </div>
      </div>

      {/* ── Break flash — white flare on select ── */}
      <AnimatePresence>
        {breaking && (
          <motion.div
            key="break-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeIn" }}
            style={{ position: "absolute", inset: 0, backgroundColor: "black", pointerEvents: "none", zIndex: 100 }}
          />
        )}
      </AnimatePresence>

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
