import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { speakText, stopSpeech, unlockAudio } from "../services/elevenlabs";
import { hostChat, ConvMessage } from "../services/claude";
import { AudioReactiveGradient } from "./AudioReactiveGradient";
import svgMicPaths from "../../imports/svg-p5gailxsrc";

// ── System prompt — reaction sentences only ───────────────────────────────────
const REACT_SYSTEM = `You are The Host. Dry. Specific. Confident.
Reply with ONE sentence only — max 12 words. No questions. No filler.
React to what the guest just told you. Make it feel inevitable.
Example: "A birthday. Good. Someone always takes that personally by the end of the night."`;

// ── Hardcoded beat scripts ────────────────────────────────────────────────────
const BEAT_1 =
  "Before we begin — what's the occasion?\n\nBirthday? Someone's finally leaving a job they hate? Or are you just looking for an excuse to make your friends feel guilty about something?";

const BEAT_2_QUESTION =
  "Now — tell me about the group.\n\nWho's the loud one? Who overthinks everything? And who, if you're being honest, already looks like they've done something wrong?";

const BEAT_3_QUESTION =
  "What are people planning to wear?\n\nAnd don't say 'whatever.' Someone always shows up in something dramatic without meaning to.";

const BEAT_3_VAGUE =
  "Go check if anyone owns a cane.\n\nOr goblets. Actual ones. You'd be surprised what changes when someone's holding a goblet.";

const BEAT_4_CLOSE =
  "Good. I have enough to work with.\n\nYou'll get your characters, your costumes, and your killer.\n\nI just need a few more details from you first — and then we begin.";

const COSTUME_KEYWORDS = /dress|blazer|coat|jacket|hat|cane|goblet|suit|gown|velvet|sequin|fur|feather|tux|heels|boots|cape|gloves|tiara/i;

// ── Helpers ───────────────────────────────────────────────────────────────────
async function getReaction(userText: string): Promise<string> {
  const msgs: ConvMessage[] = [{ role: "user", content: `Guest said: "${userText}". React in ONE dry sentence, max 12 words. Reference what they actually said. No questions.` }];
  const raw = (await hostChat(msgs, undefined, REACT_SYSTEM))?.trim();
  if (raw) return raw;

  // Fallback — always reference what they said
  const lower = userText.toLowerCase();
  if (/30th|thirtieth/.test(lower))       return "A 30th. Good. Milestones always bring something out in people.";
  if (/birthday|bday/.test(lower))        return "A birthday. Good. Someone always takes that personally by the end of the night.";
  if (/leaving|quit|resignation/.test(lower)) return "Leaving a job. There's always at least one person who cries.";
  if (/anniversary/.test(lower))          return "An anniversary. Good. The ones who've lasted always have something to prove.";
  if (/celebration|celebrate/.test(lower)) return "A celebration. Good. The best nights always start with an excuse.";
  if (/casual|chill|hangout/.test(lower)) return "A casual night. Sure. Those are the ones that go sideways.";
  return `${userText.charAt(0).toUpperCase() + userText.slice(0, 30)}. Good. I can work with that.`;
}

async function getRoleAssignment(userText: string): Promise<string> {
  const msgs: ConvMessage[] = [{
    role: "user",
    content: `Guest mentioned this clothing/prop: "${userText}". Assign ONE murder mystery character. Format exactly: "[Item]. [They're] the [Character]. That's not a suggestion." Max 12 words.`,
  }];
  const raw = (await hostChat(msgs, undefined, REACT_SYSTEM))?.trim();
  if (raw) return raw;

  // Fallback role assignments
  const lower = userText.toLowerCase();
  if (/sequin|sparkl|glitter/.test(lower)) return "A sequined dress. She's the Heiress. That's not a suggestion.";
  if (/velvet|blazer|suit/.test(lower))   return "A velvet blazer. He's the Detective. Obviously.";
  if (/fur|coat/.test(lower))             return "A fur coat. She's the Countess. It was always going to be her.";
  if (/hat|cap/.test(lower))              return "A dramatic hat. That's the Colonel. Decided.";
  return "Whatever they show up in — I'll make it work.";
}

// ── Component ────────────────────────────────────────────────────────────────
type OPhase = "idle" | "ai_speaking" | "ready" | "recording" | "thinking";

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
    <span style={{ display: "inline-block", width: 2, height: "0.85em", backgroundColor: "rgba(255,255,255,0.8)", marginLeft: 3, verticalAlign: "text-bottom", animation: "blink 0.65s step-end infinite" }} />
  );
}

export function OccasionScreen({ playerName, onComplete }: Props) {
  const [phase, setPhase]             = useState<OPhase>("idle");
  const [aiDisplay, setAiDisplay]     = useState("");
  const [isTyping, setIsTyping]       = useState(false);
  const [userDisplay, setUserDisplay] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [typeInputOpen, setTypeInputOpen]   = useState(false);
  const [typeInputValue, setTypeInputValue] = useState("");

  const historyRef    = useRef<ConvMessage[]>([]);
  const pendingAiRef  = useRef<string>("");
  const mountedRef    = useRef(true);
  const userTurnCount = useRef(0);
  const isDoneRef     = useRef(false);
  const recognitionRef     = useRef<any>(null);
  const voiceTranscriptRef = useRef<string>("");
  const typeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; stopSpeech(); };
  }, []);

  // ── Mount: show Beat 1 immediately — no API call ──────────────────────────
  useEffect(() => {
    const seedMsg: ConvMessage = { role: "user", content: `[Guest name: ${playerName}]` };
    historyRef.current = [seedMsg, { role: "assistant", content: BEAT_1 }];
    pendingAiRef.current = BEAT_1;
    const t = setTimeout(() => { if (mountedRef.current) setPhase("ai_speaking"); }, 120);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Typewriter + TTS ──────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "ai_speaking") return;
    let cancelled = false;
    const text = pendingAiRef.current.trim();
    if (!text) return;

    setIsTyping(true);

    const isLast = isDoneRef.current;
    const sp = speakText(text);
    if (isLast) {
      sp.then(() => { if (!cancelled && mountedRef.current) onComplete(historyRef.current); });
    }

    const finalDisplay = text.split("\n\n").map(p => p.trim()).filter(Boolean).pop() ?? text;

    let i = 0;
    const tick = () => {
      if (cancelled) return;
      i++;
      const soFar = text.slice(0, i);
      const lastBreak = soFar.lastIndexOf("\n\n");
      const chunk = lastBreak >= 0 ? soFar.slice(lastBreak + 2) : soFar;
      if (chunk.trim()) setAiDisplay(chunk);
      if (i < text.length) {
        const c = text[i - 1];
        const d = c === "." || c === "?" ? 480 : c === "," ? 200 : c === "\n" ? 0 : 68 + Math.random() * 20;
        setTimeout(tick, d);
      } else {
        setAiDisplay(finalDisplay);
        setIsTyping(false);
        if (!isLast) {
          setTimeout(() => { if (!cancelled && mountedRef.current) setPhase("ready"); }, 650);
        }
      }
    };
    const t = setTimeout(tick, 50);
    return () => { cancelled = true; clearTimeout(t); };
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (typeInputOpen) setTimeout(() => typeInputRef.current?.focus(), 80);
  }, [typeInputOpen]);

  // ── Build each beat with hardcoded script + one LLM reaction line ─────────
  const processTurn = async (uText: string, turn: number) => {
    setPhase("thinking");
    const userMsg: ConvMessage = { role: "user", content: uText };
    let reply = "";

    if (turn === 1) {
      // Beat 2: react to occasion + hardcoded group question
      const reaction = await getReaction(uText);
      if (!mountedRef.current) return;
      reply = reaction
        ? `${reaction}\n\n${BEAT_2_QUESTION}`
        : BEAT_2_QUESTION;

    } else if (turn === 2) {
      // Beat 3: react to group info + hardcoded costume question
      const reaction = await getReaction(uText);
      if (!mountedRef.current) return;
      reply = reaction
        ? `${reaction}\n\n${BEAT_3_QUESTION}`
        : BEAT_3_QUESTION;

    } else {
      // Beat 4: costume detection → role assignment or goblet line, then close
      isDoneRef.current = true;
      if (COSTUME_KEYWORDS.test(uText)) {
        const roleAssignment = await getRoleAssignment(uText);
        if (!mountedRef.current) return;
        reply = roleAssignment
          ? `${roleAssignment}\n\n${BEAT_4_CLOSE}`
          : `${BEAT_3_VAGUE}\n\n${BEAT_4_CLOSE}`;
      } else {
        reply = `${BEAT_3_VAGUE}\n\n${BEAT_4_CLOSE}`;
      }
    }

    historyRef.current = [...historyRef.current, userMsg, { role: "assistant", content: reply }];
    pendingAiRef.current = reply;
    setUserDisplay("");
    setPhase("ai_speaking");
  };

  const handleUserText = (uText: string) => {
    if (!uText.trim()) { setPhase("ready"); return; }
    setUserDisplay(uText);
    setLiveTranscript("");
    userTurnCount.current += 1;
    processTurn(uText, userTurnCount.current);
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
  const showThinking = phase === "thinking";
  const showControls = phase === "ready" || phase === "recording";

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <AudioReactiveGradient />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 400, background: "radial-gradient(ellipse 460px 400px at 50% 100%, rgba(151,21,26,0.52) 0%, rgba(151,21,26,0.14) 55%, transparent 75%)", pointerEvents: "none", zIndex: 1 }} />

      {/* Thinking dots */}
      <AnimatePresence>
        {showThinking && (
          <motion.div key="dots" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
          <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            style={{ position: "absolute", left: "50%", top: "42%", transform: "translate(-50%, -50%)", width: 300, textAlign: "center", zIndex: 10 }}
          >
            <p style={{ fontFamily: "Spectral, serif", fontWeight: 400, fontSize: 24, color: "white", lineHeight: 1.4, margin: 0, whiteSpace: "pre-wrap", letterSpacing: 0.1 }}>
              {aiDisplay}{isTyping && <Cursor />}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User reply */}
      <AnimatePresence>
        {(userDisplay || liveTranscript) && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", bottom: 105, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 10 }}
          >
            <p style={{ fontFamily: "Spectral, serif", fontSize: 15, fontStyle: "italic", color: liveTranscript && !userDisplay ? "rgba(255,255,255,0.38)" : "rgba(255,255,255,0.62)", margin: 0, textAlign: "center", maxWidth: 280, lineHeight: 1.4 }}>
              {liveTranscript && !userDisplay ? liveTranscript : userDisplay}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls: X | Mic | Keyboard */}
      <AnimatePresence>
        {showControls && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", bottom: 28, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, zIndex: 50 }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={handleAbort}
              style={{ width: 36, height: 36, borderRadius: "50%", background: "transparent", border: "1.5px dashed rgba(255,255,255,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <XIcon />
            </button>
            <button onClick={handleMic}
              style={{ width: 56, height: 56, borderRadius: "50%", background: micActive ? "transparent" : "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {micActive ? (
                <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#cc2222", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <div style={{ width: 20, height: 28 }}><MicIcon color="white" /></div>
                </motion.div>
              ) : (
                <div style={{ width: 20, height: 28 }}><MicIcon color="black" /></div>
              )}
            </button>
            <button onClick={() => setTypeInputOpen(true)}
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
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.94)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "16px 20px 36px", zIndex: 60 }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input ref={typeInputRef} type="text" value={typeInputValue}
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
