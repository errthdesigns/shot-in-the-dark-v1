/**
 * RecipeCard — The Reposado Paloma recipe reveal.
 *
 * Each ingredient tile appears at the EXACT moment the voice reads it.
 *
 *  0 — Bottle (immediate) → voice: "Forty-five mils of Don Julio Reposado tequila"
 *  1 — Grapefruit         → voice: "Twenty-two mils of fresh grapefruit juice"
 *  2 — Lime               → voice: "Fifteen mils of fresh lime"
 *  3 — Agave nectar       → voice: "Fifteen mils of agave nectar"
 *  4 — Cilantro           → voice: "And a handful of fresh cilantro leaves"
 *  closing                → voice: "The Reposado Paloma. Let me add these to your cart."
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { speakText, stopSpeech } from "../services/elevenlabs";

import imgGrapefruit    from "figma:asset/eb15f2ca8fa38722649c3aca5b016c8a354485e5.png";
import imgLime          from "figma:asset/ad1a6d3445d99ccf8e1db21ccbcdb6d9a41581d8.png";
import imgAgave         from "figma:asset/fdbf08631a64c7759f8f34e345f24dd602054d7d.png";
import imgCilantro      from "figma:asset/bebb630f58426b309f126863bf068e9875b1c0c6.png";
import imgTequilaBottle from "figma:asset/8bef655fab2288c1abb626e35b6d1aae3918d462.png";

const easeOut = [0.16, 1, 0.3, 1] as const;
const delay   = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ── Reusable ingredient tile ──────────────────────────────────────────────────
function Tile({
  visible, src, style, imgStyle, radius = 8,
}: {
  visible: boolean;
  src: string;
  style: React.CSSProperties;
  imgStyle?: React.CSSProperties;
  radius?: number;
}) {
  return (
    <motion.div
      style={{ position: "absolute", borderRadius: radius, overflow: "hidden", ...style }}
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={visible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 10 }}
      transition={{ duration: 0.55, ease: easeOut }}
    >
      <img
        src={src}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...imgStyle }}
      />
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function RecipeCard() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // Stage 0: bottle appears immediately — wait for it to settle
      setStage(0);
      await delay(900);
      if (cancelled) return;

      // Speak tequila while the bottle is already visible
      await speakText("Forty-five mils of Don Julio Reposado tequila");
      if (cancelled) return;
      await delay(260);

      // Stage 1: grapefruit appears as voice begins
      setStage(1);
      await speakText("Twenty-two mils of fresh grapefruit juice");
      if (cancelled) return;
      await delay(260);

      // Stage 2: lime appears as voice begins
      setStage(2);
      await speakText("Fifteen mils of fresh lime");
      if (cancelled) return;
      await delay(260);

      // Stage 3: agave nectar appears as voice begins
      setStage(3);
      await speakText("Fifteen mils of agave nectar");
      if (cancelled) return;
      await delay(260);

      // Stage 4: cilantro appears as voice begins
      setStage(4);
      await speakText("And a handful of fresh cilantro leaves");
      if (cancelled) return;
      await delay(420);

      // Closing line — invites user to review the cart
      await speakText("The Reposado Paloma. Let me add these to your cart.");
    };

    run();
    return () => {
      cancelled = true;
      stopSpeech();
    };
  }, []);

  const s = (n: number) => stage >= n;

  // ── Layout  (402 × 874 canvas; ~110px bottom reserved for the mic bar)
  // Row 1 (top):    grapefruit left  | lime right        — h 220, top 5
  // Row 2 (middle): bottle full-width                    — h 285, top 230
  // Row 3 (bottom): agave left       | cilantro right    — h 225, top 520

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: "#0A0A0A", overflow: "hidden" }}>

      {/* ── Row 1: Grapefruit (left) + Lime (right) ──────────────────────── */}
      <Tile
        visible={s(1)}
        src={imgGrapefruit}
        style={{ left: 5, top: 5, width: 195, height: 220 }}
      />
      <Tile
        visible={s(2)}
        src={imgLime}
        style={{ left: 205, top: 5, width: 192, height: 220 }}
        imgStyle={{ objectPosition: "center 60%" }}
      />

      {/* ── Row 2: Bottle (full width) ────────────────────────────────────── */}
      <Tile
        visible={s(0)}
        src={imgTequilaBottle}
        style={{ left: 5, top: 230, width: 392, height: 285 }}
        imgStyle={{ objectPosition: "center 30%" }}
      />

      {/* "The Reposado Paloma" title — fades in with the bottle */}
      <motion.p
        style={{
          position: "absolute",
          right: 18,
          top: 242,
          fontFamily: "Spectral, serif",
          fontWeight: 700,
          fontStyle: "italic",
          fontSize: 34,
          color: "white",
          lineHeight: 1.0,
          margin: 0,
          textAlign: "right",
          textShadow: "0 2px 20px rgba(0,0,0,0.95)",
          letterSpacing: -0.4,
          pointerEvents: "none",
          zIndex: 2,
        }}
        initial={{ opacity: 0 }}
        animate={s(0) ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.1, ease: easeOut, delay: 0.5 }}
      >
        The<br />Reposado<br />Paloma
      </motion.p>

      {/* ── Row 3: Agave (left) + Cilantro (right) ────────────────────────── */}
      <Tile
        visible={s(3)}
        src={imgAgave}
        style={{ left: 5, top: 520, width: 195, height: 225 }}
      />
      <Tile
        visible={s(4)}
        src={imgCilantro}
        style={{ left: 205, top: 520, width: 192, height: 225 }}
      />

    </div>
  );
}
