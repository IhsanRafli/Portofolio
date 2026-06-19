import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Twitter, Send } from "lucide-react";
import { SectionHeader } from "./Projects";
import { portfolioConfig } from "@/lib/portfolio-config";

export function Contact() {
  return (
    <section id="contact" className="relative mx-auto max-w-4xl px-6 py-24">
      <SectionHeader
        eyebrow="// open_channel"
        title="Establish Contact"
        subtitle="Broadcast a message — replies usually within one Earth-day."
        icon={<Send className="h-5 w-5" />}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="neon-card rounded-3xl p-8"
      >
        <form
          onSubmit={(e) => { e.preventDefault(); alert("Transmission sent! (demo)"); }}
          className="grid gap-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Your Name" name="name" placeholder="Cmdr. Spock" />
            <Field label="Email" name="email" type="email" placeholder="you@stellar.dev" />
          </div>
          <Field label="Subject" name="subject" placeholder="Mission briefing" />
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-[color:var(--neon-green)]">Message</label>
            <textarea
              required
              rows={5}
              placeholder="Tell me about your project..."
              className="w-full rounded-xl border border-[color:var(--neon-purple)]/40 bg-black/40 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-[color:var(--neon-gold)] focus:outline-none focus:ring-2 focus:ring-[color:var(--neon-gold)]/30"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--neon-gold)] px-5 py-3 font-bold text-black glow-gold transition hover:scale-[1.02]"
          >
            <Send className="h-4 w-4" /> Transmit Signal
          </button>
        </form>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--neon-purple)]/30 pt-6">
          <div className="inline-flex items-center gap-2 text-sm text-foreground/70">
            <Mail className="h-4 w-4 text-[color:var(--neon-gold)]" /> {portfolioConfig.email}
          </div>
          <div className="flex gap-2">
            {[
              { href: portfolioConfig.social.github, Icon: Github },
              { href: portfolioConfig.social.linkedin, Icon: Linkedin },
              { href: portfolioConfig.social.twitter, Icon: Twitter },
            ].map(({ href, Icon }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="grid h-10 w-10 place-items-center rounded-lg border border-[color:var(--neon-purple)]/40 bg-black/40 text-foreground/80 transition hover:text-[color:var(--neon-gold)] hover:glow-gold"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </motion.div>
      <p className="mt-10 text-center font-mono text-xs text-foreground/40">
        © {new Date().getFullYear()} {portfolioConfig.name} · Built in deep space with React + TanStack
      </p>
    </section>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-[color:var(--neon-green)]">{label}</label>
      <input
        required
        {...props}
        className="w-full rounded-xl border border-[color:var(--neon-purple)]/40 bg-black/40 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-[color:var(--neon-gold)] focus:outline-none focus:ring-2 focus:ring-[color:var(--neon-gold)]/30"
      />
    </div>
  );
}
