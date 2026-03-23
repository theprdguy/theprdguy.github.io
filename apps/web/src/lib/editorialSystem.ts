export const editorialTokens = {
  color: {
    bg: '#f6f1ea',
    panel: 'rgba(255, 255, 255, 0.22)',
    fg: '#111111',
    muted: 'rgba(17, 17, 17, 0.58)',
    soft: 'rgba(17, 17, 17, 0.42)',
    accent: '#c8c1b7',
    border: 'rgba(17, 17, 17, 0.1)',
    borderStrong: 'rgba(17, 17, 17, 0.16)',
  },
  spacing: {
    pageMaxWidth: '760px',
    pageGutter: '1.5rem',
    sectionGap: 'clamp(4rem, 7vw, 6rem)',
    blockGap: '2rem',
  },
  tracking: {
    display: '0.1em',
    meta: '0.22em',
  },
} as const;

export const componentSpec = {
  header: {
    structure: 'full-width hairline border with centered reading column',
    brand: 'uppercase serif wordmark with generous tracking',
    nav: 'small uppercase sans links with muted color',
  },
  hero: {
    kicker: 'small uppercase metadata line',
    title: 'oversized serif display with narrow line-height',
    body: 'light sans paragraph, max width ~35rem',
  },
  projectListItem: {
    container: 'single-column row with top/bottom hairline separators',
    index: 'two-digit muted metadata',
    title: 'serif uppercase name with subtle hover fade',
    action: 'text CTA, no filled button',
  },
  projectDetail: {
    meta: 'category + year in uppercase sans',
    title: 'large serif display',
    features: 'rule bullets rather than round dots',
    techStack: 'outlined micro-tags with uppercase tracking',
    links: 'editorial text links only',
  },
} as const;
