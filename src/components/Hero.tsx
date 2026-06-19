import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import astronaut from "@/assets/astronaut.png";

const roles = ["Frontend", "Backend", "Full Stack"];

function TypeCycle() {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = roles[i];
    const speed = deleting ? 60 : 110;
    const t = setTimeout(() => {
      if (!deleting && text === word) {
        setTimeout(() => setDeleting(true), 1400);
        return;
      }
      if (deleting && text === "") {
        setDeleting(false);
        setI((p) => (p + 1) % roles.length);
        return;
      }
      setText(word.slice(0, text.length + (deleting ? -1 : 1)));
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, i]);

  return (
    <span className="text-[color:var(--neon-green)] text-glow-green font-mono">
      {text}
      <span className="ml-1 inline-block h-[0.9em] w-[3px] translate-y-1 bg-[color:var(--neon-green)] animate-pulse" />
    </span>
  );
}

export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [10, -10]), { stiffness: 80, damping: 20 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-15, 15]), { stiffness: 80, damping: 20 });
  const tx = useSpring(useTransform(mx, [-1, 1], [-20, 20]), { stiffness: 60, damping: 20 });
  const ty = useSpring(useTransform(my, [-1, 1], [-12, 12]), { stiffness: 60, damping: 20 });

  return (
    <section
      id="home"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
        my.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      className="relative min-h-screen w-full overflow-hidden pt-28 pb-12"
    >
      <div className="grid-bg absolute inset-0 -z-10" />
      <div className="absolute left-1/2 top-1/3 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[color:var(--neon-purple)]/20 blur-[120px]" />

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--neon-purple)]/60 bg-[color:var(--neon-purple)]/10 px-4 py-1.5 text-sm font-medium text-[color:var(--neon-purple)] text-glow-purple"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[color:var(--neon-purple)]" />
            Hi, I'm Kunkey!
          </motion.div>

          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            A <TypeCycle />
            <br /> Web Developer<span className="text-[color:var(--neon-gold)]">_</span>
          </h1>

          <p className="mt-6 max-w-lg text-base text-foreground/70 md:text-lg">
            I craft immersive, performant web experiences from the cold vacuum of
            deep space. Mission control for ideas — shipped at light speed.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="rounded-xl bg-[color:var(--neon-gold)] px-5 py-3 font-semibold text-black glow-gold transition hover:scale-105"
            >
              Explore Projects
            </a>
            <a
              href="#contact"
              className="rounded-xl border border-[color:var(--neon-purple)]/60 px-5 py-3 font-semibold text-[color:var(--neon-purple)] text-glow-purple transition hover:bg-[color:var(--neon-purple)]/10"
            >
              Open Channel
            </a>
          </div>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-4 font-mono">
            {[
              ["50+", "Projects"],
              ["12+", "Certs"],
              ["3y", "Experience"],
            ].map(([n, l]) => (
              <div
                key={l}
                className="rounded-xl border border-[color:var(--neon-purple)]/30 bg-black/30 p-3 text-center backdrop-blur"
              >
                <div className="text-2xl font-bold text-[color:var(--neon-gold)]">{n}</div>
                <div className="text-xs uppercase tracking-wider text-foreground/60">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative flex h-[520px] items-center justify-center">
          <motion.div
            style={{ rotateX: rx, rotateY: ry, x: tx, y: ty }}
            className="relative"
          >
            <div className="absolute inset-0 -z-10 animate-spin-slow rounded-full border border-dashed border-[color:var(--neon-purple)]/40" style={{ width: 380, height: 380, left: -40, top: -40 }} />
            <div className="absolute inset-0 -z-10 rounded-full bg-[color:var(--neon-gold)]/15 blur-3xl" />
            <motion.img
              src={astronaut}
              alt="Floating astronaut mascot"
              width={300}
              height={300}
              className="animate-float-y h-[300px] w-[300px] drop-shadow-[0_0_40px_rgba(251,191,36,0.35)]"
            />
          </motion.div>

          {/* Root / fiber strands */}
          <motion.svg
            style={{ x: useTransform(mx, [-1, 1], [15, -15]), y: useTransform(my, [-1, 1], [10, -10]) }}
            viewBox="0 0 400 200"
            className="absolute bottom-0 left-1/2 h-48 w-[420px] -translate-x-1/2"
          >
            <defs>
              <linearGradient id="rootg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="rootg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
              </linearGradient>
            </defs>
            {Array.from({ length: 14 }).map((_, i) => {
              const sx = 200 + (i - 7) * 12;
              const ex = 200 + (i - 7) * 28 + Math.sin(i) * 20;
              const ey = 200;
              const cx = sx + (ex - sx) / 2 + Math.sin(i * 1.3) * 30;
              return (
                <motion.path
                  key={i}
                  d={`M${sx} 0 Q ${cx} 100 ${ex} ${ey}`}
                  stroke={i % 2 ? "url(#rootg2)" : "url(#rootg)"}
                  strokeWidth={1.2}
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: i * 0.05 }}
                />
              );
            })}
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.circle
                key={`d${i}`}
                cx={200 + (i - 9) * 18}
                cy={180 - (i % 3) * 8}
                r={1.5}
                fill="#FBBF24"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
              />
            ))}
          </motion.svg>
        </div>
      </div>
    </section>
  );
}
