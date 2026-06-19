import { motion } from "framer-motion";
import { Cpu, Radio, Wrench, Zap } from "lucide-react";
import { SectionHeader } from "./Projects";

const items = [
  {
    title: "Hydroponic Greenhouse Controller",
    icon: <Zap />,
    tag: "IoT",
    components: "ESP32 · DHT22 · pH/EC sensors · 5-channel relay · OLED",
    desc: "Monitors nutrient solution and climate in real time, syncs to a React dashboard via MQTT, and auto-doses pH using peristaltic pumps.",
    hue: 145,
  },
  {
    title: "Sci-Fi Smart Mirror",
    icon: <Cpu />,
    tag: "Hardware",
    components: "Raspberry Pi 4 · 2-way mirror · Capacitive touch · Voice HAT",
    desc: "Custom React UI rendered on Chromium kiosk. Touch-to-wake, voice commands, weather, calendar, and a hidden game console mode.",
    hue: 285,
  },
  {
    title: "Open-Source Macro Pad",
    icon: <Radio />,
    tag: "PCB",
    components: "RP2040 · 12 hot-swap keys · RGB underglow · QMK firmware",
    desc: "Designed in KiCad, manufactured PCB, custom 3D-printed case. Web app pairs over WebHID to remap keys live in the browser.",
    hue: 35,
  },
  {
    title: "Drone Telemetry Bridge",
    icon: <Wrench />,
    tag: "Robotics",
    components: "STM32 · LoRa 868MHz · MAVLink · Custom antenna",
    desc: "Long-range telemetry relay translating MAVLink into a websocket stream, visualised on a Three.js orbit map back at base.",
    hue: 210,
  },
];

export function PhysicalDocs() {
  return (
    <section id="physical" className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionHeader
        eyebrow="// hardware.dump"
        title="Physical Projects & Hardware Docs"
        subtitle="Tangible builds where atoms meet bits — sensors, PCBs and bespoke enclosures."
        icon={<Cpu className="h-5 w-5" />}
      />
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((p, i) => (
          <motion.article
            key={p.title}
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
                  {p.icon}
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
              <p className="mt-2 text-sm text-foreground/70">{p.desc}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
