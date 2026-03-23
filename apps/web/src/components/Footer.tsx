export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-border)] mt-32">
      <div className="page-shell flex items-center justify-between py-8">
        <p className="editorial-kicker">
          © {new Date().getFullYear()} theprdguy
        </p>
        <div className="flex gap-6">
          <a
            href="https://github.com/theprdguy"
            target="_blank"
            rel="noopener noreferrer"
            className="editorial-kicker"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
