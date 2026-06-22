import { motion } from "framer-motion";
import { Cpu, Radio, Wrench, Zap, type LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "./Projects";

const ICONS: Record<string, LucideIcon> = { Cpu, Radio, Wrench, Zap };

const FALLBACK = [
  { id: "f1", title: "Hydroponic Greenhouse Controller", icon: "Zap", tag: "IoT", components: "ESP32 · DHT22", description: "Realtime greenhouse controller.", hue: 145 },
];

export function PhysicalDocs() {
  const { data } = useQuery({
    queryKey: ["physical_docs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("physical_docs")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const items = (data && data.length > 0 ? data : FALLBACK) as typeof FALLBACK;

  return (
    <section id="physical" className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionHeader
        eyebrow="// hardware.dump"
        title="Physical Projects & Hardware Docs"
        subtitle="Tangible builds where atoms meet bits — sensors, PCBs and bespoke enclosures."
        icon={<Cpu className="h-5 w-5" />}
      />
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((p, i) => {
          const Icon = ICONS[p.icon] ?? Cpu;
          return (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="neon-card group grid grid-cols-[140px_1fr] gap-4 overflow-hidden rounded-2xl p-4 md:grid-cols-[180px_1fr]"
            >
              <div className="relative h-full min-h-[160px] overflow-hidden rounded-xl border border-[color:var(--neon-purple)]/40">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, hsla(${p.hue},90%,55%,0.45), transparent 65%), repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 4px, transparent 4px 8px), #07070d`,
                  }}
                />
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 grid place-items-center text-[color:var(--neon-gold)] text-glow-gold"
                >
                  <div className="grid h-16 w-16 place-items-center rounded-xl border border-[color:var(--neon-gold)]/50 bg-black/40 backdrop-blur">
                    <Icon />
                  </div>
                </motion.div>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[color:var(--neon-green)]/40 to-transparent animate-scan" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-[color:var(--neon-purple)]/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[color:var(--neon-purple)]">
                    {p.tag}
                  </span>
                  <span className="rounded-md bg-[color:var(--neon-gold)]/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[color:var(--neon-gold)]">
                    Physical Project
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-foreground group-hover:text-[color:var(--neon-gold)]">{p.title}</h3>
                <p className="mt-1 font-mono text-[11px] text-[color:var(--neon-green)]">{p.components}</p>
                <p className="mt-2 text-sm text-foreground/70">{p.description}</p>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
