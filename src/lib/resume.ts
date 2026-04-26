import { getEntry } from 'astro:content';
import type { Resume, WorkItem, ProjectItem, LanguageItem } from './resume-schema';

export type WorkId = WorkItem['id'];

export interface Work {
  id: WorkId;
  n: string;
  year: string;
  client: string;
  location: string;
  title: string;
  role: string;
  summary: string;
  pillars: [string, string][];
  stack: string[];
}

export interface NowEntry {
  kind: string;
  text: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface SideProject {
  year: string;
  name: string;
  note: string;
}

export interface OssEntry {
  repo: string;
  note: string;
  stars: string;
}

export interface Portfolio {
  name: string;
  shortName: string;
  initials: string;
  role: string;
  location: string;
  email: string;
  github: string;
  site: string;
  hero: { eyebrow: string; headline: string; sub: string };
  now: NowEntry[];
  work: Work[];
  about: { paragraphs: string[]; languages: Language[] };
  side: SideProject[];
  oss: OssEntry[];
}

const formatYear = (start: string, end?: string): string => {
  const startYear = start.slice(0, 4);
  if (!end) return `${startYear} — Now`;
  const endYear = end.slice(0, 4);
  return startYear === endYear ? startYear : `${startYear} — ${endYear}`;
};

const formatLocation = (city: string, countryCode: string): string => `${city}, ${countryCode}`;

const requireXSite = <T>(value: T | undefined, label: string): T => {
  if (value === undefined) {
    throw new Error(`resume.yaml: missing x_site on ${label}. The site requires this field.`);
  }
  return value;
};

const toWork = (w: WorkItem): Work => {
  const x = requireXSite(w.x_site, `work entry "${w.id}"`);
  return {
    id: w.id,
    n: x.n,
    year: formatYear(w.startDate, w.endDate),
    client: x.client,
    location: w.location ?? '',
    title: x.title,
    role: w.position,
    summary: x.summary ?? w.summary,
    pillars: x.pillars,
    stack: x.stack,
  };
};

const toSide = (p: ProjectItem): SideProject => {
  const x = requireXSite(p.x_site, `project "${p.name}"`);
  return { year: x.year, name: p.name, note: x.note };
};

const toLanguage = (l: LanguageItem): Language => ({
  name: l.language,
  level: l.fluency,
});

const githubProfile = (data: Resume): string => {
  const gh = data.basics.profiles.find((p) => p.network.toLowerCase() === 'github');
  if (!gh) throw new Error('resume.yaml: basics.profiles is missing GitHub');
  return gh.url.replace(/^https?:\/\//, '');
};

const siteHost = (data: Resume): string => {
  if (!data.basics.url) {
    throw new Error('resume.yaml: basics.url is required for site display');
  }
  return data.basics.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
};

const buildPortfolio = (data: Resume): Portfolio => ({
  name: data.basics.name,
  shortName: data.x_site.shortName,
  initials: data.x_site.initials,
  role: data.basics.label,
  location: formatLocation(data.basics.location.city, data.basics.location.countryCode),
  email: data.basics.email,
  github: githubProfile(data),
  site: siteHost(data),
  hero: data.x_site.hero,
  now: data.x_site.now,
  work: data.work.map(toWork),
  about: {
    paragraphs: data.x_site.about.paragraphs,
    languages: data.languages.map(toLanguage),
  },
  side: data.projects.filter((p) => p.x_site !== undefined).map(toSide),
  oss: data.x_site.oss,
});

export const loadPortfolio = async (): Promise<Portfolio> => {
  const entry = await getEntry('resume', 'resume');
  if (!entry) {
    throw new Error("resume.yaml: missing entry with id 'resume'");
  }
  return buildPortfolio(entry.data);
};
