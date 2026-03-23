import { Project } from '../types';

export const projects: Project[] = [
  {
    slug: 'deck',
    name: 'Deck',
    category: 'Desktop App',
    tagline: 'AI-native presentation tool',
    description: 'AI가 프롬프트에서 HTML/CSS 슬라이드를 생성하는 데스크탑 앱. BYOK 방식(Claude/ChatGPT API).',
    features: [
      'AI slide generation from prompt',
      'Dual-mode editor (visual + code)',
      'Presentation mode with speaker notes',
      'PDF/HTML export',
      '.prz file format'
    ],
    techStack: ['Electron', 'React', 'TypeScript', 'Vite', 'Claude API', 'OpenAI API'],
    year: '2025',
    links: {
      github: '#',
      website: '#'
    }
  },
  {
    slug: 'sift',
    name: 'Sift',
    category: 'Mobile App',
    tagline: 'Read later, without the clutter',
    description: 'iOS/Android Share Sheet으로 링크를 저장하고, 리치 프리뷰와 인앱 브라우저로 읽는 앱.',
    features: [
      'iOS/Android Share Sheet integration',
      'Rich link previews',
      'In-app browser reader',
      'Tagging & organization',
      'Offline archive'
    ],
    techStack: ['React Native', 'Expo', 'TypeScript', 'Zustand', 'expo-sqlite', 'Drizzle ORM'],
    year: '2025',
    links: {
      github: '#',
      appStore: '#'
    }
  },
  {
    slug: 'svrtime',
    name: 'svrTime',
    category: 'Chrome Extension',
    tagline: 'Precise server time in your browser',
    description: '웹 서버의 정확한 시간을 밀리초 단위로 표시하는 크롬 익스텐션. RTT 보정으로 정밀도 향상.',
    features: [
      'Millisecond-precision server time',
      'RTT (round-trip time) correction',
      'Chrome Side Panel UI',
      'Works on any website'
    ],
    techStack: ['Chrome Extension MV3', 'Side Panel API', 'TypeScript'],
    year: '2024',
    links: {
      github: '#',
      chromeStore: '#'
    }
  },
  {
    slug: 'mining',
    name: 'Mining',
    category: 'Chrome Extension',
    tagline: 'Clip web content to Obsidian',
    description: '웹 페이지에서 텍스트를 하이라이트하고 Obsidian 볼트에 메모로 저장하는 크롬 익스텐션.',
    features: [
      'Highlight-to-blockquote capture',
      'Direct save to Obsidian vault as .md',
      'YAML frontmatter with source URL',
      'Up to 5 active memos',
      'Popup memo editor'
    ],
    techStack: ['Chrome Extension MV3', 'React', 'Vite', 'TypeScript', 'Tailwind CSS'],
    year: '2024',
    links: {
      github: '#',
      chromeStore: '#'
    }
  }
];
