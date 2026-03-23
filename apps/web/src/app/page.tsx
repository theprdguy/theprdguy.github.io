import ProjectList from '@/components/ProjectList';
import { projects } from '@/data/projects';
import ScrollReveal from '@/components/ScrollReveal';

export default function Home() {
  return (
    <div className="max-w-[760px] mx-auto px-6 xl:px-0 pt-16 pb-8">
      {/* Hero */}
      <ScrollReveal>
        <section className="mb-24">
          <h1 className="font-serif text-[clamp(2.8rem,8vw,5rem)] leading-[1.05] tracking-tight mb-8">
            Products &<br />tools I build.
          </h1>
          <p className="font-sans font-light text-[15px] text-[var(--color-muted)] max-w-sm leading-relaxed">
            Independent builder focused on focus tools, reading, and presentation.
          </p>
        </section>
      </ScrollReveal>

      {/* Project list */}
      <ProjectList projects={projects} />
    </div>
  );
}
