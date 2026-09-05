/**
 * Markdown twins of the docs pages, for agents and other machine readers:
 * `/docs/<slug>/index.md`, `/llms.txt` and `/llms-full.txt` all render
 * from here. The source of truth is the same content collection the HTML
 * pages use, so a new page is picked up automatically.
 *
 * Plain `.md` pages pass through as written. `.mdx` pages carry Astro
 * components — the API blocks (settings tables, events, methods,
 * attributes, callbacks) are re-rendered here as markdown from the same
 * TypeDoc data, and the remaining presentational components are reduced
 * to their text.
 */
import type { CollectionEntry } from 'astro:content';

import {
    commentOf,
    findReflection,
    interfaceProps,
    publicMethods,
    settingsDefaults,
    tagText,
    type ApiComment,
} from './apidocs';

export type DocsEntry = CollectionEntry<'docs'>;

export const SITE = 'https://www.lightgalleryjs.com';

export const docsSlug = (entry: DocsEntry): string =>
    entry.id.replace(/\/index$/, '').toLowerCase();

export const docsUrl = (entry: DocsEntry): string =>
    `${SITE}/docs/${docsSlug(entry)}/`;

export const docsMarkdownUrl = (entry: DocsEntry): string =>
    `${docsUrl(entry)}index.md`;

// ---- helpers ---------------------------------------------------------------

/** HTML from JSDoc (links, <code>) → markdown; table-cell safe. */
function inline(html: string): string {
    return html
        .replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/g, (_m, href, text) =>
            `[${text}](${href.startsWith('/') ? SITE + href : href})`,
        )
        .replace(/<code>(.*?)<\/code>/g, '`$1`')
        .replace(/<\/?(b|strong)>/g, '**')
        .replace(/<\/?(i|em)>/g, '_')
        .replace(/<br\s*\/?>/g, ' ')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

const cell = (text: string): string => inline(text).replace(/\|/g, '\\|');

/** Type names contain `<>` — keep them literal inside backticks. */
const typeCell = (type: string): string => `\`${type.replace(/\|/g, '\\|')}\``;

function describe(comment: ApiComment): string {
    return [comment.summary, ...tagText(comment, 'description')]
        .map(inline)
        .filter(Boolean)
        .join(' ');
}

function table(headers: string[], rows: string[][]): string {
    const line = (cells: string[]) => `| ${cells.join(' | ')} |`;
    return [line(headers), line(headers.map(() => '---')), ...rows.map(line)].join('\n');
}

// ---- API blocks ------------------------------------------------------------

function optionsBlock(attrs: Record<string, string>): string {
    const props = interfaceProps(attrs.interface ?? '');
    const defaults = attrs.variable ? settingsDefaults(attrs.variable) : undefined;
    const out: string[] = [];
    if (attrs.pluginName) {
        out.push(`> Plugin dependency: include the ${attrs.pluginName} plugin to use these options.`, '');
    }
    const headers = defaults ? ['Name', 'Type', 'Default', 'Description'] : ['Name', 'Type', 'Description'];
    const rows = props
        .filter((p) => !p.name.startsWith('__'))
        .map((p) => {
            const version = tagText(p.comment, 'version')[0];
            const deprecated = tagText(p.comment, 'deprecated')[0];
            const notes = [
                describe(p.comment),
                version ? `_Since ${version}._` : '',
                deprecated ? `_Deprecated: ${inline(deprecated)}_` : '',
            ]
                .filter(Boolean)
                .join(' ');
            const row = [`\`${p.name}\``, typeCell(p.typeName)];
            if (defaults) row.push(defaults.get(p.name) ? `\`${cell(defaults.get(p.name)!)}\`` : '');
            row.push(cell(notes));
            return row;
        });
    out.push(table(headers, rows));
    return out.join('\n');
}

function attributesBlock(attrs: Record<string, string>): string {
    const props = interfaceProps(attrs.interface ?? '');
    const asData = attrs.data === 'true';
    const rows = props.map((p) => [
        `\`${asData ? 'data-' + p.name.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()) : p.name}\``,
        typeCell(p.typeName),
        cell(describe(p.comment)),
    ]);
    return table([asData ? 'Attribute' : 'Property', 'Type', 'Description'], rows);
}

function eventLikeBlock(attrs: Record<string, string>, nameTag: 'name' | 'method'): string {
    const meta = commentOf(findReflection(attrs.interface ?? ''));
    const detail = interfaceProps(attrs.interface ?? '');
    const out: string[] = [];
    for (const name of tagText(meta, nameTag)) out.push(`### \`${inline(name)}\``, '');
    if (meta.summary) out.push(inline(meta.summary), '');
    if (detail.length) {
        out.push(
            '**Detail**',
            '',
            table(
                ['Name', 'Type', 'Description'],
                detail.map((p) => [`\`${p.name}\``, typeCell(p.typeName), cell(describe(p.comment))]),
            ),
            '',
        );
    }
    for (const example of tagText(meta, 'example')) {
        out.push('**Example**', '', '```js', example.trim(), '```', '');
    }
    for (const see of tagText(meta, 'see')) out.push(`See also: ${inline(see)}`, '');
    return out.join('\n').trimEnd();
}

function methodsBlock(): string {
    const out: string[] = [];
    for (const method of publicMethods()) {
        out.push(`### \`${method.name}()\``, '');
        if (method.comment.summary) out.push(inline(method.comment.summary), '');
        for (const text of tagText(method.comment, 'description')) out.push(inline(text), '');
        for (const example of tagText(method.comment, 'example')) {
            out.push('```js', example.trim(), '```', '');
        }
    }
    return out.join('\n').trimEnd();
}

// ---- component reduction ---------------------------------------------------

function parseAttrs(source: string): Record<string, string> {
    const attrs: Record<string, string> = {};
    for (const m of source.matchAll(/([\w-]+)=(?:"([^"]*)"|\{([^}]*)\})/g)) {
        attrs[m[1]] = (m[2] ?? m[3] ?? '').trim();
    }
    return attrs;
}

const FRAMEWORK_LABELS: Record<string, string> = {
    vanilla: 'JavaScript',
    react: 'React',
    vue: 'Vue',
    angular: 'Angular',
};

/**
 * Reduce MDX to markdown. Fenced code is left untouched (component tags
 * inside examples are legitimately code); component tags outside fences
 * are rendered or dropped.
 */
function reduceMdx(body: string, url: string): string {
    const parts = body.split(/(```[\s\S]*?```)/g);
    return parts
        .map((part, i) => {
            if (i % 2 === 1) return part; // fenced code
            return part
                .replace(/^import .*$/gm, '')
                .replace(/^[ \t]*<Options\b([^>]*)\/>/gm, (_m, a) => optionsBlock(parseAttrs(a)))
                .replace(/^[ \t]*<Attributes\b([^>]*)\/>/gm, (_m, a) => attributesBlock(parseAttrs(a)))
                .replace(/^[ \t]*<Events\b([^>]*)\/>/gm, (_m, a) => eventLikeBlock(parseAttrs(a), 'name'))
                .replace(/^[ \t]*<Callbacks\b([^>]*)\/>/gm, (_m, a) => eventLikeBlock(parseAttrs(a), 'method'))
                .replace(/^[ \t]*<Methods\b[^>]*\/>/gm, () => methodsBlock())
                .replace(/<Fragment\s+slot="(\w+)">/g, (_m, key) => `**${FRAMEWORK_LABELS[key] ?? key}**\n`)
                .replace(/<\/Fragment>/g, '')
                .replace(/<\/?CodeTabs[^>]*>/g, '')
                .replace(/<GalleryDemo\b[^>]*\/>/g, `_Live demo: ${url}_`)
                .replace(/<DemoButtons\b[^>]*\/>/g, '')
                .replace(/<\/?ClientOnly>/g, '')
                .replace(/<[A-Z][A-Za-z]*\b[^>]*\/>/g, '') // other self-closing components
                .replace(/<div class="alert[^"]*"[^>]*>([\s\S]*?)<\/div>/g, (_m, text) => `> ${inline(text)}`)
                .replace(/<\/?div\b[^>]*>/g, '') // layout wrappers carry no meaning in markdown
                .replace(/\n{3,}/g, '\n\n');
        })
        .join('');
}

// ---- public API ------------------------------------------------------------

/** The full markdown document for one docs page. */
export function docsMarkdown(entry: DocsEntry): string {
    const url = docsUrl(entry);
    const isMdx = (entry.filePath ?? '').endsWith('.mdx');
    const body = isMdx ? reduceMdx(entry.body ?? '', url) : (entry.body ?? '');
    const lead = entry.data.lead ? `\n${inline(entry.data.lead)}\n` : '';
    return [
        `# ${entry.data.title}`,
        '',
        `> ${entry.data.description.replace(/\s+/g, ' ').trim()}`,
        lead,
        `Canonical page: ${url}`,
        '',
        body.trim(),
        '',
    ].join('\n');
}

/** Sidebar grouping → llms.txt sections. */
export function docsGroup(entry: DocsEntry): string {
    const parent = (entry.data.menu as any)?.docs?.parent as string | undefined;
    if (entry.id.startsWith('v2/')) return 'Archive (version 2 wrappers)';
    if (parent === 'Features') return 'Features';
    if (parent === 'Frameworks') return 'Framework packages';
    return 'Guides and reference';
}
