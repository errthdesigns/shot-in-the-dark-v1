import { useEffect, useRef } from "react";
import { getAnalyser } from "../services/elevenlabs";

// ── Single-source smoky ember gradient ───────────────────────────────────────
// One ember anchored at the bottom centre. Multiple low-opacity smoke wisps
// drift upward from the same source. Glows and rises when voice is active.

function getAudioLevels(analyser: AnalyserNode) {
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  const avg = (a: number, b: number) => {
    let s = 0; for (let i = a; i < b; i++) s += data[i]; return s / ((b - a) * 255);
  };
  return { bass: avg(0, 6), mid: avg(6, 24), high: avg(24, 48) };
}

// Smoke wisps — all relative to the single ember source.
// dx/dy: normalised offset from ember centre (at rest)
// rBase: base radius as fraction of min(W,H)
// phase: oscillation phase offset
// driftX/driftY: oscillation speed multipliers
const WISPS = [
  { dx:  0.00, dy: -0.05, rBase: 0.90, alpha: 0.11, phase: 0.00, driftX: 1.0, driftY: 0.7 },
  { dx: -0.06, dy: -0.10, rBase: 0.70, alpha: 0.09, phase: 1.57, driftX: 0.7, driftY: 1.1 },
  { dx:  0.07, dy: -0.08, rBase: 0.65, alpha: 0.08, phase: 3.14, driftX: 1.3, driftY: 0.8 },
  { dx: -0.03, dy: -0.16, rBase: 0.55, alpha: 0.07, phase: 2.10, driftX: 0.9, driftY: 1.4 },
  { dx:  0.04, dy: -0.19, rBase: 0.45, alpha: 0.06, phase: 0.80, driftX: 1.1, driftY: 0.6 },
];

// Smooth energy tracker — avoids jerky jumps by lerping toward target
let _smoothEnergy = 0;

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

      // Black background
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = "lighter";

      // Audio energy
      const analyser = getAnalyser();
      const lvl = analyser
        ? getAudioLevels(analyser)
        : { bass: 0, mid: 0, high: 0 };

      const rawEnergy = lvl.bass * 0.65 + lvl.mid * 0.35;
      // Lerp smoothly: fast attack (0.18), slow decay (0.04)
      _smoothEnergy += (rawEnergy - _smoothEnergy) * (rawEnergy > _smoothEnergy ? 0.18 : 0.04);
      const e = _smoothEnergy;

      // Single ember source — anchored bottom-centre with subtle ambient sway
      const ambientX = Math.sin(t * 0.00028) * 0.022;
      const ambientY = Math.cos(t * 0.00019) * 0.008;
      const emberX = (0.52 + ambientX) * W;
      const emberY = (0.94 + ambientY - e * 0.06) * H;

      // ── Smoke wisps (drawn first, behind core) ────────────────────────────
      WISPS.forEach((w) => {
        const sway = Math.sin(t * 0.00021 * w.driftX + w.phase) * 0.035;
        const rise = Math.cos(t * 0.00017 * w.driftY + w.phase) * 0.012;

        const wx = emberX + (w.dx + sway) * W;
        const wy = emberY + (w.dy - e * 0.22 + rise) * H;

        // Wisps grow and brighten subtly with audio
        const r = w.rBase * Math.min(W, H) * (1 + e * 0.55);
        const baseAlpha = w.alpha * (0.4 + e * 1.6);  // near-invisible when silent

        const hue = 24 + Math.sin(t * 0.00009 + w.phase) * 4; // gentle hue flicker

        const grd = ctx.createRadialGradient(wx, wy, 0, wx, wy, r);
        grd.addColorStop(0,    `hsla(${hue},88%,14%,${(baseAlpha * 0.9).toFixed(3)})`);
        grd.addColorStop(0.35, `hsla(${hue},85%,9%,${(baseAlpha * 0.5).toFixed(3)})`);
        grd.addColorStop(0.7,  `hsla(${hue},80%,5%,${(baseAlpha * 0.18).toFixed(3)})`);
        grd.addColorStop(1,    `hsla(${hue},75%,3%,0)`);

        ctx.beginPath();
        ctx.arc(wx, wy, r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

      // ── Core ember — single hot glow ──────────────────────────────────────
      const coreR = 0.38 * Math.min(W, H) * (1 + e * 0.9);
      // Lightness: dim ember (~7%) when silent → bright amber (~60%) when speaking
      const coreL  = 7 + e * 53;
      const coreH  = 26 + lvl.bass * 5;

      const core = ctx.createRadialGradient(emberX, emberY, 0, emberX, emberY, coreR);
      core.addColorStop(0,    `hsla(${coreH},96%,${coreL}%,0.92)`);
      core.addColorStop(0.28, `hsla(${coreH},93%,${coreL * 0.55}%,0.55)`);
      core.addColorStop(0.6,  `hsla(${coreH},88%,${coreL * 0.25}%,0.20)`);
      core.addColorStop(1,    `hsla(${coreH},80%,${coreL * 0.1}%,0)`);

      ctx.beginPath();
      ctx.arc(emberX, emberY, coreR, 0, Math.PI * 2);
      ctx.fillStyle = core;
      ctx.fill();

      // ── High-freq spark — tiny bright flicker when voice has consonants ───
      if (lvl.high > 0.06) {
        const sparks = e * lvl.high;
        const sx = emberX + Math.sin(t * 0.005 + lvl.mid * 4) * 0.06 * W;
        const sy = emberY - Math.abs(Math.cos(t * 0.006 + lvl.bass * 3)) * 0.12 * H;
        const sr = 0.08 * Math.min(W, H) * sparks;
        const sl = Math.min(50 + sparks * 35, 82);
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
        sg.addColorStop(0, `hsla(30,100%,${sl}%,${(sparks * 0.85).toFixed(3)})`);
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
