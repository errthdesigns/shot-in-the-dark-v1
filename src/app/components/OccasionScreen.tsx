import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { speakText, stopSpeech, unlockAudio } from "../services/elevenlabs";
import { hostChat, ConvMessage } from "../services/claude";
import { AudioReactiveGradient } from "./AudioReactiveGradient";
import svgMicPaths from "../../imports/svg-p5gailxsrc";

// ── The Host — murder mystery casting ────────────────────────────────────────
const HOST_SYSTEM = `You are The Host. You run murder mystery parties. That's all you do. You are not a party planner. You don't ask about food, venues, or vibes.

Your job: get to know the guests before they arrive so you can cast them perfectly.
You do this by interrogating the user — casually, with authority. You're building a picture of their group. Once you have enough, you assign characters, suggest costumes, and flag props they might already own.

Start by asking about the occasion — is it a birthday (milestone?), a casual night, a celebration? React to their answer before moving on.

What you ask about next:
- Who they are (personalities — the loud one, the overthinker, the one who always ends up looking suspicious)
- What people are likely to wear / what they already own at home
- Whether anyone has anything useful — a fur coat, a cane, a dramatic hat, goblets

When someone mentions what they're wearing or something they own, react to it immediately and assign a role:
"A new dress? You suit the role of the Heiress. Obviously."
"A velvet blazer already in the wardrobe. That's the Detective sorted."

What you do with everything:
- Match people to characters based on what you hear
- Make assignments feel inevitable — like you already knew
- Tease the narrative without revealing the mystery
- Flag props with specificity ("Do you have any candlesticks? Actual ones.")

Tone: Dry. Specific. Confident. You don't ask two questions at once. You lead. You decide. The user confirms.
3 short lines max per response. Line breaks between beats.`;

// After this many user answers, wrap up and transition
const MAX_TURNS = 4;

type OPhase = "fetching" | "ai_speaking" | "ready" | "recording" | "thinking";

interface Props {
  playerName: string;
  onComplete: (history: ConvMessage[]) => void;
}

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
      <line stroke="rgba(255,255,255,0.7)" strokeLinecap="round" x1="1.20711" x2="12.5" y1="0.5" y2="11.7929" />
      <line stroke="rgba(255,255,255,0.7)" strokeLinecap="round" transform="matrix(-0.707107 0.707107 0.707107 0.707107 12.5 0.5)" x1="0.5" x2="16.4706" y1="-0.5" y2="-0.5" />
    </svg>
  );
}

function KeyboardIcon() {
  return (
    <svg width="17" height="13" viewBox="0 0 19 14" fill="none">
      <rect x="0.5" y="0.5" width="18" height="13" rx="2.5" stroke="rgba(255,255,255,0.55)" />
      <line x1="4" y1="4.5" x2="15" y2="4.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="4" y1="7.5" x2="11" y2="7.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function Cursor() {
  return (
    <span style={{
      display: "inline-block", width: 2, height: "0.85em",
      backgroundColor: "rgba(255,255,255,0.8)", marginLeft: 3,
      verticalAlign: "text-bottom", animation: "blink 0.65s step-end infinite",
    }} />
  );
}

export function OccasionScreen({ playerName, onComplete }: Props) {
  const [phase, setPhase]             = useState<OPhase>("fetching");
  const [aiDisplay, setAiDisplay]     = useState("");
  const [isTyping, setIsTyping]       = useState(false);
  const [userDisplay, setUserDisplay] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [typeInputOpen, setTypeInputOpen]   = useState(false);
  const [typeInputValue, setTypeInputValue] = useState("");

  // history always starts with a user message so the API is happy
  const historyRef    = useRef<ConvMessage[]>([]);
  const pendingAiRef  = useRef<string>("");
  const cancelledRef  = useRef(false);
  const userTurnCount = useRef(0);
  const isDoneRef     = useRef(false);
  const recognitionRef     = useRef<any>(null);
  const voiceTranscriptRef = useRef<string>("");
  const typeInputRef = useRef<HTMLInputElement>(null);

  // ── Initial greeting ──────────────────────────────────────────────────────
  useEffect(() => {
    cancelledRef.current = false;

    // Keep this in history so subsequent calls start with a user message
    const initMsg: ConvMessage = {
      role: "user",
      content: `The guest's name is ${playerName}. Greet them briefly — just once, woven in naturally. Then ask what tonight is for. 2 lines max.`,
    };

    hostChat([initMsg], undefined, HOST_SYSTEM).then(raw => {
      if (cancelledRef.current) return;
      const greeting = raw || `${playerName}.\n\nWhat are we building tonight?`;
      // Store both sides so history always begins with a user message
      historyRef.current = [initMsg, { role: "assistant", content: greeting }];
      pendingAiRef.current = greeting;
      setPhase("ai_speaking");
    });

    return () => { cancelledRef.current = true; stopSpeech(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Typewriter + TTS whenever ai_speaking fires ───────────────────────────
  useEffect(() => {
    if (phase !== "ai_speaking") return;
    cancelledRef.current = false;
    const text = pendingAiRef.current;
    if (!text) return;

    setAiDisplay("");
    setIsTyping(true);

    const isLast = isDoneRef.current;
    const sp = speakText(text);
    if (isLast) {
      sp.then(() => { if (!cancelledRef.current) onComplete(historyRef.current); });
    }

    let i = 0;
    const tick = () => {
      if (cancelledRef.current) return;
      i++;
      const soFar = text.slice(0, i);
      const lastBreak = soFar.lastIndexOf("\n\n");
      setAiDisplay(lastBreak >= 0 ? soFar.slice(lastBreak + 2) : soFar);
      if (i < text.length) {
        const c = text[i - 1];
        const d = c === "." || c === "?" ? 240 : c === "," ? 100 : c === "\n" ? 0 : 32 + Math.random() * 18;
        setTimeout(tick, d);
      } else {
        setIsTyping(false);
        if (!isLast) {
          setTimeout(() => { if (!cancelledRef.current) setPhase("ready"); }, 650);
        }
      }
    };
    const t = setTimeout(tick, 50);
    return () => { cancelledRef.current = true; clearTimeout(t); };
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Focus text input ──────────────────────────────────────────────────────
  useEffect(() => {
    if (typeInputOpen) setTimeout(() => typeInputRef.current?.focus(), 80);
  }, [typeInputOpen]);

  // ── Handle user turn ──────────────────────────────────────────────────────
  const handleUserText = (uText: string) => {
    if (!uText.trim()) { setPhase("ready"); return; }
    cancelledRef.current = false;
    setUserDisplay(uText);
    setLiveTranscript("");
    userTurnCount.current += 1;

    const isLast = userTurnCount.current >= MAX_TURNS;
    isDoneRef.current = isLast;

    const userMsg: ConvMessage = { role: "user", content: uText };
    const msgs: ConvMessage[] = [
      ...historyRef.current,
      userMsg,
      ...(isLast ? [{
        role: "user" as const,
        content: "[System: You have enough. Give one dry, confident closing line — signal you know exactly what you're building. No question. 1–2 lines max.]",
      }] : []),
    ];

    setPhase("thinking");
    hostChat(msgs, undefined, HOST_SYSTEM).then(raw => {
      if (cancelledRef.current) return;
      const reply = raw || (isLast ? "Good.\n\nI have everything I need." : "Go on.");
      historyRef.current = [...historyRef.current, userMsg, { role: "assistant", content: reply }];
      pendingAiRef.current = reply;
      setUserDisplay("");
      setPhase("ai_speaking");
    });
  };

  // ── Voice ─────────────────────────────────────────────────────────────────
  const handleMic = () => {
    if (phase !== "ready") return;
    unlockAudio();
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setTypeInputOpen(true); return; }
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }
    voiceTranscriptRef.current = "";
    const rec = new SR();
    recognitionRef.current = rec;
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    setPhase("recording");
    rec.onresult = (e: any) => {
      let interim = "", final = "";
      for (let i = 0; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t; else interim += t;
      }
      voiceTranscriptRef.current = final || interim;
      setLiveTranscript(voiceTranscriptRef.current);
    };
    rec.onend = () => {
      recognitionRef.current = null;
      const txt = voiceTranscriptRef.current.trim();
      setLiveTranscript("");
      handleUserText(txt || "");
    };
    rec.onerror = () => { setPhase("ready"); setLiveTranscript(""); };
    rec.start();
  };

  const handleAbort = () => {
    if (phase === "recording") {
      try { recognitionRef.current?.abort(); } catch { /* ignore */ }
      recognitionRef.current = null;
      setPhase("ready");
    }
  };

  const submitType = () => {
    const val = typeInputValue.trim();
    setTypeInputOpen(false);
    setTypeInputValue("");
    handleUserText(val);
  };

  const micActive    = phase === "recording";
  const showThinking = phase === "fetching" || phase === "thinking";
  const showControls = phase === "ready" || phase === "recording";

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <AudioReactiveGradient />

      {/* Bottom red glow */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 400,
        background: "radial-gradient(ellipse 460px 400px at 50% 100%, rgba(151,21,26,0.52) 0%, rgba(151,21,26,0.14) 55%, transparent 75%)",
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* Thinking dots */}
      <AnimatePresence>
        {showThinking && (
          <motion.div key="dots"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", left: "50%", top: "42%", transform: "translate(-50%, -50%)", display: "flex", gap: 9, alignItems: "center", zIndex: 10 }}
          >
            {[0, 1, 2].map(i => (
              <motion.div key={i}
                style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.45)" }}
                animate={{ y: [-5, 5, -5], opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 0.75, delay: i * 0.14, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI text */}
      <AnimatePresence mode="wait">
        {!showThinking && aiDisplay && (
          <motion.div key="ai"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: "absolute", left: "50%", top: "42%", transform: "translate(-50%, -50%)", width: 300, textAlign: "center", zIndex: 10 }}
          >
            <p style={{ fontFamily: "Spectral, serif", fontWeight: 400, fontSize: 24, color: "white", lineHeight: 1.4, margin: 0, whiteSpace: "pre-wrap", letterSpacing: 0.1 }}>
              {aiDisplay}{isTyping && <Cursor />}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User reply — sits lower, italic, dimmer */}
      <AnimatePresence>
        {(userDisplay || liveTranscript) && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", bottom: 105, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 10 }}
          >
            <p style={{
              fontFamily: "Spectral, serif", fontSize: 15, fontStyle: "italic",
              color: liveTranscript && !userDisplay ? "rgba(255,255,255,0.38)" : "rgba(255,255,255,0.62)",
              margin: 0, textAlign: "center", maxWidth: 280, lineHeight: 1.4,
            }}>
              {liveTranscript && !userDisplay ? liveTranscript : userDisplay}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Controls: X | Mic | Keyboard ─────────────────────────────────────── */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", bottom: 28, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, zIndex: 50 }}
            onClick={e => e.stopPropagation()}
          >
            {/* X */}
            <button
              onClick={handleAbort}
              style={{ width: 36, height: 36, borderRadius: "50%", background: "transparent", border: "1.5px dashed rgba(255,255,255,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <XIcon />
            </button>

            {/* Mic — largest, centred */}
            <button
              onClick={handleMic}
              style={{ width: 56, height: 56, borderRadius: "50%", background: micActive ? "transparent" : "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {micActive ? (
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#cc2222", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <div style={{ width: 20, height: 28 }}><MicIcon color="white" /></div>
                </motion.div>
              ) : (
                <div style={{ width: 20, height: 28 }}><MicIcon color="black" /></div>
              )}
            </button>

            {/* Keyboard */}
            <button
              onClick={() => setTypeInputOpen(true)}
              style={{ width: 36, height: 36, borderRadius: "50%", background: "transparent", border: "1.5px dashed rgba(255,255,255,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <KeyboardIcon />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Type input overlay */}
      <AnimatePresence>
        {typeInputOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.94)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "16px 20px 36px", zIndex: 60 }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                ref={typeInputRef}
                type="text"
                value={typeInputValue}
                onChange={e => setTypeInputValue(e.target.value)}
                onKeyDown={e => e.key === "Enter" && typeInputValue.trim() && submitType()}
                placeholder="Type your answer…"
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: 6, fontFamily: "Spectral, serif", fontSize: 17, color: "white", caretColor: "#cc2222" }}
              />
              {typeInputValue.trim() && (
                <button onClick={submitType}
                  style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 11V3M7 3L3 7M7 3L11 7" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
              <button onClick={() => { setTypeInputOpen(false); setTypeInputValue(""); }}
                style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <line x1="1" y1="1" x2="9" y2="9" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="9" y1="1" x2="1" y2="9" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}
