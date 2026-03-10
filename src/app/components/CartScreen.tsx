import React from "react";
import { motion } from "motion/react";
import imgTequila from "figma:asset/c53c7a45987dfc7eb6c4e7a8d3d99e4b06d4258b.png";
import imgLime from "figma:asset/ad1a6d3445d99ccf8e1db21ccbcdb6d9a41581d8.png";
import imgGrapefruit from "figma:asset/eb15f2ca8fa38722649c3aca5b016c8a354485e5.png";

interface CartScreenProps {
  onApplePay: () => void;
}

const ITEM_LABEL: React.CSSProperties = {
  fontFamily: "Arial, sans-serif",
  fontStyle: "italic",
  fontSize: 18,
  color: "#000",
  lineHeight: 1.3,
  margin: 0,
};

/** One row with an emoji icon */
function EmojiRow({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 18 }}>
      <div style={{ flexShrink: 0, width: 58, height: 58, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38 }}>
        {emoji}
      </div>
      <p style={ITEM_LABEL}>{label}</p>
    </div>
  );
}

export function CartScreen({ onApplePay }: CartScreenProps) {
  return (
    <motion.div
      key="cart-sheet"
      initial={{ y: 48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 48, opacity: 0 }}
      transition={{ duration: 0.52, ease: [0.32, 0.72, 0, 1] }}
      style={{
        position: "absolute",
        top: 120,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "white",
        borderRadius: "25px 25px 0 0",
        boxShadow: "0px -5px 25px 0px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Fixed header ── */}
      <div style={{ flexShrink: 0, padding: "0 24px" }}>
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 11, paddingBottom: 6 }}>
          <svg width="64" height="4" fill="none" viewBox="0 0 64 4">
            <path d="M2 2H62" stroke="#DEDFDC" strokeLinecap="round" strokeWidth="4" />
          </svg>
        </div>

        {/* URL bar */}
        <p style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 16, color: "#000", lineHeight: 1.1, margin: "0 0 10px", textAlign: "center", whiteSpace: "nowrap" }}>
          xxx.com/cart
        </p>

        {/* Your Cart */}
        <p style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 22, color: "#0d0d0d", lineHeight: "32px", margin: "0 0 8px" }}>
          Your Cart
        </p>
      </div>

      {/* ── Scrollable items area ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "6px 24px 0", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
        {/* Tequila bottle — image */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 18 }}>
          <div style={{ flexShrink: 0, width: 58, height: 80, overflow: "hidden" }}>
            <img
              alt=""
              src={imgTequila}
              style={{ position: "relative", height: "113.56%", left: "-16%", maxWidth: "none", top: "-6.1%", width: "134%" }}
            />
          </div>
          <p style={ITEM_LABEL}>Reposado Tequila</p>
        </div>

        <EmojiRow emoji="🍊" label="Orange Bitters" />

        {/* Lime — image */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 18 }}>
          <div style={{ flexShrink: 0, width: 58, height: 58, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img
              alt=""
              src={imgLime}
              style={{ width: 58, height: 58, objectFit: "cover", display: "block" }}
            />
          </div>
          <p style={ITEM_LABEL}>Lime</p>
        </div>

        <EmojiRow emoji="🍫" label="Dark Chocolate Shavings" />
        <EmojiRow emoji="🌶️" label="Chilli Powder" />

        {/* Grapefruit — image */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 18 }}>
          <div style={{ flexShrink: 0, width: 58, height: 58, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img
              alt=""
              src={imgGrapefruit}
              style={{ width: 58, height: 58, objectFit: "cover", display: "block" }}
            />
          </div>
          <p style={ITEM_LABEL}>Grapefruit</p>
        </div>

        {/* Alibi — joke item */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 18 }}>
          <div style={{ flexShrink: 0, width: 58, height: 58, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>
            🎭
          </div>
          <p style={{ ...ITEM_LABEL, color: "#555" }}>
            One Alibi{" "}
            <span style={{ fontSize: 12, color: "#aaa", fontStyle: "normal" }}>
              complimentary — don't ask questions
            </span>
          </p>
        </div>
      </div>

      {/* ── Fixed footer ── */}
      <div style={{ flexShrink: 0, padding: "0 24px 20px" }}>
        <div style={{ height: 1, backgroundColor: "#e5e5e5", marginBottom: 14 }} />

        {/* Total row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <p style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 20, color: "#0d0d0d", lineHeight: "32px", margin: 0 }}>TOTAL</p>
          <p style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 20, color: "#0d0d0d", lineHeight: "32px", margin: 0 }}>$0.00</p>
        </div>

        {/* Checkout */}
        <button style={{ width: "100%", height: 44, backgroundColor: "#262626", borderRadius: 5, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
          <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 15, color: "white" }}>Checkout</span>
        </button>

        {/* Apple Pay */}
        <button onClick={onApplePay} style={{ width: "100%", height: 44, backgroundColor: "#262626", borderRadius: 5, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 15, color: "white" }}>Continue with Apple Pay</span>
        </button>
      </div>
    </motion.div>
  );
}
