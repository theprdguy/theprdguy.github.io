import { Metadata } from 'next';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata: Metadata = {
  title: 'About - Portfolio',
  description: 'About me',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col py-16 md:py-24 max-w-[640px] mx-auto min-h-[60vh]">
      <ScrollReveal>
        <h1 className="font-serif text-4xl md:text-5xl mb-12">About</h1>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-16">
          <p className="font-sans font-light text-lg leading-relaxed text-[var(--color-muted)] mb-6">
            I'm a product designer and builder who creates tools for focused work.
          </p>
          <p className="font-sans font-light text-[15px] leading-relaxed mb-6">
            With a background in both design and engineering, I specialize in crafting minimal, intuitive interfaces and robust underlying systems. My work is guided by the belief that software should be quiet, respecting the user's attention and time.
          </p>
          <p className="font-sans font-light text-[15px] leading-relaxed">
            I currently focus on building tools that help people read better, present ideas clearly, and navigate the web without clutter.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="pt-8 border-t border-[var(--color-border)] mt-auto">
          <h2 className="font-serif text-xl mb-4">Contact</h2>
          <a
            href="mailto:hello@example.com"
            className="font-sans font-light hover:text-[var(--color-muted)] transition-colors"
          >
            hello@example.com
          </a>
        </section>
      </ScrollReveal>
    </div>
  );
}
