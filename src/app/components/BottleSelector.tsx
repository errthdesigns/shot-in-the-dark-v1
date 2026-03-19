import { useState, useRef } from "react";
import imgCristalino from "../../assets/cristalino_bottle.png";
import imgReposado   from "../../assets/resposado_bottle.png";
import imgBlanco     from "../../assets/blanco_bottle.png";

// Only reposado is available in this demo
const SELECTABLE_ID = "reposado";

export interface BottleData {
  id: string;
  name: string;
  brand: string;
}

export const BOTTLES: BottleData[] = [
  {
    id:       "cristalino",
    name:     "70 Cristalino",
    brand:    "Don Julio",
  },
  {
    id:       "reposado",
    name:     "Reposado",
    brand:    "Don Julio",
  },
  {
    id:       "blanco",
    name:     "Blanco",
    brand:    "Don Julio",
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
  // Track scroll position at pointer-down to distinguish swipe from tap
  const pointerDownScrollX = useRef(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const page = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
    setActivePage(Math.min(Math.max(page, 0), BOTTLES.length - 1));
  };

  const handlePointerDown = () => {
    pointerDownScrollX.current = scrollRef.current?.scrollLeft ?? 0;
  };

  const handleCardClick = (bottleId: string) => {
    // If scroll moved more than 5px since pointer-down, it was a swipe — ignore
    const scrolled = Math.abs((scrollRef.current?.scrollLeft ?? 0) - pointerDownScrollX.current);
    if (scrolled > 5) return;
    // Only the selectable bottle triggers onSelect
    if (bottleId !== SELECTABLE_ID) return;
    onSelect(bottleId);
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
              {/* GIF background */}
              <img
                src={GIF_MAP[bottle.id]}
                alt={bottle.name}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
              />

              {/* Gradient overlay */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.72) 100%)",
              }} />

              {/* Dim overlay for non-selectable bottles */}
              {!selectable && (
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: "rgba(0,0,0,0.45)",
                }} />
              )}

            </div>
          );
        })}
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
