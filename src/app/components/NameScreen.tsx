import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { speakText, stopSpeech } from "../services/elevenlabs";
import { AudioReactiveGradient } from "./AudioReactiveGradient";
import svgMicPaths from "../../imports/svg-p5gailxsrc";

interface Props { onComplete: (name: string) => void; }

type Phase = "ai_typing" | "user_input" | "pun_typing" | "done";

const AI_QUESTION = "So, what do they call you?";
const VOICE_QUESTION = "So, what do they call you?";

// Mic icon inline (same as PartyPlannerScreen)
function MicIcon({ color = "white" }: { color?: string }) {
  return (
    <svg style={{ display: "block", width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 24.0714 33">
      <rect height="22.6854" rx="5.15519" stroke={color} strokeWidth="2.06462" width="10.3104" x="6.87606" y="1.03231" />
      <path d={svgMicPaths.p27f3cf60} stroke={color} strokeLinecap="round" strokeWidth="2.0625" />
      <line stroke={color} strokeLinecap="round" strokeWidth="2.0625" x1="11.6875" x2="11.6875" y1="29.2188" y2="31.9688" />
    </svg>
  );
}

function Cursor() {
  return (
    <span style={{
      display: "inline-block", width: 2, height: "0.85em",
      backgroundColor: "rgba(255,255,255,0.8)", marginLeft: 3,
      verticalAlign: "text-bottom",
      animation: "blink 0.65s step-end infinite",
    }} />
  );
}

export function NameScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("ai_typing");
  const [aiDisplay, setAiDisplay] = useState("");
  const [punDisplay, setPunDisplay] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [micActive, setMicActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelledRef = useRef(false);
  const recognitionRef = useRef<any>(null);

  // Phase 1: Type the AI question + speak it
  useEffect(() => {
    cancelledRef.current = false;
    setAiDisplay("");
    let i = 0;
    const text = AI_QUESTION;

    // Speak concurrently with typing
    speakText(VOICE_QUESTION);

    const tick = () => {
      if (cancelledRef.current) return;
      i++;
      setAiDisplay(text.slice(0, i));
      if (i < text.length) {
        const c = text[i - 1];
        const d = c === "?" ? 280 : c === "," ? 90 : 38;
        setTimeout(tick, d);
      } else {
        // Done typing — wait a beat then show input
        setTimeout(() => {
          if (!cancelledRef.current) setPhase("user_input");
        }, 600);
      }
    };
    setTimeout(tick, 200);

    return () => {
      cancelledRef.current = true;
      // Do NOT call stopSpeech() here — AnimatePresence keeps NameScreen mounted
      // for ~700ms exit animation, which would fire this cleanup and kill the
      // InfoGatherScreen's speakText() fetch that started at t=120ms.
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus the input when user_input phase starts
  useEffect(() => {
    if (phase === "user_input") {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [phase]);

  // Phase 3: After name submitted — type the pun + speak it
  useEffect(() => {
    if (phase !== "pun_typing") return;
    cancelledRef.current = false;
    const name = nameInput.trim().toUpperCase();
    const pun = `Alright... let's go ${name}.`;
    setPunDisplay("");

    speakText(pun).then(() => {
      if (!cancelledRef.current) {
        setTimeout(() => onComplete(nameInput.trim()), 500);
      }
    });

    let i = 0;
    const tick = () => {
      if (cancelledRef.current) return;
      i++;
      setPunDisplay(pun.slice(0, i));
      if (i < pun.length) {
        const c = pun[i - 1];
        const d = c === "." ? 260 : c === "," ? 90 : 32;
        setTimeout(tick, d);
      }
    };
    setTimeout(tick, 180);

    return () => { cancelledRef.current = true; };
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = () => {
    if (!nameInput.trim()) return;
    setPhase("pun_typing");
  };

  const handleMic = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { inputRef.current?.focus(); return; }

    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setMicActive(true);

    recognition.onresult = (event: any) => {
      const transcript = (event.results?.[0]?.[0]?.transcript ?? "").trim();
      if (transcript) {
        setNameInput(transcript);
        setTimeout(() => {
          setPhase("pun_typing");
        }, 200);
      }
    };
    recognition.onerror = () => { /* fall through to onend */ };
    recognition.onend = () => {
      recognitionRef.current = null;
      setMicActive(false);
    };
    recognition.start();
  };

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <AudioReactiveGradient />

      {/* Bottom red glow */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 380,
        background: "radial-gradient(ellipse 460px 380px at 50% 100%, rgba(151,21,26,0.55) 0%, rgba(151,21,26,0.15) 55%, transparent 75%)",
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* AI question text */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%, -50%)",
        width: 310, textAlign: "center", zIndex: 5,
      }}>
        <AnimatePresence mode="wait">
          {phase !== "pun_typing" && phase !== "done" && (
            <motion.p
              key="question"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                fontFamily: "Spectral, serif",
                fontWeight: 400,
                fontSize: 24,
                color: "white",
                lineHeight: 1.25,
                margin: 0,
                letterSpacing: 0.1,
              }}
            >
              {aiDisplay}
              {phase === "ai_typing" && <Cursor />}
            </motion.p>
          )}

          {phase === "pun_typing" && (
            <motion.p
              key="pun"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                fontFamily: "Spectral, serif",
                fontWeight: 400,
                fontSize: 24,
                color: "white",
                lineHeight: 1.25,
                margin: 0,
                letterSpacing: 0.1,
              }}
            >
              {punDisplay}
              <Cursor />
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Name input box — slides up when user_input phase */}
      <AnimatePresence>
        {phase === "user_input" && (
          <motion.div
            key="name-input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: 20, right: 20,
              top: 580,
              zIndex: 10,
            }}
          >
            {/* Input row */}
            <div style={{
              backgroundColor: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(151,21,26,0.7)",
              borderRadius: 10,
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              <input
                ref={inputRef}
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()}
                placeholder="Type your name…"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 16,
                  color: "white",
                  caretColor: "rgba(151,21,26,0.9)",
                }}
              />
              {nameInput.trim() && (
                <button onClick={submit} style={{ background: "white", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 11V3M7 3L3 7M7 3L11 7" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>

            {/* OR speak row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, justifyContent: "center" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.12)" }} />
              <span style={{ fontFamily: "Spectral, serif", fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>or</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.12)" }} />
            </div>

            {/* Mic button */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
              <motion.button
                onClick={handleMic}
                animate={micActive ? { scale: [1, 1.12, 1], backgroundColor: "#cc2222" } : { backgroundColor: "white" }}
                transition={micActive ? { duration: 0.9, repeat: Infinity } : { duration: 0.2 }}
                style={{ width: 56, height: 56, borderRadius: "50%", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <div style={{ width: 20, height: 28 }}>
                  <MicIcon color={micActive ? "white" : "black"} />
                </div>
              </motion.button>
            </div>
            <p style={{ textAlign: "center", fontFamily: "Spectral, serif", fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 8, letterSpacing: 0.5 }}>
              {micActive ? "Listening…" : "Tap to speak"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}
