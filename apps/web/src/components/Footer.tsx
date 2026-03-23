export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t border-[var(--color-border)] mt-24">
      <div className="max-w-[800px] mx-auto px-6 md:px-0 flex flex-col md:flex-row items-center justify-between gap-4 py-8 font-sans text-xs font-light text-[var(--color-muted)]">
        <p>© {year} Portfolio. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-fg)] transition-colors">
            GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-fg)] transition-colors">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
