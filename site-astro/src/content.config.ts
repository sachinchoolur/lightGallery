import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Collections mirror the Hugo content sections one-to-one. Slugs (and
 * therefore URLs) must match the Hugo site exactly — URL preservation is
 * a hard requirement of the migration.
 *
 * `title` and `description` are REQUIRED everywhere: they feed the
 * Metadata head component (meta description, Open Graph), so a page
 * missing either fails the build instead of shipping with empty SEO tags.
 */

/** Frontmatter every Hugo section shares. */
const baseSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    /** Sub-heading shown under the title (Hugo `lead`). */
    lead: z.string().optional(),
    date: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    /** Social-share image paths (Hugo convention; empty on most pages). */
    images: z.array(z.string()).default([]),
    /** Sidebar/list ordering (replaces Hugo's file-order fallback). */
    weight: z.number().optional(),
    toc: z.boolean().optional(),
});

/**
 * Hugo `menu: { <section>: { parent, name? } }` — drives sidebar grouping;
 * `name` overrides the sidebar label (defaults to the page title).
 */
const menuSchema = (section: string) =>
    z
        .object({
            [section]: z.object({
                parent: z.string(),
                name: z.string().optional(),
            }),
        })
        .optional();

const docs = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
    schema: baseSchema.extend({
        menu: menuSchema('docs'),
    }),
});

const demos = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/demos' }),
    schema: baseSchema.extend({
        menu: menuSchema('demos'),
        has_video: z.boolean().optional(),
    }),
});

const blog = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
    schema: baseSchema.extend({
        /** Hugo page bundles can override their URL slug. */
        slug: z.string().optional(),
        lastmod: z.coerce.date().optional(),
        tags: z.array(z.string()).default([]),
        contributors: z.array(z.string()).default([]),
        /** Site name heading override used by the blog list page. */
        heading: z.string().optional(),
    }),
});

/** Standalone pages: home (_index), license, jquery-to-js-converter. */
const pages = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
    schema: baseSchema,
});

/** The repo's CHANGELOG.md, rendered at /changelog/. */
const changelog = defineCollection({
    loader: glob({ pattern: 'CHANGELOG.md', base: '..' }),
    schema: z.object({}),
});

export const collections = { docs, demos, blog, pages, changelog };
