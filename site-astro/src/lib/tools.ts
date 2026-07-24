/**
 * The two tool pages are raw-HTML Hugo `_index.html` files (their Hugo
 * layouts were bare `{{ .Content }}`). Frontmatter is parsed here; the
 * body renders verbatim.
 */
export interface ToolPage {
    title: string;
    description: string;
    body: string;
}

export function loadToolPage(raw: string): ToolPage {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) throw new Error('Tool page has no frontmatter');
    const fm = match[1];
    const field = (name: string): string => {
        const single = fm.match(new RegExp(`^${name}:\\s*(['"]?)([\\s\\S]*?)\\1\\s*$`, 'm'));
        if (single && single[2].trim()) return single[2].trim();
        // Indented continuation form (`description:\n    '...'`).
        const multi = fm.match(new RegExp(`^${name}:\\s*\\n((?:[ \\t]+.*\\n?)+)`, 'm'));
        return (multi?.[1] ?? '')
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/^['"]|['"]$/g, '');
    };
    return {
        title: field('title'),
        description: field('description'),
        body: match[2],
    };
}
