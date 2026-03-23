import { Project } from '../types';

export const projects: Project[] = [
  {
    slug: 'deck',
    name: 'Deck',
    category: 'Desktop App',
    tagline: 'AI-native presentation tool',
    description:
      'A desktop presentation app where AI generates HTML/CSS slides from a plain-text prompt. Bring your own API key (Claude or ChatGPT). Edit visually or in code, present with speaker notes, and export to PDF or HTML.',
    features: [
      'AI slide generation from prompt',
      'Dual-mode editor — visual and code',
      'Presentation mode with speaker notes',
      'PDF and HTML export',
      '.prz file format (portable ZIP container)',
    ],
    techStack: ['Electron', 'React', 'TypeScript', 'Vite', 'Claude API', 'OpenAI API'],
    year: '2025',
    links: {
      github: '#',
      website: '#',
    },
  },
  {
    slug: 'sift',
    name: 'Sift',
    category: 'Mobile App',
    tagline: 'Read later, without the clutter',
    description:
      'A read-later app for iOS and Android. Save links from any app via the Share Sheet, browse rich previews, and read in the built-in browser. Stays local — no cloud sync, no account required.',
    features: [
      'Save links via iOS / Android Share Sheet',
      'Rich link previews with metadata',
      'In-app browser reader',
      'Tag-based organisation',
      'Fully offline archive',
    ],
    techStack: ['React Native', 'Expo', 'TypeScript', 'Zustand', 'expo-sqlite', 'Drizzle ORM'],
    year: '2025',
    links: {
      github: '#',
      appStore: '#',
    },
  },
  {
    slug: 'svrtime',
    name: 'svrTime',
    category: 'Chrome Extension',
    tagline: 'Precise server time in your browser',
    description:
      'A Chrome extension that reads the server time from HTTP response headers and displays it to the millisecond. Corrects for round-trip latency so you see the true server clock — useful for ticket sales, class registration, or any time-critical task.',
    features: [
      'Millisecond-precision server time',
      'RTT (round-trip time) correction',
      'Chrome Side Panel UI',
      'Works on any website',
    ],
    techStack: ['Chrome Extension MV3', 'Side Panel API', 'TypeScript'],
    year: '2024',
    links: {
      github: '#',
      chromeStore: '#',
    },
  },
  {
    slug: 'mining',
    name: 'Mining',
    category: 'Chrome Extension',
    tagline: 'Clip web content straight to Obsidian',
    description:
      'A Chrome extension for saving web research to your Obsidian vault. Highlight text on any page, turn it into a blockquote memo, then export as a Markdown file with YAML frontmatter including the source URL.',
    features: [
      'Highlight-to-blockquote capture',
      'Save directly to Obsidian vault as .md',
      'YAML frontmatter with source URL',
      'Up to 5 active memos',
      'Popup memo editor',
    ],
    techStack: ['Chrome Extension MV3', 'React', 'Vite', 'TypeScript', 'Tailwind CSS'],
    year: '2024',
    links: {
      github: '#',
      chromeStore: '#',
    },
  },
];
