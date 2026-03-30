import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { speakText, stopSpeech, unlockAudio } from "../services/elevenlabs";
import { hostChat, ConvMessage } from "../services/claude";
import { AudioReactiveGradient } from "./AudioReactiveGradient";
import svgMicPaths from "../../imports/svg-p5gailxsrc";

type OPhase = "fetching" | "greeting" | "ready" | "recording" | "confirming";

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

function Cursor() {
  return (
    <span style={{ display: "inline-block", width: 2, height: "0.85em", backgroundColor: "rgba(255,255,255,0.8)", marginLeft: 3, verticalAlign: "text-bottom", animation: "blink 0.65s step-end infinite" }} />
  );
}

export function OccasionScreen({ playerName, onComplete }: Props) {
  const [phase, setPhase]               = useState<OPhase>("fetching");
  const [aiDisplay, setAiDisplay]       = useState("");
  const [isTyping, setIsTyping]         = useState(false);
  const [userDisplay, setUserDisplay]   = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [typeInputOpen, setTypeInputOpen]   = useState(false);
  const [typeInputValue, setTypeInputValue] = useState("");

  const greetingRef  = useRef<string>("");
  const confirmRef   = useRef<string>("");
  const historyRef   = useRef<ConvMessage[]>([]);
  const cancelledRef = useRef(false);
  const recognitionRef     = useRef<any>(null);
  const voiceTranscriptRef = useRef<string>("");
  const typeInputRef = useRef<HTMLInputElement>(null);

  // ── Fetch greeting on mount ───────────────────────────────────────────────
  useEffect(() => {
    cancelledRef.current = false;
    const seedMsgs: ConvMessage[] = [{
      role: "user",
      content: `My name is ${playerName}. I want to plan a night. Address me by name naturally (not as the opener), then ask what kind of night we're building — is it a birthday, something fancy, a casual hangout? Be curious, dark, intriguing. 2-3 short lines max.`,
    }];
    hostChat(seedMsgs).then(raw => {
      if (cancelledRef.current) return;
      const greeting = raw || `${playerName}.\n\nSo — what are we building tonight?\n\nBirthday? Something fancy? Or are we keeping it loose?`;
      greetingRef.current = greeting;
      historyRef.current = [...seedMsgs, { role: "assistant", content: greeting }];
      setPhase("greeting");
    });
    return () => { cancelledRef.current = true; stopSpeech(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Typewriter + TTS for greeting / confirmation ──────────────────────────
  useEffect(() => {
    if (phase !== "greeting" && phase !== "confirming") return;
    cancelledRef.current = false;
    const text = phase === "greeting" ? greetingRef.current : confirmRef.current;
    if (!text) return;
    setIsTyping(true);

    if (phase === "greeting") {
      speakText(text);
    } else {
      // Confirming — advance to onComplete when audio finishes
      speakText(text).then(() => {
        if (!cancelledRef.current) onComplete(historyRef.current);
      });
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
        if (phase === "greeting") {
          setTimeout(() => { if (!cancelledRef.current) setPhase("ready"); }, 650);
        }
      }
    };
    const t = setTimeout(tick, 50);
    return () => { cancelledRef.current = true; clearTimeout(t); };
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Focus type input when it opens ───────────────────────────────────────
  useEffect(() => {
    if (typeInputOpen) setTimeout(() => typeInputRef.current?.focus(), 80);
  }, [typeInputOpen]);

  // ── Handle completed user response ───────────────────────────────────────
  const handleUserText = (uText: string) => {
    if (!uText.trim()) { setPhase("ready"); return; }
    cancelledRef.current = false;
    setUserDisplay(uText);
    setLiveTranscript("");

    const userMsg: ConvMessage = { role: "user", content: uText };
    const followMsgs: ConvMessage[] = [
      ...historyRef.current,
      userMsg,
      { role: "user", content: "[System: Give a brief 1-2 line confirmation — acknowledge the vibe, say you'll get it built. Don't repeat their words back literally. Dark, confident, in character. End by saying you need a few quick details.]" },
    ];
    hostChat(followMsgs).then(raw => {
      if (cancelledRef.current) return;
      const confirm = raw || "Perfect.\n\nLet me get a few details and we'll build it.";
      confirmRef.current = confirm;
      historyRef.current = [
        ...historyRef.current,
        userMsg,
        { role: "assistant", content: confirm },
      ];
      setAiDisplay("");
      setPhase("confirming");
    });
  };

  // ── Voice recording ───────────────────────────────────────────────────────
  const handleMic = () => {
    if (phase !== "ready") return;
    unlockAudio();
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setTypeInputOpen(true);
      return;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }
    voiceTranscriptRef.current = "";
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    setPhase("recording");

    recognition.onresult = (e: any) => {
      let interim = "", final = "";
      for (let i = 0; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      voiceTranscriptRef.current = final || interim;
      setLiveTranscript(voiceTranscriptRef.current);
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      const uText = voiceTranscriptRef.current.trim();
      setLiveTranscript("");
      handleUserText(uText);
    };
    recognition.onerror = () => { setPhase("ready"); setLiveTranscript(""); };
    recognition.start();
  };

  const submitType = () => {
    const val = typeInputValue.trim();
    setTypeInputOpen(false);
    setTypeInputValue("");
    handleUserText(val);
  };

  const micActive = phase === "recording";

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <AudioReactiveGradient />

      {/* Bottom glow */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 380, background: "radial-gradient(ellipse 460px 380px at 50% 100%, rgba(151,21,26,0.48) 0%, rgba(151,21,26,0.12) 55%, transparent 75%)", pointerEvents: "none", zIndex: 1 }} />

      {/* AI text / thinking dots */}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 310, textAlign: "center", zIndex: 5 }}>
        <AnimatePresence mode="wait">
          {phase === "fetching" && (
            <motion.div key="dots" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: "flex", gap: 9, alignItems: "center", justifyContent: "center" }}
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

          {(phase === "greeting" || phase === "confirming" || phase === "ready") && aiDisplay && (
            <motion.p key={phase + aiDisplay.slice(0, 12)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ fontFamily: "Spectral, serif", fontWeight: 400, fontSize: 24, color: "white", lineHeight: 1.35, margin: 0, letterSpacing: 0.1, whiteSpace: "pre-wrap" }}
            >
              {aiDisplay}
              {isTyping && <Cursor />}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* User response text */}
      <AnimatePresence>
        {(userDisplay || liveTranscript) && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", bottom: 95, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 10 }}
          >
            <p style={{ fontFamily: "Spectral, serif", fontSize: 15, color: liveTranscript && !userDisplay ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.68)", margin: 0, textAlign: "center", maxWidth: 280, fontStyle: "italic" }}>
              {liveTranscript && !userDisplay ? liveTranscript : userDisplay}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <AnimatePresence>
        {(phase === "ready" || phase === "recording") && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 22, alignItems: "center", zIndex: 40 }}
          >
            {/* Keyboard button */}
            <motion.button
              onClick={() => setTypeInputOpen(true)}
              style={{ width: 46, height: 46, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.08)", border: "1.5px dashed rgba(255,255,255,0.28)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg width="17" height="13" viewBox="0 0 19 14" fill="none">
                <rect x="0.5" y="0.5" width="18" height="13" rx="2.5" stroke="rgba(255,255,255,0.55)" />
                <line x1="4" y1="4.5" x2="15" y2="4.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="4" y1="7.5" x2="11" y2="7.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </motion.button>

            {/* Mic button */}
            <motion.button
              onClick={handleMic}
              animate={micActive ? { scale: [1, 1.08, 1], backgroundColor: "#cc2222" } : { backgroundColor: "white" }}
              transition={micActive ? { duration: 0.9, repeat: Infinity } : { duration: 0.2 }}
              style={{ width: 64, height: 64, borderRadius: "50%", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <div style={{ width: 22, height: 30 }}>
                <MicIcon color={micActive ? "white" : "black"} />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Type input overlay */}
      <AnimatePresence>
        {typeInputOpen && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.93)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "18px 22px 34px", zIndex: 60 }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input ref={typeInputRef}
                type="text" value={typeInputValue}
                onChange={e => setTypeInputValue(e.target.value)}
                onKeyDown={e => e.key === "Enter" && typeInputValue.trim() && submitType()}
                placeholder="Type your answer…"
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", borderBottom: "1px solid rgba(255,255,255,0.22)", paddingBottom: 6, fontFamily: "Spectral, serif", fontSize: 17, color: "white", caretColor: "#cc2222" }}
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
                style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <line x1="1" y1="1" x2="9" y2="9" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="9" y1="1" x2="1" y2="9" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round" />
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
