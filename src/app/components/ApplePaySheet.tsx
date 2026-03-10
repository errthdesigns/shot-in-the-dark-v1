import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { speakText } from "../services/elevenlabs";
import imgCard from "figma:asset/77ee3dd8aebd716db92dddc4d8a398ddcb374b8c.png";

const SF_PRO  = '"SF Pro", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif';
const SF_TEXT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif';
const INTER   = '"Inter", sans-serif';

export function ApplePaySheet() {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    speakText("You're all set. See you on the 26th of February.");
  };

  return (
    <motion.div
      key="apple-pay-sheet"
      initial={{ y: 52, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 52, opacity: 0 }}
      transition={{ duration: 0.48, ease: [0.32, 0.72, 0, 1] }}
      style={{
        position: "absolute",
        top: 310,
        left: 4,
        right: 5,
        bottom: 4,
        backgroundColor: "#ebebeb",
        borderRadius: "10px 10px 0 0",
        overflow: "hidden",
      }}
    >
      {/* ── NAV BAR ── top 0–64 ─────────────────────────────────────────────── */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 64 }}>
        <p style={{ position: "absolute", left: 16, top: 16, fontFamily: SF_PRO, fontWeight: 510, fontSize: 28, color: "#000", letterSpacing: 0.9, lineHeight: "normal", margin: 0 }}>
          Pay
        </p>
        <button
          style={{ position: "absolute", right: 16, top: 17, width: 30, height: 30, borderRadius: 15, backgroundColor: "rgba(118,118,128,0.12)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg width="12" height="12" fill="none" viewBox="0 0 12 12">
            <path d="M1.5 1.5L10.5 10.5M10.5 1.5L1.5 10.5" stroke="rgba(60,60,67,0.6)" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* ── APPLE CARD ROW ── top 68–137 ─────────────────────────────────────── */}
      <div style={{ position: "absolute", top: 68, left: 16, right: 16, height: 69, backgroundColor: "white", borderRadius: 12 }}>
        {/* Card icon */}
        <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 40, height: 26, overflow: "hidden", borderRadius: 3 }}>
          <img alt="" src={imgCard} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        {/* Card name */}
        <p style={{ position: "absolute", left: 68, top: 13, fontFamily: SF_PRO, fontSize: 17, color: "#000", lineHeight: "22px", margin: 0 }}>
          Apple Card
        </p>
        {/* Last 4 */}
        <p style={{ position: "absolute", left: 68, top: 35, fontFamily: SF_TEXT, fontSize: 15, color: "rgba(60,60,67,0.6)", lineHeight: "20px", margin: 0 }}>
          •••• 1234
        </p>
        {/* Chevron */}
        <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)" }}>
          <svg width="8" height="14" fill="none" viewBox="0 0 8 14">
            <path d="M1.5 1.5L6.5 7L1.5 12.5" stroke="rgba(60,60,67,0.4)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* ── SHIP TO ROW ── top 145–271 ───────────────────────────────────────── */}
      <div style={{ position: "absolute", top: 145, left: 16, right: 16, height: 116, backgroundColor: "white", borderRadius: 12 }}>
        {/* House icon */}
        <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, backgroundColor: "#f2f2f7", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path d="M3 9.5L10 3L17 9.5V18H13V13H7V18H3V9.5Z" stroke="#3C3C43" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        {/* Labels */}
        <p style={{ position: "absolute", left: 62, top: 10, fontFamily: SF_TEXT, fontSize: 15, color: "rgba(60,60,67,0.6)", lineHeight: "20px", margin: 0 }}>
          Ship to
        </p>
        <p style={{ position: "absolute", left: 62, top: 30, fontFamily: SF_TEXT, fontSize: 15, color: "#000", lineHeight: "20px", margin: 0 }}>
          Riley Jones
        </p>
        <p style={{ position: "absolute", left: 62, top: 52, fontFamily: SF_TEXT, fontSize: 14, color: "#000", lineHeight: "19px", margin: 0 }}>
          Flat 11, 90 Lexham Gardens
        </p>
        <p style={{ position: "absolute", left: 62, top: 71, fontFamily: SF_TEXT, fontSize: 14, color: "#000", lineHeight: "19px", margin: 0 }}>
          W8 6JQ, London, UK
        </p>
        {/* Chevron */}
        <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)" }}>
          <svg width="8" height="14" fill="none" viewBox="0 0 8 14">
            <path d="M1.5 1.5L6.5 7L1.5 12.5" stroke="rgba(60,60,67,0.4)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* ── TOP SEPARATOR ── top 277 ─────────────────────────────────────────── */}
      <div style={{ position: "absolute", top: 277, left: 0, right: 0, height: 1, backgroundColor: "#c6c6c8" }} />

      {/* ── PAY STORE + AMOUNT ── top 278–358 ───────────────────────────────── */}
      <div style={{ position: "absolute", top: 278, left: 0, right: 0, height: 80 }}>
        <p style={{ position: "absolute", left: 20, top: 12, fontFamily: SF_TEXT, fontSize: 15, color: "rgba(60,60,67,0.6)", lineHeight: "20px", margin: 0 }}>
          Pay Store
        </p>
        <p style={{ position: "absolute", left: 20, top: 30, fontFamily: INTER, fontWeight: 500, fontSize: 30, color: "#000", lineHeight: "normal", letterSpacing: 0.74, margin: 0 }}>
          $82.99
        </p>
        <div style={{ position: "absolute", right: 20, top: 38 }}>
          <svg width="8" height="14" fill="none" viewBox="0 0 8 14">
            <path d="M1.5 1.5L6.5 7L1.5 12.5" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* ── MID SEPARATOR ── top 358 ─────────────────────────────────────────── */}
      <div style={{ position: "absolute", top: 358, left: 0, right: 0, height: 1, backgroundColor: "#c6c6c8" }} />

      {/* ── CONFIRM / DONE AREA ── top 359–bottom ────────────────────────────── */}
      <div style={{ position: "absolute", top: 359, left: 0, right: 0, bottom: 0 }}>
        <AnimatePresence mode="wait">
          {!confirmed ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25 }}
              style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer" }}
              onClick={() => handleConfirm()}
            >
              {/* Double-press icon */}
              <div style={{ position: "relative", width: 36, height: 36 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 18, border: "1.5px solid #007AFF" }} />
                <svg width="16" height="22" fill="none" viewBox="0 0 16 26" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-58%)" }}>
                  <rect x="1" y="1" width="14" height="20" rx="3.5" stroke="#007AFF" strokeWidth="1.6" />
                  <line x1="8" y1="21" x2="8" y2="25" stroke="#007AFF" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <p style={{ fontFamily: SF_TEXT, fontSize: 15, color: "#000", lineHeight: "20px", margin: 0, textAlign: "center" }}>
                Confirm with Side Button
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#34C759", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="16" fill="none" viewBox="0 0 22 16">
                  <path d="M1.5 8L8 14.5L20.5 1.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p style={{ fontFamily: SF_TEXT, fontSize: 15, color: "#000", lineHeight: "20px", margin: 0, textAlign: "center" }}>
                Payment Confirmed
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Home indicator */}
        <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", width: 139, height: 5, borderRadius: 100, backgroundColor: "#000" }} />
      </div>
    </motion.div>
  );
}