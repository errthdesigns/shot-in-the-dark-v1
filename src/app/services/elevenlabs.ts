// ElevenLabs TTS – speakText(), stopSpeech(), unlockAudio()
const VOICE_ID = "4YYIPFl9wE5c4L2eu2Gb";
const API_KEY  = "sk_aab8f6f9a28033a376b068526a4155aa68ef9136b3a52168";
const SILENT_WAV = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
let _el: HTMLAudioElement | null = null;
let _blobUrl: string | null = null;
let _gen = 0;
let _abort: AbortController | null = null;
let _resolve: (() => void) | null = null;
let _audioCtx: AudioContext | null = null;
let _analyser: AnalyserNode | null = null;

function getEl(): HTMLAudioElement {
  if (!_el) { _el = new Audio(); _el.crossOrigin = "anonymous"; }
  return _el;
}

function ensureAnalyser(): void {
  if (_analyser) return;
  try {
    const el = getEl();
    _audioCtx = new AudioContext();
    _analyser = _audioCtx.createAnalyser();
    _analyser.fftSize = 128;
    _analyser.smoothingTimeConstant = 0.82;
    const src = _audioCtx.createMediaElementSource(el);
    src.connect(_analyser);
    _analyser.connect(_audioCtx.destination);
  } catch (e) {
    console.warn("[EL] analyser setup failed", e);
  }
}

export function getAnalyser(): AnalyserNode | null {
  return _analyser;
}
function revokeCurrent() {
  if (_blobUrl) { URL.revokeObjectURL(_blobUrl); _blobUrl = null; }
}
export function unlockAudio(): void {
  const el = getEl(); el.src = SILENT_WAV; el.volume = 0; el.play().catch(() => {});
}
export function stopSpeech(): void {
  _gen++;
  if (_abort) { _abort.abort(); _abort = null; }
  const el = getEl(); el.onended = null; el.onerror = null; el.pause(); el.src = ""; revokeCurrent();
  if (_resolve) { _resolve(); _resolve = null; }
}
export async function speakText(text: string): Promise<void> {
  if (!text.trim()) return;
  ensureAnalyser();
  stopSpeech();
  const myGen = _gen;
  const controller = new AbortController();
  _abort = controller;
  return new Promise<void>(async (resolve) => {
    _resolve = resolve;
    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: "POST", signal: controller.signal,
        headers: { "xi-api-key": API_KEY, "Content-Type": "application/json", Accept: "audio/mpeg" },
        body: JSON.stringify({ text, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.82, similarity_boost: 0.90, style: 0.0, use_speaker_boost: true } }),
      });
      if (_gen !== myGen) { resolve(); return; }
      if (!res.ok) { console.error("[EL] HTTP", res.status); resolve(); _resolve = null; return; }
      const blob = await res.blob();
      if (_gen !== myGen) { resolve(); return; }
      const url = URL.createObjectURL(blob); _blobUrl = url;
      const el = getEl(); el.volume = 1; el.src = url;
      el.onended = () => { if (_gen !== myGen) return; resolve(); _resolve = null; };
      el.onerror = () => { if (_gen !== myGen) return; resolve(); _resolve = null; };
      await el.play();
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("[EL] error:", err);
      if (_gen === myGen) { resolve(); _resolve = null; }
    }
  });
}
