import Link from 'next/link';
import { Project } from '../types';
import ScrollReveal from './ScrollReveal';

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <div className="max-w-[760px] mx-auto px-6 xl:px-0 pt-12 pb-8">
      {/* Back */}
      <ScrollReveal>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-sans text-[13px] font-light text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors duration-300 mb-16"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
          All projects
        </Link>
      </ScrollReveal>

      {/* Hero */}
      <ScrollReveal delay={60}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
              {project.category}
            </span>
            <span className="w-px h-3 bg-[var(--color-border)]" />
            <span className="font-sans text-[11px] text-[var(--color-muted)] tabular-nums">
              {project.year}
            </span>
          </div>
          <h1 className="font-serif text-[clamp(2.2rem,6vw,3.8rem)] leading-[1.05] mb-6 tracking-tight">
            {project.name}
          </h1>
          <p className="font-sans font-light text-[17px] text-[var(--color-muted)] leading-relaxed max-w-md">
            {project.tagline}
          </p>
        </section>
      </ScrollReveal>

      {/* Description */}
      <ScrollReveal delay={120}>
        <section className="mb-14 pb-14 border-b border-[var(--color-border)]">
          <p className="font-sans font-light text-[15px] leading-[1.8] max-w-xl">
            {project.description}
          </p>
        </section>
      </ScrollReveal>

      {/* Features + Tech — side by side on md */}
      <ScrollReveal delay={160}>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-14 pb-14 border-b border-[var(--color-border)]">
          <div>
            <h2 className="font-sans text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)] mb-5">
              Features
            </h2>
            <ul className="space-y-3">
              {project.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 font-sans font-light text-[14px] leading-relaxed">
                  <span className="mt-[6px] w-1 h-1 rounded-full bg-[var(--color-accent)] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-sans text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)] mb-5">
              Built with
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((t, i) => (
                <span
                  key={i}
                  className="font-sans text-[12px] font-light px-3 py-1 border border-[var(--color-border)] text-[var(--color-muted)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Links */}
      <ScrollReveal delay={200}>
        <section className="flex flex-wrap gap-6">
          {project.links.github && project.links.github !== '#' && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[13px] font-light hover:opacity-50 transition-opacity duration-300 underline underline-offset-4 decoration-[var(--color-border)]"
            >
              GitHub →
            </a>
          )}
          {project.links.website && project.links.website !== '#' && (
            <a
              href={project.links.website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[13px] font-light hover:opacity-50 transition-opacity duration-300 underline underline-offset-4 decoration-[var(--color-border)]"
            >
              Website →
            </a>
          )}
          {project.links.appStore && project.links.appStore !== '#' && (
            <a
              href={project.links.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[13px] font-light hover:opacity-50 transition-opacity duration-300 underline underline-offset-4 decoration-[var(--color-border)]"
            >
              App Store →
            </a>
          )}
          {project.links.chromeStore && project.links.chromeStore !== '#' && (
            <a
              href={project.links.chromeStore}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[13px] font-light hover:opacity-50 transition-opacity duration-300 underline underline-offset-4 decoration-[var(--color-border)]"
            >
              Chrome Web Store →
            </a>
          )}
          {/* If no real links, show nothing */}
        </section>
      </ScrollReveal>
    </div>
  );
}
