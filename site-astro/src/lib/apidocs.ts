import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

/**
 * Build-time access to the library API docs — replaces Hugo's
 * `.Site.Data.doc` (TypeDoc JSON, regenerate with `pnpm -w run docs`).
 * The modern TypeDoc no longer inlines settings-object literals, so the
 * per-option defaults are read from the settings sources with the
 * TypeScript AST instead.
 */

const REPO_ROOT = fileURLToPath(new URL('../../..', import.meta.url));
const DOC_JSON = path.join(REPO_ROOT, 'site/data/doc.json');

interface DocNode {
    id: number;
    name: string;
    kind: number;
    children?: DocNode[];
    groups?: { title: string; children?: number[]; categories?: { title: string; children: number[] }[] }[];
    comment?: DocComment;
    type?: DocType;
    signatures?: DocNode[];
}

interface DocComment {
    summary?: { kind: string; text: string }[];
    blockTags?: { tag: string; content: { kind: string; text: string }[] }[];
}

interface DocType {
    type: string;
    name?: string;
    value?: unknown;
    types?: DocType[];
    elementType?: DocType;
    typeArguments?: DocType[];
}

let docCache: DocNode | undefined;
function doc(): DocNode {
    if (!docCache) {
        try {
            docCache = JSON.parse(readFileSync(DOC_JSON, 'utf8')) as DocNode;
        } catch {
            throw new Error(
                `${DOC_JSON} missing or unreadable — run \`pnpm run docs\` at the repo root first.`,
            );
        }
    }
    return docCache;
}

export function findReflection(name: string): DocNode | undefined {
    for (const mod of doc().children ?? []) {
        for (const child of mod.children ?? []) {
            if (child.name === name) return child;
        }
    }
    return undefined;
}

const partsToText = (parts?: { kind: string; text: string }[]): string =>
    (parts ?? [])
        .map((part) => (part.kind === 'code' ? part.text.replace(/^`+|`+$/g, '') : part.text))
        .join('')
        // JSDoc links written without trailing slashes relied on the old
        // host's directory redirects; normalize to the canonical form.
        .replace(/href="(\/[\w/-]*[\w-])"/g, 'href="$1/"');

export interface ApiComment {
    summary: string;
    tags: { tag: string; text: string }[];
}

export function commentOf(node: DocNode | undefined): ApiComment {
    const comment = node?.comment;
    return {
        summary: partsToText(comment?.summary),
        tags: (comment?.blockTags ?? []).map((tag) => ({
            tag: tag.tag.replace(/^@/, ''),
            text: partsToText(tag.content),
        })),
    };
}

export const tagText = (comment: ApiComment, tag: string): string[] =>
    comment.tags.filter((t) => t.tag === tag).map((t) => t.text);

export function typeToString(type?: DocType): string {
    if (!type) return '';
    switch (type.type) {
        case 'intrinsic':
        case 'reference':
            return `${type.name}${type.typeArguments ? `<${type.typeArguments.map(typeToString).join(', ')}>` : ''}`;
        case 'literal':
            return JSON.stringify(type.value);
        case 'array':
            return `${typeToString(type.elementType)}[]`;
        case 'union':
            return (type.types ?? []).map(typeToString).join(' | ');
        case 'intersection':
            return (type.types ?? []).map(typeToString).join(' & ');
        case 'reflection':
            return 'function';
        default:
            return type.name ?? type.type;
    }
}

export interface ApiProperty {
    name: string;
    /** Literal values when the type is a union (rendered as spans). */
    unionValues?: string[];
    typeName: string;
    comment: ApiComment;
}

export function interfaceProps(interfaceName: string): ApiProperty[] {
    const node = findReflection(interfaceName);
    return (node?.children ?? []).map((child) => ({
        name: child.name,
        unionValues:
            child.type?.type === 'union'
                ? (child.type.types ?? []).map((t) =>
                      t.type === 'literal' ? String(t.value) : (t.name ?? t.type),
                  )
                : undefined,
        typeName: typeToString(child.type),
        comment: commentOf(child),
    }));
}

export interface ApiMethod {
    name: string;
    comment: ApiComment;
}

/** LightGallery public methods (the `lGPublicMethods` category). */
export function publicMethods(): ApiMethod[] {
    const lg = findReflection('LightGallery');
    if (!lg) return [];
    const category = (lg.groups ?? [])
        .find((group) => group.title === 'Methods')
        ?.categories?.find((cat) => cat.title === 'lGPublicMethods');
    const ids = new Set(category?.children ?? []);
    const byId = new Map((lg.children ?? []).map((child) => [child.id, child]));
    return [...ids]
        .map((id) => byId.get(id))
        .filter((node): node is DocNode => !!node)
        .flatMap((node) =>
            (node.signatures ?? []).map((signature) => ({
                name: signature.name,
                comment: commentOf(signature),
            })),
        );
}

// ── Settings defaults (TS AST over the settings sources) ─────────────────

const SETTINGS_DIRS = ['src', 'src/plugins'];

let settingsFilesCache: string[] | undefined;
function settingsFiles(): string[] {
    if (!settingsFilesCache) {
        const files: string[] = [];
        for (const dir of SETTINGS_DIRS) {
            const abs = path.join(REPO_ROOT, dir);
            for (const entry of readdirSync(abs, {
                recursive: true,
                withFileTypes: true,
            })) {
                if (entry.isFile() && /settings\.ts$/.test(entry.name)) {
                    files.push(path.join(entry.parentPath, entry.name));
                }
            }
        }
        settingsFilesCache = [...new Set(files)];
    }
    return settingsFilesCache;
}

const defaultsCache = new Map<string, Map<string, string>>();

/** Default values of a settings variable, keyed by option name. */
export function settingsDefaults(variableName: string): Map<string, string> {
    const cached = defaultsCache.get(variableName);
    if (cached) return cached;
    const defaults = new Map<string, string>();
    for (const file of settingsFiles()) {
        const source = ts.createSourceFile(
            file,
            readFileSync(file, 'utf8'),
            ts.ScriptTarget.Latest,
            true,
        );
        for (const statement of source.statements) {
            if (!ts.isVariableStatement(statement)) continue;
            for (const declaration of statement.declarationList.declarations) {
                if (
                    !ts.isIdentifier(declaration.name) ||
                    declaration.name.text !== variableName ||
                    !declaration.initializer ||
                    !ts.isObjectLiteralExpression(declaration.initializer)
                ) {
                    continue;
                }
                for (const property of declaration.initializer.properties) {
                    if (ts.isPropertyAssignment(property)) {
                        defaults.set(
                            property.name.getText(source),
                            property.initializer.getText(source),
                        );
                    }
                }
            }
        }
        if (defaults.size) break;
    }
    defaultsCache.set(variableName, defaults);
    return defaults;
}
