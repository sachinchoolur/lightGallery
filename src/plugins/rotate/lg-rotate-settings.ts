export interface RotateStrings {
    flipVertical: string;
    flipHorizontal: string;
    rotateLeft: string;
    rotateRight: string;
}

export interface RotateSettings {
    /**
     * Enable/Disable rotate option
     */
    rotate: boolean;

    /**
     * Rotate speed in milliseconds
     */
    rotateSpeed: number;

    /**
     * Enable rotate left.
     */
    rotateLeft: boolean;

    /**
     * Enable rotate right.
     */
    rotateRight: boolean;

    /**
     * Enable flip horizontal.
     */
    flipHorizontal: boolean;

    /**
     * Enable flip vertical.
     */
    flipVertical: boolean;

    /**
     * Custom translation strings for aria-labels
     * @deprecated Set these labels on the core `strings` object instead —
     * every user-facing string lives in that one contract. An explicitly set
     * key here still wins (alias).
     */
    rotatePluginStrings?: Partial<RotateStrings>;
}
export const rotateSettings = {
    rotate: true,
    rotateSpeed: 400,
    rotateLeft: true,
    rotateRight: true,
    flipHorizontal: true,
    flipVertical: true,
};
