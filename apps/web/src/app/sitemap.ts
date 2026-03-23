export const dynamic = "force-static";
import { projects } from '@/data/projects';

const base = 'https://theprdguy.github.io';

export default function sitemap() {
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    ...projects.map(p => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: new Date()
    })),
  ];
}
