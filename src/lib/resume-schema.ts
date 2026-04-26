import { z } from 'astro/zod';

const profile = z.object({
  network: z.string(),
  username: z.string(),
  url: z.url(),
});

const location = z.object({
  city: z.string(),
  region: z.string().optional(),
  countryCode: z.string(),
});

const basics = z.object({
  name: z.string(),
  label: z.string(),
  email: z.email(),
  url: z.url().optional(),
  summary: z.string().optional(),
  location,
  profiles: z.array(profile).default([]),
});

export const WORK_IDS = ['flottando', 'jimdo', 'freenow', 'bauer', 'fashion'] as const;

const workXSite = z.object({
  n: z.string(),
  client: z.string(),
  title: z.string(),
  summary: z.string().optional(),
  pillars: z.array(z.tuple([z.string(), z.string()])),
  stack: z.array(z.string()),
});

const workItem = z.object({
  id: z.enum(WORK_IDS),
  name: z.string(),
  position: z.string(),
  location: z.string().optional(),
  url: z.url().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  summary: z.string(),
  highlights: z.array(z.string()).default([]),
  x_site: workXSite.optional(),
  x_cv: z
    .object({
      highlights: z.array(z.string()).default([]),
    })
    .optional(),
});

const educationItem = z.object({
  institution: z.string(),
  area: z.string(),
  studyType: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  score: z.string().optional(),
  location: z.string().optional(),
});

const skillGroup = z.object({
  name: z.string(),
  keywords: z.array(z.string()),
});

const projectXSite = z.object({
  year: z.string(),
  note: z.string(),
});

const projectItem = z.object({
  name: z.string(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  url: z.url().optional(),
  highlights: z.array(z.string()).default([]),
  x_site: projectXSite.optional(),
  x_cv: z
    .object({
      highlights: z.array(z.string()).default([]),
    })
    .optional(),
});

const languageItem = z.object({
  language: z.string(),
  fluency: z.string(),
});

const heroBlock = z.object({
  eyebrow: z.string(),
  headline: z.string(),
  sub: z.string(),
});

const nowEntry = z.object({
  kind: z.string(),
  text: z.string(),
});

const ossEntry = z.object({
  repo: z.string(),
  note: z.string(),
  stars: z.string(),
});

const xSiteRoot = z.object({
  shortName: z.string(),
  initials: z.string(),
  hero: heroBlock,
  now: z.array(nowEntry),
  about: z.object({
    paragraphs: z.array(z.string()),
  }),
  oss: z.array(ossEntry),
});

const cvOssEntry = z.object({
  repo: z.string(),
  note: z.string(),
  stars: z.string(),
});

const xCvRoot = z.object({
  tagline: z.string(),
  summary_highlights: z.array(z.string()).default([]),
  oss: z.array(cvOssEntry).default([]),
});

export const resumeSchema = z.object({
  basics,
  work: z.array(workItem),
  education: z.array(educationItem).default([]),
  skills: z.array(skillGroup).default([]),
  projects: z.array(projectItem).default([]),
  languages: z.array(languageItem).default([]),
  meta: z
    .object({
      canonical: z.url().optional(),
      version: z.string().optional(),
      lastModified: z.string().optional(),
    })
    .optional(),
  x_site: xSiteRoot,
  x_cv: xCvRoot.optional(),
});

export type Resume = z.infer<typeof resumeSchema>;
export type WorkItem = z.infer<typeof workItem>;
export type ProjectItem = z.infer<typeof projectItem>;
export type LanguageItem = z.infer<typeof languageItem>;
