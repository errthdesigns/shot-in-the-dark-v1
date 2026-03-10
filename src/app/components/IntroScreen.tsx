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

interface Blob { x: number; y: number; r: number; h: number; s: number; l: number; }

const BLOBS: Blob[] = [
  { x: 0.18, y: 0.28, r: 0.52, h: 275, s: 72, l: 22 }, // deep violet
  { x: 0.82, y: 0.62, r: 0.46, h: 340, s: 80, l: 18 }, // crimson wine
  { x: 0.50, y: 0.82, r: 0.54, h: 24,  s: 90, l: 22 }, // burnt amber
  { x: 0.12, y: 0.72, r: 0.38, h: 230, s: 70, l: 16 }, // midnight navy
  { x: 0.88, y: 0.18, r: 0.40, h: 300, s: 78, l: 20 }, // electric purple
];

// Returns bass / mid / high energy in [0, 1]
function getAudioLevels(analyser: AnalyserNode): { bass: number; mid: number; high: number } {
  const data = new Uint8Array(analyser.frequencyBinCount); // 64 bins
  analyser.getByteFrequencyData(data);
  const avg = (a: number, b: number) => {
    let s = 0; for (let i = a; i < b; i++) s += data[i]; return s / ((b - a) * 255);
  };
  return { bass: avg(0, 6), mid: avg(6, 24), high: avg(24, 48) };
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
      ctx.clearRect(0, 0, W, H);

      const analyser = getAnalyser();
      const lvl = analyser ? getAudioLevels(analyser) : { bass: 0, mid: 0, high: 0 };
      const energyWeights = [lvl.bass, lvl.bass, lvl.mid, lvl.high, lvl.mid];

      BLOBS.forEach((blob, i) => {
        const drift   = 0.07;
        const energy  = energyWeights[i];
        const breathe = 1 + energy * 0.55;
        const bx = (blob.x + Math.sin(t * 0.00035 + i * 1.31) * drift) * W;
        const by = (blob.y + Math.cos(t * 0.00028 + i * 0.97) * drift) * H;
        const br = blob.r * Math.min(W, H) * breathe;

        // Lightness pulses up slightly with energy
        const l = Math.min(blob.l + energy * 18, 55);
        const centerColor = `hsla(${blob.h},${blob.s}%,${l}%,0.72)`;
        const edgeColor   = `hsla(${blob.h},${blob.s}%,${l}%,0)`;

        const grd = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        grd.addColorStop(0, centerColor);
        grd.addColorStop(1, edgeColor);

        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

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
          mixBlendMode: "screen",
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
