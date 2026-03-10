import { useEffect, useRef } from "react";
import { getAnalyser } from "../services/elevenlabs";

// ── Full-screen drifting ember glow ──────────────────────────────────────────
// Glow source wanders across the screen. Wide, slow columns sweep horizontally
// so it feels like heat rolling through a room rather than a candle flame.

function getAudioLevels(analyser: AnalyserNode) {
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  const avg = (a: number, b: number) => {
    let s = 0; for (let i = a; i < b; i++) s += data[i]; return s / ((b - a) * 255);
  };
  return { bass: avg(0, 6), mid: avg(6, 24), high: avg(24, 48) };
}

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
    Math.sin(t * speed         + phase)       * amp * 0.65 +
    Math.sin(t * speed * 1.91  + phase * 1.4) * amp * 0.35
  );
}

// Columns spread wide across the screen with slow, sweeping movement
const COLUMNS = [
  { x: 0.50, phase: 0.00, spd: 0.00011, swingW: 0.42, rWf: 0.72, alphaMul: 1.00 },
  { x: 0.22, phase: 2.09, spd: 0.00008, swingW: 0.36, rWf: 0.58, alphaMul: 0.85 },
  { x: 0.78, phase: 4.19, spd: 0.00013, swingW: 0.33, rWf: 0.54, alphaMul: 0.82 },
  { x: 0.50, phase: 1.05, spd: 0.00006, swingW: 0.48, rWf: 0.44, alphaMul: 0.70 },
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

      // Slow, gentle energy smoothing — avoids the rapid candle-flicker feel
      const rawE = lvl.bass * 0.55 + lvl.mid * 0.45;
      _energy += (rawE - _energy) * (rawE > _energy ? 0.07 : 0.022);
      _eHigh  += (lvl.high - _eHigh) * (lvl.high > _eHigh ? 0.09 : 0.035);
      const e  = _energy;

      // Glow source wanders across the lower half of the screen
      const emberX = W * (0.50 + sway(t, 0.00015, 0, 0.22));
      const emberY = H * (0.90 + Math.sin(t * 0.00009) * 0.06);

      // ── 1. Wide background haze ───────────────────────────────────────────
      const hazeAlpha = 0.14 + e * 0.12;
      const hazeH     = 24 + lvl.bass * 4;
      drawEllipseGlow(ctx, W * (0.50 + sway(t, 0.00007, 1.1, 0.18)), H * 0.80, W * 0.85, H * 1.10, [
        [0,    `hsla(${hazeH},80%,18%,${hazeAlpha.toFixed(3)})`],
        [0.28, `hsla(${hazeH},76%,11%,${(hazeAlpha * 0.65).toFixed(3)})`],
        [0.60, `hsla(${hazeH},72%,5%,${(hazeAlpha * 0.28).toFixed(3)})`],
        [0.85, `hsla(${hazeH},68%,2%,${(hazeAlpha * 0.06).toFixed(3)})`],
        [1,    `hsla(${hazeH},66%,1%,0)`],
      ]);

      // ── 2. Smoke columns ──────────────────────────────────────────────────
      COLUMNS.forEach((col) => {
        const cx = (col.x + sway(t, col.spd, col.phase, col.swingW)) * W;
        const cy = emberY + H * (0.05 + Math.sin(t * col.spd * 3 + col.phase) * 0.04);

        const rW = col.rWf * W;
        // Gentle height modulation — not the dramatic upward surge of a flame
        const rH = H * (1.12 + e * 0.18);

        const alpha = col.alphaMul * (0.22 + e * 0.32);
        const lBase = 12 + e * 26;
        const hue   = 23 + Math.sin(t * 0.00007 + col.phase) * 6 + lvl.bass * 4;

        drawEllipseGlow(ctx, cx, cy, rW, rH, [
          [0,    `hsla(${hue},90%,${lBase}%,${alpha.toFixed(3)})`],
          [0.20, `hsla(${hue},86%,${lBase * 0.78}%,${(alpha * 0.85).toFixed(3)})`],
          [0.45, `hsla(${hue},82%,${lBase * 0.50}%,${(alpha * 0.55).toFixed(3)})`],
          [0.70, `hsla(${hue},76%,${lBase * 0.22}%,${(alpha * 0.20).toFixed(3)})`],
          [0.88, `hsla(${hue},70%,${lBase * 0.08}%,${(alpha * 0.06).toFixed(3)})`],
          [1,    `hsla(${hue},66%,1%,0)`],
        ]);
      });

      // ── 3. Core glow at the wandering source ─────────────────────────────
      const coreRW = W * (0.32 + e * 0.16);
      const coreRH = coreRW * (1.4 + e * 0.6);
      const coreL  = 8 + e * 48;
      const coreH  = 27 + lvl.bass * 5;

      drawEllipseGlow(ctx, emberX, emberY, coreRW, coreRH, [
        [0,    `hsla(${coreH},98%,${coreL}%,0.90)`],
        [0.22, `hsla(${coreH},94%,${coreL * 0.52}%,0.55)`],
        [0.48, `hsla(${coreH},88%,${coreL * 0.20}%,0.20)`],
        [0.75, `hsla(${coreH},82%,${coreL * 0.07}%,0.05)`],
        [1,    `hsla(${coreH},76%,2%,0)`],
      ]);

      // ── 4. Soft roaming accent — a second slower ember wandering the opposite side
      if (e > 0.04 || _eHigh > 0.03) {
        const ax = W * (0.50 - sway(t, 0.00013, 2.5, 0.28));
        const ay = H * (0.85 + Math.sin(t * 0.00012 + 1.8) * 0.08);
        const aR = W * (0.20 + e * 0.12);
        const aL = 6 + e * 22 + _eHigh * 18;
        drawEllipseGlow(ctx, ax, ay, aR, aR * 1.6, [
          [0, `hsla(28,96%,${aL}%,${(0.30 + e * 0.28).toFixed(3)})`],
          [1, `hsla(24,90%,4%,0)`],
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
