import { useEffect, useRef } from "react";
import { getAnalyser } from "../services/elevenlabs";

// ── Full-screen deep crimson atmosphere ───────────────────────────────────────
// Three large overlapping light sources sweep the whole screen on slow
// Lissajous paths. Radius > 1× W so each source bleeds completely off all
// four edges — result is a rich red wash with no visible orb shape, just
// shifting atmosphere. Audio energy brightens and saturates the red.

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

// Three large orbiters — rf > 1.0 so the glow source fills past every edge.
// ampX/ampY > 0.5 pushes the centre off-screen so the hot core is never
// visible as a round blob in the middle of the display.
const ORBITERS = [
  { phase: 0.00,  sX: 0.00013, sY: 0.00010, ampX: 0.55, ampY: 0.52, rf: 1.10, mul: 1.00, hue: 2 },
  { phase: 2.094, sX: 0.00009, sY: 0.00017, ampX: 0.50, ampY: 0.48, rf: 0.95, mul: 0.88, hue: 358 },
  { phase: 4.189, sX: 0.00019, sY: 0.00013, ampX: 0.46, ampY: 0.54, rf: 0.82, mul: 0.76, hue: 5 },
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

      // Near-black with a hair of red so even silent moments aren't dead black
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#0b0000";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      const analyser = getAnalyser();
      const lvl = analyser ? getAudioLevels(analyser) : { bass: 0, mid: 0, high: 0 };

      _energy += ((lvl.bass * 0.55 + lvl.mid * 0.45) - _energy) * (_energy < lvl.bass ? 0.06 : 0.020);
      _eHigh  += (lvl.high - _eHigh) * (lvl.high > _eHigh ? 0.08 : 0.030);
      const e = _energy;

      // ── 1. Large screen-filling ambient haze ─────────────────────────────
      // Always present — ensures the whole display reads red even in silence.
      const hazeA = 0.18 + e * 0.12;
      const hazeX = W * (0.5 + Math.sin(t * 0.000055) * 0.14);
      const hazeY = H * (0.42 + Math.cos(t * 0.000042) * 0.18);
      drawRadialGlow(ctx, hazeX, hazeY, W * 1.05, [
        [0,    `hsla(3,84%,18%,${hazeA.toFixed(3)})`],
        [0.38, `hsla(3,80%,9%,${(hazeA * 0.52).toFixed(3)})`],
        [0.70, `hsla(3,74%,4%,${(hazeA * 0.18).toFixed(3)})`],
        [1,    `hsla(3,68%,1%,0)`],
      ]);

      // ── 2. Counter-haze from bottom-right corner — adds depth variation ──
      const hazeB = 0.12 + e * 0.08;
      drawRadialGlow(ctx, W * 0.88, H * 0.88, W * 0.92, [
        [0,    `hsla(0,90%,14%,${hazeB.toFixed(3)})`],
        [0.50, `hsla(0,84%,6%,${(hazeB * 0.40).toFixed(3)})`],
        [1,    `hsla(0,78%,1%,0)`],
      ]);

      // ── 3. Three large orbiting sources ──────────────────────────────────
      ORBITERS.forEach((orb) => {
        const ox = W * (0.5 + Math.sin(t * orb.sX + orb.phase) * orb.ampX);
        const oy = H * (0.5 + Math.cos(t * orb.sY + orb.phase + 0.7) * orb.ampY);

        const r     = W * (orb.rf + e * 0.18);
        const alpha = orb.mul * (0.22 + e * 0.30);
        const lBase = 12 + e * 24;
        const hue   = orb.hue + lvl.bass * 4;

        drawRadialGlow(ctx, ox, oy, r, [
          [0,    `hsla(${hue},92%,${lBase}%,${alpha.toFixed(3)})`],
          [0.22, `hsla(${hue},88%,${(lBase * 0.68).toFixed(1)}%,${(alpha * 0.78).toFixed(3)})`],
          [0.48, `hsla(${hue},82%,${(lBase * 0.34).toFixed(1)}%,${(alpha * 0.42).toFixed(3)})`],
          [0.72, `hsla(${hue},76%,${(lBase * 0.12).toFixed(1)}%,${(alpha * 0.14).toFixed(3)})`],
          [0.88, `hsla(${hue},70%,${(lBase * 0.04).toFixed(1)}%,${(alpha * 0.04).toFixed(3)})`],
          [1,    `hsla(${hue},64%,1%,0)`],
        ]);
      });

      // ── 4. Audio-reactive pulse — red, not orange ─────────────────────────
      if (e > 0.03 || _eHigh > 0.02) {
        const orb = ORBITERS[0];
        const hx = W * (0.5 + Math.sin(t * orb.sX + orb.phase) * orb.ampX);
        const hy = H * (0.5 + Math.cos(t * orb.sY + orb.phase + 0.7) * orb.ampY);
        const hr = W * (0.32 + e * 0.20 + _eHigh * 0.10);
        const hl = 10 + e * 40 + _eHigh * 18;

        drawRadialGlow(ctx, hx, hy, hr, [
          [0,    `hsla(4,100%,${hl.toFixed(1)}%,${(0.78 + e * 0.22).toFixed(3)})`],
          [0.38, `hsla(2,96%,${(hl * 0.38).toFixed(1)}%,${(0.38 + e * 0.18).toFixed(3)})`],
          [1,    `hsla(0,88%,3%,0)`],
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
