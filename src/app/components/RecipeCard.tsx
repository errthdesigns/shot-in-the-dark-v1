/**
 * RecipeCard — The Velvet Alibi recipe reveal screen.
 *
 * Each ingredient image + label appears at the EXACT moment the voice
 * starts reading it. Sequence:
 *
 *  0 — Bottle + "The Velvet Alibi" title + "45ml Don Julio 1942" label (immediate, no voice)
 *      → voice: "Forty-five mils of Don Julio 1942 tequila"
 *  1 — imgDrinkB (orange bitters photo) + "1 dash of Orange Bitters" label
 *      → voice: "One dash of Orange Bitters"
 *  3 — imgDrinkE (large top) + imgDrinkG (small right) + "2 sprinkles of dark chocolate" label
 *      → voice: "Two sprinkles of dark chocolate"
 *  4 — bottom row + imgDrinkH (large bottom) + "1 drop of chilli powder" label
 *      → voice: "One drop of chilli powder"
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { speakText, stopSpeech } from "../services/elevenlabs";

import imgDrinkB from "figma:asset/bebb630f58426b309f126863bf068e9875b1c0c6.png";
import imgDrinkC from "figma:asset/dd33400cb52f89d213f163c8a0a3d1dfb5392df3.png";
import imgDrinkE from "figma:asset/fdbf08631a64c7759f8f34e345f24dd602054d7d.png";
import imgDrinkF from "figma:asset/0a5a790cdb7a8244ab8ab4888beeffde31c348c8.png";
import imgDrinkG from "figma:asset/9a84fe4ce610df332fe3506757e6b14c9b78d673.png";
import imgDrinkH from "figma:asset/20c86c34546dbdb8928acf6ee66035cf56ce01c6.png";
import imgTequilaBottle from "figma:asset/8bef655fab2288c1abb626e35b6d1aae3918d462.png";

const easeOut = [0.16, 1, 0.3, 1] as const;
const delay   = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ── Reusable tile ─────────────────────────────────────────────────────────────
function Tile({
  visible, delayS = 0, style, imgStyle, src, radius = 5,
}: {
  visible: boolean; delayS?: number;
  style: React.CSSProperties; imgStyle?: React.CSSProperties;
  src: string; radius?: number;
}) {
  return (
    <motion.div
      style={{ position: "absolute", borderRadius: radius, overflow: "hidden", ...style }}
      initial={{ opacity: 0, scale: 0.88, y: 8 }}
      animate={visible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.88, y: 8 }}
      transition={{ duration: 0.6, ease: easeOut, delay: visible ? delayS : 0 }}
    >
      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", maxWidth: "none", ...imgStyle }} />
    </motion.div>
  );
}

// ── Reusable label ────────────────────────────────────────────────────────────
function Label({
  visible, delayS = 0, style, children,
}: {
  visible: boolean; delayS?: number; style: React.CSSProperties; children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{ position: "absolute", ...style }}
      initial={{ opacity: 0, y: 6 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      transition={{ duration: 0.55, ease: easeOut, delay: visible ? delayS : 0 }}
    >
      {children}
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function RecipeCard() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // Stage 0: bottle appears immediately — wait for it to settle
      setStage(0);
      await delay(900);
      if (cancelled) return;

      // Speak "45ml Don Julio 1942" while bottle is already on screen
      await speakText("Forty-five mils of Don Julio 1942 tequila");
      if (cancelled) return;
      await delay(280);

      // Stage 1: Orange Bitters image + label appear as voice begins
      setStage(1);
      await speakText("One dash of Orange Bitters");
      if (cancelled) return;
      await delay(280);

      // Stage 3: large top photo + small right + chocolate label appear as voice begins
      // (also makes stage 2 visible, which has no separate label)
      setStage(3);
      await speakText("Two sprinkles of dark chocolate");
      if (cancelled) return;
      await delay(280);

      // Stage 4: bottom row + chilli label appear as voice begins
      setStage(4);
      await speakText("One drop of chilli powder");
      if (cancelled) return;
      await delay(420);

      // Closing line — invites user to review the cart
      await speakText("Perfect. Let me check this out for you. Have a look at the cart, and when you're ready you can proceed to payment.");
    };

    run();
    return () => {
      cancelled = true;
      stopSpeech();
    };
  }, []);

  const s  = (n: number) => stage >= n;
  const lbl: React.CSSProperties = {
    fontFamily: "Spectral, serif", fontWeight: 700, fontStyle: "italic",
    fontSize: 14, color: "white", lineHeight: 1.3, margin: 0, whiteSpace: "pre-wrap",
  };

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: "#0A0A0A", overflow: "hidden" }}>

      {/* ── Row 1: Large top photo (stage 3) ────────────────────────────────── */}
      <Tile visible={s(3)} src={imgDrinkE}
        style={{ left: 5, top: 5, width: 250, height: 154 }}
      />

      {/* ── Row 2 left: Orange bitters photo (stage 1) ──────────────────────── */}
      <Tile visible={s(1)} src={imgDrinkB}
        style={{ left: 10, top: 169, width: 188, height: 120 }}
      />
      {/* Row 2 right: small image (stage 2, i.e. ≥ stage 3 shows it) ─────── */}
      <Tile visible={s(2)} src={imgDrinkG}
        style={{ left: 204, top: 169, width: 188, height: 120 }}
      />

      {/* ── Centre: Don Julio 1942 bottle (always visible) ──────────────────── */}
      <Tile visible={true} src={imgTequilaBottle}
        style={{ left: 6, top: 291, width: 290, height: 290 }}
      />

      {/* ── Rotated "The Velvet Alibi" title (always) ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: easeOut }}
        style={{
          position: "absolute", left: 327, top: 295,
          width: 36, height: 290,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{ transform: "rotate(-90deg)", flexShrink: 0, width: 290, textAlign: "center" }}>
          <p style={{ fontFamily: "Spectral, serif", fontWeight: 700, fontStyle: "italic", fontSize: 36, color: "white", lineHeight: 1, margin: 0 }}>
            The Velvet Alibi
          </p>
        </div>
      </motion.div>

      {/* ── Sub-title "for 6 guests (serves 12)" (always) ───────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
        transition={{ duration: 0.9, ease: easeOut, delay: 0.2 }}
        style={{
          position: "absolute", left: 366, top: 353,
          width: 10, height: 184,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{ transform: "rotate(-90deg)", flexShrink: 0, width: 184, textAlign: "center" }}>
          <p style={{ fontFamily: "Spectral, serif", fontWeight: 700, fontStyle: "italic", fontSize: 10, color: "white", lineHeight: 1, margin: 0 }}>
            for 6 guests (serves 12)
          </p>
        </div>
      </motion.div>

      {/* ── Large bottom-centre image (stage 3) ─────────────────────────────── */}
      <Tile visible={s(3)} delayS={0.12} src={imgDrinkH}
        style={{ left: 133, top: 587, width: 254, height: 158 }}
      />

      {/* ── Bottom row left (stage 4) ────────────────────────────────────────── */}
      <Tile visible={s(4)} src={imgDrinkF}
        style={{ left: 6, top: 751, width: 188, height: 109 }}
      />
      {/* ── Bottom row right (stage 4) ───────────────────────────────────────── */}
      <Tile visible={s(4)} delayS={0.12} src={imgDrinkC}
        style={{ left: 200, top: 751, width: 187, height: 109 }}
      />

      {/* ══ TEXT LABELS ══════════════════════════════════════════════════════════ */}

      {/* "45ml Don Julio 1942" — always visible, voice reads on mount */}
      <Label visible={true} delayS={0.3}
        style={{ left: 10, top: 622, transform: "translateY(-50%)", width: 120 }}
      >
        <p style={lbl}>45ml Don Julio 1942</p>
      </Label>

      {/* "1 dash of Orange Bitters" — stage 1, appears as voice begins */}
      <Label visible={s(1)} delayS={0.05}
        style={{ left: 267, top: 43, transform: "translateY(-50%)", width: 103 }}
      >
        <p style={lbl}>{"1 dash of\nOrange Bitters"}</p>
      </Label>

      {/* "2 sprinkles of dark chocolate" — stage 3, appears as voice begins */}
      <Label visible={s(3)} delayS={0.05}
        style={{ left: 267, top: 112, transform: "translateY(-50%)", width: 103, textAlign: "right" }}
      >
        <p style={lbl}>{"2 sprinkles of dark chocolate"}</p>
      </Label>

      {/* "1 drop of chilli powder" — stage 4, appears as voice begins */}
      <Label visible={s(4)} delayS={0.05}
        style={{ left: 10, top: 700, transform: "translateY(-50%)", width: 103, textAlign: "right" }}
      >
        <p style={lbl}>{"1 drop of\nchilli powder"}</p>
      </Label>

      {/* ── Thin vertical gold accent line ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 0.4, scaleY: 1 }}
        transition={{ duration: 0.8, ease: easeOut, delay: 0.4 }}
        style={{ position: "absolute", left: 321, top: 291, width: 1, height: 290, backgroundColor: "#D4A853", transformOrigin: "top" }}
      />
    </div>
  );
}