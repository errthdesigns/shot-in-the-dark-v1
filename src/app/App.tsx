import { useState, useEffect } from "react";
import { PartyPlannerScreen } from "./components/PartyPlannerScreen";

export default function App() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () => {
      const s = Math.min(window.innerWidth / 410, window.innerHeight / 882);
      setScale(Math.min(s, 1));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return (
    <div style={{ minHeight: "100dvh", backgroundColor: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ transformOrigin: "center center", transform: `scale(${scale})` }}>
        <PartyPlannerScreen />
      </div>
    </div>
  );
}
