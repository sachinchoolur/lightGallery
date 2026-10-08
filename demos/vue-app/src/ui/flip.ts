export function flip<T>(list: readonly T[], value: T): T[] {
    return list.includes(value)
        ? list.filter((entry) => entry !== value)
        : [...list, value];
}
