import ProjectList from '@/components/ProjectList';
import { projects } from '@/data/projects';
import ScrollReveal from '@/components/ScrollReveal';

export default function Home() {
  return (
    <div className="page-shell pt-20 pb-8 md:pt-24">
      <ScrollReveal>
        <section className="mb-[var(--section-gap)] border-b border-[var(--color-border)] pb-14 md:pb-20">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <p className="editorial-kicker">Independent builder portfolio</p>
            <div className="max-w-[18rem]">
              <p className="editorial-kicker mb-2">Practice</p>
              <p className="font-sans text-[0.95rem] leading-[1.75] text-[var(--color-muted)]">
                Tools for reading, timing, capture, and presentation. Minimal
                interfaces with a bias toward clarity and calm.
              </p>
            </div>
          </div>
          <h1 className="editorial-display mb-8 max-w-[12ch] text-[clamp(3.6rem,10vw,6.8rem)]">
            Products & tools for focused work
          </h1>
          <p className="editorial-body max-w-[38rem] text-[1.02rem]">
            I design and build small software that reduces friction instead of
            adding more interface. Each project begins with a real workflow
            problem and ends as a tool meant to stay out of the way.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={60}>
        <section className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="editorial-kicker mb-3">Selected works</p>
            <h2 className="editorial-title text-[2.4rem] leading-none md:text-[3rem]">
              Four recent projects
            </h2>
          </div>
          <p className="hidden max-w-[16rem] font-sans text-[0.9rem] leading-[1.7] text-[var(--color-muted)] md:block">
            A concise catalogue of products, apps, and extensions built from
            specific everyday needs.
          </p>
        </section>
      </ScrollReveal>

      <ProjectList projects={projects} />

      <ScrollReveal delay={120}>
        <section className="mt-[var(--section-gap)] border-t border-[var(--color-border)] pt-10 pb-4">
          <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
            <p className="editorial-kicker">Approach</p>
            <div className="space-y-5">
              <p className="font-sans text-[1rem] leading-[1.9] text-[var(--color-fg)]">
                I prefer quiet visual systems, strong type, and interfaces that
                communicate with as little ornament as possible.
              </p>
              <p className="font-sans text-[0.96rem] leading-[1.85] text-[var(--color-muted)]">
                The work here ranges from desktop software to browser utilities,
                but the through-line is the same: make something specific,
                legible, and useful enough to keep.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
