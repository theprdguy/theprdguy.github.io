import Link from 'next/link';
import { Project } from '../types';
import ScrollReveal from './ScrollReveal';

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  return (
    <section className="w-full border-t border-[var(--color-border)]">
      {projects.map((project, i) => (
        <ScrollReveal key={project.slug} delay={i * 60}>
          <Link
            href={`/projects/${project.slug}`}
            className="group block border-b border-[var(--color-border)] py-8 md:py-10"
          >
            <div className="grid gap-5 md:grid-cols-[72px_minmax(0,1fr)_150px] md:items-start">
              <span className="editorial-kicker w-8 shrink-0 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h3 className="font-serif text-[2rem] leading-none uppercase tracking-[0.08em] transition-opacity duration-300 group-hover:opacity-60 md:text-[2.55rem]">
                    {project.name}
                  </h3>
                  <span className="editorial-kicker">{project.category}</span>
                </div>
                <p className="max-w-[31rem] font-sans text-[1rem] font-light leading-[1.75] text-[var(--color-muted)]">
                  {project.tagline}
                </p>
              </div>
              <div className="flex items-center justify-between gap-5 md:justify-end md:pt-1">
                <span className="editorial-kicker tabular-nums">{project.year}</span>
                <span className="editorial-link group-hover:translate-x-1">Open</span>
              </div>
            </div>
          </Link>
        </ScrollReveal>
      ))}
    </section>
  );
}
