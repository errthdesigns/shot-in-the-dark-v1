import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { speakText, stopSpeech, getAnalyser } from "../services/elevenlabs";

// ── Script ────────────────────────────────────────────────────────────────────
// Text must exactly match what should be spoken — voice duration drives timing.

const CHUNKS = [
  "Well, well, well...",
  "Look who just walked into the wrong saloon\nat exactly the right time.",
  "Welcome to Shot in the Dark.",
  "Here's how this works. Somebody's dead.\nA room full of suspects.\nAnd the only thing standing between a killer\nand a clean getaway...\nis you.",
  "I'll help you plan the night, build the drinks,\nand make sure nobody leaves without\na story worth telling.",
  "The bottle you choose tonight\ndecides how this story ends.",
  "So.\nYou ready?",
];

// Short silence (ms) between audio ending and text starting to exit
const POST_AUDIO_PAUSE = 420;

// ── Token builder ─────────────────────────────────────────────────────────────

interface Token { word: string; breakAfter: boolean; }

function buildTokens(text: string): Token[] {
  const lines = text.split("\n");
  const out: Token[] = [];
  lines.forEach((line, li) => {
    line.trim().split(/\s+/).filter(Boolean).forEach((word, wi, arr) => {
      out.push({ word, breakAfter: wi === arr.length - 1 && li < lines.length - 1 });
    });
  });
  return out;
}

// ── Animation variants ────────────────────────────────────────────────────────

const WORD_STAGGER   = 0.042;
const EXIT_STAGGER   = 0.026;
const WORD_ENTER_DUR = 0.58;
const WORD_EXIT_DUR  = 0.30;

const containerV = {
  visible: { transition: { staggerChildren: WORD_STAGGER } },
  exit:    { transition: { staggerChildren: EXIT_STAGGER, staggerDirection: -1 } },
};

const wordV = {
  initial: { opacity: 0, filter: "blur(14px)", y: 6 },
  visible: {
    opacity: 1, filter: "blur(0px)", y: 0,
    transition: { duration: WORD_ENTER_DUR, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0, filter: "blur(10px)", y: -5,
    transition: { duration: WORD_EXIT_DUR, ease: "easeIn" as const },
  },
};

// ── Gradient blobs ────────────────────────────────────────────────────────────
// Western noir: black base, orange embers only.
// dispX/dispY are per-blob phase offsets for displacement oscillators.

interface Blob { x: number; y: number; r: number; h: number; s: number; l: number; px: number; py: number; }

const BLOBS: Blob[] = [
  { x: 0.62, y: 0.52, r: 0.68, h: 26, s: 92, l:  9, px:  1.31, py:  0.97 }, // main ember
  { x: 0.26, y: 0.70, r: 0.50, h: 20, s: 88, l:  5, px: -0.85, py:  1.43 }, // coal, lower-left
  { x: 0.80, y: 0.30, r: 0.40, h: 33, s: 95, l:  6, px:  0.62, py: -1.17 }, // flicker, upper-right
];

// Returns bass / mid / high energy in [0, 1], plus raw frequency data
function getAudioLevels(analyser: AnalyserNode): { bass: number; mid: number; high: number; data: Uint8Array } {
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  const avg = (a: number, b: number) => {
    let s = 0; for (let i = a; i < b; i++) s += data[i]; return s / ((b - a) * 255);
  };
  return { bass: avg(0, 6), mid: avg(6, 24), high: avg(24, 48), data };
}

// ── Component ──────────────────────────────────────────────────────────────────

interface Props { onComplete: () => void; }

export function IntroScreen({ onComplete }: Props) {
  const [idx, setIdx]         = useState(0);
  const [visible, setVisible] = useState(true);
  const cancelledRef = useRef(false);
  const phaseRef     = useRef<"running" | "done">("running");
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const rafRef       = useRef<number>(0);

  // ── Voice-driven sequencer ─────────────────────────────────────────────────
  // For each chunk:  speak → wait for audio to end → short pause → hide text
  // Text exit animation completes → handleExitComplete advances to next chunk.
  useEffect(() => {
    cancelledRef.current = false;
    phaseRef.current     = "running";
    setVisible(true);

    async function run() {
      // Speak the chunk and WAIT for audio to finish naturally
      await speakText(CHUNKS[idx]);
      if (cancelledRef.current) return;

      // Small breath between voice ending and text leaving
      await new Promise<void>(r => setTimeout(r, POST_AUDIO_PAUSE));
      if (cancelledRef.current) return;

      setVisible(false);
    }

    run();

    return () => { cancelledRef.current = true; };
  }, [idx]);

  // Called by AnimatePresence once exit animation fully completes
  const handleExitComplete = () => {
    if (cancelledRef.current) return;
    const next = idx + 1;
    if (next >= CHUNKS.length) {
      onComplete();
    } else {
      setIdx(next);
    }
  };

  // ── Gradient canvas loop ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (t: number) => {
      const W = canvas.width;
      const H = canvas.height;

      // Own the background — pure black so orange embers read against it
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      // Additive blending: overlapping orange glows stack toward bright amber/white
      ctx.globalCompositeOperation = "lighter";

      const analyser = getAnalyser();
      const lvl = analyser
        ? getAudioLevels(analyser)
        : { bass: 0, mid: 0, high: 0, data: new Uint8Array(64) };

      // Each blob is primarily driven by a different band
      const energyWeights = [lvl.bass, lvl.mid, (lvl.bass + lvl.mid) * 0.55];

      BLOBS.forEach((blob, i) => {
        const energy = energyWeights[i];

        // Slow ambient drift (always on)
        const ambientX = Math.sin(t * 0.00032 + i * blob.px) * 0.05;
        const ambientY = Math.cos(t * 0.00025 + i * blob.py) * 0.05;

        // Audio displacement: faster oscillators scaled by energy
        const dispMag = energy * 0.22;
        const dispX = Math.sin(t * 0.0018 + i * 2.7 + lvl.mid * 3) * dispMag;
        const dispY = Math.cos(t * 0.0021 + i * 1.9 + lvl.bass * 2) * dispMag;

        const bx = (blob.x + ambientX + dispX) * W;
        const by = (blob.y + ambientY + dispY) * H;

        // Radius breathes with energy — main blob expands most
        const breathe = 1 + energy * (i === 0 ? 0.80 : 0.55);
        const br = blob.r * Math.min(W, H) * breathe;

        // Lightness flares dramatically — goes from near-black to vivid orange
        const l = Math.min(blob.l + energy * 58, 62);
        // Slight hue shift toward warmer orange under high bass
        const h = blob.h + lvl.bass * 6;

        const grd = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        grd.addColorStop(0,   `hsla(${h},${blob.s}%,${l}%,0.85)`);
        grd.addColorStop(0.4, `hsla(${h},${blob.s}%,${l * 0.55}%,0.45)`);
        grd.addColorStop(1,   `hsla(${h},${blob.s}%,${l * 0.2}%,0)`);

        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

      // Hot-spot: a tight bright spark that chases high-frequency energy
      if (lvl.high > 0.04) {
        const sparkEnergy = lvl.high;
        const sx = (0.62 + Math.sin(t * 0.004 + lvl.mid * 5) * 0.18) * W;
        const sy = (0.50 + Math.cos(t * 0.005 + lvl.bass * 4) * 0.15) * H;
        const sr = 0.12 * Math.min(W, H) * sparkEnergy;
        const sl = Math.min(40 + sparkEnergy * 38, 78);
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
        sg.addColorStop(0, `hsla(28,100%,${sl}%,${sparkEnergy * 0.9})`);
        sg.addColorStop(1, `hsla(28,100%,30%,0)`);
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fillStyle = sg;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Tap anywhere to skip
  const skip = () => {
    cancelledRef.current = true;
    stopSpeech();
    onComplete();
  };

  const tokens = buildTokens(CHUNKS[idx]);

  return (
    <div
      onClick={skip}
      style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 36px",
        cursor: "pointer",
      }}
    >
      {/* Audio-reactive gradient background */}
      <canvas
        ref={canvasRef}
        width={410}
        height={882}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          pointerEvents: "none",
        }}
      />

      <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
        {visible && (
          <motion.p
            key={idx}
            initial="initial"
            animate="visible"
            exit="exit"
            variants={containerV}
            style={{
              fontFamily: "Spectral, serif",
              fontWeight: 400,
              fontSize: 24,
              color: "white",
              lineHeight: 1.38,
              textAlign: "center",
              margin: 0,
              letterSpacing: 0.1,
            }}
          >
            {tokens.flatMap((tok, i) => {
              const el = (
                <motion.span
                  key={`w-${i}`}
                  variants={wordV}
                  style={{ display: "inline-block", marginRight: "0.26em" }}
                >
                  {tok.word}
                </motion.span>
              );
              return tok.breakAfter ? [el, <br key={`br-${i}`} />] : el;
            })}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div style={{ position: "absolute", bottom: 42, display: "flex", gap: 5, alignItems: "center" }}>
        {CHUNKS.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === idx ? 14 : 4,
              backgroundColor: i === idx
                ? "rgba(255,255,255,0.7)"
                : i < idx
                  ? "rgba(255,255,255,0.35)"
                  : "rgba(255,255,255,0.15)",
            }}
            transition={{ duration: 0.3 }}
            style={{ height: 4, borderRadius: 2 }}
          />
        ))}
      </div>

      {/* Tap to skip hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.28 }}
        transition={{ delay: 3, duration: 1.2 }}
        style={{
          position: "absolute", bottom: 16,
          fontFamily: "Inter, sans-serif",
          fontSize: 9,
          color: "white",
          letterSpacing: 2.8,
          margin: 0,
          textTransform: "uppercase",
          pointerEvents: "none",
        }}
      >
        Tap to skip
      </motion.p>
    </div>
  );
}
