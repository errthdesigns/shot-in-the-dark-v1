import { useEffect, useRef } from "react";
import { getAnalyser } from "../services/elevenlabs";

// ── Shared western-noir audio-reactive gradient ───────────────────────────────
// Black base, orange-only embers.  Blobs displace with audio energy.
// Mount anywhere that needs the full-bleed background treatment.

interface Blob { x: number; y: number; r: number; h: number; s: number; l: number; px: number; py: number; }

const BLOBS: Blob[] = [
  { x: 0.55, y: 0.90, r: 0.70, h: 26, s: 92, l:  9, px:  1.31, py:  0.97 }, // main ember, bottom centre
  { x: 0.22, y: 0.96, r: 0.52, h: 20, s: 88, l:  5, px: -0.85, py:  1.43 }, // coal, bottom left
  { x: 0.82, y: 0.82, r: 0.42, h: 33, s: 95, l:  6, px:  0.62, py: -1.17 }, // flicker, lower right
];

function getAudioLevels(analyser: AnalyserNode) {
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  const avg = (a: number, b: number) => {
    let s = 0; for (let i = a; i < b; i++) s += data[i]; return s / ((b - a) * 255);
  };
  return { bass: avg(0, 6), mid: avg(6, 24), high: avg(24, 48) };
}

export function AudioReactiveGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (t: number) => {
      const W = canvas.width;
      const H = canvas.height;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = "lighter";

      const analyser = getAnalyser();
      const lvl = analyser
        ? getAudioLevels(analyser)
        : { bass: 0, mid: 0, high: 0 };

      const energyWeights = [lvl.bass, lvl.mid, (lvl.bass + lvl.mid) * 0.55];

      BLOBS.forEach((blob, i) => {
        const energy = energyWeights[i];

        // Lateral sway — minimal vertical ambient drift so blobs stay near the bottom
        const ambientX = Math.sin(t * 0.00032 + i * blob.px) * 0.04;
        const ambientY = Math.cos(t * 0.00025 + i * blob.py) * 0.015;

        // Horizontal sway + upward-only rise on audio (negative = up on canvas)
        const dispMag = energy * 0.20;
        const dispX = Math.sin(t * 0.0018 + i * 2.7 + lvl.mid * 3) * dispMag;
        const dispY = -Math.abs(Math.cos(t * 0.0021 + i * 1.9 + lvl.bass * 2)) * dispMag;

        const bx = (blob.x + ambientX + dispX) * W;
        const by = (blob.y + ambientY + dispY) * H;

        const breathe = 1 + energy * (i === 0 ? 0.80 : 0.55);
        const br = blob.r * Math.min(W, H) * breathe;

        const l = Math.min(blob.l + energy * 58, 62);
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

      // Hot-spot spark tracking high-frequency energy
      if (lvl.high > 0.04) {
        const e = lvl.high;
        const sx = (0.55 + Math.sin(t * 0.004 + lvl.mid * 5) * 0.18) * W;
        const sy = (0.88 - Math.abs(Math.cos(t * 0.005 + lvl.bass * 4)) * 0.18) * H;
        const sr = 0.12 * Math.min(W, H) * e;
        const sl = Math.min(40 + e * 38, 78);
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
        sg.addColorStop(0, `hsla(28,100%,${sl}%,${e * 0.9})`);
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

  return (
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
  );
}
