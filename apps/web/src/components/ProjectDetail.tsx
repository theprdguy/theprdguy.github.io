import Link from 'next/link';
import { Project } from '../types';
import ScrollReveal from './ScrollReveal';

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <div className="flex flex-col py-16 md:py-24 max-w-[640px] mx-auto">
      <ScrollReveal>
        <Link
          href="/"
          className="font-sans text-sm font-light text-[var(--color-muted)] hover:text-black transition-colors mb-16 inline-block"
        >
          &larr; All projects
        </Link>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-sans text-[10px] uppercase tracking-wider text-[var(--color-muted)] border border-[var(--color-border)] px-2 py-1 rounded-full">
              {project.category}
            </span>
            <span className="font-sans text-xs font-light text-[var(--color-muted)]">
              {project.year}
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
            {project.name}
          </h1>
          <p className="font-sans font-light text-xl text-[var(--color-muted)] leading-relaxed">
            {project.tagline}
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-16">
          <p className="font-sans font-light text-[15px] leading-relaxed">
            {project.description}
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-16">
          <h2 className="font-serif text-xl mb-6">Key Features</h2>
          <ul className="list-disc pl-5 font-sans text-[15px] font-light space-y-3">
            {project.features.map((feature, index) => (
              <li key={index} className="pl-2">
                {feature}
              </li>
            ))}
          </ul>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-16">
          <h2 className="font-serif text-xl mb-6">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, index) => (
              <span
                key={index}
                className="font-sans text-xs font-light bg-[var(--color-border)] px-3 py-1.5 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="flex flex-wrap gap-4 pt-8 border-t border-[var(--color-border)]">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm pb-1 border-b border-[var(--color-border)] hover:border-black transition-colors"
            >
              GitHub
            </a>
          )}
          {project.links.website && (
            <a
              href={project.links.website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm pb-1 border-b border-[var(--color-border)] hover:border-black transition-colors"
            >
              Website
            </a>
          )}
          {project.links.appStore && (
            <a
              href={project.links.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm pb-1 border-b border-[var(--color-border)] hover:border-black transition-colors"
            >
              App Store
            </a>
          )}
          {project.links.chromeStore && (
            <a
              href={project.links.chromeStore}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm pb-1 border-b border-[var(--color-border)] hover:border-black transition-colors"
            >
              Chrome Store
            </a>
          )}
        </section>
      </ScrollReveal>
    </div>
  );
}
