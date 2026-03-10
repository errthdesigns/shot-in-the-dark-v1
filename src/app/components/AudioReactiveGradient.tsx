import { useEffect, useRef } from "react";
import { getAnalyser } from "../services/elevenlabs";

// ── Swarming ember glow ───────────────────────────────────────────────────────
// Three light sources orbit the screen independently on slow elliptical paths.
// They sweep through all four corners so the warmth rolls around the whole
// screen rather than sitting at the bottom like a candle.

function getAudioLevels(analyser: AnalyserNode) {
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  const avg = (a: number, b: number) => {
    let s = 0; for (let i = a; i < b; i++) s += data[i]; return s / ((b - a) * 255);
  };
  return { bass: avg(0, 6), mid: avg(6, 24), high: avg(24, 48) };
}

function drawRadialGlow(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  r: number,
  stops: [number, string][],
) {
  if (r <= 0) return;
  ctx.save();
  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  stops.forEach(([p, c]) => grd.addColorStop(p, c));
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = grd;
  ctx.fill();
  ctx.restore();
}

// Three orbiters at different phases, speeds and ellipse sizes.
// ampX/ampY as fraction of W/H — values > 0.4 push centers beyond the screen
// centre so the glow source actually travels to the edges.
const ORBITERS = [
  { phase: 0.00,  sX: 0.00017, sY: 0.00011, ampX: 0.44, ampY: 0.41, rf: 0.72, mul: 1.00, hue: 24 },
  { phase: 2.094, sX: 0.00012, sY: 0.00019, ampX: 0.40, ampY: 0.38, rf: 0.58, mul: 0.82, hue: 20 },
  { phase: 4.189, sX: 0.00020, sY: 0.00014, ampX: 0.37, ampY: 0.44, rf: 0.50, mul: 0.70, hue: 28 },
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

      // Slow smoothing — no candle-flicker feeling
      const rawE = lvl.bass * 0.55 + lvl.mid * 0.45;
      _energy += (rawE - _energy) * (rawE > _energy ? 0.06 : 0.020);
      _eHigh  += (lvl.high - _eHigh) * (lvl.high > _eHigh ? 0.08 : 0.030);
      const e = _energy;

      // ── 1. Very faint whole-screen ambient haze ──────────────────────────
      // Keeps the background from ever going dead-black
      const hazeA = 0.09 + e * 0.08;
      const hazeX = W * (0.5 + Math.sin(t * 0.000065) * 0.12);
      const hazeY = H * (0.5 + Math.cos(t * 0.000048) * 0.14);
      drawRadialGlow(ctx, hazeX, hazeY, W * 0.95, [
        [0,    `hsla(22,75%,14%,${hazeA.toFixed(3)})`],
        [0.5,  `hsla(22,70%,7%,${(hazeA * 0.45).toFixed(3)})`],
        [1,    `hsla(22,65%,2%,0)`],
      ]);

      // ── 2. Three orbiting glow sources ───────────────────────────────────
      ORBITERS.forEach((orb) => {
        // Orbital position — sinusoidal on both axes at different rates
        // so the path is a Lissajous-like figure that covers the whole screen
        const ox = W * (0.5 + Math.sin(t * orb.sX + orb.phase) * orb.ampX);
        const oy = H * (0.5 + Math.cos(t * orb.sY + orb.phase + 0.7) * orb.ampY);

        const r     = W * (orb.rf + e * 0.22);
        const alpha = orb.mul * (0.28 + e * 0.36);
        const lBase = 11 + e * 28;
        const hue   = orb.hue + lvl.bass * 6;

        drawRadialGlow(ctx, ox, oy, r, [
          [0,    `hsla(${hue},90%,${lBase}%,${alpha.toFixed(3)})`],
          [0.22, `hsla(${hue},86%,${lBase * 0.72}%,${(alpha * 0.82).toFixed(3)})`],
          [0.48, `hsla(${hue},80%,${lBase * 0.42}%,${(alpha * 0.48).toFixed(3)})`],
          [0.72, `hsla(${hue},74%,${lBase * 0.16}%,${(alpha * 0.16).toFixed(3)})`],
          [0.90, `hsla(${hue},68%,${lBase * 0.05}%,${(alpha * 0.04).toFixed(3)})`],
          [1,    `hsla(${hue},62%,1%,0)`],
        ]);
      });

      // ── 3. Audio-reactive hot spot — follows the first orbiter ──────────
      if (e > 0.03 || _eHigh > 0.02) {
        const orb = ORBITERS[0];
        const hx = W * (0.5 + Math.sin(t * orb.sX + orb.phase) * orb.ampX);
        const hy = H * (0.5 + Math.cos(t * orb.sY + orb.phase + 0.7) * orb.ampY);
        const hr = W * (0.18 + e * 0.14 + _eHigh * 0.08);
        const hl = 14 + e * 52 + _eHigh * 22;

        drawRadialGlow(ctx, hx, hy, hr, [
          [0,   `hsla(30,100%,${hl}%,${(0.85 + e * 0.15).toFixed(3)})`],
          [0.4, `hsla(26,95%,${hl * 0.4}%,${(0.40 + e * 0.20).toFixed(3)})`],
          [1,   `hsla(22,88%,4%,0)`],
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
