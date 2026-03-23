import Link from 'next/link';
import { Project } from '../types';
import ScrollReveal from './ScrollReveal';

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="flex flex-col w-full">
      {projects.map((project) => (
        <ScrollReveal key={project.slug}>
          <div className="group block w-full py-8 border-b border-[var(--color-border)] last:border-b-0">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-2">
              <div className="flex items-baseline gap-4">
                <span className="font-sans text-xs font-light text-[var(--color-muted)] w-8">
                  {project.year}
                </span>
                <h3 className="font-serif text-2xl group-hover:text-[var(--color-muted)] transition-colors">
                  {project.name}
                </h3>
              </div>
              <span className="font-sans text-[10px] uppercase tracking-wider text-[var(--color-muted)] border border-[var(--color-border)] px-2 py-1 rounded-full w-fit">
                {project.category}
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-0 md:pl-12 mt-2">
              <p className="font-sans font-light text-sm text-[var(--color-muted)]">
                {project.tagline}
              </p>
              <Link
                href={`/projects/${project.slug}`}
                className="font-sans text-sm font-light hover:text-[var(--color-muted)] transition-colors inline-flex items-center gap-1"
              >
                View project <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
