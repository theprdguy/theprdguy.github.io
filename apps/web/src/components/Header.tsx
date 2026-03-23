import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--color-bg)]/80 border-b border-[var(--color-border)]">
      <div className="max-w-[800px] mx-auto px-6 md:px-0 flex items-center justify-between py-4">
        <Link href="/" className="font-serif text-lg tracking-widest hover:text-[var(--color-muted)] transition-colors">
          PORTFOLIO
        </Link>
        <nav className="flex items-center gap-6 font-sans text-sm font-light">
          <Link href="/about" className="hover:text-[var(--color-muted)] transition-colors">
            About
          </Link>
          <a href="mailto:hello@example.com" className="hover:text-[var(--color-muted)] transition-colors">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
