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
    // The current version always lives at the bare /docs/<slug>/ URL. The
    // framework and feature pages spent a short while under /docs/v3/;
    // these keep any link that was shared in the meantime working.
    redirects: {
        '/docs/v3/': '/docs/getting-started/',
        '/docs/v3/react/': '/docs/react/',
        '/docs/v3/vue/': '/docs/vue/',
        '/docs/v3/angular/': '/docs/angular/',
        '/docs/v3/headless/': '/docs/headless/',
        '/docs/v3/justified-layout/': '/docs/justified-layout/',
        '/docs/v3/localization-rtl/': '/docs/localization-rtl/',
        '/docs/v3/virtualization/': '/docs/virtualization/',
        '/docs/v3/video-facades/': '/docs/video-facades/',
        '/docs/v3/accessibility/': '/docs/accessibility/',
        '/docs/v3/web-share/': '/docs/web-share/',
        '/docs/v3/hash-drivers/': '/docs/hash-drivers/',
        '/docs/v3/responsive-loading/': '/docs/responsive-loading/',
    },
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
