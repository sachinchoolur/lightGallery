/**
 * Builds the file set of each sandbox project from the folders next to
 * this file. The site reads the folders through Vite and the check script
 * reads them from disk; both go through here, so they see one project.
 *
 *   templates/<framework>/      the project scaffold
 *   shared/                     files a project gets under src/
 *   demos/<demo>/demo.json      { "title": "…" }
 *   demos/<demo>/<framework>/   the example itself; wins over the scaffold
 */

/** `__LIGHTGALLERY_VERSION__` in a template is replaced with the released version. */
const VERSION_TOKEN = '__LIGHTGALLERY_VERSION__';

export const FRAMEWORKS = {
    vanilla: {
        label: 'JavaScript',
        open: 'src/main.js',
        shared: ['demo.css'],
    },
    react: {
        label: 'React',
        open: 'src/App.tsx',
        shared: ['demo.css', 'photos.ts'],
    },
    vue: {
        label: 'Vue',
        open: 'src/App.vue',
        shared: ['demo.css', 'photos.ts'],
    },
    angular: {
        label: 'Angular',
        open: 'src/app/app.ts',
        shared: ['demo.css', 'photos.ts'],
    },
};

/**
 * @param {Record<string, string>} sources file contents keyed by their
 *   path inside this folder, e.g. `templates/react/package.json`
 * @param {string} version the lightGallery version the projects install
 */
export function assembleSandboxes(sources, version) {
    const under = (prefix) =>
        Object.entries(sources)
            .filter(([path]) => path.startsWith(prefix))
            .map(([path, content]) => [path.slice(prefix.length), content]);

    const demos = new Set(
        Object.keys(sources)
            .map((path) => /^demos\/([^/]+)\//.exec(path)?.[1])
            .filter(Boolean),
    );

    const sandboxes = [];
    for (const demo of [...demos].sort()) {
        const meta = JSON.parse(sources[`demos/${demo}/demo.json`] ?? '{}');
        for (const [framework, config] of Object.entries(FRAMEWORKS)) {
            const example = under(`demos/${demo}/${framework}/`);
            if (example.length === 0) {
                continue;
            }
            const files = Object.fromEntries(under(`templates/${framework}/`));
            for (const name of config.shared) {
                files[`src/${name}`] = sources[`shared/${name}`];
            }
            Object.assign(files, Object.fromEntries(example));
            for (const [path, content] of Object.entries(files)) {
                files[path] = content.replaceAll(VERSION_TOKEN, version);
            }
            sandboxes.push({
                demo,
                framework,
                label: config.label,
                title: `lightGallery ${meta.title ?? demo} (${config.label})`,
                open: config.open,
                files,
            });
        }
    }
    return sandboxes;
}
