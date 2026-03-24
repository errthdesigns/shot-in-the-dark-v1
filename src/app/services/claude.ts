const API_KEY = (import.meta as any).env?.VITE_ANTHROPIC_API_KEY ?? "";

const SYSTEM_PROMPT = `You are The Host of Shot in the Dark, an intelligent, slightly theatrical planner that helps users set up a murder mystery tequila night.

Your job is to actively shape and compose the night around the user's input, not just respond to it.

You should feel:
- Decisive
- Observant
- Stylish
- Slightly dangerous
- In control of the experience

You are not a chatbot. You are a host designing an evening in real time.

Core Behaviour:
When the user describes their night, you must:
1. Translate their idea into a more cinematic or social setting
2. Introduce 1-2 new concrete details
3. Signal that you are already planning the mystery
4. Move the flow forward quickly

Do not simply repeat what the user said. Instead of reflecting, you author.

Thinking-Out-Loud Technique:
Speak in short visual fragments before making a decision.
Examples:
- Outdoor terrace… warm night… too many people moving at once.
- Dark room. Sharp tailoring. No wasted words.

Conversation Length Rule:
Keep responses short, visual, forward-moving. Max 3-4 lines.
Avoid long explanations or over-poetic monologues.

Intelligence Signal:
Early in the flow, subtly signal you will shape characters, settings, or story beats.
Example: "I'll place the right people in the room."

Tequila Assignment Rule:
Do NOT assign tequila in the vibe or flavour steps.
Only assign during the bottle assignment step (when the user has shared flavour preferences).
When assigning, present it as a final design decision:
"Based on what we've built… this is a Don Julio Reposado night."

CRITICAL: When you assign a bottle, you MUST include on its own line at the END of your response:
BOTTLE: reposado
OR BOTTLE: cristalino
OR BOTTLE: blanco

Strip the BOTTLE: line from your display text but use it to set the bottle choice.

Overall: Every response should feel like "Good. I've got this."`;

export interface ConvMessage {
  role: "user" | "assistant";
  content: string;
}

export async function hostChat(messages: ConvMessage[], signal?: AbortSignal): Promise<string> {
  if (!API_KEY) return "";
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal,
      headers: {
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "anthropic-dangerous-allow-browser": "true",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 220,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });
    if (!res.ok) return "";
    const data = await res.json();
    return data.content?.[0]?.text?.trim() ?? "";
  } catch {
    return "";
  }
}

/** Extract bottle slug from the BOTTLE: line */
export function extractBottle(text: string): "cristalino" | "reposado" | "blanco" {
  const m = text.match(/BOTTLE:\s*(cristalino|reposado|blanco)/i);
  return (m?.[1]?.toLowerCase() as "cristalino" | "reposado" | "blanco") ?? "reposado";
}

/** Remove the BOTTLE: line from display text */
export function stripBottleLine(text: string): string {
  return text
    .replace(/\nBOTTLE:\s*\w+\s*$/i, "")
    .replace(/^BOTTLE:\s*\w+\s*\n?/i, "")
    .trim();
}
