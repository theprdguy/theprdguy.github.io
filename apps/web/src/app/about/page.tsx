import { Metadata } from 'next';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata: Metadata = {
  title: 'About — theprdguy',
  description: 'Independent builder. I make tools for focused people.',
};

export default function AboutPage() {
  return (
    <div className="max-w-[760px] mx-auto px-6 xl:px-0 pt-12 pb-8">
      <ScrollReveal>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-sans text-[13px] font-light text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors duration-300 mb-16"
        >
          ← All projects
        </Link>
      </ScrollReveal>

      <ScrollReveal delay={60}>
        <h1 className="font-serif text-[clamp(2.2rem,6vw,3.8rem)] leading-[1.05] tracking-tight mb-14">
          About
        </h1>
      </ScrollReveal>

      <ScrollReveal delay={120}>
        <section className="max-w-md mb-16 pb-16 border-b border-[var(--color-border)]">
          <p className="font-sans font-light text-[17px] text-[var(--color-muted)] leading-relaxed mb-6">
            Independent builder. I make tools for focused people.
          </p>
          <p className="font-sans font-light text-[15px] leading-[1.8] mb-4">
            I build desktop apps, mobile apps, and browser extensions — things that fit
            into real workflows without adding noise. Most of my work starts from a
            personal frustration and ends up being useful to others too.
          </p>
          <p className="font-sans font-light text-[15px] leading-[1.8]">
            Currently working on presentation tools, read-later apps, and small utilities
            that respect attention.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={160}>
        <section>
          <h2 className="font-sans text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)] mb-5">
            Contact
          </h2>
          <a
            href="mailto:theprdguy@gmail.com"
            className="font-sans font-light text-[15px] hover:opacity-50 transition-opacity duration-300"
          >
            theprdguy@gmail.com
          </a>
        </section>
      </ScrollReveal>
    </div>
  );
}
