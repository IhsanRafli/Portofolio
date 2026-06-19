import { createFileRoute } from "@tanstack/react-router";
import { Starfield } from "@/components/Starfield";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Certificates } from "@/components/Certificates";
import { PhysicalDocs } from "@/components/PhysicalDocs";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { HUD } from "@/components/HUD";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kunkey — Full Stack Web Developer" },
      { name: "description", content: "Sci-fi themed portfolio of Kunkey, a Full Stack web developer. Explore live GitHub projects, certifications and hardware experiments." },
      { property: "og:title", content: "Kunkey — Full Stack Web Developer" },
      { property: "og:description", content: "Sci-fi themed portfolio with live GitHub projects, certifications and hardware experiments." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-[#050509] text-foreground">
      <Starfield />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Projects />
          <Certificates />
          <PhysicalDocs />
          <Skills />
          <Contact />
        </main>
      </div>
      <HUD />
    </div>
  );
}
