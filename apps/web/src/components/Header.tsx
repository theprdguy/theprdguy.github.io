import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full">
      <div className="max-w-[760px] mx-auto px-6 xl:px-0 flex items-baseline justify-between py-10">
        <Link
          href="/"
          className="font-serif text-base tracking-[0.18em] uppercase hover:opacity-50 transition-opacity duration-300"
        >
          theprdguy
        </Link>
        <nav className="flex items-baseline gap-8 font-sans text-[13px] font-light tracking-wide">
          <Link
            href="/about"
            className="hover:opacity-50 transition-opacity duration-300"
          >
            About
          </Link>
          <a
            href="mailto:theprdguy@gmail.com"
            className="hover:opacity-50 transition-opacity duration-300"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
