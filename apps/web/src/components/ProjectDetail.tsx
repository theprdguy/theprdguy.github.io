import Link from 'next/link';
import { Project } from '../types';
import ScrollReveal from './ScrollReveal';
import { projects } from '@/data/projects';

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const relatedProjects = projects.filter((entry) => entry.slug !== project.slug).slice(0, 2);

  return (
    <div className="page-shell pt-14 pb-8 md:pt-16">
      <ScrollReveal>
        <Link
          href="/"
          className="editorial-kicker inline-flex items-center gap-3 mb-16"
        >
          <span>←</span>
          All projects
        </Link>
      </ScrollReveal>

      <ScrollReveal delay={60}>
        <section className="mb-16 border-b border-[var(--color-border)] pb-14 md:mb-20 md:pb-16">
          <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-3">
              <span className="editorial-kicker">
                {project.category}
              </span>
              <span className="h-3 w-px bg-[var(--color-border)]" />
              <span className="editorial-kicker tabular-nums">
                {project.year}
              </span>
            </div>
            <p className="max-w-[16rem] font-sans text-[0.92rem] leading-[1.75] text-[var(--color-muted)]">
              A focused tool designed around a single workflow and reduced visual noise.
            </p>
          </div>
          <p className="editorial-kicker mb-4">Project</p>
          <h1 className="editorial-display mb-6 text-[clamp(3rem,8vw,5.2rem)]">
            {project.name}
          </h1>
          <p className="editorial-body max-w-[34rem] text-[1.08rem]">
            {project.tagline}
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={120}>
        <section className="mb-14 grid gap-10 border-b border-[var(--color-border)] pb-14 md:grid-cols-[140px_minmax(0,1fr)]">
          <p className="editorial-kicker">Overview</p>
          <div className="space-y-6">
            <p className="font-sans text-[1rem] leading-[1.95] text-[var(--color-fg)]">
              {project.description}
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="editorial-kicker mb-3">Type</p>
                <p className="font-sans text-[0.98rem] leading-[1.8] text-[var(--color-muted)]">
                  {project.category}
                </p>
              </div>
              <div>
                <p className="editorial-kicker mb-3">Year</p>
                <p className="font-sans text-[0.98rem] leading-[1.8] text-[var(--color-muted)]">
                  {project.year}
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={160}>
        <section className="mb-14 grid grid-cols-1 gap-12 border-b border-[var(--color-border)] pb-14 md:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="editorial-kicker mb-5">
              Features
            </h2>
            <ul className="space-y-3">
              {project.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 font-sans text-[0.95rem] font-light leading-[1.8] text-[var(--color-muted)]">
                  <span className="mt-[11px] h-px w-3 shrink-0 bg-[var(--color-border-strong)]" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="editorial-kicker mb-5">
              Built with
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((t, i) => (
                <span
                  key={i}
                  className="border border-[var(--color-border)] px-3 py-1.5 font-sans text-[0.78rem] font-light uppercase tracking-[0.12em] text-[var(--color-soft)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <section className="mb-16 grid gap-8 border-b border-[var(--color-border)] pb-14 md:grid-cols-[140px_minmax(0,1fr)]">
          <p className="editorial-kicker">Links</p>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {project.links.github && project.links.github !== '#' && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link"
              >
                GitHub
              </a>
            )}
            {project.links.website && project.links.website !== '#' && (
              <a
                href={project.links.website}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link"
              >
                Website
              </a>
            )}
            {project.links.appStore && project.links.appStore !== '#' && (
              <a
                href={project.links.appStore}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link"
              >
                App Store
              </a>
            )}
            {project.links.chromeStore && project.links.chromeStore !== '#' && (
              <a
                href={project.links.chromeStore}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link"
              >
                Chrome Web Store
              </a>
            )}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={240}>
        <section className="pb-4">
          <div className="mb-8 flex items-end justify-between gap-6">
            <span className="editorial-kicker">
              More work
            </span>
            <Link href="/" className="editorial-link">
              All projects
            </Link>
          </div>
          <div className="border-t border-[var(--color-border)]">
            {relatedProjects.map((entry) => (
              <Link
                key={entry.slug}
                href={`/projects/${entry.slug}`}
                className="group flex flex-col gap-2 border-b border-[var(--color-border)] py-6 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="font-serif text-[1.8rem] uppercase tracking-[0.08em] transition-opacity duration-300 group-hover:opacity-60 md:text-[2.1rem]">
                    {entry.name}
                  </h3>
                  <p className="mt-2 font-sans text-[0.95rem] font-light leading-[1.75] text-[var(--color-muted)]">
                    {entry.tagline}
                  </p>
                </div>
                <span className="editorial-kicker tabular-nums">{entry.year}</span>
              </Link>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
