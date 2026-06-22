import { motion } from "framer-motion";
import { Award, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "./Projects";

const FALLBACK = [
  { id: "f1", title: "AWS Certified Solutions Architect", org: "Amazon Web Services", date: "Mar 2025", hue: 35, verify_url: null },
];

export function Certificates() {
  const { data } = useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const certs = (data && data.length > 0 ? data : FALLBACK) as typeof FALLBACK;

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
            key={c.id}
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
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-bold text-foreground">{c.title}</h3>
              <p className="mt-1 text-sm text-foreground/60">{c.org}</p>
              <p className="mt-1 font-mono text-xs text-foreground/40">Issued {c.date}</p>
              <a
                href={c.verify_url || "#"}
                target={c.verify_url ? "_blank" : undefined}
                rel="noreferrer"
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
