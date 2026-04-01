import React from "react";
import { motion } from "motion/react";
import imgTequila from "../../assets/Reposado.png";
import imgLime from "../../assets/Lime.png";
import imgGrapefruit from "../../assets/Grapefruit.png";
import imgAgave from "../../assets/Agave.png";
import imgCilantro from "../../assets/Cilantro.png";

interface CartScreenProps {
  onApplePay: () => void;
  guests?: number;
}

// Per-unit prices
const P_TEQUILA    =  54.99; // 1 bottle per event
const P_GRAPEFRUIT =   1.99; // per guest
const P_LIME       =   0.99; // per guest
const P_AGAVE      =   4.99; // 1 bottle per event
const P_CILANTRO   =   1.99; // 1 bunch per event
const P_SERVICE    =  50.00; // cocktail experience per guest (~$60/head total)

/** Exported so PartyPlannerScreen can pass the same number to ApplePaySheet */
export function calcCartTotal(guests: number): number {
  return P_TEQUILA + guests * (P_GRAPEFRUIT + P_LIME + P_SERVICE) + P_AGAVE + P_CILANTRO;
}

const ITEM_LABEL: React.CSSProperties = {
  fontFamily: "Arial, sans-serif",
  fontStyle: "italic",
  fontSize: 18,
  color: "#000",
  lineHeight: 1.3,
  margin: 0,
};

const PRICE_LABEL: React.CSSProperties = {
  fontFamily: "Arial, sans-serif",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: 16,
  color: "#444",
  lineHeight: 1.3,
  margin: 0,
  marginLeft: "auto",
  flexShrink: 0,
};

function ImgRow({ src, imgStyle, label, price }: {
  src: string;
  imgStyle?: React.CSSProperties;
  label: string;
  price: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 18 }}>
      <div style={{ flexShrink: 0, width: 58, height: 58, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img alt="" src={src} style={{ width: 58, height: 58, objectFit: "cover", display: "block", ...imgStyle }} />
      </div>
      <p style={ITEM_LABEL}>{label}</p>
      <p style={PRICE_LABEL}>{price}</p>
    </div>
  );
}

export function CartScreen({ onApplePay, guests = 6 }: CartScreenProps) {
  const gfQty   = guests;
  const limeQty = guests;
  const total   = calcCartTotal(guests).toFixed(2);

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
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 11, paddingBottom: 6 }}>
          <svg width="64" height="4" fill="none" viewBox="0 0 64 4">
            <path d="M2 2H62" stroke="#DEDFDC" strokeLinecap="round" strokeWidth="4" />
          </svg>
        </div>
        <p style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 22, color: "#0d0d0d", lineHeight: "32px", margin: "0 0 8px" }}>
          Your Cart
        </p>
      </div>

      {/* ── Scrollable items ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "6px 24px 0", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>

        {/* Tequila bottle (1×) */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 18 }}>
          <div style={{ flexShrink: 0, width: 58, height: 80, overflow: "hidden" }}>
            <img alt="" src={imgTequila}
              style={{ position: "relative", height: "113.56%", left: "-16%", maxWidth: "none", top: "-6.1%", width: "134%" }}
            />
          </div>
          <p style={ITEM_LABEL}>Reposado Tequila <span style={{ fontSize: 13, color: "#aaa", fontStyle: "normal" }}>×1</span></p>
          <p style={PRICE_LABEL}>${P_TEQUILA.toFixed(2)}</p>
        </div>

        {/* Fresh Grapefruit (guests×) */}
        <ImgRow
          src={imgGrapefruit}
          label={`Fresh Grapefruit ×${gfQty}`}
          price={`$${(P_GRAPEFRUIT * gfQty).toFixed(2)}`}
        />

        {/* Fresh Lime (guests×) */}
        <ImgRow
          src={imgLime}
          label={`Fresh Lime ×${limeQty}`}
          price={`$${(P_LIME * limeQty).toFixed(2)}`}
        />

        {/* Agave Nectar (1×) */}
        <ImgRow
          src={imgAgave}
          label="Agave Nectar ×1"
          price={`$${P_AGAVE.toFixed(2)}`}
        />

        {/* Fresh Cilantro (1×) */}
        <ImgRow
          src={imgCilantro}
          label="Fresh Cilantro ×1"
          price={`$${P_CILANTRO.toFixed(2)}`}
        />

        {/* Cocktail Experience — per guest service fee */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 18 }}>
          <div style={{ flexShrink: 0, width: 58, height: 58, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
            🍹
          </div>
          <p style={ITEM_LABEL}>
            Cocktail Experience{" "}
            <span style={{ fontSize: 13, color: "#aaa", fontStyle: "normal" }}>×{guests}</span>
          </p>
          <p style={PRICE_LABEL}>${(P_SERVICE * guests).toFixed(2)}</p>
        </div>

        {/* One Alibi — complimentary */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 18 }}>
          <div style={{ flexShrink: 0, width: 58, height: 58, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>
            🎭
          </div>
          <p style={{ ...ITEM_LABEL, color: "#555", flex: 1 }}>
            One Alibi{" "}
            <span style={{ fontSize: 12, color: "#aaa", fontStyle: "normal" }}>
              complimentary — don't ask questions
            </span>
          </p>
          <p style={{ ...PRICE_LABEL, color: "#aaa" }}>$0.00</p>
        </div>
      </div>

      {/* ── Fixed footer ── */}
      <div style={{ flexShrink: 0, padding: "0 24px 20px" }}>
        <div style={{ height: 1, backgroundColor: "#e5e5e5", marginBottom: 14 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <p style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 20, color: "#0d0d0d", lineHeight: "32px", margin: 0 }}>TOTAL</p>
          <p style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 20, color: "#0d0d0d", lineHeight: "32px", margin: 0 }}>${total}</p>
        </div>
        <button onClick={onApplePay} style={{ width: "100%", height: 44, backgroundColor: "#262626", borderRadius: 5, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
          <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 15, color: "white" }}>Checkout</span>
        </button>
        <button onClick={onApplePay} style={{ width: "100%", height: 44, backgroundColor: "#262626", borderRadius: 5, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 15, color: "white" }}>Continue with Apple Pay</span>
        </button>
      </div>
    </motion.div>
  );
}
