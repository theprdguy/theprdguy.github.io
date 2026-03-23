export const dynamic = "force-static";

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://theprdguy.github.io/sitemap.xml',
  };
}
