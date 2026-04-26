import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse as parseYaml } from 'yaml';
import { resumeSchema } from './lib/resume-schema';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    kicker: z.string(),
    draft: z.boolean().optional(),
  }),
});

const resume = defineCollection({
  // Parser wraps the flat JSON-Resume YAML into a single-entry map so the
  // file stays canonical on disk (no wrapper key) and editor-side JSON Resume
  // schema validators don't complain.
  loader: file('src/data/resume.yaml', {
    parser: (text) => ({ resume: parseYaml(text) }),
  }),
  schema: resumeSchema,
});

export const collections = { writing, resume };
