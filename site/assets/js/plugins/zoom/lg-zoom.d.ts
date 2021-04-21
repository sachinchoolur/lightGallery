import { LgQuery, lgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
interface Coords {
    x: number;
    y: number;
}
interface ZoomTouchEvent {
    pageX: number;
    targetTouches: {
        pageY: number;
        pageX: number;
    }[];
    pageY: number;
}
interface PossibleCords {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}
export default class Zoom {
    private core;
    private settings;
    private $LG;
    zoomableTimeout: any;
    positionChanged: boolean;
    pageX: number;
    pageY: number;
    scale: number;
    constructor(instance: LightGallery, $LG: LgQuery);
    buildTemplates(): void;
    /**
     * @desc Enable zoom option only once the image is completely loaded
     * If zoomFromOrigin is true, Zoom is enabled once the dummy image has been inserted
     *
     * Zoom styles are defined under lg-zoomable CSS class.
     */
    enableZoom(event: CustomEvent): void;
    enableZoomOnSlideItemLoad(): void;
    getModifier(rotateValue: number, axis: string, el: HTMLElement): number;
    getImageSize($image: HTMLImageElement, rotateValue: number, axis: string): any;
    getDragCords(e: MouseEvent, rotateValue: number): Coords;
    getSwipeCords(e: TouchEvent, rotateValue: number): Coords;
    getDragAllowedAxises($image: lgQuery, rotateValue: number): {
        allowX: boolean;
        allowY: boolean;
    };
    /**
     *
     * @param {Element} el
     * @return matrix(cos(X), sin(X), -sin(X), cos(X), 0, 0);
     * Get the current transform value
     */
    getCurrentTransform(el: HTMLElement): string[] | undefined;
    getCurrentRotation(el: HTMLElement): number;
    /**
     * @desc Image zoom
     * Translate the wrap and scale the image to get better user experience
     *
     * @param {String} scale - Zoom decrement/increment value
     */
    zoomImage(scale: number): void;
    /**
     * @desc apply scale3d to image and translate to image wrap
     * @param {style} X,Y and scale
     */
    setZoomStyles(style: {
        x: number;
        y: number;
        scale: number;
    }): void;
    /**
     * @param index - Index of the current slide
     * @param event - event will be available only if the function is called on clicking/taping the imags
     */
    setActualSize(index: number, event?: ZoomTouchEvent): void;
    getNaturalWidth(index: number): number;
    getActualSizeScale(naturalWidth: number, width: number): number;
    getCurrentImageActualSizeScale(): number;
    getPageCords(event?: ZoomTouchEvent): Coords;
    setPageCords(event?: ZoomTouchEvent): void;
    beginZoom(scale: number): boolean;
    getScale(scale: number): number;
    init(): void;
    zoomIn(scale?: number): void;
    resetZoom(index?: number): void;
    getTouchDistance(e: TouchEvent): number;
    pinchZoom(): void;
    touchendZoom(startCoords: Coords, endCoords: Coords, allowX: boolean, allowY: boolean, touchDuration: number, rotateValue: number): void;
    getZoomSwipeCords(startCoords: Coords, endCoords: Coords, allowX: any, allowY: any, possibleSwipeCords: PossibleCords, dataY: number, dataX: number, rotateValue: number, rotateEl: HTMLElement): Coords;
    getPossibleSwipeDragCords($image: lgQuery, rotateValue: number): PossibleCords;
    setZoomSwipeStyles(LGel: lgQuery, distance: {
        x: number;
        y: number;
    }): void;
    zoomSwipe(): void;
    zoomDrag(): void;
    closeGallery(): void;
    destroy(): void;
}
export {};
