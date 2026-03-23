export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-border)] mt-32">
      <div className="max-w-[760px] mx-auto px-6 xl:px-0 flex items-center justify-between py-8">
        <p className="font-sans text-xs font-light text-[var(--color-muted)] tracking-wide">
          © {new Date().getFullYear()} theprdguy
        </p>
        <div className="flex gap-6 font-sans text-xs font-light text-[var(--color-muted)]">
          <a
            href="https://github.com/theprdguy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-fg)] transition-colors duration-300 tracking-wide"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
