import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Music } from "lucide-react";

export function HUD() {
  const [score, setScore] = useState(70);
  const [meteors, setMeteors] = useState(2);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const p = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      setScore(Math.round(70 + p * 250));
      setMeteors(Math.min(6, 2 + Math.floor(p * 5)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const level = Math.max(1, Math.floor(score / 100));

  return (
    <>
      <div className="pointer-events-auto fixed bottom-4 left-4 z-40 hidden font-mono text-xs sm:block">
        <div className="rounded-xl border border-[color:var(--neon-green)]/50 bg-black/70 p-3 text-[color:var(--neon-green)] backdrop-blur-md text-glow-green">
          <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-80">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--neon-green)]" />
            HUD · status: online
          </div>
          <div>Your Score: <span className="font-bold">{score}</span></div>
          <div>Your Level: <span className="font-bold">{level}</span></div>
          <div>Meteors Destroyed: <span className="font-bold">{meteors}/6</span></div>
          <div className="mt-2 h-1 w-44 overflow-hidden rounded-full bg-[color:var(--neon-green)]/20">
            <motion.div
              className="h-full bg-[color:var(--neon-green)]"
              animate={{ width: `${(meteors / 6) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => setPlaying((p) => !p)}
        className="pointer-events-auto fixed bottom-4 right-4 z-40 grid h-14 w-14 place-items-center rounded-full border border-[color:var(--neon-purple)]/60 bg-black/70 text-[color:var(--neon-purple)] backdrop-blur-md animate-pulse-ring"
        aria-label="Music"
      >
        <motion.div
          animate={playing ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 3, repeat: playing ? Infinity : 0, ease: "linear" }}
        >
          <Music className="h-5 w-5" />
        </motion.div>
        <span className="pointer-events-none absolute -top-7 right-0 hidden rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-mono text-[color:var(--neon-purple)] group-hover:block">
          {playing ? "PLAYING" : "MUTED"}
        </span>
      </button>
    </>
  );
}
