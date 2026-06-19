import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Star, GitFork, ExternalLink, Github, Code2 } from "lucide-react";
import { portfolioConfig } from "@/lib/portfolio-config";

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  fork: boolean;
};

const langColor: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3776AB",
  Go: "#00ADD8",
  Rust: "#DEA584",
  HTML: "#E34F26",
  CSS: "#1572B6",
  Java: "#B07219",
};

const fallback: Repo[] = [
  { id: 1, name: "stellar-dashboard", description: "Example mission — connect your GitHub to populate.", html_url: "#", homepage: null, stargazers_count: 0, forks_count: 0, language: "TypeScript", topics: [], fork: false },
];

const imageMap: { match: RegExp; url: string }[] = [
  { match: /robot|laborator/i, url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=70" },
  { match: /mobile|flutter|dart|app/i, url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=70" },
  { match: /padi|rice|tani|agri/i, url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=70" },
  { match: /kecerdasan|\bai\b|\bml\b|machine|cluster|jupyter|deteksi/i, url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=70" },
  { match: /aqua|water|hydro/i, url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&q=70" },
  { match: /game/i, url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=70" },
  { match: /ecommerce|shop|store/i, url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=70" },
  { match: /coffee/i, url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=70" },
  { match: /docs|documentation|mdx/i, url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=70" },
  { match: /portfolio/i, url: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=70" },
];
const defaultImage = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=70";

function pickImage(repo: Repo): string {
  const hay = `${repo.name} ${repo.description ?? ""} ${(repo.topics ?? []).join(" ")} ${repo.language ?? ""}`;
  for (const { match, url } of imageMap) if (match.test(hay)) return url;
  return defaultImage;
}

// ASCII keyboard SVG element
function KeyboardVisual() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: 600 }}>
        <div className="grid gap-1 rounded-md border border-[color:var(--neon-gold)]/40 bg-black/60 p-2" style={{ transform: "rotateX(45deg)" }}>
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex gap-1">
              {Array.from({ length: 10 }).map((_, c) => (
                <motion.span
                  key={c}
                  className="block h-3 w-4 rounded-sm bg-[color:var(--neon-purple)]/40"
                  animate={{ backgroundColor: ["rgba(139,92,246,0.4)", "rgba(251,191,36,0.9)", "rgba(139,92,246,0.4)"] }}
                  transition={{ duration: 1.5, delay: (row * 10 + c) * 0.05, repeat: Infinity }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 -top-4 h-8 bg-gradient-to-b from-[color:var(--neon-green)]/60 to-transparent blur-md animate-scan" />
    </div>
  );
}

function MonitorVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <div ref={ref} className="relative grid h-full w-full place-items-center">
      <motion.div
        animate={inView ? { rotateY: [0, 0, 360] } : {}}
        transition={{ duration: 8, times: [0, 0.1, 1], repeat: Infinity, ease: "linear" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative"
      >
        <div className="h-20 w-32 rounded-md border-2 border-[color:var(--neon-purple)]/60 bg-black p-1.5">
          <motion.div
            initial={{ backgroundColor: "#000" }}
            animate={inView ? { backgroundColor: ["#000", "#000", "rgba(74,222,128,0.8)", "rgba(74,222,128,0.4)"] } : {}}
            transition={{ duration: 1.5, times: [0, 0.4, 0.5, 1] }}
            className="h-full w-full rounded-sm"
          >
            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.8 }} className="p-1 font-mono text-[6px] leading-[8px] text-[color:var(--neon-green)]">
              {"> boot.sys ok"}<br />{"> render UI..."}<br />{"> ready_"}
            </motion.div>
          </motion.div>
        </div>
        <div className="mx-auto mt-1 h-1.5 w-10 rounded-b-md bg-[color:var(--neon-purple)]/60" />
        <div className="mx-auto h-1 w-16 rounded-md bg-[color:var(--neon-purple)]/40" />
      </motion.div>
    </div>
  );
}

function ProjectCard({ repo, index }: { repo: Repo; index: number }) {
  const isWebDemo = !!repo.homepage;
  const img = pickImage(repo);
  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
      whileHover={{ y: -6 }}
      className="group neon-card relative flex flex-col overflow-hidden rounded-2xl p-5 transition-shadow hover:shadow-[0_0_40px_rgba(251,191,36,0.25)]"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[color:var(--neon-purple)]/0 to-[color:var(--neon-gold)]/0 transition-all duration-500 group-hover:from-[color:var(--neon-purple)]/10 group-hover:to-[color:var(--neon-gold)]/10" />

      <div className="relative mb-4 h-36 overflow-hidden rounded-xl border border-[color:var(--neon-purple)]/30 bg-black/60">
        <img
          src={img}
          alt={repo.name}
          loading="lazy"
          className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-110 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 -top-4 h-8 bg-gradient-to-b from-[color:var(--neon-green)]/40 to-transparent blur-md animate-scan" />
        <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2">
          <span className="rounded-md border border-[color:var(--neon-purple)]/40 bg-black/70 px-2 py-0.5 font-mono text-[10px] text-[color:var(--neon-purple)]">
            {isWebDemo ? "WEB / LIVE" : "SOURCE"}
          </span>
          {isWebDemo && (
            <span className="rounded-md bg-[color:var(--neon-green)]/20 px-2 py-0.5 font-mono text-[10px] text-[color:var(--neon-green)]">
              ● ONLINE
            </span>
          )}
        </div>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Github className="h-4 w-4 text-[color:var(--neon-gold)]" />
          <h3 className="font-bold text-foreground group-hover:text-glow-gold group-hover:text-[color:var(--neon-gold)]">
            {repo.name}
          </h3>
        </div>
        <ExternalLink className="h-4 w-4 text-foreground/40 transition group-hover:text-[color:var(--neon-gold)]" />
      </div>

      <p className="mt-2 line-clamp-3 text-sm text-foreground/70">
        {repo.description || "No description provided."}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-3 pt-4 text-xs text-foreground/70">
        {repo.language && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--neon-purple)]/40 bg-black/40 px-2 py-0.5">
            <span className="h-2 w-2 rounded-full" style={{ background: langColor[repo.language] || "#FBBF24" }} />
            {repo.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 text-[color:var(--neon-gold)]" /> {repo.stargazers_count}</span>
        <span className="inline-flex items-center gap-1"><GitFork className="h-3.5 w-3.5" /> {repo.forks_count}</span>
        {isWebDemo && (
          <span
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(repo.homepage!, "_blank"); }}
            className="ml-auto cursor-pointer rounded-md bg-[color:var(--neon-green)]/15 px-2 py-0.5 font-mono text-[10px] text-[color:var(--neon-green)] hover:bg-[color:var(--neon-green)]/30"
          >
            VISIT →
          </span>
        )}
      </div>
    </motion.a>
  );
}

export function Projects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`https://api.github.com/users/${portfolioConfig.githubUsername}/repos?per_page=100&sort=updated`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: Repo[]) => {
        if (!alive) return;
        const sorted = data.filter((r) => !r.fork).sort((a, b) => b.stargazers_count - a.stargazers_count);
        setRepos(sorted.length ? sorted : fallback);
      })
      .catch(() => {
        if (!alive) return;
        setErr("Showing example missions — connect a real GitHub username in portfolio-config.ts");
        setRepos(fallback);
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionHeader
        eyebrow="// repositories"
        title="Active Missions"
        subtitle="Live feed from GitHub. Each module is a deployed experiment in orbit."
        icon={<Code2 className="h-5 w-5" />}
      />
      {err && (
        <p className="mb-6 rounded-lg border border-[color:var(--neon-gold)]/30 bg-[color:var(--neon-gold)]/5 p-3 text-center text-xs text-[color:var(--neon-gold)]">
          {err}
        </p>
      )}
      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="neon-card h-72 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {repos.map((r, i) => (
            <ProjectCard key={r.id} repo={r} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}

export function SectionHeader({ eyebrow, title, subtitle, icon }: { eyebrow: string; title: string; subtitle?: string; icon?: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-10 text-center"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--neon-purple)]/40 bg-[color:var(--neon-purple)]/10 px-3 py-1 font-mono text-xs text-[color:var(--neon-purple)]">
        {icon}{eyebrow}
      </div>
      <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[color:var(--neon-gold)] text-glow-gold md:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="mx-auto mt-3 max-w-2xl text-foreground/60">{subtitle}</p>}
    </motion.div>
  );
}
