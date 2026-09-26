import { signal } from '@angular/core';

/** Page settings as one signal, patched a key at a time. */
export function settingsStore<T extends object>(initial: T) {
    const value = signal(initial);
    return {
        value,
        patch<K extends keyof T>(key: K, next: T[K]): void {
            value.update((current) => ({ ...current, [key]: next }));
        },
    };
}

export function flip<T>(list: readonly T[], value: T): T[] {
    return list.includes(value)
        ? list.filter((entry) => entry !== value)
        : [...list, value];
}

/** The option a `<select>` change picked, typed as the option list. */
export function pick<T extends string | number>(
    options: readonly T[],
    event: Event,
): T {
    const raw = (event.target as HTMLSelectElement).value;
    return options.find((entry) => String(entry) === raw) ?? options[0];
}

export function checked(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
}
