import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { SectionHeader } from "./Projects";

const groups = [
  { title: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion", "Three.js"] },
  { title: "Backend", items: ["Node.js", "Bun", "Go", "PostgreSQL", "Redis", "tRPC"] },
  { title: "Cloud / DevOps", items: ["AWS", "Cloudflare", "Docker", "Kubernetes", "Terraform"] },
  { title: "Hardware", items: ["ESP32", "Raspberry Pi", "KiCad", "Arduino", "MQTT"] },
];

export function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionHeader
        eyebrow="// arsenal"
        title="Tech Arsenal"
        subtitle="Weapons of choice across the full stack — picked for speed and reliability."
        icon={<Sparkles className="h-5 w-5" />}
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {groups.map((g, i) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="neon-card rounded-2xl p-5"
          >
            <h3 className="font-display text-lg font-bold text-[color:var(--neon-gold)]">{g.title}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {g.items.map((s) => (
                <span
                  key={s}
                  className="rounded-md border border-[color:var(--neon-purple)]/40 bg-[color:var(--neon-purple)]/10 px-2.5 py-1 text-xs font-medium text-foreground/85"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
