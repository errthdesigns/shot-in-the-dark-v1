import React from "react";
import { motion } from "motion/react";
import imgTequila from "figma:asset/c53c7a45987dfc7eb6c4e7a8d3d99e4b06d4258b.png";
import imgLime from "figma:asset/ad1a6d3445d99ccf8e1db21ccbcdb6d9a41581d8.png";
import imgGrapefruit from "figma:asset/eb15f2ca8fa38722649c3aca5b016c8a354485e5.png";

interface CartScreenProps {
  onApplePay: () => void;
}

const BTN: React.CSSProperties = {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  width: 352,
  height: 40,
  backgroundColor: "#262626",
  borderRadius: 5,
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const BTN_LABEL: React.CSSProperties = {
  fontFamily: "Arial, sans-serif",
  fontWeight: 700,
  fontSize: 15,
  color: "white",
  letterSpacing: 0,
  lineHeight: "22px",
};

const ITEM_LABEL: React.CSSProperties = {
  fontFamily: "Arial, sans-serif",
  fontStyle: "italic",
  fontSize: 16,
  color: "#000",
  lineHeight: 1.3,
  margin: 0,
};

function EmojiItem({ emoji, label, top }: { emoji: string; label: string; top: number }) {
  return (
    <>
      <div style={{ position: "absolute", left: 24, top, width: 54, height: 54, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
        {emoji}
      </div>
      <p style={{ ...ITEM_LABEL, position: "absolute", left: 96, top: top + 17 }}>{label}</p>
    </>
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
        overflow: "hidden",
      }}
    >
      {/* ── Drag handle ── */}
      <div style={{ position: "absolute", left: "50%", top: 11, transform: "translateX(-50%)", width: 60, height: 4 }}>
        <svg width="64" height="4" fill="none" viewBox="0 0 64 4" style={{ display: "block", width: "100%", height: "100%" }}>
          <path d="M2 2H62" stroke="#DEDFDC" strokeLinecap="round" strokeWidth="4" />
        </svg>
      </div>

      {/* ── URL bar ── */}
      <p style={{ position: "absolute", left: "50%", top: 29, transform: "translateX(-50%)", fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 16, color: "#000", lineHeight: "1.1", margin: 0, whiteSpace: "nowrap" }}>
        xxx.com/cart
      </p>

      {/* ── Your Cart header ── */}
      <p style={{ position: "absolute", left: 24, top: 68, fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 20, color: "#0d0d0d", lineHeight: "32px", margin: 0, whiteSpace: "nowrap" }}>
        Your Cart
      </p>

      {/* ── Tequila bottle (with image) ── */}
      <div style={{ position: "absolute", left: 24, top: 118, width: 54, height: 90, overflow: "hidden", pointerEvents: "none" }}>
        <img alt="" src={imgTequila} style={{ position: "absolute", height: "113.56%", left: "-28.4%", maxWidth: "none", top: "-6.1%", width: "158.58%" }} />
      </div>
      <p style={{ ...ITEM_LABEL, position: "absolute", left: 96, top: 155 }}>Reposado Tequila</p>

      {/* ── Orange Bitters ── */}
      <EmojiItem emoji="🍊" label="Orange Bitters" top={222} />

      {/* ── Lime (with image) ── */}
      <div style={{ position: "absolute", left: 24, top: 286, width: 54, height: 40, overflow: "hidden", pointerEvents: "none" }}>
        <img alt="" src={imgLime} style={{ position: "absolute", height: "166.27%", left: "-12.1%", maxWidth: "none", top: "-39.02%", width: "135.03%" }} />
      </div>
      <p style={{ ...ITEM_LABEL, position: "absolute", left: 96, top: 300 }}>Lime</p>

      {/* ── Dark Chocolate ── */}
      <EmojiItem emoji="🍫" label="Dark Chocolate Shavings" top={346} />

      {/* ── Chilli Powder ── */}
      <EmojiItem emoji="🌶️" label="Chilli Powder" top={410} />

      {/* ── Grapefruit (with image) ── */}
      <div style={{ position: "absolute", left: 24, top: 470, width: 54, height: 52, overflow: "hidden", pointerEvents: "none" }}>
        <img alt="" src={imgGrapefruit} style={{ position: "absolute", height: "127.45%", left: "-41.18%", maxWidth: "none", top: "-12.75%", width: "182.36%" }} />
      </div>
      <p style={{ ...ITEM_LABEL, position: "absolute", left: 96, top: 490 }}>Grapefruit</p>

      {/* ── Alibi (complimentary joke item) ── */}
      <div style={{ position: "absolute", left: 24, top: 534, width: 54, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🎭</div>
      <p style={{ ...ITEM_LABEL, position: "absolute", left: 96, top: 542, fontStyle: "italic", color: "#555" }}>
        One Alibi{"\n"}
        <span style={{ fontSize: 11, color: "#aaa", fontStyle: "normal" }}>complimentary — don't ask questions</span>
      </p>

      {/* ── Separator ── */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 596, height: 1, backgroundColor: "#e5e5e5" }} />

      {/* ── TOTAL row ── */}
      <p style={{ position: "absolute", left: 21, top: 616, fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 20, color: "#0d0d0d", lineHeight: "32px", margin: 0, whiteSpace: "nowrap" }}>
        TOTAL
      </p>
      <p style={{ position: "absolute", right: 21, top: 616, fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 20, color: "#0d0d0d", lineHeight: "32px", margin: 0, whiteSpace: "nowrap" }}>
        $0.00
      </p>

      {/* ── Checkout button ── */}
      <button style={{ ...BTN, top: 672 }}>
        <span style={BTN_LABEL}>Checkout</span>
      </button>

      {/* ── Continue with Apple Pay button ── */}
      <button onClick={onApplePay} style={{ ...BTN, top: 722 }}>
        <span style={BTN_LABEL}>Continue with Apple Pay</span>
      </button>
    </motion.div>
  );
}
