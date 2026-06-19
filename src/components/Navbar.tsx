import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { href: "#home", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#certificates", label: "Certificates" },
  { href: "#physical", label: "Physical Docs" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    links.forEach((l) => {
      const el = document.querySelector(l.href);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav className="flex w-full max-w-5xl items-center justify-between rounded-2xl border border-[color:var(--neon-purple)]/30 bg-black/40 px-5 py-3 backdrop-blur-xl shadow-[0_0_30px_rgba(139,92,246,0.15)]">
        <a href="#home" className="flex items-center gap-2 font-bold tracking-wider">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--neon-gold)] to-[color:var(--neon-purple)] text-black">
            K
          </span>
          <span className="text-glow-gold text-[color:var(--neon-gold)]">KUNKEY</span>
          <span className="text-xs text-[color:var(--neon-green)] font-mono">_dev</span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active === l.href.slice(1)
                    ? "text-[color:var(--neon-gold)] text-glow-gold"
                    : "text-foreground/70 hover:text-[color:var(--neon-gold)]"
                }`}
              >
                {l.label}
                {active === l.href.slice(1) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-2 right-2 h-0.5 rounded-full bg-[color:var(--neon-gold)] shadow-[0_0_8px_var(--neon-gold)]"
                  />
                )}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="hidden rounded-lg border border-[color:var(--neon-gold)]/60 px-3 py-1.5 text-sm font-semibold text-[color:var(--neon-gold)] glow-gold transition hover:bg-[color:var(--neon-gold)]/10 md:inline-block"
        >
          Hire Me
        </a>
      </nav>
    </motion.header>
  );
}
