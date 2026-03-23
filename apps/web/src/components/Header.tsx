import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full border-b border-[var(--color-border)]">
      <div className="page-shell flex items-baseline justify-between py-10 md:py-12">
        <Link
          href="/"
          className="editorial-title text-[1.7rem] leading-none md:text-[2rem]"
        >
          theprdguy
        </Link>
        <nav className="flex items-baseline gap-6 md:gap-8">
          <Link
            href="/about"
            className="editorial-kicker"
          >
            About
          </Link>
          <a
            href="mailto:theprdguy@gmail.com"
            className="editorial-kicker"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
