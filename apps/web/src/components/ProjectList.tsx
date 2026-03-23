import Link from 'next/link';
import { Project } from '../types';
import ScrollReveal from './ScrollReveal';

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="w-full border-t border-[var(--color-border)]">
      {projects.map((project, i) => (
        <ScrollReveal key={project.slug} delay={i * 60}>
          <Link
            href={`/projects/${project.slug}`}
            className="group flex items-baseline gap-6 py-7 border-b border-[var(--color-border)] cursor-pointer block"
          >
            {/* Index */}
            <span className="font-sans text-[11px] font-light text-[var(--color-muted)] w-5 shrink-0 tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Name + tagline */}
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-[22px] leading-snug group-hover:opacity-50 transition-opacity duration-300 mb-1">
                {project.name}
              </h3>
              <p className="font-sans text-[13px] font-light text-[var(--color-muted)] leading-relaxed">
                {project.tagline}
              </p>
            </div>

            {/* Year + arrow */}
            <div className="flex items-baseline gap-5 shrink-0">
              <span className="font-sans text-[11px] font-light text-[var(--color-muted)] tabular-nums hidden sm:block">
                {project.year}
              </span>
              <span className="font-sans text-sm text-[var(--color-muted)] group-hover:text-[var(--color-fg)] group-hover:translate-x-1 transition-all duration-300">
                →
              </span>
            </div>
          </Link>
        </ScrollReveal>
      ))}
    </div>
  );
}
