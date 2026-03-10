import { useState, useRef } from "react";
import imgCristalino from "../../assets/bottle-cristalino.gif";
import imgReposado   from "../../assets/bottle-reposado.gif";
import imgBlanco     from "../../assets/bottle-blanco.gif";

export interface BottleData {
  id: string;
  name: string;
  brand: string;
  blurb: string;
  darkText: boolean;
}

export const BOTTLES: BottleData[] = [
  {
    id:       "cristalino",
    name:     "70 Cristalino",
    brand:    "Don Julio",
    blurb:    "Aged 18 months, then stripped of colour.\nAll the depth. None of the shadows.",
    darkText: true,
  },
  {
    id:       "reposado",
    name:     "Reposado",
    brand:    "Don Julio",
    blurb:    "Two months in American white oak.\nSmoke and warmth with nowhere to be.",
    darkText: false,
  },
  {
    id:       "blanco",
    name:     "Blanco",
    brand:    "Don Julio",
    blurb:    "Pure blue agave. Unaged. Uncut.\nThe spirit at its most dangerous.",
    darkText: false,
  },
];

const GIF_MAP: Record<string, string> = {
  cristalino: imgCristalino,
  reposado:   imgReposado,
  blanco:     imgBlanco,
};

interface Props {
  onSelect: (id: string) => void;
}

export function BottleSelector({ onSelect }: Props) {
  const [activePage, setActivePage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const page = Math.round(scrollRef.current.scrollLeft / 402);
    setActivePage(Math.min(Math.max(page, 0), BOTTLES.length - 1));
  };

  return (
    <div style={{ position: "absolute", inset: 0 }}>

      {/* ── Scrollable pages ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
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
        {BOTTLES.map((bottle) => (
          <div
            key={bottle.id}
            onClick={() => onSelect(bottle.id)}
            style={{
              flexShrink: 0,
              width: "100%",
              height: "100%",
              scrollSnapAlign: "start",
              position: "relative",
              cursor: "pointer",
            }}
          >
            {/* GIF background */}
            <img
              src={GIF_MAP[bottle.id]}
              alt={bottle.name}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
            />

            {/* Gradient overlay */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: bottle.darkText
                ? "linear-gradient(to bottom, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)"
                : "linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.72) 100%)",
            }} />

            {/* Bottle name + brand */}
            <div style={{ position: "absolute", top: 64, left: 28, pointerEvents: "none" }}>
              <p style={{
                fontFamily: "Spectral, serif",
                fontWeight: 700,
                fontSize: 44,
                color: bottle.darkText ? "#0c0c0c" : "white",
                lineHeight: 1.0,
                margin: 0,
                letterSpacing: -1.4,
              }}>
                {bottle.name}
              </p>
              <p style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontStyle: "italic",
                fontSize: 13,
                color: bottle.darkText ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.65)",
                margin: "7px 0 0",
                letterSpacing: 0.6,
              }}>
                {bottle.brand}
              </p>
            </div>

            {/* Blurb — bottom of card */}
            <div style={{ position: "absolute", bottom: 108, left: 28, right: 28, pointerEvents: "none" }}>
              <p style={{
                fontFamily: "Spectral, serif",
                fontWeight: 400,
                fontStyle: "italic",
                fontSize: 16,
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.55,
                margin: 0,
                whiteSpace: "pre-wrap",
              }}>
                {bottle.blurb}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Page dots ── */}
      <div style={{
        position: "absolute",
        bottom: 72,
        left: 0, right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 8,
        pointerEvents: "none",
      }}>
        {BOTTLES.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === activePage ? 18 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: i === activePage ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.28)",
              transition: "all 0.25s ease",
            }}
          />
        ))}
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
