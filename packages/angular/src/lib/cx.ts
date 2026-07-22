/** Join class names, skipping falsy entries (twin of the React `cx`). */
export function cx(
    ...parts: Array<string | false | null | undefined>
): string {
    return parts.filter(Boolean).join(' ');
}
