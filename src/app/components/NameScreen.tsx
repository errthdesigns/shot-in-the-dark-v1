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
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelledRef = useRef(false);

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
      stopSpeech();
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
        position: "absolute", left: "50%", top: 200,
        transform: "translateX(-50%)",
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
              top: 688,
              zIndex: 10,
            }}
          >
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
                placeholder="Your name..."
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom bar: X · Mic · Grid — same style as main chat */}
      <div style={{
        position: "absolute", left: 107, top: 778, width: 45, height: 45,
        borderRadius: 22.5, border: "1px dashed #838383",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", zIndex: 10,
      }}>
        <svg style={{ display: "block", width: 12, height: 12 }} fill="none" viewBox="0 0 13 12.5">
          <line stroke="#838383" strokeLinecap="round" x1="1.20711" x2="12.5" y1="0.5" y2="11.7929" />
          <line stroke="#838383" strokeLinecap="round" transform="matrix(-0.707107 0.707107 0.707107 0.707107 12.5 0.5)" x1="0.5" x2="16.4706" y1="-0.5" y2="-0.5" />
        </svg>
      </div>

      {/* Mic / submit button */}
      <motion.button
        onClick={submit}
        disabled={phase !== "user_input" || !nameInput.trim()}
        style={{
          position: "absolute", left: 168, top: 767, width: 66, height: 66,
          borderRadius: 33, border: "none",
          cursor: phase === "user_input" && nameInput.trim() ? "pointer" : "default",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px 22px", boxSizing: "border-box", zIndex: 10,
        }}
        animate={{
          backgroundColor: phase === "user_input" && nameInput.trim()
            ? ["#383838", "#444", "#383838"]
            : "#383838",
        }}
        transition={phase === "user_input" && nameInput.trim()
          ? { duration: 2.2, repeat: Infinity }
          : {}
        }
        whileTap={phase === "user_input" && nameInput.trim() ? { scale: 0.88 } : {}}
      >
        <MicIcon />
      </motion.button>

      {/* Ready pulse ring */}
      <AnimatePresence>
        {phase === "user_input" && nameInput.trim() && (
          <motion.div
            key="ring"
            style={{
              position: "absolute", left: 160, top: 759,
              width: 82, height: 82, borderRadius: 41,
              border: "1.5px solid rgba(255,255,255,0.28)",
              pointerEvents: "none", zIndex: 9,
            }}
            animate={{ scale: [1, 1.55], opacity: [0.55, 0] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Grid button */}
      <div style={{
        position: "absolute", left: 250, top: 778, width: 45, height: 45,
        borderRadius: 22.5, border: "1px dashed #838383",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", zIndex: 10,
      }}>
        <div style={{ position: "relative", width: 19, height: 14 }}>
          {[0,5,10,15].map(l => [0,5,10].map(t => (
            <div key={`${l}-${t}`} style={{ position: "absolute", left: l, top: t, width: 4, height: 4, border: "0.5px solid #838383", borderRadius: 0.5 }} />
          )))}
          <div style={{ position: "absolute", left: 0, top: 10, width: 19, height: 2, border: "0.5px solid #838383", borderRadius: 0.5 }} />
        </div>
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}
