import { useEffect, useRef } from "react";
import { getAnalyser } from "../services/elevenlabs";

// ── Full-screen smoky ember  ──────────────────────────────────────────────────
// Single heat source at the bottom. Tall elliptical smoke columns fill the
// screen. The canvas is portrait (410×882), so columns are scaled ~4× taller
// than wide so they reach from floor to ceiling.

function getAudioLevels(analyser: AnalyserNode) {
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  const avg = (a: number, b: number) => {
    let s = 0; for (let i = a; i < b; i++) s += data[i]; return s / ((b - a) * 255);
  };
  return { bass: avg(0, 6), mid: avg(6, 24), high: avg(24, 48) };
}

// Draw a radial gradient stretched into a tall ellipse via ctx.scale.
// cx/cy: canvas position of ellipse centre
// rW:    horizontal radius (pixels)
// yScale: vertical stretch factor (rH = rW * yScale)
function drawEllipseGlow(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  rW: number, yScale: number,
  stops: [number, string][],
) {
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

// Three smoke columns. xBase: fraction of W. Independent sway phases.
const COLUMNS = [
  { xBase: 0.50, phase: 0.00, swaySpeed: 0.00018, swayAmp: 0.08 },
  { xBase: 0.30, phase: 2.09, swaySpeed: 0.00014, swayAmp: 0.06 },
  { xBase: 0.72, phase: 4.19, swaySpeed: 0.00022, swayAmp: 0.07 },
];

let _smoothEnergy = 0;
let _smoothHigh   = 0;

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

      // Smooth energy: fast attack, slow decay
      const rawE = lvl.bass * 0.60 + lvl.mid * 0.40;
      _smoothEnergy += (rawE - _smoothEnergy) * (rawE > _smoothEnergy ? 0.16 : 0.035);
      _smoothHigh   += (lvl.high - _smoothHigh) * (lvl.high > _smoothHigh ? 0.20 : 0.05);
      const e  = _smoothEnergy;
      const eh = _smoothHigh;

      // Base column dimensions
      const rW      = W * 0.52;                         // horizontal radius
      const yScaleBase = 3.6 + e * 2.2;                 // taller when speaking
      const rootY   = H * 0.98;                         // anchor just below bottom edge

      // ── 1. Wide background haze (always present, very faint) ─────────────
      const hazeAlpha = 0.055 + e * 0.10;
      drawEllipseGlow(ctx, W * 0.5, rootY, W * 0.75, yScaleBase * 0.85, [
        [0,   `hsla(24,80%,12%,${hazeAlpha.toFixed(3)})`],
        [0.5, `hsla(22,75%,6%,${(hazeAlpha * 0.4).toFixed(3)})`],
        [1,   `hsla(20,70%,3%,0)`],
      ]);

      // ── 2. Three smoke columns ────────────────────────────────────────────
      COLUMNS.forEach((col, i) => {
        const sway   = Math.sin(t * col.swaySpeed + col.phase) * col.swayAmp * W;
        const cx     = col.xBase * W + sway;
        // Columns thin and brighten with energy
        const colRW  = rW * (0.7 + i * 0.06 - i * i * 0.02);
        const yScale = yScaleBase * (1 + i * 0.08);

        // Silent: just barely visible; speaking: warm amber smoke
        const baseL  = 8  + e * 22;
        const alpha  = 0.10 + e * 0.28;

        const hue = 23 + Math.sin(t * 0.00007 + col.phase) * 4 + lvl.bass * 6;

        drawEllipseGlow(ctx, cx, rootY, colRW, yScale, [
          [0,    `hsla(${hue},90%,${baseL}%,${alpha.toFixed(3)})`],
          [0.25, `hsla(${hue},86%,${baseL * 0.7}%,${(alpha * 0.65).toFixed(3)})`],
          [0.55, `hsla(${hue},80%,${baseL * 0.35}%,${(alpha * 0.28).toFixed(3)})`],
          [0.8,  `hsla(${hue},74%,${baseL * 0.12}%,${(alpha * 0.07).toFixed(3)})`],
          [1,    `hsla(${hue},70%,3%,0)`],
        ]);
      });

      // ── 3. Core ember — bright concentrated glow at the source ───────────
      const coreX  = W * (0.50 + Math.sin(t * 0.00025) * 0.025);
      const coreY  = rootY - H * 0.02;
      const coreRW = W * (0.38 + e * 0.22);
      const coreL  = 7 + e * 55;
      const coreH  = 27 + lvl.bass * 6;

      drawEllipseGlow(ctx, coreX, coreY, coreRW, 1.4 + e * 0.8, [
        [0,    `hsla(${coreH},98%,${coreL}%,0.95)`],
        [0.22, `hsla(${coreH},95%,${coreL * 0.55}%,0.60)`],
        [0.5,  `hsla(${coreH},90%,${coreL * 0.22}%,0.22)`],
        [0.75, `hsla(${coreH},84%,${coreL * 0.08}%,0.06)`],
        [1,    `hsla(${coreH},78%,3%,0)`],
      ]);

      // ── 4. High-freq flicker — sparks that rise with consonants ──────────
      if (eh > 0.05) {
        const sparks = e * eh;
        const sx = coreX + Math.sin(t * 0.005 + lvl.mid * 5) * 0.10 * W;
        const sy = coreY - (0.10 + Math.abs(Math.cos(t * 0.006)) * 0.18 + e * 0.20) * H;
        const sr = W * 0.10 * sparks;
        const sl = Math.min(48 + sparks * 38, 85);
        drawEllipseGlow(ctx, sx, sy, sr, 2.0, [
          [0, `hsla(30,100%,${sl}%,${(sparks * 0.9).toFixed(3)})`],
          [1, `hsla(28,100%,28%,0)`],
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
