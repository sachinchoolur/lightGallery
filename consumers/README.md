# Consumer apps

Small apps that use lightGallery the way the docs tell users to, one per
server-rendering stack:

| Folder | Stack | Package |
| --- | --- | --- |
| `next/` | Next.js App Router, rendered per request | `@lightgallery/react` |
| `nuxt/` | Nuxt, server-rendered | `@lightgallery/vue` |
| `angular-ssr/` | Angular with `@angular/ssr`, rendered per request | `@lightgallery/angular` |

Each renders the same four-photo gallery with the zoom and thumbnail
plugins. They are not part of the pnpm workspace on purpose: the check
installs the packed tarballs into a scratch copy, so nothing resolves to
workspace source.

```bash
npm run check:consumers                        # pack the current builds and check them
npm run check:consumers -- --version 3.0.0     # check a version on the registry
npm run check:consumers -- --only nuxt --keep  # one app, keep the scratch folder
```

Build the packages first (`npm run build` and each package's `build`).
`npm run release:check` runs the same check on the tarballs it is about to
publish; pass `--skip-consumers` to leave it out.

The check (`scripts/check-consumers.mjs`) installs each app, compiles every
lightGallery declaration it installed with `skipLibCheck` off, runs the
app's type check and production build, then drives the production server
in headless Chrome: the server HTML (each trigger links to its image, no
lightbox markup), the console through hydration, the keyboard path (Tab,
Enter, ArrowRight, Escape, focus back on the trigger) and an axe WCAG 2.1
A/AA audit. It then compares the triggers and the open lightbox across the
three apps; the lg-* classes and ARIA attributes must match.

It needs Chrome or Chromium; set `CHROME_PATH` when it is not in a usual
place. Photos are generated at run time, so the apps need no fixtures and
no network beyond the npm registry.

Keep the apps close to what a new project gets from each framework's
scaffold and to the snippets in the docs. When a docs snippet changes,
change the matching app.
