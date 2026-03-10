/**
 * AutoGallery — CSS 3D perspective tunnel with staggered spawn-in.
 *
 * Supports two kinds of planes:
 *   • Image planes  — photo cards that fly, wrap, and cycle src
 *   • Tile planes   — custom HTML cards (guest / time / date / ingredient tags)
 *                     that fly in the same 3-D space at the same speed
 *
 * Pass images=[] for a pure "void + tiles only" mode — the RAF loop runs
 * only the tile planes over the black void (used by cocktail-build steps).
 *
 * All animation is driven by requestAnimationFrame with direct DOM mutation —
 * zero React re-renders during flight, no Three.js required.
 */

import { useRef, useEffect } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const PERSPECTIVE        = 1100;   // px — focal length
const Z_FAR              = -1600;  // back of tunnel
const Z_NEAR             = 660;    // front (wrap point)
const Z_RANGE            = Z_NEAR - Z_FAR;

const SPAWN_INTERVAL_MS  = 340;    // ms between successive image spawns
const SPAWN_ANIM_MS      = 750;    // ms for the pop-in animation

// easeOutBack — slight overshoot then settle
function easeOutBack(t: number): number {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// ─── Image layout ─────────────────────────────────────────────────────────────

const IMG_POSITIONS = [
  { x: -200, y: -140, rotZ: -4.5, w: 260, h: 180 },
  { x:  200, y: -190, rotZ:  3.2, w: 190, h: 240 },
  { x: -240, y:  160, rotZ: -6.1, w: 170, h: 170 },
  { x:  230, y:  130, rotZ:  4.8, w: 280, h: 190 },
  { x:   30, y: -240, rotZ: -2.3, w: 220, h: 155 },
  { x:  -40, y:  200, rotZ:  5.5, w: 200, h: 260 },
];

// ─── Tile slot type (exported so PartyPlannerScreen can use it) ───────────────

export interface TileSlot {
  id:       string;
  x:        number;
  y:        number;
  rotZ:     number;
  w:        number;
  h:        number;
  radius?:  number;   // optional card corner radius (default 5.64)
  children: React.ReactNode;
}

// ─── Plane state ──────────────────────────────────────────────────────────────

interface PlaneState {
  z:         number;
  imgIdx:    number;
  spawnedAt: number | null;
}

interface TilePlaneState {
  z:         number;
  spawnedAt: number | null;
}

function makePlanes(count: number, imgLen: number): PlaneState[] {
  return Array.from({ length: count }, (_, i) => ({
    z:         Z_FAR + (Z_RANGE / Math.max(count, 1)) * i,
    imgIdx:    i % Math.max(imgLen, 1),
    spawnedAt: null,
  }));
}

// ─── Component ────────────────────────────────────────────────────────────────

interface AutoGalleryProps {
  images?:       string[];   // optional — pass [] for tiles-only void mode
  speed?:        number;
  visibleCount?: number;
  tileSlots?:    TileSlot[];
  style?:        React.CSSProperties;
}

export function AutoGallery({
  images       = [],
  speed        = 1.8,
  visibleCount = 16,
  tileSlots    = [],
  style,
}: AutoGalleryProps) {
  const COUNT = images.length > 0 ? Math.min(visibleCount, images.length * 4) : 0;

  // ── Image plane refs ──
  const layout      = useRef(IMG_POSITIONS.slice(0, COUNT));
  const wrapRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs     = useRef<(HTMLImageElement | null)[]>([]);
  const planes      = useRef<PlaneState[]>(makePlanes(COUNT, images.length));

  // ── Tile plane refs ──
  const tileWrapRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const tilePlanes    = useRef<Map<string, TilePlaneState>>(new Map());
  // Always-current ref so the RAF closure never goes stale
  const tileSlotsRef  = useRef<TileSlot[]>(tileSlots);
  tileSlotsRef.current = tileSlots;

  if (planes.current.length !== COUNT) {
    planes.current = makePlanes(COUNT, images.length);
    layout.current = IMG_POSITIONS.slice(0, COUNT);
  }

  // ─── RAF loop ─────────────────────────────────────────────────────────────

  useEffect(() => {
    // Run if we have images OR tile slots — pure tile mode supported
    if (COUNT === 0 && tileSlots.length === 0) return;

    if (COUNT > 0) {
      layout.current = IMG_POSITIONS.slice(0, COUNT);
      planes.current = makePlanes(COUNT, images.length);
    }

    let raf: number;
    let last        = performance.now();
    const startTime = performance.now();

    const tick = (now: number) => {
      const delta   = Math.min((now - last) / 16.667, 3);
      const elapsed = now - startTime;
      last = now;

      // ── IMAGE PLANES ──────────────────────────────────────────────────────
      if (COUNT > 0) {
        planes.current.forEach((plane, i) => {
          const wrap = wrapRefs.current[i];
          if (!wrap) return;

          // Dormant until staggered spawn time
          if (elapsed < i * SPAWN_INTERVAL_MS) {
            wrap.style.opacity = "0";
            return;
          }
          if (plane.spawnedAt === null) plane.spawnedAt = now;

          plane.z += speed * delta;
          if (plane.z > Z_NEAR) {
            plane.z -= Z_RANGE;
            const next   = (plane.imgIdx + COUNT) % images.length;
            plane.imgIdx = next;
            const imgEl  = imgRefs.current[i];
            if (imgEl) imgEl.src = images[next];
          }

          const spawnT     = Math.min((now - plane.spawnedAt) / SPAWN_ANIM_MS, 1);
          const spawnScale = easeOutBack(spawnT);
          const spawnFade  = Math.min(spawnT / 0.35, 1);

          const np = (plane.z - Z_FAR) / Z_RANGE;
          let depthOpacity = 1;
          if (np < 0.08) depthOpacity = np / 0.08;
          depthOpacity = Math.max(0, Math.min(1, depthOpacity));

          const opacity = spawnFade * depthOpacity;

          let blur = 0;
          if (np < 0.12) blur = 4 * (1 - np / 0.12);

          const sp = layout.current[i] ?? { x: 0, y: 0, rotZ: 0 };
          wrap.style.transform =
            `translateX(${sp.x}px) translateY(${sp.y}px)` +
            ` translateZ(${plane.z.toFixed(1)}px)` +
            ` rotateZ(${sp.rotZ}deg)` +
            ` scale(${spawnScale.toFixed(4)})`;
          wrap.style.opacity = opacity.toFixed(4);
          wrap.style.filter  = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "";
        });
      }

      // ── TILE PLANES ───────────────────────────────────────────────────────
      tileSlotsRef.current.forEach((slot, i) => {
        const wrap = tileWrapRefs.current[i];
        if (!wrap) return;

        // Initialise fresh plane state for each unique tile id
        if (!tilePlanes.current.has(slot.id)) {
          // Stagger tile spawns slightly after images
          tilePlanes.current.set(slot.id, {
            z:         Z_FAR + (Z_RANGE * 0.18 * i), // stagger start depths
            spawnedAt: null,
          });
        }

        const plane = tilePlanes.current.get(slot.id)!;

        if (plane.spawnedAt === null) plane.spawnedAt = now;

        // Fly at the same speed as photos
        plane.z += speed * delta;
        if (plane.z > Z_NEAR) plane.z -= Z_RANGE;

        // Spawn pop-in
        const spawnT     = Math.min((now - plane.spawnedAt) / SPAWN_ANIM_MS, 1);
        const spawnScale = easeOutBack(spawnT);
        const spawnFade  = Math.min(spawnT / 0.35, 1);

        // Depth opacity — same rules as images (no near fade)
        const np = (plane.z - Z_FAR) / Z_RANGE;
        let depthOpacity = 1;
        if (np < 0.08) depthOpacity = np / 0.08;
        depthOpacity = Math.max(0, Math.min(1, depthOpacity));

        const opacity = spawnFade * depthOpacity;

        wrap.style.transform =
          `translateX(${slot.x}px) translateY(${slot.y}px)` +
          ` translateZ(${plane.z.toFixed(1)}px)` +
          ` rotateZ(${slot.rotZ}deg)` +
          ` scale(${spawnScale.toFixed(4)})`;
        wrap.style.opacity = opacity.toFixed(4);
        wrap.style.filter  = "";  // tiles always sharp
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [images, speed, COUNT]); // tiles accessed via ref — no restart needed

  // Render nothing if there are truly no planes at all
  if (COUNT === 0 && tileSlots.length === 0) return null;

  return (
    <div
      style={{
        position:          "absolute",
        inset:             0,
        perspective:       `${PERSPECTIVE}px`,
        perspectiveOrigin: "50% 46%",
        transformStyle:    "preserve-3d",
        overflow:          "hidden",
        ...style,
      }}
    >
      {/* Central 3-D anchor — images and tiles share this coordinate space */}
      <div
        style={{
          position:       "absolute",
          left:           "50%",
          top:            "48%",
          transformStyle: "preserve-3d",
        }}
      >
        {/* ── Image planes ── */}
        {COUNT > 0 && Array.from({ length: COUNT }, (_, i) => {
          const p  = planes.current[i];
          const sp = layout.current[i] ?? { x: 0, y: 0, rotZ: 0, w: 240, h: 170 };
          if (!p) return null;
          return (
            <div
              key={i}
              ref={(el) => { wrapRefs.current[i] = el; }}
              style={{
                position:           "absolute",
                width:              sp.w,
                height:             sp.h,
                marginLeft:         -sp.w / 2,
                marginTop:          -sp.h / 2,
                overflow:           "hidden",
                borderRadius:       14,
                willChange:         "transform, opacity, filter",
                backfaceVisibility: "hidden",
                opacity:            "0",
                transform:
                  `translateX(${sp.x}px) translateY(${sp.y}px)` +
                  ` translateZ(${p.z.toFixed(1)}px)` +
                  ` rotateZ(${sp.rotZ}deg) scale(0)`,
              }}
            >
              <img
                ref={(el) => { imgRefs.current[i] = el; }}
                src={images[p.imgIdx]}
                alt=""
                style={{
                  width:         "100%",
                  height:        "100%",
                  objectFit:     "cover",
                  display:       "block",
                  pointerEvents: "none",
                  userSelect:    "none",
                }}
                draggable={false}
              />
            </div>
          );
        })}

        {/* ── Tile planes — same 3-D anchor, same RAF animation ── */}
        {tileSlots.map((slot, i) => (
          <div
            key={slot.id}
            ref={(el) => { tileWrapRefs.current[i] = el; }}
            style={{
              position:           "absolute",
              width:              slot.w,
              height:             slot.h,
              marginLeft:         -slot.w / 2,
              marginTop:          -slot.h / 2,
              borderRadius:       slot.radius ?? 5.64,
              overflow:           "hidden",
              willChange:         "transform, opacity",
              backfaceVisibility: "hidden",
              opacity:            "0",
              transform:
                `translateX(${slot.x}px) translateY(${slot.y}px)` +
                ` translateZ(${Z_FAR}px)` +
                ` rotateZ(${slot.rotZ}deg) scale(0)`,
            }}
          >
            {slot.children}
          </div>
        ))}
      </div>
    </div>
  );
}
