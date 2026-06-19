import { motion } from "framer-motion";
import { Award, ShieldCheck } from "lucide-react";
import { SectionHeader } from "./Projects";

const certs = [
  { title: "AWS Certified Solutions Architect", org: "Amazon Web Services", date: "Mar 2025", hue: 35 },
  { title: "Google Professional Cloud Developer", org: "Google Cloud", date: "Jan 2025", hue: 210 },
  { title: "Meta Front-End Developer", org: "Meta / Coursera", date: "Nov 2024", hue: 240 },
  { title: "TensorFlow Developer Certificate", org: "Google", date: "Aug 2024", hue: 25 },
  { title: "Certified Kubernetes Application Dev", org: "CNCF", date: "May 2024", hue: 195 },
  { title: "MongoDB Associate Developer", org: "MongoDB University", date: "Feb 2024", hue: 145 },
];

export function Certificates() {
  return (
    <section id="certificates" className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionHeader
        eyebrow="// credentials.log"
        title="Earned Certifications"
        subtitle="Verified achievements collected across the galaxy of tech."
        icon={<Award className="h-5 w-5" />}
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certs.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="group neon-card flex flex-col overflow-hidden rounded-2xl transition-shadow hover:shadow-[0_0_45px_rgba(139,92,246,0.35)]"
          >
            <div className="relative aspect-[16/9] overflow-hidden border-b border-[color:var(--neon-purple)]/30">
              <div
                className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                style={{
                  background: `radial-gradient(circle at 30% 30%, hsla(${c.hue},90%,60%,0.45), transparent 60%), radial-gradient(circle at 70% 70%, hsla(${(c.hue + 60) % 360},80%,55%,0.35), transparent 55%), #0a0a14`,
                }}
              />
              <div className="absolute inset-0 grid place-items-center">
                <div className="rounded-xl border border-[color:var(--neon-gold)]/40 bg-black/40 px-4 py-3 backdrop-blur-md">
                  <ShieldCheck className="mx-auto h-8 w-8 text-[color:var(--neon-gold)] text-glow-gold" />
                  <p className="mt-1 text-center font-mono text-[10px] tracking-widest text-[color:var(--neon-green)]">VERIFIED</p>
                </div>
              </div>
              <div className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                   style={{ boxShadow: "inset 0 0 60px rgba(139,92,246,0.6)" }} />
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-bold text-foreground">{c.title}</h3>
              <p className="mt-1 text-sm text-foreground/60">{c.org}</p>
              <p className="mt-1 font-mono text-xs text-foreground/40">Issued {c.date}</p>
              <a
                href="#"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-[color:var(--neon-gold)] bg-[color:var(--neon-gold)]/10 px-3 py-2 text-sm font-semibold text-[color:var(--neon-gold)] glow-gold transition hover:bg-[color:var(--neon-gold)]/20"
              >
                Verify Credential →
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
