import { useEffect, useRef } from "react";
import { getAnalyser } from "../services/elevenlabs";

// ── Full-screen smoky ember ───────────────────────────────────────────────────
// Heat source at the bottom. Smoke columns rise and fill the whole screen.
// Each column uses a vertically-stretched ellipse with rH ≥ H so colour
// reaches from floor to ceiling. Slow compound sway creates organic flow.

function getAudioLevels(analyser: AnalyserNode) {
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  const avg = (a: number, b: number) => {
    let s = 0; for (let i = a; i < b; i++) s += data[i]; return s / ((b - a) * 255);
  };
  return { bass: avg(0, 6), mid: avg(6, 24), high: avg(24, 48) };
}

// Draw a vertically-stretched radial gradient (circle → tall ellipse via scale).
// Centre is at (cx, cy). rW = horizontal radius. rH = vertical radius.
// Clipping arc is scaled to rW (becomes rH tall after ctx.scale).
function drawEllipseGlow(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  rW: number, rH: number,
  stops: [number, string][],
) {
  if (rW <= 0 || rH <= 0) return;
  const yScale = rH / rW;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(1, yScale);
  const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, rW);
  stops.forEach(([p, c]) => grd.addColorStop(p, c));
  ctx.beginPath();
  ctx.arc(0, 0, rW, 0, Math.PI * 2);
  ctx.fillStyle = grd;
  ctx.fill();
  ctx.restore();
}

// Compound sway: two overlapping sine waves for organic, non-repeating drift
function sway(t: number, speed: number, phase: number, amp: number) {
  return (
    Math.sin(t * speed         + phase)       * amp * 0.70 +
    Math.sin(t * speed * 2.37  + phase * 1.6) * amp * 0.30
  );
}

// Four columns. xBase: resting x as fraction of W.
const COLUMNS = [
  { x: 0.50, phase: 0.00, spd: 0.00016, swingW: 0.13, rWf: 0.60, alphaMul: 1.00 },
  { x: 0.28, phase: 2.09, spd: 0.00012, swingW: 0.11, rWf: 0.50, alphaMul: 0.85 },
  { x: 0.74, phase: 4.19, spd: 0.00019, swingW: 0.10, rWf: 0.46, alphaMul: 0.82 },
  { x: 0.50, phase: 1.05, spd: 0.00009, swingW: 0.16, rWf: 0.38, alphaMul: 0.70 },
];

let _energy = 0;
let _eHigh  = 0;

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
      const lvl = analyser ? getAudioLevels(analyser) : { bass: 0, mid: 0, high: 0 };

      const rawE = lvl.bass * 0.60 + lvl.mid * 0.40;
      _energy += (rawE - _energy) * (rawE > _energy ? 0.16 : 0.035);
      _eHigh  += (lvl.high - _eHigh) * (lvl.high > _eHigh ? 0.20 : 0.05);
      const e  = _energy;

      // Ember anchor — bottom centre, slight ambient drift
      const emberX = W * (0.50 + Math.sin(t * 0.00022) * 0.018);
      const emberY = H * 0.99;

      // ── 1. Wide background haze — fills the whole screen faintly ─────────
      // rH is set to H so it physically covers floor-to-ceiling
      const hazeAlpha = 0.12 + e * 0.14;
      const hazeH     = 24 + lvl.bass * 4;
      drawEllipseGlow(ctx, W * 0.5, emberY, W * 0.70, H * 1.05, [
        [0,    `hsla(${hazeH},82%,16%,${hazeAlpha.toFixed(3)})`],
        [0.3,  `hsla(${hazeH},78%,10%,${(hazeAlpha * 0.7).toFixed(3)})`],
        [0.65, `hsla(${hazeH},74%,5%,${(hazeAlpha * 0.30).toFixed(3)})`],
        [0.88, `hsla(${hazeH},70%,3%,${(hazeAlpha * 0.07).toFixed(3)})`],
        [1,    `hsla(${hazeH},68%,2%,0)`],
      ]);

      // ── 2. Smoke columns — tall ellipses that fill the screen ────────────
      COLUMNS.forEach((col) => {
        const cx = (col.x + sway(t, col.spd, col.phase, col.swingW)) * W;

        // rH slightly larger than H so gradient top sits above screen edge
        const rW = col.rWf * W;
        const rH = H * (1.08 + e * 0.35);   // taller with audio → top edge shifts upward

        // Alpha and lightness: visible when silent, warm+bright when speaking
        const alpha = col.alphaMul * (0.20 + e * 0.38);
        const lBase = 13  + e * 30;
        const hue   = 23  + Math.sin(t * 0.00008 + col.phase) * 5 + lvl.bass * 5;

        drawEllipseGlow(ctx, cx, emberY, rW, rH, [
          [0,    `hsla(${hue},92%,${lBase}%,${alpha.toFixed(3)})`],
          [0.18, `hsla(${hue},88%,${lBase * 0.80}%,${(alpha * 0.88).toFixed(3)})`],
          [0.42, `hsla(${hue},84%,${lBase * 0.55}%,${(alpha * 0.58).toFixed(3)})`],  // ← mid-screen
          [0.68, `hsla(${hue},78%,${lBase * 0.28}%,${(alpha * 0.24).toFixed(3)})`],  // ← upper screen
          [0.85, `hsla(${hue},72%,${lBase * 0.10}%,${(alpha * 0.07).toFixed(3)})`],
          [1,    `hsla(${hue},68%,2%,0)`],
        ]);
      });

      // ── 3. Core ember — concentrated hot glow at the source ──────────────
      const coreRW = W * (0.36 + e * 0.20);
      const coreRH = coreRW * (1.6 + e * 0.9);   // slightly elliptical rising tongue
      const coreL  = 8 + e * 56;
      const coreH  = 27 + lvl.bass * 6;

      drawEllipseGlow(ctx, emberX, emberY, coreRW, coreRH, [
        [0,    `hsla(${coreH},98%,${coreL}%,0.95)`],
        [0.20, `hsla(${coreH},96%,${coreL * 0.55}%,0.60)`],
        [0.45, `hsla(${coreH},90%,${coreL * 0.22}%,0.22)`],
        [0.72, `hsla(${coreH},84%,${coreL * 0.08}%,0.06)`],
        [1,    `hsla(${coreH},78%,3%,0)`],
      ]);

      // ── 4. High-freq spark flicker ────────────────────────────────────────
      if (_eHigh > 0.05) {
        const sparks = e * _eHigh;
        const sx = emberX + Math.sin(t * 0.0048 + lvl.mid * 5) * 0.09 * W;
        const sy = emberY - (0.08 + Math.abs(Math.cos(t * 0.006)) * 0.15 + e * 0.22) * H;
        const sl = Math.min(50 + sparks * 40, 86);
        drawEllipseGlow(ctx, sx, sy, W * 0.09 * sparks, W * 0.09 * sparks * 2.5, [
          [0, `hsla(32,100%,${sl}%,${(sparks * 0.88).toFixed(3)})`],
          [1, `hsla(28,100%,26%,0)`],
        ]);
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
