import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// https://astro.build/config
export default defineConfig({
    site: 'https://www.lightgalleryjs.com',
    // The Hugo site serves every page under a trailing slash; URL parity
    // is a hard requirement of the migration.
    trailingSlash: 'always',
    // Until the Hugo retirement swap, the 61 MB static tree stays in
    // site/static and is shared by both builds instead of duplicated.
    publicDir: '../site/static',
    integrations: [mdx(), react(), sitemap()],
    markdown: {
        rehypePlugins: [
            [
                // Same markup the Hugo `headline-hash` partial appended:
                // <a href="#id" class="anchor" aria-hidden="true">#</a>
                rehypeAutolinkHeadings,
                {
                    behavior: 'append',
                    content: { type: 'text', value: '#' },
                    properties: { className: 'anchor', ariaHidden: 'true' },
                },
            ],
        ],
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    // Bootstrap 5.0-beta1 (pinned for pixel parity)
                    // predates modern Sass syntax.
                    quietDeps: true,
                    silenceDeprecations: [
                        'import',
                        'global-builtin',
                        'slash-div',
                        'color-functions',
                        'mixed-decls',
                    ],
                },
            },
        },
    },
});
