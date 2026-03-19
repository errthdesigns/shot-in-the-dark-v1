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

import imgGrapefruit    from "../../assets/Grapefruit.png";
import imgLime          from "../../assets/Lime.png";
import imgAgave         from "../../assets/Agave.png";
import imgCilantro      from "../../assets/Cilantro.png";
import imgTequilaBottle from "../../assets/Reposado.png";

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

  // ── Layout  (402 × 874 canvas; ~110px bottom reserved for the mic bar → ~764px usable)
  // 3 equal rows, 2px gap between them
  // Row 1 (top):    grapefruit left  | lime right        — h 253, top 0
  // Row 2 (middle): bottle full-width                    — h 255, top 255
  // Row 3 (bottom): agave left       | cilantro right    — h 253, top 512

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: "#0A0A0A", overflow: "hidden" }}>

      {/* ── Row 1: Grapefruit (left) + Lime (right) ──────────────────────── */}
      <Tile
        visible={s(1)}
        src={imgGrapefruit}
        style={{ left: 0, top: 0, width: 200, height: 253 }}
      />
      <Tile
        visible={s(2)}
        src={imgLime}
        style={{ left: 202, top: 0, width: 200, height: 253 }}
        imgStyle={{ objectPosition: "center 60%" }}
      />

      {/* ── Row 2: Bottle (full width) ────────────────────────────────────── */}
      <Tile
        visible={s(0)}
        src={imgTequilaBottle}
        style={{ left: 0, top: 255, width: 402, height: 255 }}
        imgStyle={{ objectPosition: "center 30%" }}
      />

      {/* ── Row 3: Agave (left) + Cilantro (right) ────────────────────────── */}
      <Tile
        visible={s(3)}
        src={imgAgave}
        style={{ left: 0, top: 512, width: 200, height: 253 }}
      />
      <Tile
        visible={s(4)}
        src={imgCilantro}
        style={{ left: 202, top: 512, width: 200, height: 253 }}
      />

    </div>
  );
}
