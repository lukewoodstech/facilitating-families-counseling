import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Service areas. One markdown file per service in src/content/services/.
 * The file name becomes the URL: eating-disorders.md -> /services/eating-disorders
 */
const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    /** Short name used on cards and in navigation */
    cardTitle: z.string(),
    /** Card blurb (Emree's words from the old home / Scope of Practice page) */
    summary: z.string(),
    description: z.string(),
    order: z.number(),
    image: z.object({ src: z.string(), alt: z.string(), todo: z.string().optional() }),
    /** Notes about missing content, shown as a placeholder on the page */
    todos: z.array(z.string()).default([]),
  }),
});

/**
 * Standalone pages (home, about, services overview, licenses & payments, contact).
 * Structured fields live in frontmatter; long-form copy is the markdown body.
 */
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    eyebrow: z.string().optional(),
    heading: z.string().optional(),
    hero: z
      .object({
        headline: z.string(),
        subhead: z.string().optional(),
      })
      .optional(),
    states: z.array(z.string()).optional(),
    paymentOptions: z.array(z.string()).optional(),
    insurers: z.array(z.string()).optional(),
    todos: z.array(z.string()).default([]),
  }),
});

export const collections = { services, pages };
