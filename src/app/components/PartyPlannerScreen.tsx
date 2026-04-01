import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { speakText, stopSpeech, unlockAudio, getSpeechPromise } from "../services/elevenlabs";
import { AutoGallery, TileSlot } from "./AutoGallery";
import { IntroScreen } from "./IntroScreen";
import { VideoScreen } from "./VideoScreen";
import { NameScreen } from "./NameScreen";
import { InfoGatherScreen, PartyDetails } from "./InfoGatherScreen";
import { AudioReactiveGradient } from "./AudioReactiveGradient";
import { CartScreen, calcCartTotal } from "./CartScreen";
import { ApplePaySheet } from "./ApplePaySheet";
import { BottleSelector } from "./BottleSelector";
import svgMicPaths from "../../imports/svg-p5gailxsrc";
import imgSafdgdbnf from "figma:asset/46012681f417991ceea5ca1a2a5fe36bc79180ea.png";
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
// Reposado Paloma ingredient images — used in recipe card
import imgPalomaGrapefruit from "../../assets/Grapefruit.png";
import imgPalomaLime       from "../../assets/Lime.png";
import imgPalomaAgave      from "../../assets/Agave.png";
import imgPalomaCilantro   from "../../assets/Cilantro.png";
import imgPalomaClubSoda   from "../../assets/soda.png";

// ── Cocktail builder ingredient images (keyword-spawn during cocktail chat) ───
import imgCocktailBitter     from "../../assets/Cocktail/Bitter Cocktail.jpg";
import imgCocktailChilli     from "../../assets/Cocktail/Chilli.jpg";
import imgCocktailGrapefruit from "../../assets/Cocktail/Grapefruit.jpg";
import imgCocktailHoney      from "../../assets/Cocktail/Honey.jpg";
import imgCocktailLemon      from "../../assets/Cocktail/Lemon.jpg";
import imgCocktailLime       from "../../assets/Cocktail/Lime.jpg";
import imgCocktailMint       from "../../assets/Cocktail/Mint.jpg";
import imgCocktailSour       from "../../assets/Cocktail/Sour Cocktail.jpg";
import imgCocktailSweet      from "../../assets/Cocktail/Sweet Cocktail.jpg";

// ── Final reveal: cocktail video ─────────────────────────────────────────────
import videoCocktail2 from "../../assets/Cocktail Vid 2.mp4";
import { OccasionScreen } from "./OccasionScreen";
import { hostChat, ConvMessage } from "../services/claude";

// ── Gatsby theme images ───────────────────────────────────────────────────────
import imgGatsbyA from "figma:asset/33c1904697d60857f2793985dd45af0b65d00138.png";
import imgGatsbyB from "figma:asset/b700a4bda2ef0ceacaf56b1c8edc736bfaa95522.png";

// ── The Night 1 — western keyword-spawn + gallery images ──────────────────────
import imgNightHat1       from "../../assets/The Night 1/Cowboy Hat 1.jpg";
import imgNightHat2       from "../../assets/The Night 1/Cowboy Hat 2.jpg";
import imgNightHat3       from "../../assets/The Night 1/Cowboy HAt 3.jpg";
import imgNightBoots      from "../../assets/The Night 1/Cowboy Boots 1.jpg";
import imgNightDonJulio   from "../../assets/The Night 1/Don Julio Reposado.png";
import imgNightGrapefruit from "../../assets/The Night 1/Grapefruit.png";
import imgNightMixer      from "../../assets/The Night 1/Mixer.png";
import imgNightMostWanted from "../../assets/The Night 1/Most Wanted.jpg";
import imgNightSaloon1    from "../../assets/The Night 1/Saloon 1.jpg";
import imgNightSaloon2    from "../../assets/The Night 1/Saloon 2.jpg";
import imgNightSaloon3    from "../../assets/The Night 1/Saloon 3.jpg";
import imgNightDress      from "../../assets/The Night 1/Sparkly Dress.jpg";
import imgNightReposadoCard from "../../assets/The Night 1/reposado-card 10.avif";

// Gallery shown on step 7 ("Take it in") — full western void
const WESTERN_GALLERY = [
  imgNightSaloon1, imgNightSaloon2, imgNightSaloon3,
  imgNightHat1, imgNightHat2, imgNightHat3,
  imgNightBoots, imgNightMostWanted, imgNightDress,
  imgNightMixer, imgNightReposadoCard, imgNightDonJulio,
];

const PARTY_IMAGES      = [imgSafdgdbnf, imgHrsbgfdxVc, img855, img833, imgC9556];
const DRINK_IMAGES_B    = [imgDrinkD, imgDrinkF, imgDrinkI, imgDrinkJ, imgDrinkK, imgDrinkL];
// The six Figma-matched spice/bitter images (screen 14/17)
const DRINK_IMAGES_SPICE = [imgDrinkH, imgDrinkE, imgDrinkB, imgDrinkF, imgDrinkC, imgDrinkG];
const GATSBY_COMBINED   = [...PARTY_IMAGES, imgDrinkK, imgDrinkI, imgDrinkJ, imgGatsbyA, imgGatsbyB];

// ── Keyword-triggered ingredient images ───────────────────────────────────────
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

// ── Western keyword-spawn defs — images fly in as LLM narrates step 6 ─────────
// keywords matched against aiDisplay.toLowerCase() as text types
const WESTERN_DEFS: IngredientDef[] = [
  { keyword: "hat",        src: imgNightHat1,          x: 0, y: 0, w: 200, h: 155, radius: 14, rotZ: -4.5, cx:  -10, cy: -185 },
  { keyword: "boots",      src: imgNightBoots,         x: 0, y: 0, w: 175, h: 145, radius: 14, rotZ:  6.2, cx:  115, cy:  110 },
  { keyword: "saloon",     src: imgNightSaloon1,       x: 0, y: 0, w: 200, h: 152, radius: 14, rotZ: -3.1, cx: -105, cy:   45 },
  { keyword: "most wanted",src: imgNightMostWanted,    x: 0, y: 0, w: 145, h: 185, radius: 14, rotZ:  3.4, cx: -135, cy:  -90 },
  { keyword: "don julio",  src: imgNightDonJulio,      x: 0, y: 0, w: 120, h: 190, radius: 14, rotZ:  5.1, cx:   70, cy:  170 },
  { keyword: "reposado",   src: imgNightReposadoCard,  x: 0, y: 0, w: 170, h: 130, radius: 14, rotZ: -5.8, cx:  -55, cy:  155 },
  { keyword: "grapefruit", src: imgNightGrapefruit,    x: 0, y: 0, w: 130, h: 130, radius: 65, rotZ:  7.3, cx:  145, cy:  -80 },
];

// ── Cocktail keyword-spawn defs — images fly in as user/LLM mentions flavours ─
// keywords matched against aiDisplay + userDisplay combined (case-insensitive)
const COCKTAIL_DEFS: IngredientDef[] = [
  { keyword: "lemon",      src: imgCocktailLemon,      x:0, y:0, w:148, h:148, radius:14, rotZ:-3.1, cx:  -30, cy: -175 },
  { keyword: "grapefruit", src: imgCocktailGrapefruit, x:0, y:0, w:148, h:148, radius:14, rotZ:-5.9, cx: -135, cy:  -95 },
  { keyword: "lime",       src: imgCocktailLime,       x:0, y:0, w:142, h:142, radius:14, rotZ: 4.1, cx:   60, cy:  170 },
  { keyword: "spic",       src: imgCocktailChilli,     x:0, y:0, w:130, h:158, radius:14, rotZ:-6.2, cx:  130, cy:   95 },
  { keyword: "honey",      src: imgCocktailHoney,      x:0, y:0, w:130, h:145, radius:14, rotZ: 3.7, cx: -150, cy:   45 },
  { keyword: "mint",       src: imgCocktailMint,       x:0, y:0, w:155, h:135, radius:14, rotZ:-3.9, cx:  100, cy: -170 },
  { keyword: "citru",      src: imgCocktailGrapefruit, x:0, y:0, w:148, h:148, radius:14, rotZ: 2.7, cx:   75, cy:  -35 },
  { keyword: "sweet",      src: imgCocktailHoney,      x:0, y:0, w:155, h:150, radius:14, rotZ: 5.2, cx:   50, cy: -100 },
  { keyword: "sour",       src: imgCocktailSour,       x:0, y:0, w:155, h:150, radius:14, rotZ: 6.8, cx:  -50, cy: -145 },
  { keyword: "bitter",     src: imgCocktailBitter,     x:0, y:0, w:165, h:145, radius:14, rotZ:-2.8, cx:  130, cy:   50 },
  { keyword: "agave",      src: imgPalomaAgave,        x:0, y:0, w:155, h:155, radius:14, rotZ: 4.6, cx:  -60, cy: -155 },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase     = "thinking" | "ai_typing" | "ready" | "recording" | "transcribing";
type ImgState  = "none" | "full" | "keyword-reveal" | "gatsby-reveal" | "drink-spice";
type ViewState = "chat" | "bottle-select" | "flavor-pick" | "invite" | "email" | "recipe" | "cart" | "apple-pay" | "cocktail2";

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
  // 0 — fun intro (speechAdvance)
  { aiText: "Now, the fun part.", aiY: 85, userText: "", imgState: "none", guestCount: null, showTimeTile: false, showDateTile: false, view: "chat", speechAdvance: true },
  // 1 — bottle framing (speechAdvance)
  { aiText: "The bottle doesn't just set the mood.\n\nIt decides who you are tonight.", aiY: 85, userText: "", imgState: "none", guestCount: null, showTimeTile: false, showDateTile: false, view: "chat", speechAdvance: true },
  // 2 — bottle selector (3-drink carousel)
  { aiText: "", aiY: 85, userText: "", imgState: "none", guestCount: null, showTimeTile: false, showDateTile: false, view: "bottle-select" },
  // 3-6 — flavour questions (chat, keyword-reveal void, user responds each turn)
  { aiText: "", aiY: 85, userText: "", imgState: "keyword-reveal", guestCount: null, showTimeTile: false, showDateTile: false, view: "chat" },
  { aiText: "", aiY: 85, userText: "", imgState: "keyword-reveal", guestCount: null, showTimeTile: false, showDateTile: false, view: "chat" },
  { aiText: "", aiY: 85, userText: "", imgState: "keyword-reveal", guestCount: null, showTimeTile: false, showDateTile: false, view: "chat" },
  { aiText: "", aiY: 85, userText: "", imgState: "keyword-reveal", guestCount: null, showTimeTile: false, showDateTile: false, view: "chat" },
  // 7 — flavour roundup (AI-generated, ingredients fly in, speechAdvance)
  { aiText: "", aiY: 85, userText: "", imgState: "keyword-reveal", guestCount: null, showTimeTile: false, showDateTile: false, view: "chat", speechAdvance: true },
  // 8 — cocktail vid 2 (plays after flavour builder void, before night reveal)
  { aiText: "", aiY: 85, userText: "", imgState: "none", guestCount: null, showTimeTile: false, showDateTile: false, view: "cocktail2", noVoice: true },
  // 9 — cocktail reveal (AI-generated, speechAdvance)
  { aiText: "", aiY: 85, userText: "", imgState: "keyword-reveal", guestCount: null, showTimeTile: false, showDateTile: false, view: "chat", speechAdvance: true },
  // 10 — cart
  { aiText: "Here's everything you'll need. When you're ready, tap checkout.", aiY: 85, userText: "", imgState: "none", guestCount: null, showTimeTile: false, showDateTile: false, view: "cart" },
  // 11 — apple pay
  { aiText: "", aiY: 85, userText: "", imgState: "none", guestCount: null, showTimeTile: false, showDateTile: false, view: "apple-pay", noVoice: true },
];

// ─── Flavour conversation ─────────────────────────────────────────────────────
const FLAVOUR_STEPS  = new Set([3, 4, 5, 6]);
const ROUNDUP_STEP   = 7;
const REVEAL_STEP    = 9;

const FLAVOUR_Q1: Record<string, string> = {
  reposado:   "Solid choice.\n\nThe Reposado — golden, a little smoky, smooth finish.\n\nNow tell me — what flavours do you actually enjoy?\n\nCitrus, herbal, spicy, sweet...?",
  cristalino: "Cristalino.\n\nIce-cold clarity, smooth as glass.\n\nNow tell me — what flavours do you actually enjoy?\n\nCitrus, herbal, spicy, sweet...?",
  blanco:     "Blanco.\n\nBold, pure, no apology.\n\nNow tell me — what flavours do you actually enjoy?\n\nCitrus, herbal, spicy, sweet...?",
};
const FLAVOUR_Q2 = "A dash of agave to balance it out.\n\nNow — you want something a bit more on the citrus side?";
const FLAVOUR_Q3 = "Grapefruit or lime — do you lean one more over the other?";
const FLAVOUR_Q4 = "Last one.\n\nSomething long and slow to sip, or short and sharp?";
const FLAVOUR_Q2_FALLBACK = "Tell me more — are you after something crisp and sharp, or round and sweet?";
const FLAVOUR_Q3_FALLBACK = "Any heat in there — chilli, spice — or something cleaner?";
const FLAVOUR_Q4_FALLBACK = "Last one.\n\nSomething long and slow to sip, or short and sharp?";
const ROUNDUP_FALLBACK    = "Grapefruit.\n\nAgave.\n\nA trace of chilli.\n\nBitter at the back.\n\nI've got everything I need.";
const COCKTAIL_REVEAL_FALLBACK = "The Velvet Alibi.\n\nGrapefruit. Agave. Smoke at the back.\n\nThis one has edges.";

// ─── AI-driven steps ─────────────────────────────────────────────────────────
const AI_STEPS = new Set([4, 5, 6, ROUNDUP_STEP, REVEAL_STEP]);

function resolveAiText(stepIdx: number, selectedBottle: string | null, aiGeneratedSteps: Record<number, string>): string {
  if (aiGeneratedSteps[stepIdx]) return aiGeneratedSteps[stepIdx];
  if (stepIdx === 3) return FLAVOUR_Q1[selectedBottle ?? "reposado"] ?? FLAVOUR_Q1.reposado;
  if (stepIdx === 4) return FLAVOUR_Q2_FALLBACK;
  if (stepIdx === 5) return FLAVOUR_Q3_FALLBACK;
  if (stepIdx === 6) return FLAVOUR_Q4_FALLBACK;
  if (stepIdx === ROUNDUP_STEP) return ROUNDUP_FALLBACK;
  if (stepIdx === REVEAL_STEP) return COCKTAIL_REVEAL_FALLBACK;
  return STEPS[stepIdx]?.aiText ?? "";
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
function ThinkingDots() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2 }}
      style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", display: "flex", gap: 9, alignItems: "center" }}
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

// Highlight "orange" in orange within user text
function UserText({ text }: { text: string }) {
  const parts = text.split(/(orange)/gi);
  return (
    <>
      {parts.map((part, i) =>
        /^orange$/i.test(part)
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

// ─── Cocktail video card ──────────────────────────────────────────────────────
function CocktailCard({ onComplete, src }: { onComplete: () => void; src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const skip = () => { videoRef.current?.pause(); onComplete(); };
  return (
    <motion.div
      key="cocktail-card"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ position: "absolute", inset: 0, backgroundColor: "#000", borderRadius: 21, overflow: "hidden" }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        controlsList="nodownload"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", maxWidth: "none" }}
        src={src}
        onEnded={onComplete}
      />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 15%, transparent 78%, rgba(0,0,0,0.55) 100%)" }} />
      <div onClick={skip} style={{ position: "absolute", inset: 0, cursor: "pointer", zIndex: 10 }} />
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} transition={{ delay: 2, duration: 1.2 }}
        style={{ position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)", fontFamily: "Inter, sans-serif", fontSize: 9, color: "white", letterSpacing: 2.8, margin: 0, textTransform: "uppercase", pointerEvents: "none", zIndex: 20 }}
      >Tap to skip</motion.p>
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

// ── Flavor picker void positions (TileSlot x/y = offset from AutoGallery center 50%/48%) ──
const FLAVOR_VOID_POSITIONS = [
  { x:  -90, y: -170, rotZ: -5.5, w: 175, h: 155 },
  { x:  135, y: -130, rotZ:  4.2, w: 150, h: 170 },
  { x: -155, y:   20, rotZ: -7.0, w: 155, h: 140 },
  { x:  120, y:   70, rotZ:  5.8, w: 145, h: 155 },
  { x:  -55, y:  185, rotZ: -3.8, w: 180, h: 148 },
  { x:  130, y:  205, rotZ:  6.3, w: 148, h: 160 },
];

// ── Paloma ingredient void positions (TileSlot x/y = offset from AutoGallery centre 201/420) ──
const PALOMA_VOID_POSITIONS = [
  { x:  -90, y: -175, rotZ: -5.5, w: 178, h: 160 },   // grapefruit
  { x:  140, y: -135, rotZ:  4.2, w: 152, h: 172 },   // lime
  { x: -158, y:   18, rotZ: -7.0, w: 158, h: 142 },   // agave nectar
  { x:  122, y:   75, rotZ:  5.8, w: 148, h: 158 },   // cilantro
  { x:  -52, y:  190, rotZ: -3.8, w: 182, h: 150 },   // club soda
];

const PALOMA_ITEMS = [
  { src: imgPalomaGrapefruit, label: "Grapefruit",   tagColor: "#E5311C" },
  { src: imgPalomaLime,       label: "Lime",          tagColor: "#4AB856" },
  { src: imgPalomaAgave,      label: "Agave Nectar",  tagColor: "#C8820A" },
  { src: imgPalomaCilantro,   label: "Cilantro",      tagColor: "#27AE60" },
  { src: imgPalomaClubSoda,   label: "Club Soda",     tagColor: "#E06020" },
] as const;

// ── Flavor suggest — just the "Happy?" button overlay; tiles live in AutoGallery tileSlots ──
function FlavorSuggest({ onConfirm }: { onConfirm: () => void }) {
  return (
    <motion.div
      key="flavor-suggest"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <motion.button
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.35, delay: 0.6 }}
        onClick={onConfirm}
        style={{
          position: "absolute", bottom: 36, left: 28, right: 28,
          height: 52, borderRadius: 26, backgroundColor: "white",
          border: "none", cursor: "pointer", pointerEvents: "auto",
          fontFamily: "Spectral, serif", fontWeight: 500, fontSize: 18,
          color: "black", letterSpacing: -0.3,
        }}
      >
        Happy? →
      </motion.button>
    </motion.div>
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
  // Intro monologue gate — main flow stays frozen until intro completes
  const [introActive, setIntroActive]   = useState(true);
  // Video plays after intro
  const [videoActive, setVideoActive]   = useState(false);
  // Name entry after video
  const [nameActive, setNameActive]     = useState(false);
  const [playerName, setPlayerName]     = useState("");
  // Occasion chat — shown after name entry, before info-gather
  const [occasionActive, setOccasionActive] = useState(false);
  // Info-gather tap UI — shown after occasion, before main flow
  const [infoGatherActive, setInfoGatherActive] = useState(false);
  const [partyDetails, setPartyDetails] = useState<PartyDetails | null>(null);
  // AI-generated step text (e.g. cocktail reveal)
  const [aiGeneratedSteps, setAiGeneratedSteps] = useState<Record<number, string>>({});
  // Tap-to-start gate — must tap once to unlock AudioContext before intro voice plays
  const [tapToStart, setTapToStart]     = useState(true);
  const [inviteOpen, setInviteOpen]     = useState(false);
  const [selectedBottle, setSelectedBottle] = useState<string | null>(null);
  // Text input overlay
  const [typeInputOpen, setTypeInputOpen]   = useState(false);
  const [typeInputValue, setTypeInputValue] = useState("");
  // Real-time speech — shows words as user speaks (interim results)
  const [liveTranscript, setLiveTranscript] = useState("");

  const typeTimerRef          = useRef<ReturnType<typeof setTimeout> | null>(null);
  const thinkTimerRef         = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceTimerRef       = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Voice capture refs
  const recognitionRef        = useRef<any>(null);
  const voiceTranscriptRef    = useRef<string>("");
  // Flavour answers collector
  const flavourAnswersRef     = useRef<string[]>([]);
  // Mirror of selectedBottle for use in closures
  const selectedBottleRef     = useRef<string | null>(null);

  const clearType    = () => { if (typeTimerRef.current)    clearTimeout(typeTimerRef.current); };
  const clearThink   = () => { if (thinkTimerRef.current)   clearTimeout(thinkTimerRef.current); };
  const clearAdvance = () => { if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current); };
  const clearAll     = () => { clearType(); clearThink(); clearAdvance(); };

  const current     = STEPS[step];
  // Show AutoGallery for photo steps AND void steps (keyword, flavor-pick — tiles only, no photos)
  const showGallery =
    current.imgState === "full" ||
    current.imgState === "gatsby-reveal" ||
    current.imgState === "keyword-reveal";

  const COCKTAIL_GALLERY = [
    imgCocktailBitter, imgCocktailChilli, imgCocktailGrapefruit, imgCocktailHoney,
    imgCocktailLemon,  imgCocktailLime,   imgCocktailMint,        imgCocktailSour,
    imgCocktailSweet,  imgIngredientStrawberry, imgDrinkA,
  ];

  const currentGalleryImages =
    current.imgState === "gatsby-reveal"  ? GATSBY_COMBINED :
    current.imgState === "keyword-reveal" ? [] :
    PARTY_IMAGES;

  // Memoized so array reference stays stable — AutoGallery RAF effect depends on images
  const _memoAnchor = useMemo(() => currentGalleryImages, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // Memoized so array reference stays stable — AutoGallery RAF effect depends on images
  // and would cancel/restart (resetting all planes) if this was a new array each render
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
  // ── Keyword TileSlots — fly through the 3D void exactly like gallery cards ──
  if (current.imgState === "keyword-reveal") {
    const activeDefs = COCKTAIL_DEFS;
    activeDefs.forEach((def) => {
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

  // ── Flavor images are shown as image planes in AutoGallery (not tile slots) ──
  // Tile slots are only used for guests/time/date/ingredients/gatsby
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
    if (introActive || videoActive || nameActive || occasionActive || infoGatherActive) return;
    clearAll();
    stopSpeech();
    setAiDisplay(""); setIsAiTyping(false);
    setUserDisplay(""); setIsUserTyping(false);
    // Keep revealed keywords while we stay in the keyword-reveal void section
    if (current.imgState !== "keyword-reveal") setRevealedKeywords(new Set());
    setInviteOpen(false);
    setPhase("thinking");
    // Flavour Q1 needs the bottle choice before text is known
    if (step === 3 && !selectedBottle) return;
    // AI-generated steps wait until content arrives
    if (AI_STEPS.has(step) && !aiGeneratedSteps[step]) return;
    thinkTimerRef.current = setTimeout(() => setPhase("ai_typing"), step <= 2 ? 850 : 500);
    return clearThink;
  }, [step, introActive, videoActive, nameActive, occasionActive, infoGatherActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // When AI text arrives for an AI_STEPS step, kick off typing
  useEffect(() => {
    if (!AI_STEPS.has(step)) return;
    if (!aiGeneratedSteps[step]) return;
    if (phase !== "thinking") return;
    thinkTimerRef.current = setTimeout(() => setPhase("ai_typing"), 600);
    return clearThink;
  }, [aiGeneratedSteps, step, phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Safety net: if an AI step is stuck thinking for 7s, inject the fallback text
  useEffect(() => {
    if (!AI_STEPS.has(step)) return;
    if (aiGeneratedSteps[step]) return;
    if (phase !== "thinking") return;
    const id = setTimeout(() => {
      setAiGeneratedSteps(prev => {
        if (prev[step]) return prev; // already arrived, skip
        return { ...prev, [step]: resolveAiText(step, selectedBottle, {}) };
      });
    }, 7000);
    return () => clearTimeout(id);
  }, [step, phase, aiGeneratedSteps]); // eslint-disable-line react-hooks/exhaustive-deps

  // When bottle is selected, kick off typing on step 3
  useEffect(() => {
    if (step !== 3 || !selectedBottle) return;
    if (phase !== "thinking") return;
    thinkTimerRef.current = setTimeout(() => setPhase("ai_typing"), 600);
    return clearThink;
  }, [selectedBottle, step, phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync selectedBottle into a ref for use in closures
  useEffect(() => { selectedBottleRef.current = selectedBottle; }, [selectedBottle]);

  // ── Effect 2: stream AI text, then ready / autoAdvance / speechAdvance ──────
  useEffect(() => {
    if (introActive || videoActive || nameActive || occasionActive || infoGatherActive) return;
    if (phase !== "ai_typing") return;
    const text  = resolveAiText(step, selectedBottle, aiGeneratedSteps);
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

    const next = () => {
      if (cancelled) return;
      if (i >= text.length) {
        setIsAiTyping(false);
        if (s.speechAdvance) {
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
      const soFar = text.slice(0, i);
      const lastBreak = soFar.lastIndexOf("\n\n");
      const chunk = lastBreak >= 0 ? soFar.slice(lastBreak + 2) : soFar;
      if (chunk.trim()) setAiDisplay(chunk);
      const c = text[i - 1];
      let d = 50 + Math.random() * 12;
      if (c === "." || c === "!" || c === "?") d = 320;
      else if (c === ",") d = 130;
      else if (c === "\n") d = 220;
      typeTimerRef.current = setTimeout(next, d);
    };

    // Start typewriter only when audio actually begins playing (stays in sync)
    let typingStarted = false;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
    const startTyping = () => {
      if (typingStarted || cancelled) return;
      typingStarted = true;
      if (fallbackTimer) { clearTimeout(fallbackTimer); fallbackTimer = null; }
      next();
    };

    if (text.trim() && !s.noVoice) {
      unlockAudio();
      fallbackTimer = setTimeout(startTyping, 2500); // safety net if audio stalls
      if (s.speechAdvance) {
        speakText(text, startTyping).then(() => { voiceDone = true; tryAdvance(); });
      } else {
        speakText(text, startTyping);
      }
    } else {
      startTyping(); // no audio — start immediately
    }

    return () => {
      cancelled = true;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      clearType(); clearAdvance();
    };
  }, [phase, step, introActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Effect 4: transcribing → type user text → advance step ─────────────────
  useEffect(() => {
    if (phase !== "transcribing") return;
    const captured = voiceTranscriptRef.current;
    if (captured) voiceTranscriptRef.current = "";
    const uText = captured || STEPS[step]?.userText || "";

    setUserDisplay(""); setIsUserTyping(true);
    if (!uText) {
      setIsUserTyping(false);
      // Cocktail builder (step 0) requires real input — return to ready if empty
      if (step === 0) { setPhase("ready"); return; }
      advanceTimerRef.current = setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 300);
      return clearAdvance;
    }
    let cancelled = false;
    let j = 0;

    // After the user text finishes typing, decide what happens next
    const afterType = () => {
      setIsUserTyping(false);

      if (FLAVOUR_STEPS.has(step)) {
        flavourAnswersRef.current[step - 3] = uText;
        const bottle  = selectedBottleRef.current ?? "reposado";
        const answers = flavourAnswersRef.current.filter(Boolean).join("; ");

        if (step === 6) {
          // Last flavour question — generate ingredient roundup + cocktail reveal in parallel
          const roundupMsgs: ConvMessage[] = [{
            role: "user",
            content: `[System: The guest chose ${bottle}. Their flavour answers: ${answers}. List 4-5 key cocktail ingredients. Put each ingredient on its own line. Short, specific, one word or two. Then one punchy closing line (max 6 words). No cocktail name, no brand names. Stay in character as The Host — dry, cinematic.]`,
          }];
          const revealMsgs: ConvMessage[] = [{
            role: "user",
            content: `[System: The guest chose ${bottle}. Their flavour answers: ${answers}. Name their cocktail. First line: just the cocktail name. Then 2-3 short atmospheric lines. No product names or brand mentions. Stay in character as The Host — dry, cinematic.]`,
          }];
          Promise.all([hostChat(roundupMsgs), hostChat(revealMsgs)]).then(([roundup, reveal]) => {
            // Always store AI text (never block on cancelled — these steps need text to proceed)
            setAiGeneratedSteps(prev => ({
              ...prev,
              [ROUNDUP_STEP]: roundup || ROUNDUP_FALLBACK,
              [REVEAL_STEP]:  reveal  || COCKTAIL_REVEAL_FALLBACK,
            }));
            if (!cancelled) setStep(prev => Math.min(prev + 1, STEPS.length - 1));
          });
        } else {
          // Generate the next question in the background — avoids repeating what the user already said
          const nextStep = step + 1;
          const qMsgs: ConvMessage[] = [{
            role: "user",
            content: `[System: The guest chose ${bottle}. Their flavour answers so far: "${answers}". Ask ONE short follow-up question about their drink preferences. STRICT RULES: (1) Do NOT mention or echo any word or concept from their answers — if they said citrus, do not ask about citrus; if they said sweet, do not ask about sweet. (2) Explore a completely new angle not yet covered: heat/spice, bitterness, drink length, or finish. (3) Max 2 short sentences. Dry, cinematic. Stay in character as The Host.]`,
          }];
          const fallbacks: Record<number, string> = { 4: FLAVOUR_Q2_FALLBACK, 5: FLAVOUR_Q3_FALLBACK, 6: FLAVOUR_Q4_FALLBACK };
          hostChat(qMsgs).then(text => {
            // Always set — if empty use fallback; never leave an AI_STEPS step waiting forever
            setAiGeneratedSteps(prev => ({ ...prev, [nextStep]: text?.trim() || fallbacks[nextStep] }));
          });
          advanceTimerRef.current = setTimeout(() => setStep(s => Math.min(s + 1, STEPS.length - 1)), 520);
        }
        return;
      }

      advanceTimerRef.current = setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 520);
    };

    const next = () => {
      if (j >= uText.length) { afterType(); return; }
      j++;
      setUserDisplay(uText.slice(0, j));
      typeTimerRef.current = setTimeout(next, 30);
    };
    advanceTimerRef.current = setTimeout(next, 180);
    return () => { cancelled = true; clearType(); clearAdvance(); };
  }, [phase, step]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Effect 5: keyword-triggered image reveal ──────────────────────────────
  useEffect(() => {
    if (current.imgState !== "keyword-reveal") return;
    const defsToCheck = FLAVOUR_STEPS.has(step) || step === REVEAL_STEP ? COCKTAIL_DEFS : WESTERN_DEFS;
    // Flavour Q steps: only reveal from user words. Roundup + reveal: AI text also triggers.
    const combined = FLAVOUR_STEPS.has(step)
      ? userDisplay.toLowerCase()
      : aiDisplay.toLowerCase() + " " + userDisplay.toLowerCase();
    setRevealedKeywords((prev) => {
      let changed = false;
      const next = new Set(prev);
      for (const def of defsToCheck) {
        if (!next.has(def.keyword) && combined.includes(def.keyword)) { next.add(def.keyword); changed = true; }
      }
      return changed ? next : prev;
    });
  }, [aiDisplay, userDisplay, step, current.imgState]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Mic click ───────────────────────────────────────────────────────────────
  const handleMicClick = () => {
    unlockAudio();
    if (phase !== "ready") return;

    // Try Web Speech API (Chromium + Safari 15+)
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // No speech API — advance immediately with scripted fallback
      setStep((st) => Math.min(st + 1, STEPS.length - 1));
      return;
    }

    // Abort any lingering recognition session
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }

    voiceTranscriptRef.current = "";
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = true;   // show words in real-time
    recognition.maxAlternatives = 1;

    setPhase("recording");
    stopSpeech(); // stop any playing TTS while the user speaks

    recognition.onresult = (event: any) => {
      let interim = "";
      let final   = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      const live = final || interim;
      setLiveTranscript(live);
      if (final) voiceTranscriptRef.current = final;
    };

    recognition.onerror = () => {
      // Fall through to onend — voiceTranscriptRef stays empty → scripted fallback
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setLiveTranscript("");
      // Transition to transcribing whether or not we got a result
      setPhase((prev) => (prev === "recording" ? "transcribing" : prev));
    };

    recognition.start();
  };

  const handleTypeSubmit = () => {
    const text = typeInputValue.trim();
    if (!text) return;
    setTypeInputOpen(false);
    setTypeInputValue("");
    clearAll(); // stop any ongoing typewriter/timers
    voiceTranscriptRef.current = text;
    setPhase("transcribing");
  };

  const handleContinue = () => {
    if (current.view !== "email" || !lastEmail) return;
    const emailStep = step; // capture so double-tap can't advance past cart
    getSpeechPromise().then(() => setStep((s) => s === emailStep ? Math.min(s + 1, STEPS.length - 1) : s));
  };

  // Direct step jump for the "Continue with Apple Pay" button (bypasses mic cycle)
  const handleApplePay = () => {
    clearAll();
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBottleSelect = (id: string) => {
    setSelectedBottle(id);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const isThinking     = phase === "thinking";
  const isPaymentView  = current.view === "cart" || current.view === "apple-pay" || current.view === "cocktail2";
  const isBottleSelect = current.view === "bottle-select";

  return (
    <div style={{ position: "relative", width: 402, height: 874, backgroundColor: "#000", overflow: "hidden", borderRadius: 25, border: "4px solid white", boxSizing: "border-box", perspective: "700px" }}>

      {/* ── Audio-reactive gradient — always shown on chat steps, behind gallery */}
      <AnimatePresence>
        {current.view === "chat" && (
          <motion.div key="audio-gradient" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
            style={{ position: "absolute", inset: 0, zIndex: 0 }}
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
            <AutoGallery
              images={_memoAnchor}
              speed={1.8}
              visibleCount={7}
              tileSlots={tileSlots}
            />
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

      {/* ── Bottle selector (3-drink carousel) ──────────────────────────────────── */}
      <AnimatePresence>
        {isBottleSelect && (
          <motion.div key="bottle-select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
            style={{ position: "absolute", inset: 0, zIndex: 40 }}
          >
            <BottleSelector onSelect={handleBottleSelect} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cocktail Vid 2 (post-flavour builder, pre-night reveal) ─────────────── */}
      <AnimatePresence>
        {current.view === "cocktail2" && (
          <CocktailCard key="cocktail2" src={videoCocktail2} onComplete={() => setStep(s => Math.min(s + 1, STEPS.length - 1))} />
        )}
      </AnimatePresence>

      {/* ── Cart screen ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {current.view === "cart" && (
          <CartScreen key="cart" onApplePay={handleApplePay} guests={partyDetails?.guests ?? 6} />
        )}
      </AnimatePresence>

      {/* ── Apple Pay sheet ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {current.view === "apple-pay" && (
          <ApplePaySheet
            key="apple-pay"
            total={calcCartTotal(partyDetails?.guests ?? 6)}
            date={partyDetails?.date ?? "the night"}
            name={playerName || "Riley Jones"}
          />
        )}
      </AnimatePresence>

      {/* ── AI thinking dots ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isThinking && !isBottleSelect && <ThinkingDots key={`dots-${step}`} />}
      </AnimatePresence>

      {/* ── Ambient glow while AI types ──────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "ai_typing" && !isBottleSelect && (
          <motion.div key="glow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
            style={{ position: "absolute", left: "50%", top: current.aiY, transform: "translate(-50%,-50%)", width: 320, height: 120, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,0.045) 0%, transparent 70%)", pointerEvents: "none" }}
          />
        )}
      </AnimatePresence>

      {/* ── AI text (hidden on bottle-select and all overlay screens) ────────── */}
      <AnimatePresence mode="wait">
        {!isThinking && aiDisplay && !isBottleSelect && !isPaymentView && !introActive && !videoActive && !nameActive && !occasionActive && !infoGatherActive && (
          <motion.div key={`ai-${step}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
            style={{ position: "absolute", left: "50%",
              ...(current.imgState === "keyword-reveal" && revealedKeywords.size > 0
                ? { top: 88, transform: "translateX(-50%)" }
                : { top: "50%", transform: "translate(-50%, -50%)" }),
              width: 300, textAlign: "center", zIndex: 20 }}
          >
            <p style={{ fontFamily: "Spectral, serif", fontWeight: current.fontVariant === "semibold-italic" ? 600 : 400, fontStyle: current.fontVariant === "semibold-italic" ? "italic" : "normal", fontSize: 24, color: "white", lineHeight: 1.15, letterSpacing: current.fontVariant === "semibold-italic" ? -0.48 : 0, margin: 0, whiteSpace: "pre-wrap" }}>
              <BlurText text={aiDisplay} isTyping={isAiTyping} />
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── User text bubble (live transcript while recording, then typed result) */}
      <AnimatePresence>
        {(userDisplay || liveTranscript) && !isPaymentView && !introActive && !videoActive && !nameActive && !occasionActive && !infoGatherActive && (
          <motion.div
            key="user-bubble"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.22 }}
            style={{ position: "absolute", bottom: 90, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 20 }}
          >
            <p style={{ fontFamily: "Spectral, serif", fontSize: 15, color: liveTranscript && !userDisplay ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.72)", lineHeight: 1.35, margin: 0, fontStyle: "italic", textAlign: "center", maxWidth: 300 }}>
              {liveTranscript && !userDisplay ? liveTranscript : <UserText text={userDisplay} />}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Step indicator pills — sit above the control bar ─────────────────── */}
      {!introActive && !videoActive && !nameActive && !occasionActive && !infoGatherActive && !isPaymentView && !isBottleSelect && (
        <div style={{ position: "absolute", bottom: 84, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4 }}>
          {STEPS.map((_, i) => (
            <motion.div key={i}
              animate={{ width: i === step ? 14 : 4, backgroundColor: i === step ? "#ffffff" : "rgba(255,255,255,0.22)" }}
              transition={{ duration: 0.3 }}
              style={{ height: 4, borderRadius: 2 }}
            />
          ))}
        </div>
      )}

      {/* ── Bottom control bar ───────────────────────────────────────────────── */}
      {!introActive && !videoActive && !nameActive && !occasionActive && !infoGatherActive && !isPaymentView && !isBottleSelect && (
        <div
          style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 18, zIndex: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* X button — abort / reset */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (phase === "recording") {
                try { recognitionRef.current?.abort(); } catch { /* ignore */ }
                recognitionRef.current = null;
                setPhase("ready");
              } else {
                setStep(0);
              }
            }}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "transparent", border: "1.5px dashed rgba(255,255,255,0.7)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <XIcon />
          </button>

          {/* Mic button — center */}
          <button
            onClick={(e) => { e.stopPropagation(); handleMicClick(); }}
            style={{ width: 56, height: 56, borderRadius: "50%", background: phase === "recording" ? "transparent" : "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "visible" }}
          >
            {phase === "recording" ? (
              <motion.div
                animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#cc2222", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <div style={{ width: 20, height: 28 }}><MicIcon color="white" /></div>
              </motion.div>
            ) : phase === "transcribing" ? (
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {[0, 1, 2].map((i) => (
                  <motion.div key={i}
                    style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#000" }}
                    animate={{ y: [-3, 3, -3], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.6, delay: i * 0.12, repeat: Infinity, ease: "easeInOut" }}
                  />
                ))}
              </div>
            ) : (
              <div style={{ width: 20, height: 28 }}><MicIcon color="black" /></div>
            )}
          </button>

          {/* Keyboard button — open text input */}
          <button
            onClick={(e) => { e.stopPropagation(); setTypeInputOpen(true); }}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "transparent", border: "1.5px dashed rgba(255,255,255,0.7)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <GridIcon />
          </button>
        </div>
      )}

      {/* ── Text input overlay ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {typeInputOpen && (
          <motion.div
            key="type-input"
            initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 200,
              background: "rgba(10,10,10,0.97)", borderRadius: "18px 18px 0 0",
              padding: "20px 16px 32px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                autoFocus
                value={typeInputValue}
                onChange={(e) => setTypeInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleTypeSubmit(); }}
                placeholder="Type your response…"
                style={{
                  flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 24, padding: "12px 18px", fontFamily: "Spectral, serif",
                  fontSize: 16, color: "white", outline: "none"
                }}
              />
              <button
                onClick={handleTypeSubmit}
                style={{
                  width: 44, height: 44, borderRadius: "50%", background: "white",
                  border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 14V4M9 4L4 9M9 4L14 9" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


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
            <IntroScreen onComplete={() => { setIntroActive(false); setVideoActive(true); }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Video overlay — plays after intro ─────────────────────────────────── */}
      <AnimatePresence>
        {videoActive && (
          <motion.div
            key="video-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0, zIndex: 190, borderRadius: 21 }}
          >
            <VideoScreen onComplete={() => { setVideoActive(false); setNameActive(true); }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Name entry — shown after video ────────────────────────────────────── */}
      <AnimatePresence>
        {nameActive && (
          <motion.div
            key="name-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0, zIndex: 180, borderRadius: 21 }}
          >
            <NameScreen onComplete={(name) => {
              setPlayerName(name);
              setNameActive(false);
              setOccasionActive(true);
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Occasion chat — shown after name entry ──────────────────────────────── */}
      <AnimatePresence>
        {occasionActive && !nameActive && (
          <motion.div
            key="occasion-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0, zIndex: 170, borderRadius: 21 }}
          >
            <OccasionScreen
              playerName={playerName}
              onComplete={() => {
                setOccasionActive(false);
                setInfoGatherActive(true);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Info-gather tap UI — shown after name entry, before main flow ────── */}
      <AnimatePresence>
        {infoGatherActive && !nameActive && (
          <motion.div
            key="info-gather-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0, zIndex: 150, borderRadius: 21 }}
          >
            <InfoGatherScreen
              playerName={playerName}
              onComplete={(details) => {
                unlockAudio();
                setPartyDetails(details);
                setInfoGatherActive(false);
                setStep(0);
              }}
            />
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
