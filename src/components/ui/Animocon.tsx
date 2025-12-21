import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface AnimoconProps {
  type?: "like" | "heart";
  size?: number;
}

export const Animocon = ({ type = "like", size = 24 }: AnimoconProps) => {
  const [isActive, setIsActive] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const handleClick = () => {
    setIsActive(true);
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 800);
    setTimeout(() => setIsActive(false), 1000);
  };

  return (
    <motion.div
      onClick={handleClick}
      className="relative inline-flex items-center justify-center cursor-pointer p-2"
      whileTap={{ scale: 0.8 }}
      style={{ width: size * 2, height: size * 2 }}
    >
      {/* Main emoji with bounce */}
      <motion.span
        className="text-2xl relative z-10"
        animate={
          isActive
            ? {
                scale: [1, 1.5, 1.2, 1],
                rotate: [0, -15, 15, -10, 10, 0],
              }
            : { scale: 1 }
        }
        transition={{ duration: 0.6, type: "tween" as const }}
      >
        {type === "like" ? "👍" : "❤️"}
      </motion.span>

      {/* Circular fill expanding */}
      <AnimatePresence>
        {showParticles && (
          <>
            {/* Filled circle expanding */}
            <motion.div
              className="absolute inset-0 rounded-full bg-yellow-400"
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-yellow-300"
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 3.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            />

            {/* Sparkles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                style={{ left: "50%", top: "50%" }}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * Math.PI * 2) / 12) * 40,
                  y: Math.sin((i * Math.PI * 2) / 12) * 40,
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ))}

            {/* Plus signs */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`plus-${i}`}
                className="absolute text-yellow-400 text-xs font-bold"
                style={{ left: "50%", top: "50%" }}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5, 0],
                  x: Math.cos((i * Math.PI * 2) / 4 + Math.PI / 4) * 50,
                  y: Math.sin((i * Math.PI * 2) / 4 + Math.PI / 4) * 50,
                  opacity: [1, 1, 0],
                  rotate: 360,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                +
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Global click feedback
export const GlobalClickFeedback = () => {
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
    []
  );

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("a, button, input, textarea, select")) {
        const id = Date.now();
        setClicks((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
        setTimeout(() => {
          setClicks((prev) => prev.filter((click) => click.id !== id));
        }, 1000);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {clicks.map((click) => (
          <div
            key={click.id}
            className="absolute"
            style={{ left: click.x - 20, top: click.y - 20 }}
          >
            <motion.div
              className="absolute text-5xl"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: [0, 1.3, 1], rotate: [-30, 15, 0] }}
              exit={{ scale: 0, y: -60, opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              👍
            </motion.div>

            {/* Filled circle */}
            <motion.div
              className="absolute w-10 h-10 rounded-full bg-yellow-400"
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />

            {/* Sparkles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full"
                style={{ left: 20, top: 20 }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * Math.PI * 2) / 8) * 45,
                  y: Math.sin((i * Math.PI * 2) / 8) * 45,
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
