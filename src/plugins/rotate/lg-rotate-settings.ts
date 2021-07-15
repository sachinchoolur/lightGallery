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
}
export const rotateSettings = {
    rotate: true,
    rotateSpeed: 400,
    rotateLeft: true,
    rotateRight: true,
    flipHorizontal: true,
    flipVertical: true,
};
