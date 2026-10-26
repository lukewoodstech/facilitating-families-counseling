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
    /** Page heading, exactly as on Emree's page */
    title: z.string(),
    /** Card heading, exactly as on Emree's home page */
    cardTitle: z.string(),
    /** Card blurb, exactly as on Emree's home page. Omit when she never wrote one. */
    summary: z.string().optional(),
    /** Shown on the card when `summary` is missing */
    summaryTodo: z.string().optional(),
    description: z.string(),
    order: z.number(),
    /** File name of the original tree illustration in src/assets/original/ */
    tree: z.string(),
    treeAlt: z.string(),
    todos: z.array(z.string()).default([]),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heading: z.string().optional(),
    hero: z.object({ headline: z.string() }).optional(),
    states: z.array(z.object({ name: z.string(), image: z.string() })).optional(),
    paymentOptions: z.array(z.string()).optional(),
    insurers: z.array(z.string()).optional(),
    todos: z.array(z.string()).default([]),
  }),
});

export const collections = { services, pages };
