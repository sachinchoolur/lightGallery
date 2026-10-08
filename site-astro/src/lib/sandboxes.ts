/**
 * Sandbox projects the site hands to StackBlitz: one runnable project per
 * demo and framework, assembled from `site-astro/sandboxes/` and pinned to
 * the lightGallery version this site was built with.
 */
import rootPackage from '../../../package.json';
import { FRAMEWORKS, assembleSandboxes } from '../../sandboxes/assemble.mjs';

export type SandboxFramework = keyof typeof FRAMEWORKS;

export interface Sandbox {
    demo: string;
    framework: SandboxFramework;
    /** Framework name as shown to readers. */
    label: string;
    title: string;
    /** File the editor opens on. */
    open: string;
    /** Project files by path. */
    files: Record<string, string>;
}

const ROOT = '../../sandboxes/';
const raw = import.meta.glob<string>(
    [
        '../../sandboxes/{templates,shared,demos}/**/*',
        // Dotfiles (.stackblitzrc) are skipped unless asked for.
        '../../sandboxes/{templates,shared,demos}/**/.*',
    ],
    { query: '?raw', import: 'default', eager: true },
);
const sources = Object.fromEntries(
    Object.entries(raw).map(([path, content]) => [
        path.slice(ROOT.length),
        content,
    ]),
);

export const sandboxes = assembleSandboxes(
    sources,
    rootPackage.version,
) as Sandbox[];

export function sandboxFor(
    demo: string | undefined,
    framework: string,
): Sandbox | undefined {
    return sandboxes.find(
        (sandbox) => sandbox.demo === demo && sandbox.framework === framework,
    );
}

/** The site page that opens the sandbox. */
export const sandboxPath = (sandbox: Sandbox) =>
    `/sandbox/${sandbox.demo}/${sandbox.framework}/`;
