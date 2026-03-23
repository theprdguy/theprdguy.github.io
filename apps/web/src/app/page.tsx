import ProjectList from '@/components/ProjectList';
import { projects } from '@/data/projects';
import ScrollReveal from '@/components/ScrollReveal';

export default function Home() {
  return (
    <div className="flex flex-col gap-24 py-16 md:py-24">
      <ScrollReveal>
        <section className="flex flex-col gap-6">
          <h1 className="font-serif text-5xl md:text-6xl tracking-[0.2em] uppercase">
            PORTFOLIO
          </h1>
          <p className="font-sans font-light text-[var(--color-muted)] text-lg max-w-lg leading-relaxed">
            I build tools that help people focus, read, and create without the clutter.
          </p>
        </section>
      </ScrollReveal>

      <section>
        <ProjectList projects={projects} />
      </section>
    </div>
  );
}
