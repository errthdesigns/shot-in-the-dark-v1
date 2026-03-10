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
      <p style={{ position: "absolute", left: 24, top: 90, fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 20, color: "#0d0d0d", lineHeight: "32px", margin: 0, whiteSpace: "nowrap" }}>
        Your Cart
      </p>

      {/* ── Tequila bottle ── */}
      <div style={{ position: "absolute", left: 24, top: 162, width: 72, height: 126, overflow: "hidden", pointerEvents: "none" }}>
        <img alt="" src={imgTequila} style={{ position: "absolute", height: "113.56%", left: "-28.4%", maxWidth: "none", top: "-6.1%", width: "158.58%" }} />
      </div>

      {/* ── Lime ── */}
      <div style={{ position: "absolute", left: 24, top: 328, width: 99, height: 53, overflow: "hidden", pointerEvents: "none" }}>
        <img alt="" src={imgLime} style={{ position: "absolute", height: "166.27%", left: "-12.1%", maxWidth: "none", top: "-39.02%", width: "135.03%" }} />
      </div>

      {/* ── Grapefruit ── */}
      <div style={{ position: "absolute", left: 24, top: 424, width: 75, height: 71, overflow: "hidden", pointerEvents: "none" }}>
        <img alt="" src={imgGrapefruit} style={{ position: "absolute", height: "127.45%", left: "-41.18%", maxWidth: "none", top: "-12.75%", width: "182.36%" }} />
      </div>

      {/* ── Item labels ── */}
      <p style={{ position: "absolute", left: 132, top: 225, width: 187, fontFamily: "Arial, sans-serif", fontStyle: "italic", fontSize: 18, color: "#000", lineHeight: 1.4, margin: 0 }}>
        Reposado Tequlia
      </p>
      <p style={{ position: "absolute", left: 132, top: 345, width: 140, fontFamily: "Arial, sans-serif", fontStyle: "italic", fontSize: 18, color: "#000", lineHeight: 1.4, margin: 0 }}>
        Lime
      </p>
      <p style={{ position: "absolute", left: 132, top: 455, width: 140, fontFamily: "Arial, sans-serif", fontStyle: "italic", fontSize: 18, color: "#000", lineHeight: 1.4, margin: 0 }}>
        Grapefruit
      </p>

      {/* ── Separator ── */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 535, height: 1, backgroundColor: "#e5e5e5" }} />

      {/* ── TOTAL row ── */}
      <p style={{ position: "absolute", left: 21, top: 558, fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 20, color: "#0d0d0d", lineHeight: "32px", margin: 0, whiteSpace: "nowrap" }}>
        TOTAL
      </p>
      <p style={{ position: "absolute", right: 21, top: 558, fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 20, color: "#0d0d0d", lineHeight: "32px", margin: 0, whiteSpace: "nowrap" }}>
        $82.99
      </p>

      {/* ── Checkout button ── */}
      <button style={{ ...BTN, top: 620 }}>
        <span style={BTN_LABEL}>Checkout</span>
      </button>

      {/* ── Continue with Apple Pay button ── */}
      <button onClick={onApplePay} style={{ ...BTN, top: 672 }}>
        <span style={BTN_LABEL}>Continue with Apple Pay</span>
      </button>
    </motion.div>
  );
}
