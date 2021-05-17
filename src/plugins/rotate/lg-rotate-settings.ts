export interface RotateSettings {
    /**
     * Enable/Disable rotate option
     */
    rotate: boolean;

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
}
export const rotateSettings = {
    rotate: true,
    rotateLeft: true,
    rotateRight: true,
    flipHorizontal: true,
    flipVertical: true,
};
