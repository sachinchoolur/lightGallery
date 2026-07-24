import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    site: 'https://www.lightgalleryjs.com',
    // The Hugo site serves every page under a trailing slash; URL parity
    // is a hard requirement of the migration.
    trailingSlash: 'always',
    integrations: [mdx(), react(), sitemap()],
});
