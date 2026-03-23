export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  techStack: string[];
  category: string;
  links: {
    github?: string;
    website?: string;
    appStore?: string;
    chromeStore?: string;
  };
  year: string;
}
