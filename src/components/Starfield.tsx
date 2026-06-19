import { useEffect, useRef } from "react";

export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 0.8 + 0.2,
      r: Math.random() * 1.4 + 0.2,
      tw: Math.random() * Math.PI * 2,
      hue: Math.random() < 0.15 ? 285 : Math.random() < 0.3 ? 50 : 220,
    }));

    let raf = 0;
    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.y += s.z * 0.15;
        if (s.y > h) s.y = 0;
        const a = 0.5 + Math.sin(t * 0.002 + s.tw) * 0.5;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${s.hue}, 90%, 75%, ${a * s.z})`;
        ctx.shadowColor = `hsla(${s.hue}, 90%, 70%, ${a})`;
        ctx.shadowBlur = 6 * s.z;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onR = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onR);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onR);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
      aria-hidden
    />
  );
}
