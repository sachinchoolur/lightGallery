/**
 * Cleanup-tracked timers: every timeout in the package goes through this
 * class so unmounting a gallery (even mid-animation) never leaks a timer —
 * the Vue twin of the sibling tracks' timer discipline that the 007 leak
 * audit assumes.
 */
export class LgTimeouts {
    private readonly ids = new Set<ReturnType<typeof setTimeout>>();

    set(fn: () => void, ms: number): void {
        const id = setTimeout(() => {
            this.ids.delete(id);
            fn();
        }, ms);
        this.ids.add(id);
    }

    clearAll(): void {
        this.ids.forEach((id) => clearTimeout(id));
        this.ids.clear();
    }
}
