import { useRef } from "react";
import { motion } from "motion/react";
import videoIntro from "../../assets/Untitled (79).mp4";

interface Props { onComplete: () => void; }

export function VideoScreen({ onComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const skip = () => {
    if (videoRef.current) videoRef.current.pause();
    onComplete();
  };

  return (
    <div
      style={{
        position: "absolute", inset: 0,
        backgroundColor: "#000",
        borderRadius: 21,
        overflow: "hidden",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        controlsList="nodownload"
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          maxWidth: "none",
        }}
        src={videoIntro}
        onEnded={onComplete}
      />

      {/* Subtle top + bottom gradient to keep the phone chrome clean */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 18%, transparent 75%, rgba(0,0,0,0.6) 100%)",
      }} />

      {/* Tap anywhere to skip */}
      <div
        onClick={skip}
        style={{
          position: "absolute", inset: 0,
          cursor: "pointer",
          zIndex: 10,
        }}
      />

      {/* Skip hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 2, duration: 1.2 }}
        style={{
          position: "absolute", bottom: 22, left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "Inter, sans-serif",
          fontSize: 9,
          color: "white",
          letterSpacing: 2.8,
          margin: 0,
          textTransform: "uppercase",
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        Tap to skip
      </motion.p>
    </div>
  );
}
