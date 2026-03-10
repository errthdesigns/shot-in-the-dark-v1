import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { speakText, stopSpeech, unlockAudio } from "../services/elevenlabs";
import { AutoGallery, TileSlot } from "./AutoGallery";
import { IntroScreen } from "./IntroScreen";
import { AudioReactiveGradient } from "./AudioReactiveGradient";
import { RecipeCard } from "./RecipeCard";
import { CartScreen } from "./CartScreen";
import { ApplePaySheet } from "./ApplePaySheet";
import { BottleSelector } from "./BottleSelector";
import svgMicPaths from "../../imports/svg-p5gailxsrc";
import imgSafdgdbnf from "figma:asset/46012681f417991ceea5ca1a2a5fe36bc79180ea.png";
import imgNrhdfbg   from "figma:asset/8ce9e0c9b853ca02b728fcdc542a98bce9a0f680.png";
import imgHrsbgfdxVc from "figma:asset/77f7ee28f0d3c625dd310ec0030c47d3e9d0bd4e.png";
import img855       from "figma:asset/0338a0f67f0358213e455ae1fd0ede9ca42462d7.png";
import img833       from "figma:asset/50a297f0102d4387d64592178384a47ae35769dd.png";
import imgC9556     from "figma:asset/1306677af40992daac01cdeb9661463391dbbc96.png";
import img30        from "figma:asset/f64e15edc573482617d07e85b330691c46ed8f0e.png";
import { img29 }   from "../../imports/svg-yl670";

// ── Cocktail images ───────────────────────────────────────────────────────────
import imgDrinkA from "figma:asset/c2b4983fcd96dcdcd63c25dc4518a548a9f9cbf5.png"; // raspberry close-up (Figma Frame2147257325: imgTcfygvubhj)
import imgDrinkB from "figma:asset/bebb630f58426b309f126863bf068e9875b1c0c6.png"; // dark botanical   (Figma Frame2147257325: imgCfyvgubhnj)
import imgIngredientStrawberry from "figma:asset/eead9e8d8a3a03aca01d001c8dcc83fd7a742518.png"; // strawberry (Figma Frame2147257325: img091374...)
import imgDrinkC from "figma:asset/dd33400cb52f89d213f163c8a0a3d1dfb5392df3.png";
import imgDrinkD from "figma:asset/c17405f3818d2c7d63ef7a1b09b97a71b1b54b2e.png";
import imgDrinkE from "figma:asset/fdbf08631a64c7759f8f34e345f24dd602054d7d.png";
import imgDrinkF from "figma:asset/0a5a790cdb7a8244ab8ab4888beeffde31c348c8.png";
import imgDrinkG from "figma:asset/9a84fe4ce610df332fe3506757e6b14c9b78d673.png";
import imgDrinkH from "figma:asset/20c86c34546dbdb8928acf6ee66035cf56ce01c6.png";
import imgDrinkI from "figma:asset/cfa68884a3f8e09e7e4c165c86b42b8d9d23664a.png";
import imgDrinkJ from "figma:asset/33e25f39a0f2e453dfd6bfa208f332f644a2da71.png";
import imgDrinkK from "figma:asset/5b873ac3b3d33a7fc5b92bb7718e0bacd44d94b3.png";
import imgDrinkL from "figma:asset/5d7e916fcf23b5e34746902373fb092a3decd6e7.png";

// ── Final reveal: orange video frame ─────────────────────────────────────────
import imgVideoFrame from "figma:asset/a801057e54da16ed98c5ecb3d99195543f0ac4fe.png";
import videoCocktailReveal from "../../assets/Untitled (71).mp4";

// ── Gatsby theme images ───────────────────────────────────────────────────────
import imgGatsbyA from "figma:asset/33c1904697d60857f2793985dd45af0b65d00138.png";
import imgGatsbyB from "figma:asset/b700a4bda2ef0ceacaf56b1c8edc736bfaa95522.png";

const PARTY_IMAGES      = [imgSafdgdbnf, imgNrhdfbg, imgHrsbgfdxVc, img855, img833, imgC9556];
const DRINK_IMAGES_B    = [imgDrinkD, imgDrinkF, imgDrinkI, imgDrinkJ, imgDrinkK, imgDrinkL];
// The six Figma-matched spice/bitter images (screen 14/17)
const DRINK_IMAGES_SPICE = [imgDrinkH, imgDrinkE, imgDrinkB, imgDrinkF, imgDrinkC, imgDrinkG];
const GATSBY_COMBINED   = [...PARTY_IMAGES, imgDrinkK, imgDrinkI, imgDrinkJ, imgGatsbyA, imgGatsbyB];

// ── Cocktail build — keyword-triggered items for steps 15-17 ─────────────────
// cx,cy = EXPLICIT center-relative void positions (spread wide across phone)
// AutoGallery anchor: left:50%=201px, top:48%=420px of phone (402×874)
interface CocktailItem {
  id: string;
  keyword?: string;
  type: "img" | "orange-bitters" | "chilli" | "chocolate";
  src?: string;
  x: number; y: number; w: number; h: number;
  radius?: number;
  rotZ: number;
  cx: number; cy: number;  // explicit wide-spread void positions
}
const COCKTAIL_BUILD_ITEMS: CocktailItem[] = [
  { id: "orange",       type: "img",            src: imgDrinkB, x: 177, y: 261, w: 190, h: 170, radius:  9.131, rotZ: -3.5, cx:   90, cy: -140 },
  { id: "ob-label",     keyword: "bitter",      type: "orange-bitters",           x: 286, y: 287, w:  65, h:  78,            rotZ:  5.2, cx:  155, cy:  -60 },
  { id: "circle-dark",  keyword: "bitter",      type: "img",   src: imgDrinkC,    x: 212, y: 364, w: 165, h: 165, radius: 82,    rotZ: -6.0, cx:   80, cy:   30 },
  { id: "amber",        keyword: "unforgiving", type: "img",   src: imgDrinkE,    x:  92, y: 318, w: 155, h: 190, radius:  9.131, rotZ:  4.0, cx: -105, cy: -100 },
  { id: "oval",         keyword: "grudge",      type: "img",   src: imgDrinkF,    x:  27, y: 327, w: 110, h: 100, radius: 55,    rotZ: -8.0, cx: -145, cy:   10 },
  { id: "dark-spice",   keyword: "talking",     type: "img",   src: imgDrinkG,    x: 169, y: 458, w: 220, h: 140, radius:  9.131, rotZ:  3.5, cx:   65, cy:  150 },
  { id: "choc-label",   keyword: "talking",     type: "chocolate",                x:  99, y: 484, w: 165, h:  90,                  rotZ: -4.0, cx:  -50, cy:  130 },
  { id: "depth-drink",  keyword: "depth",       type: "img",   src: imgDrinkH,    x:  67, y: 449, w: 155, h: 240, radius:  9.131, rotZ:  6.0, cx: -105, cy:  155 },
  { id: "chilli-label", keyword: "spice",       type: "chilli",                   x:   9, y: 514, w:  80, h:  50,                  rotZ: -5.5, cx: -150, cy:  110 },
];

// ── Keyword-triggered ingredient images (step 13) ─────────────────────────────
interface IngredientDef {
  keyword: string;
  src: string;
  x: number; y: number; w: number; h: number;
  radius: number;
  rotZ: number;
  cx: number; cy: number;  // explicit wide-spread void positions
}
const INGREDIENT_DEFS: IngredientDef[] = [
  { keyword: "orange",     src: imgDrinkB,               x: 210, y: 339, w: 127, h: 121, radius:  9.131, rotZ: -4.0, cx:  110, cy: -130 },
  { keyword: "strawberry", src: imgIngredientStrawberry, x: 151, y: 456, w: 178, h: 115, radius: 20,     rotZ:  5.0, cx:  -65, cy:  145  },
  { keyword: "raspberry",  src: imgDrinkA,               x:  51, y: 295, w: 127, h: 161, radius: 20,     rotZ: -6.5, cx: -150, cy:  -70  },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase     = "thinking" | "ai_typing" | "ready" | "recording" | "transcribing";
type ImgState  = "none" | "full" | "keyword-reveal" | "gatsby-reveal" | "drink-spice" | "cocktail-build" | "cocktail-video";
type ViewState = "chat" | "bottle-select" | "invite" | "email" | "cocktail" | "recipe" | "cart" | "apple-pay";

interface Step {
  aiText: string; aiY: number; fontVariant?: "semibold-italic";
  userText: string; imgState: ImgState; imgSet?: "party" | "drink-b";
  guestCount: number | null; showTimeTile: boolean; showDateTile: boolean;
  view: ViewState; autoAdvance?: boolean; autoAdvanceDelay?: number;
  /** Advance only after BOTH text streaming AND ElevenLabs voice have finished */
  speechAdvance?: boolean;
  noVoice?: boolean;
}

// ─── Conversation script ──────────────────────────────────────────────────────
const STEPS: Step[] = [
  // 0 — guest question
  { aiText: `How many guests are we expecting?\n\nAnd don't say "a few." I like specifics.`, aiY: 85, userText: "ok, 6 people", imgState: "none", guestCount: null, showTimeTile: false, showDateTile: false, view: "chat" },
  // 1 — date/time question
  { aiText: "Good. And what night are we talking?", aiY: 85, userText: "7pm on the 26th feb", imgState: "full", guestCount: 6, showTimeTile: false, showDateTile: false, view: "chat" },
  // 3 — confirmation with tiles
  { aiText: "Six guests. 26th February. Seven in the evening.\n\nDoes that all sound about right to you?", aiY: 85, userText: "sounds great!", imgState: "full", guestCount: 6, showTimeTile: true, showDateTile: true, view: "chat" },
  // 4 — invite preview: waits for mic tap before revealing invite at step 5
  { aiText: "Here's a preview of the invite;\neach one gets their character profile.", aiY: 85, userText: "", imgState: "none", guestCount: null, showTimeTile: false, showDateTile: false, view: "chat" },
  // 5
  { aiText: "Like it?", aiY: 85, userText: "Yeah, looks great. Lets send them!", imgState: "none", guestCount: null, showTimeTile: false, showDateTile: false, view: "invite" },
  // 6 — email
  { aiText: "Good. Now type in their emails and I'll take care of the rest.", aiY: 140, fontVariant: "semibold-italic", userText: "", imgState: "none", guestCount: null, showTimeTile: false, showDateTile: false, view: "email" },
  // 7 — bridge
  { aiText: "Now. The important part.", aiY: 85, userText: "", imgState: "none", guestCount: null, showTimeTile: false, showDateTile: false, view: "chat", autoAdvance: true, autoAdvanceDelay: 1400 },
  // 8 — tone intro, auto-advance
  { aiText: "Every great mystery has a tone. A temperature.\n\nAnd around here, that starts with what's in the glass.", aiY: 85, userText: "", imgState: "none", guestCount: null, showTimeTile: false, showDateTile: false, view: "chat", autoAdvance: true, autoAdvanceDelay: 1800 },
  // 9 — prompt before bottle selector; mic tap (no userText) advances to bottle-select
  { aiText: "Pick your poison, and I'll match the story to the spirit.", aiY: 85, userText: "", imgState: "none", guestCount: null, showTimeTile: false, showDateTile: false, view: "chat" },
  // 10 — bottle selector: user taps a bottle to advance
  { aiText: "", aiY: 85, userText: "", imgState: "none", guestCount: null, showTimeTile: false, showDateTile: false, view: "bottle-select", noVoice: true },
  // 11 — dynamic bottle selection response (text set via getAiText); then ask flavour
  { aiText: "", aiY: 85, userText: "something fruity, maybe strong?", imgState: "none", guestCount: null, showTimeTile: false, showDateTile: false, view: "chat" },
  // 12 — cocktail-build: "bitter"/"unforgiving"/"grudge" trigger images word-by-word
  { aiText: "Orange... yes. Needs something bitter then.\nWarm. A little unforgiving.\nLike a grudge with good manners.", aiY: 85, userText: "yes", imgState: "cocktail-build", guestCount: null, showTimeTile: false, showDateTile: false, view: "chat" },
  // 13 — "talking" pops chocolate shavings + dark-spice; accumulates from step 12
  { aiText: "Now we're talking!", aiY: 85, userText: "", imgState: "cocktail-build", guestCount: null, showTimeTile: false, showDateTile: false, view: "chat", autoAdvance: true, autoAdvanceDelay: 1400 },
  // 14 — still building the cocktail; video only fires on step 15
  { aiText: "Let me add a little depth...\nsomething that coats the glass...\na whisper of spice to close it out...", aiY: 85, userText: "yes, add a bit of spice", imgState: "cocktail-build", guestCount: null, showTimeTile: false, showDateTile: false, view: "chat" },
  // 15 — orange video reveal: dynamic text names the chosen bottle; no voice
  { aiText: "Finally.\nYour poison.\nTHE VELVET ALIBI.\nDark. Elevated. Slightly dangerous.\nNot sugary.\nWorthy of a Reposado base.", aiY: 340, fontVariant: "semibold-italic", userText: "", imgState: "cocktail-video", guestCount: null, showTimeTile: false, showDateTile: false, view: "chat", noVoice: true },
  // 16 — recipe card with sequential ingredient spawn
  { aiText: "", aiY: 85, userText: "looking good - order this for me", imgState: "none", guestCount: null, showTimeTile: false, showDateTile: false, view: "recipe" },
  // 17 — shopping cart (mic tap from recipe card advances here)
  { aiText: "", aiY: 85, userText: "", imgState: "none", guestCount: null, showTimeTile: false, showDateTile: false, view: "cart" },
  // 18 — apple pay sheet (triggered by "Continue with Apple Pay" button)
  { aiText: "", aiY: 85, userText: "", imgState: "none", guestCount: null, showTimeTile: false, showDateTile: false, view: "apple-pay" },
];

// ─── Bottle-selection dynamic text ───────────────────────────────────────────
const BOTTLE_RESPONSE_STEP = 10;
const COCKTAIL_REVEAL_STEP = 14;

const BOTTLE_RESPONSES: Record<string, string> = {
  cristalino: "Cristalino. Ice-cold clarity.\nSmooth edges. No rough ends.\n\nNow — what are you working with flavour-wise?",
  reposado:   "Reposado. Solid choice.\nRich, smooth finish. Barrel-aged patience.\n\nNow — what are you working with flavour-wise?",
  blanco:     "Blanco. Bold and pure.\nThe agave speaks for itself.\n\nNow — what are you working with flavour-wise?",
};

const BOTTLE_REVEAL_TEXTS: Record<string, string> = {
  cristalino: "Finally.\nYour poison.\nTHE VELVET ALIBI.\nDark. Elevated. Slightly dangerous.\nNot sugary.\nWorthy of a Don Julio 70 Cristalino base.",
  reposado:   "Finally.\nYour poison.\nTHE VELVET ALIBI.\nDark. Elevated. Slightly dangerous.\nNot sugary.\nWorthy of a Reposado base.",
  blanco:     "Finally.\nYour poison.\nTHE VELVET ALIBI.\nDark. Elevated. Slightly dangerous.\nNot sugary.\nWorthy of a Blanco base.",
};

function resolveAiText(stepIdx: number, bottle: string | null): string {
  if (stepIdx === BOTTLE_RESPONSE_STEP && bottle) return BOTTLE_RESPONSES[bottle] ?? "";
  if (stepIdx === COCKTAIL_REVEAL_STEP && bottle)  return BOTTLE_REVEAL_TEXTS[bottle] ?? STEPS[stepIdx].aiText;
  return STEPS[stepIdx].aiText;
}

const WAVE_H = [7, 14, 20, 11, 22, 9, 17, 13, 21, 8, 16, 12];

// ─── Small icons ──────────────────────────────────────────────────────────────
function MicIcon({ color = "white" }: { color?: string }) {
  return (
    <svg style={{ display: "block", width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 24.0714 33">
      <rect height="22.6854" rx="5.15519" stroke={color} strokeWidth="2.06462" width="10.3104" x="6.87606" y="1.03231" />
      <path d={svgMicPaths.p27f3cf60} stroke={color} strokeLinecap="round" strokeWidth="2.0625" />
      <line stroke={color} strokeLinecap="round" strokeWidth="2.0625" x1="11.6875" x2="11.6875" y1="29.2188" y2="31.9688" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg style={{ display: "block", width: 12, height: 12 }} fill="none" viewBox="0 0 13 12.5">
      <line stroke="#838383" strokeLinecap="round" x1="1.20711" x2="12.5"  y1="0.5"  y2="11.7929" />
      <line stroke="#838383" strokeLinecap="round" transform="matrix(-0.707107 0.707107 0.707107 0.707107 12.5 0.5)" x1="0.5" x2="16.4706" y1="-0.5" y2="-0.5" />
    </svg>
  );
}

function GridIcon() {
  const dot = (l: number, t: number) => (
    <div key={`${l}-${t}`} style={{ position: "absolute", left: l, top: t, width: 4, height: 4, border: "0.5px solid #838383", borderRadius: 0.5 }} />
  );
  return (
    <div style={{ position: "relative", width: 19, height: 14 }}>
      {dot(0,0)}{dot(5,0)}{dot(10,0)}{dot(15,0)}
      {dot(0,5)}{dot(5,5)}{dot(10,5)}{dot(15,5)}
      <div style={{ position: "absolute", left: 0, top: 10, width: 19, height: 2, border: "0.5px solid #838383", borderRadius: 0.5 }} />
    </div>
  );
}

// ─── Thinking dots ────────────────────────────────────────────────────────────
function ThinkingDots({ aiY }: { aiY: number; isEmail: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2 }}
      style={{ position: "absolute", left: "50%", top: aiY, transform: "translateX(-50%)", display: "flex", gap: 9, alignItems: "center" }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div key={i}
          style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.45)" }}
          animate={{ y: [-5, 5, -5], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 0.75, delay: i * 0.14, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </motion.div>
  );
}

// ─── Voice waveform ───────────────────────────────────────────────────────────
function Waveform() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, height: 28, width: "100%" }}>
      {WAVE_H.map((h, i) => (
        <motion.div key={i}
          style={{ width: 3, backgroundColor: "#8B2E2E", borderRadius: 2 }}
          animate={{ height: [3, h, 3] }}
          transition={{ duration: 0.38 + i * 0.022, repeat: Infinity, ease: "easeInOut", delay: i * 0.04 }}
        />
      ))}
    </div>
  );
}

// ─── Cursor blink ─────────────────────────────────────────────────────���───────
function Cursor() {
  return <span style={{ display: "inline-block", width: 2, height: "0.85em", backgroundColor: "rgba(255,255,255,0.8)", marginLeft: 3, verticalAlign: "text-bottom", animation: "blink 0.65s step-end infinite" }} />;
}

// Highlight keywords like "strong" in orange within user text
function UserText({ text }: { text: string }) {
  const parts = text.split(/(strong)/gi);
  return (
    <>
      {parts.map((part, i) =>
        /^strong$/i.test(part)
          ? <span key={i} style={{ color: "#F97316" }}>{part}</span>
          : part
      )}
    </>
  );
}

// ─── Blur-reveal text ─────────────────────────────────────────────────────────
function BlurText({ text, isTyping }: { text: string; isTyping: boolean }) {
  const tokens = text.split(/(\s+)/);
  return (
    <>
      {tokens.map((token, i) => (
        <motion.span
          key={i}
          initial={{ filter: "blur(14px)", opacity: 0, y: 4 }}
          animate={{ filter: "blur(0px)",  opacity: 1, y: 0 }}
          transition={{ duration: 0.48, ease: "easeOut" }}
          style={{ display: "inline", whiteSpace: "pre-wrap" }}
        >
          {token}
        </motion.span>
      ))}
      {isTyping && <Cursor />}
    </>
  );
}

// ─── Email fields ─────────────────────────────────────────────────────────────
function EmailField({ value, filled, index }: { value: string; filled: boolean; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: filled ? 1 : 0.22, x: 0 }} transition={{ duration: 0.35, delay: index * 0.06 }} style={{ marginBottom: 12 }}>
      <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 24, color: "white", letterSpacing: -0.48, lineHeight: 1.1, margin: 0 }}>{value}</p>
      <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.28)", marginTop: 12 }} />
    </motion.div>
  );
}

function EmailInputField({ index, value, onChange }: { index: number; value: string; onChange: (v: string) => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: index * 0.06 }} style={{ marginBottom: 12 }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input
          type="email" placeholder="Type email address..." autoFocus value={value} onChange={(e) => onChange(e.target.value)}
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 24, color: "white", letterSpacing: -0.48, lineHeight: 1.1, background: "transparent", border: "none", outline: "none", width: "100%", caretColor: "#D4A853" }}
        />
      </div>
      <div style={{ height: 1, backgroundColor: "#D4A853", marginTop: 12 }} />
    </motion.div>
  );
}

// ─── Cocktail card ────────────────────────────────────────────────────────────
function CocktailCard() {
  return (
    <motion.div
      key="cocktail-card"
      initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <img src={imgDrinkI} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,5,0,0.6) 0%, rgba(10,5,0,0.1) 30%, rgba(10,5,0,0.75) 65%, rgba(10,5,0,0.97) 100%)" }} />
      <p style={{ position: "absolute", left: "50%", top: 518, transform: "translate(-50%, -50%)", fontFamily: "Spectral, serif", fontWeight: 700, fontStyle: "italic", fontSize: 48, color: "white", letterSpacing: -1.5, lineHeight: 1, margin: 0, whiteSpace: "nowrap", textShadow: "0 2px 28px rgba(0,0,0,0.8)" }}>The Vendetta</p>
      <p style={{ position: "absolute", left: "50%", top: 562, transform: "translateX(-50%)", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10.5, color: "rgba(212,168,83,0.9)", letterSpacing: 2.4, textTransform: "uppercase", margin: 0, whiteSpace: "nowrap" }}>Blood Orange · Dark Rum · Amaro · Cardamom</p>
      <div style={{ position: "absolute", left: "50%", top: 608, transform: "translateX(-50%)", width: 196, height: 40, border: "1px solid rgba(245,240,230,0.45)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 11, color: "#F5F0E6", letterSpacing: 2.2, margin: 0 }}>VIEW RECIPE</p>
      </div>
    </motion.div>
  );
}

// ─── Tile content components ──────────────────────────────────────────────────
function GuestTileContent({ count }: { count: number }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: "#e5311c", boxShadow: "0 10px 28px rgba(229,49,28,0.55)" }}>
      <p style={{ position: "absolute", fontFamily: "Spectral, serif", fontWeight: 700, fontSize: 22.5, color: "black", left: 9, top: 3, lineHeight: 1.4, margin: 0 }}>{count}</p>
      <div style={{ position: "absolute", display: "flex", height: 72, alignItems: "center", justifyContent: "center", left: 37, top: 4, width: 32 }}>
        <p style={{ fontFamily: "Spectral, serif", fontWeight: 700, fontSize: 22.5, color: "black", lineHeight: 1.4, margin: 0, transform: "rotate(-90deg)", whiteSpace: "nowrap" }}>Guests</p>
      </div>
    </div>
  );
}

function TimeTileContent() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: "#3d545c", boxShadow: "0 8px 22px rgba(61,84,92,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "Spectral, serif", fontWeight: 700, fontSize: 17, color: "white", lineHeight: 1.4, margin: 0 }}>7pm</p>
    </div>
  );
}

function DateTileContent() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: "#2f3532", boxShadow: "0 8px 22px rgba(0,0,0,0.6)" }}>
      <p style={{ position: "absolute", fontFamily: "Spectral, serif", fontWeight: 700, fontSize: 14.7, color: "white", left: 8, bottom: 10, width: 70, lineHeight: 1, margin: 0 }}>26th February</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function PartyPlannerScreen() {
  const [step, setStep]                 = useState(0);
  const [phase, setPhase]               = useState<Phase>("thinking");
  const [aiDisplay, setAiDisplay]       = useState("");
  const [userDisplay, setUserDisplay]   = useState("");
  const [isAiTyping, setIsAiTyping]     = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [lastEmail, setLastEmail]       = useState("");
  const [revealedKeywords, setRevealedKeywords] = useState<Set<string>>(new Set());
  // buildKeywords accumulates across steps 12-14 (does NOT reset between them)
  const [buildKeywords, setBuildKeywords]       = useState<Set<string>>(new Set());
  // Intro monologue gate — main flow stays frozen until intro completes
  const [introActive, setIntroActive]   = useState(true);
  // Tap-to-start gate — must tap once to unlock AudioContext before intro voice plays
  const [tapToStart, setTapToStart]     = useState(true);
  const [inviteOpen, setInviteOpen]     = useState(false);
  const [selectedBottle, setSelectedBottle] = useState<string | null>(null);

  const typeTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const thinkTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearType    = () => { if (typeTimerRef.current)    clearTimeout(typeTimerRef.current); };
  const clearThink   = () => { if (thinkTimerRef.current)   clearTimeout(thinkTimerRef.current); };
  const clearAdvance = () => { if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current); };
  const clearAll     = () => { clearType(); clearThink(); clearAdvance(); };

  const current     = STEPS[step];
  const isEmailStep = current.view === "email";
  // Show AutoGallery for photo steps AND cocktail/keyword void steps (tiles only, no photos)
  const showGallery =
    current.imgState === "full" ||
    current.imgState === "gatsby-reveal" ||
    current.imgState === "cocktail-build" ||
    current.imgState === "keyword-reveal";

  // Cocktail/keyword steps use empty image array — AutoGallery runs as tiles-only void
  const currentGalleryImages =
    current.imgState === "gatsby-reveal"  ? GATSBY_COMBINED :
    current.imgState === "cocktail-build" ? [] :
    current.imgState === "keyword-reveal" ? [] :
    PARTY_IMAGES;

  // ── Build tile slots ────────────────────────────────────────────────────────
  const tileSlots: TileSlot[] = [];
  if (current.guestCount !== null) {
    tileSlots.push({ id: `guest-${current.guestCount}`, x: -10, y: 40,  rotZ: -3, w: 70,  h: 85,  children: <GuestTileContent count={current.guestCount} /> });
  }
  if (current.showTimeTile) {
    tileSlots.push({ id: "time", x: -148, y: 155, rotZ: 5, w: 86, h: 54, children: <TimeTileContent /> });
  }
  if (current.showDateTile) {
    tileSlots.push({ id: "date", x:  92,  y: 145, rotZ: 4, w: 86, h: 102, children: <DateTileContent /> });
  }
  // ── Ingredient TileSlots — fly through the 3D void exactly like gallery cards ──
  // AutoGallery anchor: x=201, y=420  →  cx = x + w/2 - 201,  cy = y + h/2 - 420
  if (current.imgState === "keyword-reveal") {
    INGREDIENT_DEFS.forEach((def) => {
      if (!revealedKeywords.has(def.keyword)) return;
      tileSlots.push({
        id: `kr-img-${def.keyword}`, x: def.cx, y: def.cy, rotZ: def.rotZ,
        w: def.w, h: def.h, radius: def.radius,
        children: <img src={def.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />,
      });
    });
    if (revealedKeywords.has("strawberry")) {
      tileSlots.push({
        id: "kr-label-strawberry", x: -140, y: 185, rotZ: 4.5,
        w: 149, h: 82, radius: 4.565,
        children: (
          <div style={{ width: "100%", height: "100%", backgroundColor: "#c12c5b", position: "relative" }}>
            <p style={{ position: "absolute", fontFamily: "Spectral, serif", fontWeight: 700, fontSize: 13.696, color: "white", lineHeight: 1.4, left: 4.11, top: 56.15, width: 128.285, margin: 0, whiteSpace: "nowrap" }}>Strawberry</p>
          </div>
        ),
      });
    }
    if (revealedKeywords.has("raspberry")) {
      tileSlots.push({
        id: "kr-label-raspberry", x: -25, y: -165, rotZ: 2,
        w: 57, h: 95, radius: 4.565,
        children: (
          <div style={{ width: "100%", height: "100%", backgroundColor: "#e5311c", position: "relative" }}>
            <div style={{ position: "absolute", left: 21.91, top: 18.5, width: 32, height: 57.979, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ transform: "rotate(-90deg)" }}>
                <p style={{ fontFamily: "Spectral, serif", fontWeight: 700, fontSize: 16.435, color: "black", lineHeight: 1, margin: 0, width: 57.979 }}>Rasberry</p>
              </div>
            </div>
          </div>
        ),
      });
    }
  }

  if (current.imgState === "cocktail-build") {
    COCKTAIL_BUILD_ITEMS.forEach((item) => {
      if (item.keyword && !buildKeywords.has(item.id)) return;
      tileSlots.push({
        id: `cb-${item.id}`, x: item.cx, y: item.cy, rotZ: item.rotZ,
        w: item.w, h: item.h, radius: item.radius ?? 4.565,
        children: (
          item.type === "img" ? (
            <img src={item.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : item.type === "orange-bitters" ? (
            <div style={{ width: "100%", height: "100%", backgroundColor: "#e5311c", position: "relative" }}>
              <div style={{ position: "absolute", left: 21.91, top: 5.48, width: 32, height: 57.979, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ transform: "rotate(-90deg)" }}>
                  <p style={{ fontFamily: "Spectral, serif", fontWeight: 700, fontSize: 16.435, color: "black", lineHeight: 1, margin: 0, width: 57.979 }}>Orange Bitters</p>
                </div>
              </div>
            </div>
          ) : item.type === "chilli" ? (
            <div style={{ width: "100%", height: "100%", backgroundColor: "#fb1a00", position: "relative" }}>
              <p style={{ position: "absolute", fontFamily: "Spectral, serif", fontWeight: 700, fontSize: 13.696, color: "white", lineHeight: 1.4, left: 3.65, top: 2.28, width: 49.305, margin: 0 }}>Chilli</p>
            </div>
          ) : (
            <div style={{ width: "100%", height: "100%", backgroundColor: "#342614", position: "relative" }}>
              <p style={{ position: "absolute", fontFamily: "Spectral, serif", fontWeight: 700, fontSize: 13.696, color: "white", lineHeight: 1.4, left: 4.11, top: 56.15, width: 128.285, margin: 0, whiteSpace: "nowrap" }}>Chocolate Shavings</p>
            </div>
          )
        ),
      });
    });
  }

  if (current.imgState === "gatsby-reveal") {
    const gatsbyItems = [
      { id: "gatsby-img-0", src: imgDrinkK,  x:  55, y: -120, rotZ: -3.5, w: 154, h: 130, radius: 14 },
      { id: "gatsby-img-1", src: imgDrinkI,  x: -100, y:  -50, rotZ:  4.2, w:  93, h: 123, radius: 14 },
      { id: "gatsby-img-2", src: imgDrinkJ,  x:    5, y:   25, rotZ: -2.1, w: 119, h: 179, radius: 14 },
      { id: "gatsby-img-3", src: imgGatsbyA, x:  110, y:   80, rotZ:  5.8, w:  69, h: 130, radius:  7 },
      { id: "gatsby-img-4", src: imgGatsbyB, x:  -82, y:  105, rotZ: -1.5, w:  70, h: 105, radius: 13 },
    ];
    for (const item of gatsbyItems) {
      tileSlots.push({ id: item.id, x: item.x, y: item.y, rotZ: item.rotZ, w: item.w, h: item.h, radius: item.radius, children: <img src={item.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }} /> });
    }
    tileSlots.push({
      id: "gatsby-label", x: -148, y: 160, rotZ: -4, w: 74, h: 118, radius: 5.64,
      children: (
        <div style={{ width: "100%", height: "100%", backgroundColor: "#b12120", boxShadow: "0 10px 30px rgba(177,33,32,0.65)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontFamily: "Spectral, serif", fontWeight: 700, fontSize: 13, color: "white", lineHeight: 1.15, margin: 0, padding: "0 8px", textAlign: "center" }}>1920's Great Gatsby</p>
        </div>
      ),
    });
  }

  // ── Effect 1: step change → reset and start thinking ───────────────────────
  useEffect(() => {
    if (introActive) return;
    clearAll();
    stopSpeech();
    setAiDisplay(""); setIsAiTyping(false);
    setUserDisplay(""); setIsUserTyping(false);
    setRevealedKeywords(new Set());
    // Reset cocktail-build accumulator when leaving the 12-14 window
    if (step < 12 || step > 14) setBuildKeywords(new Set()); // step 14 is last build step
    setInviteOpen(false);
    setPhase("thinking");
    thinkTimerRef.current = setTimeout(() => setPhase("ai_typing"), step === 0 ? 500 : 850);
    return clearThink;
  }, [step, introActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Effect 2: stream AI text, then ready / autoAdvance / speechAdvance ──────
  useEffect(() => {
    if (introActive) return;
    if (phase !== "ai_typing") return;
    const text  = resolveAiText(step, selectedBottle);
    const s     = STEPS[step];
    const myStep = step;
    let i = 0;
    let cancelled   = false;
    let textDone    = false;
    let voiceDone   = !s.speechAdvance; // non-speech-advance steps skip voice gate

    // Fire advance only after BOTH gates are true
    const tryAdvance = () => {
      if (cancelled || !textDone || !voiceDone) return;
      setStep((st) => st === myStep ? Math.min(st + 1, STEPS.length - 1) : st);
    };

    setAiDisplay(""); setIsAiTyping(true);

    // Speak the full line concurrently with the typewriter animation (skip if noVoice)
    if (text.trim() && !s.noVoice) {
      if (s.speechAdvance) {
        speakText(text).then(() => {
          voiceDone = true;
          tryAdvance();
        });
      } else {
        speakText(text);
      }
    }

    const next = () => {
      if (i >= text.length) {
        setIsAiTyping(false);
        if (s.speechAdvance) {
          // Wait for voice to finish too (tryAdvance handles it)
          textDone = true;
          tryAdvance();
        } else if (s.autoAdvance) {
          advanceTimerRef.current = setTimeout(() => setStep((st) => Math.min(st + 1, STEPS.length - 1)), s.autoAdvanceDelay ?? 1000);
        } else {
          setPhase("ready");
        }
        return;
      }
      i++;
      setAiDisplay(text.slice(0, i));
      const c = text[i - 1];
      let d = 34;
      if (c === "." || c === "!" || c === "?") d = 300;
      else if (c === ",") d = 100;
      else if (c === "\n") d = 400;
      typeTimerRef.current = setTimeout(next, d);
    };
    next();
    return () => { cancelled = true; clearType(); clearAdvance(); };
  }, [phase, step, introActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Effect 3: recording → transcribing ─────────────────────────────────────
  useEffect(() => {
    if (phase !== "recording") return;
    advanceTimerRef.current = setTimeout(() => setPhase("transcribing"), 1450);
    return clearAdvance;
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Effect 4: transcribing → type user text → advance step ─────────────────
  useEffect(() => {
    if (phase !== "transcribing") return;
    const uText = STEPS[step].userText;
    setUserDisplay(""); setIsUserTyping(true);
    if (!uText) {
      setIsUserTyping(false);
      advanceTimerRef.current = setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 300);
      return clearAdvance;
    }
    let j = 0;
    const next = () => {
      if (j >= uText.length) {
        setIsUserTyping(false);
        advanceTimerRef.current = setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 520);
        return;
      }
      j++;
      setUserDisplay(uText.slice(0, j));
      typeTimerRef.current = setTimeout(next, 30);
    };
    advanceTimerRef.current = setTimeout(next, 180);
    return () => { clearType(); clearAdvance(); };
  }, [phase, step]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Effect 5: keyword-triggered ingredient reveal (step 13) ──────────────────
  useEffect(() => {
    if (current.imgState !== "keyword-reveal") return;
    const lower = aiDisplay.toLowerCase();
    setRevealedKeywords((prev) => {
      let changed = false;
      const next = new Set(prev);
      for (const def of INGREDIENT_DEFS) {
        if (!next.has(def.keyword) && lower.includes(def.keyword)) { next.add(def.keyword); changed = true; }
      }
      return changed ? next : prev;
    });
  }, [aiDisplay, current.imgState]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Effect 6: cocktail-build keyword reveal (steps 15-17, accumulates) ───────
  useEffect(() => {
    if (current.imgState !== "cocktail-build") return;
    const lower = aiDisplay.toLowerCase();
    setBuildKeywords((prev) => {
      let changed = false;
      const next = new Set(prev);
      for (const item of COCKTAIL_BUILD_ITEMS) {
        if (item.keyword && !next.has(item.id) && lower.includes(item.keyword)) {
          next.add(item.id); changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [aiDisplay, current.imgState]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Mic click ───────────────────────────────────────────────────────────────
  const handleMicClick = () => {
    unlockAudio(); // keep AudioContext alive on every tap
    if (phase !== "ready") return;
    if (!STEPS[step].userText) { setStep((st) => Math.min(st + 1, STEPS.length - 1)); return; }
    setPhase("recording");
  };

  const handleBottleSelect = (id: string) => {
    setSelectedBottle(id);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleContinue = () => {
    if (current.view === "email" && lastEmail) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  // Direct step jump for the "Continue with Apple Pay" button (bypasses mic cycle)
  const handleApplePay = () => {
    clearAll();
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const isThinking  = phase === "thinking";
  const isReady     = phase === "ready";
  const isRecording = phase === "recording" || phase === "transcribing";
  const isPaymentView   = current.view === "cart" || current.view === "apple-pay";
  const isBottleSelect  = current.view === "bottle-select";
  const showUserBox = !isPaymentView && !isBottleSelect && isRecording && current.view !== "invite";

  return (
    <div style={{ position: "relative", width: 402, height: 874, backgroundColor: "#000", overflow: "hidden", borderRadius: 25, border: "4px solid white", boxSizing: "border-box", perspective: "700px" }}>

      {/* ── Audio-reactive gradient (black bg steps only) ───────────────────── */}
      <AnimatePresence>
        {!showGallery && current.imgState !== "cocktail-video" && current.view === "chat" && (
          <motion.div key="audio-gradient" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
            style={{ position: "absolute", inset: 0 }}
          >
            <AudioReactiveGradient />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 3-D gallery ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showGallery && (
          <motion.div key={`gallery-${current.imgState}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0 }}
          >
            <AutoGallery images={currentGalleryImages} speed={1.8} visibleCount={6} tileSlots={tileSlots} />
            {/* Only apply darkening overlays when we have background photos — void steps stay pure black */}
            {currentGalleryImages.length > 0 && (
              <>
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.08) 28%, rgba(0,0,0,0.08) 65%, rgba(0,0,0,0.88) 100%)" }} />
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundColor: "rgba(0,0,0,0.18)" }} />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ingredient cards for keyword-reveal and cocktail-build are now TileSlots
          inside AutoGallery — they fly through the 3D void via the RAF loop */}

      {/* ── Gatsby theme reveal overlays ────────────────────────────────────── */}
      <AnimatePresence>
        {current.imgState === "gatsby-reveal" && (
          <>
            <motion.div key="gatsby-scrim"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.15)", pointerEvents: "none" }}
            />
            <motion.div key="gatsby-grad"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.82) 100%)" }}
            />
          </>
        )}
      </AnimatePresence>

      {/* ── Cocktail-video: orange full-bleed background for the "Finally" reveal ── */}
      <AnimatePresence>
        {current.imgState === "cocktail-video" && (
          <motion.div key="cocktail-video"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            {/* Solid fallback so it's never pure black while image/video loads */}
            <div style={{ position: "absolute", inset: 0, backgroundColor: "#3a1500" }} />
            {/* Orange image as fallback below video */}
            <img src={imgVideoFrame} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            {/* Actual video — plays once at full length with volume; no loop so it isn't cut off */}
            <video
              autoPlay playsInline controlsList="nodownload"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", maxWidth: "none" }}
              src={videoCocktailReveal}
              onEnded={() => setPhase("ready")}
            />
            {/* Gradient so text is legible over the bright orange */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.88) 100%)" }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Recipe card ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {current.view === "recipe" && (
          <motion.div key="recipe"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0 }}
          >
            <RecipeCard />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cart screen ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {current.view === "cart" && (
          <CartScreen key="cart" onApplePay={handleApplePay} />
        )}
      </AnimatePresence>

      {/* ── Apple Pay sheet ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {current.view === "apple-pay" && (
          <ApplePaySheet key="apple-pay" />
        )}
      </AnimatePresence>

      {/* ── Bottle selector ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isBottleSelect && (
          <motion.div
            key="bottle-select"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0, zIndex: 50 }}
          >
            <BottleSelector onSelect={handleBottleSelect} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Invite card + Email form — single AnimatePresence mode="wait" so invite
           exits completely before email enters (eliminates the stacked-layer glitch) ── */}
      <AnimatePresence mode="wait">
        {current.view === "invite" && (
          <motion.div
            key="invite"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            transition={{ duration: 0.55 }}
            style={{ position: "absolute", inset: 0 }}
          >
            {/* ── Card image — Figma: left-[-110] top-[138] w-[619] h-[520]
                 maskMode:"alpha" is critical — without it SVG luminance leaks outside the shape ── */}
            <div style={{
              position: "absolute", left: -110, top: 138, width: 619, height: 520,
              maskImage: `url('${img29}')`, WebkitMaskImage: `url('${img29}')`,
              maskMode: "alpha", WebkitMaskMode: "alpha",
              maskSize: "318px 521px", WebkitMaskSize: "318px 521px",
              maskPosition: "152px 0px", WebkitMaskPosition: "152px 0px",
              maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat",
              overflow: "hidden", borderRadius: 15.919, pointerEvents: "none",
            }}>
              {/* img30 background rotated 90° */}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <div style={{ transform: "rotate(90deg)", flexShrink: 0 }}>
                  <img src={img30} alt="" style={{ width: 520, height: 619, objectFit: "cover", maxWidth: "none", display: "block" }} />
                </div>
              </div>
              {/* imgSafdgdbnf orange horse rider at opacity 0.7 */}
              <img src={imgSafdgdbnf} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
              {/* gradient for text legibility */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.42) 68%, rgba(0,0,0,0.84) 100%)" }} />
            </div>

            {/* ════ CLOSED STATE ════════════════════════════════════════════════════ */}

            {/* Title — Figma Frame 4: left-[201] top-[280] -translate-x-1/2 w-[284.433]
                 left edge = 201 - 142.22 = 58.78 ≈ 59px */}
            <motion.p
              animate={{ opacity: inviteOpen ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              style={{ position: "absolute", left: 59, top: 280, width: 284, fontFamily: "Spectral, serif", fontWeight: 500, fontStyle: "italic", fontSize: 16.786, textAlign: "center", color: "white", letterSpacing: 3.3572, lineHeight: 1.35, margin: 0, pointerEvents: "none" }}
            >
              <span style={{ textTransform: "capitalize" }}>Exclusive</span>
              {" invitation FOR "}
              <span style={{ textTransform: "capitalize" }}>John Doe</span>
            </motion.p>

            {/* Description — Figma Frame 4: left-[201] top-[348] h-[51] w-[240]
                 left edge = 201 - 120 = 81px */}
            <motion.p
              animate={{ opacity: inviteOpen ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              style={{ position: "absolute", left: 81, top: 348, width: 240, height: 51, fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 14.133, textAlign: "center", color: "white", lineHeight: 1.25, margin: 0, overflow: "hidden", pointerEvents: "none" }}
            >
              You're invited to an exclusive invitation-only murder mystery event called Shot In The Dark.
            </motion.p>

            {/* Scroll indicator — Figma Frame 4: left-[185] top-[436] w-[32.085] h-[81.764]
                 vertical pill (rotate -90°) with down-arrow inside */}
            <motion.div
              animate={{ opacity: inviteOpen ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              style={{ position: "absolute", left: 185, top: 436, width: 32, height: 82, pointerEvents: "none" }}
            >
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 82, height: 32, transform: "rotate(-90deg)", border: "0.776px solid white", borderRadius: 65, flexShrink: 0 }} />
              </div>
              <svg style={{ position: "absolute", left: "50%", top: "16%", transform: "translateX(-50%)" }} width="14" height="22" viewBox="0 0 14 22" fill="none">
                <line x1="7" y1="2" x2="7" y2="14" stroke="white" strokeWidth="0.9" strokeLinecap="round" />
                <path d="M2 11 L7 16 L12 11" stroke="white" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>

            {/* ── OPENED: title — Figma: left-[201.22px] -translate-x-1/2 w-[284] top-[226] → left=59 ── */}
            <motion.div
              animate={{ opacity: inviteOpen ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              style={{ position: "absolute", left: 59, top: 226, width: 284, pointerEvents: "none" }}
            >
              <p style={{ fontFamily: "Spectral, serif", fontWeight: 500, fontStyle: "italic", fontSize: 16.786, textAlign: "center", color: "white", letterSpacing: 3.3572, lineHeight: 1.35, margin: 0, textTransform: "capitalize" }}>1920's Great Gatsby</p>
              <p style={{ fontFamily: "Spectral, serif", fontWeight: 500, fontStyle: "italic", fontSize: 16.786, textAlign: "center", color: "white", letterSpacing: 3.3572, lineHeight: 1.35, margin: 0, textTransform: "capitalize" }}>Murder Mystery</p>
            </motion.div>
            {/* ── OPENED: date — Figma Frame 11: left-[201] top-[277] -translate-x-1/2 w-[240]
                 single line "26th Feb 2026 @ 7pm" — left edge = 81px */}
            <motion.div
              animate={{ opacity: inviteOpen ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              style={{ position: "absolute", left: 81, top: 277, width: 240, textAlign: "center", pointerEvents: "none" }}
            >
              <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 8, color: "white", lineHeight: 1.5, margin: 0 }}>26th Feb 2026 @ 7pm</p>
            </motion.div>

            {/* ── OPENED: location pill — Figma Frame 11: left-[135] top-[306] w-[132] h-[27]
                 bg rgba(0,0,0,0.5), border 0.614px solid white, borderRadius 57.682px */}
            <motion.div
              animate={{ opacity: inviteOpen ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 0.14 }}
              style={{ position: "absolute", left: 135, top: 306, width: 132, height: 27, backgroundColor: "rgba(0,0,0,0.5)", border: "0.614px solid white", borderRadius: 57.682, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, pointerEvents: "none" }}
            >
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" style={{ flexShrink: 0 }}>
                <path d="M4 0C1.791 0 0 1.791 0 4C0 7 4 12 4 12C4 12 8 7 8 4C8 1.791 6.209 0 4 0ZM4 5.5C3.172 5.5 2.5 4.828 2.5 4C2.5 3.172 3.172 2.5 4 2.5C4.828 2.5 5.5 3.172 5.5 4C5.5 4.828 4.828 5.5 4 5.5Z" fill="white" />
              </svg>
              <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 8, color: "white", lineHeight: 1.495, margin: 0, whiteSpace: "nowrap" }}>Birch Hotel, London</p>
            </motion.div>

            {/* ── OPENED: body copy — Figma Frame 11: left-[197] top-[363] -translate-x-1/2 w-[252] h-[140]
                 left edge = 197 - 126 = 71px — Inter Regular 12px white text-center */}
            <motion.div
              animate={{ opacity: inviteOpen ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ position: "absolute", left: 71, top: 363, width: 252, height: 140, pointerEvents: "none" }}
            >
              <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 12, color: "white", textAlign: "center", lineHeight: 1.25, margin: 0 }}>
                You're in for a night of secrets, suspicion, and Don Julio. Someone at your table has blood on their hands.
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 12, color: "white", textAlign: "center", lineHeight: 1.25, margin: "10px 0 0" }}>
                Your AI host knows who; but they're not telling. Not yet.
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 12, color: "white", textAlign: "center", lineHeight: 1.25, margin: "10px 0 0" }}>
                Dress sharp. Trust no one. And whatever you do, don't leave your drink unattended.
              </p>
            </motion.div>

            {/* ── OPEN INVITATION button — Figma: left-[75] top-[556] w-[252] h-[41] ── */}
            <motion.button
              animate={{ opacity: inviteOpen ? 0 : 1 }}
              transition={{ duration: 0.25 }}
              onClick={() => setInviteOpen(true)}
              style={{ position: "absolute", left: 75, top: 556, width: 252, height: 41, backgroundColor: "white", borderRadius: 20, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: inviteOpen ? "none" : "auto" }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
            >
              <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, color: "#313131", letterSpacing: 1.8, margin: 0 }}>OPEN INVITATION</p>
            </motion.button>

            {/* ── I WILL BE ATTENDING — Figma: left-[75] top-[530] w-[252] h-[41] ── */}
            <motion.button
              animate={{ opacity: inviteOpen ? 1 : 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => {}}
              style={{ position: "absolute", left: 75, top: 530, width: 252, height: 41, backgroundColor: "white", borderRadius: 20, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: inviteOpen ? "auto" : "none" }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
            >
              <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, color: "#313131", letterSpacing: 1.8, margin: 0 }}>I WILL BE ATTENDING</p>
            </motion.button>

            {/* ── I HAVE TO DECLINE — Figma: left-[75] top-[581] w-[252] h-[41] ── */}
            <motion.button
              animate={{ opacity: inviteOpen ? 1 : 0 }}
              transition={{ duration: 0.45, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => {}}
              style={{ position: "absolute", left: 75, top: 581, width: 252, height: 41, backgroundColor: "#313131", borderRadius: 20, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: inviteOpen ? "auto" : "none" }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
            >
              <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, color: "white", letterSpacing: 1.8, margin: 0 }}>I HAVE TO DECLINE</p>
            </motion.button>

            {/* ── User message bubble — Figma Frame 7: left-[20] top-[688] w-[352]
                 bg rgba(255,255,255,0.1), border 1px solid #838383, rounded-[10px], p-[16px] ── */}
            <motion.div
              animate={{ opacity: isRecording ? 1 : 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              style={{ position: "absolute", left: 20, top: 688, width: 352, backgroundColor: "rgba(255,255,255,0.07)", border: `1px solid ${phase === "recording" ? "#8B2E2E" : "#838383"}`, borderRadius: 10, padding: "14px 18px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 10, pointerEvents: "none", transition: "border-color 0.3s" }}
            >
              {phase === "recording" ? (
                <Waveform />
              ) : (
                <>
                  {isUserTyping && (
                    <div style={{ flexShrink: 0, width: 6, height: 6, borderRadius: "50%", backgroundColor: "#e5311c", animation: "voicePulse 0.65s ease-in-out infinite" }} />
                  )}
                  <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 16, color: "white", lineHeight: 1.5, margin: 0, textAlign: "center", flex: 1 }}>
                    <UserText text={userDisplay} />{isUserTyping && <Cursor />}
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* ── Email form (inside same AnimatePresence — enters only after invite exits) ── */}
        {current.view === "email" && (
          <motion.div key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} style={{ position: "absolute", left: 33, top: 306, width: 335 }}>
            <EmailField value="john.doe@gmail.com"        filled index={0} />
            <EmailField value="sarah.black@gmail.com"     filled index={1} />
            <EmailField value="james.white@icloud.com"    filled index={2} />
            <EmailField value="olivia.grey@outlook.com"   filled index={3} />
            <EmailField value="thomas.scarlett@gmail.com" filled index={4} />
            <EmailInputField index={5} value={lastEmail} onChange={setLastEmail} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue button */}
      <AnimatePresence>
        {current.view === "email" && (
          <motion.div key="continue" initial={{ opacity: 0 }} animate={{ opacity: lastEmail ? 1 : 0.2 }} exit={{ opacity: 0 }}
            onClick={handleContinue}
            style={{ position: "absolute", left: "50%", bottom: 135, transform: "translateX(-50%)", width: 335, height: 50, backgroundColor: "white", borderRadius: 62, display: "flex", alignItems: "center", justifyContent: "center", cursor: lastEmail ? "pointer" : "default" }}
          >
            <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 16, color: "black", lineHeight: 1.5, margin: 0 }}>Continue</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cocktail card ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {current.view === "cocktail" && <CocktailCard />}
      </AnimatePresence>

      {/* ── AI thinking dots ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isThinking && !isBottleSelect && current.imgState !== "cocktail-video" && <ThinkingDots key={`dots-${step}`} aiY={current.aiY} isEmail={isEmailStep} />}
      </AnimatePresence>

      {/* ── Ambient glow while AI types (hidden on cocktail-video) ──────────────── */}
      <AnimatePresence>
        {phase === "ai_typing" && current.imgState !== "cocktail-video" && (
          <motion.div key="glow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
            style={{ position: "absolute", left: "50%", top: current.aiY, transform: "translate(-50%,-50%)", width: 320, height: 120, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,0.045) 0%, transparent 70%)", pointerEvents: "none" }}
          />
        )}
      </AnimatePresence>

      {/* ── AI text (hidden on cocktail-video so the video has no overlaid copy) ── */}
      <AnimatePresence mode="wait">
        {!isThinking && aiDisplay && current.imgState !== "cocktail-video" && (
          <motion.div key={`ai-${step}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
            style={isEmailStep
              ? { position: "absolute", left: 25, top: current.aiY, width: 343, textAlign: "center" }
              : { position: "absolute", left: "50%", top: current.aiY, transform: "translateX(-50%)", width: 352, textAlign: "center" }}
          >
            <p style={{ fontFamily: "Spectral, serif", fontWeight: current.fontVariant === "semibold-italic" ? 600 : 400, fontStyle: current.fontVariant === "semibold-italic" ? "italic" : "normal", fontSize: 24, color: "white", lineHeight: 1.15, letterSpacing: current.fontVariant === "semibold-italic" ? -0.48 : 0, margin: 0, whiteSpace: "pre-wrap" }}>
              <BlurText text={aiDisplay} isTyping={isAiTyping} />
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── User voice box ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showUserBox && (
          <motion.div key="user-box"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.22 } }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            style={{ position: "absolute", left: 20, top: 688, width: 352, minHeight: 52, padding: "14px 18px", borderRadius: 10, backgroundColor: "rgba(255,255,255,0.07)", border: `1px solid ${phase === "recording" ? "#8B2E2E" : "#838383"}`, boxSizing: "border-box", transition: "border-color 0.3s" }}
          >
            {phase === "recording" ? <Waveform /> : (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <AnimatePresence>
                  {isUserTyping && (
                    <motion.div key="dot" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} transition={{ duration: 0.2 }}
                      style={{ flexShrink: 0, width: 6, height: 6, borderRadius: "50%", backgroundColor: "#e5311c", animation: "voicePulse 0.65s ease-in-out infinite" }}
                    />
                  )}
                </AnimatePresence>
                <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 16, color: "white", textAlign: "center", lineHeight: 1.5, margin: 0, flex: 1 }}>
                  <UserText text={userDisplay} />{isUserTyping && <Cursor />}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LISTENING badge ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "recording" && (
          <motion.div key="listening"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.25 }}
            style={{ position: "absolute", left: "50%", top: 750, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 7, pointerEvents: "none" }}
          >
            <motion.div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#8B2E2E" }}
              animate={{ scale: [1, 1.7, 1], opacity: [1, 0.4, 1] }} transition={{ duration: 0.72, repeat: Infinity }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: 2.5 }}>LISTENING</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Ready-pulse ring (hidden on payment views) ───────────────────────── */}
      <AnimatePresence>
        {isReady && !isPaymentView && !isBottleSelect && (
          <motion.div key="ring"
            style={{ position: "absolute", left: 160, top: 759, width: 82, height: 82, borderRadius: 41, border: "1.5px solid rgba(255,255,255,0.28)", pointerEvents: "none" }}
            animate={{ scale: [1, 1.55], opacity: [0.55, 0] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* ── Recording pulse ring ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "recording" && (
          <motion.div key="rec-ring"
            style={{ position: "absolute", left: 157, top: 756, width: 88, height: 88, borderRadius: 44, border: "2px solid #8B2E2E", pointerEvents: "none" }}
            animate={{ scale: [1, 1.65, 1], opacity: [0.85, 0, 0.85] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* ── Mic button (hidden on payment + bottle-select views) ── */}
      <motion.button
        onClick={handleMicClick} disabled={!isReady || isPaymentView || isBottleSelect}
        style={{ position: "absolute", left: 168, top: 767, width: 66, height: 66, borderRadius: 33, border: "none", cursor: isReady && !isPaymentView && !isBottleSelect ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 22px", boxSizing: "border-box", zIndex: 10, opacity: isPaymentView || isBottleSelect ? 0 : 1, pointerEvents: isPaymentView || isBottleSelect ? "none" : undefined }}
        animate={{ backgroundColor: phase === "recording" ? "#8B2E2E" : isReady ? ["#383838", "#444", "#383838"] : "#383838", scale: phase === "recording" ? [1, 1.06, 1] : 1 }}
        transition={phase === "recording" ? { scale: { duration: 0.9, repeat: Infinity }, backgroundColor: { duration: 0.3 } } : isReady ? { duration: 2.2, repeat: Infinity } : {}}
        whileHover={isReady ? { scale: 1.08 } : {}} whileTap={isReady ? { scale: 0.88 } : {}}
      >
        <MicIcon />
      </motion.button>

      {/* X + Grid buttons — hidden on payment + bottle-select views */}
      <div style={{ position: "absolute", left: 107, top: 778, opacity: isPaymentView || isBottleSelect ? 0 : 1, pointerEvents: isPaymentView || isBottleSelect ? "none" : undefined, width: 45, height: 45, borderRadius: 22.5, border: "1px dashed #838383", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><XIcon /></div>
      <div style={{ position: "absolute", left: 250, top: 778, width: 45, height: 45, borderRadius: 22.5, border: "1px dashed #838383", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: isPaymentView || isBottleSelect ? 0 : 1, pointerEvents: isPaymentView || isBottleSelect ? "none" : undefined }}><GridIcon /></div>

      {/* ── Step indicator pills ─────────────────────────────────────────────── */}
      <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4 }}>
        {STEPS.map((_, i) => (
          <motion.div key={i}
            animate={{ width: i === step ? 14 : 4, backgroundColor: i === step ? "#ffffff" : "rgba(255,255,255,0.22)" }}
            transition={{ duration: 0.3 }}
            style={{ height: 4, borderRadius: 2 }}
          />
        ))}
      </div>

      {/* ── Debug back button ────────────────────────────────────────────────── */}
      {step > 0 && (
        <button
          onClick={() => setStep((s) => Math.max(s - 1, 0))}
          style={{ position: "absolute", top: 14, left: 16, display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 20, padding: "5px 11px 5px 8px", cursor: "pointer", zIndex: 100 }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M8 1L3 6L8 11" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: 1.2 }}>{step - 1} ← {step}</span>
        </button>
      )}

      <style>{`
        @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes voicePulse { 0%,100%{transform:scale(1);opacity:0.75} 50%{transform:scale(1.6);opacity:1} }
      `}</style>

      {/* ── Intro monologue overlay — only mounted AFTER the tap-to-start gate ── */}
      <AnimatePresence>
        {introActive && !tapToStart && (
          <motion.div
            key="intro-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0, backgroundColor: "#000", zIndex: 200, borderRadius: 21 }}
          >
            <IntroScreen onComplete={() => setIntroActive(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tap-to-start gate — zIndex 300, sits above intro, unlocks AudioContext ── */}
      <AnimatePresence>
        {tapToStart && (
          <motion.div
            key="tap-to-start"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            onClick={() => { unlockAudio(); setTapToStart(false); }}
            style={{
              position: "absolute", inset: 0,
              backgroundColor: "#0A0A0A",
              zIndex: 300,
              borderRadius: 21,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              gap: 24,
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "Spectral, serif",
                fontWeight: 400,
                fontSize: 22,
                color: "white",
                letterSpacing: 0.5,
                margin: 0,
                textAlign: "center",
              }}
            >
              Shot In The Dark
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#D4A853" }}
              />
              <span style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 9,
                color: "rgba(255,255,255,0.38)",
                letterSpacing: 3,
                textTransform: "uppercase",
              }}>
                Tap to begin
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
