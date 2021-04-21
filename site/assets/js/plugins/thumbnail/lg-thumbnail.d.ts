import { LgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import { GalleryItem } from '../../lg-utils';
interface ThumbDragUtils {
    cords: {
        startX: number;
        endX: number;
    };
    isMoved: boolean;
    newTranslateX: number;
    startTime: Date;
    endTime: Date;
    touchMoveTime: number;
}
interface ThumbnailGalleryItem extends GalleryItem {
    thumb: string;
}
export default class Thumbnail {
    private core;
    private $thumbOuter;
    private $lgThumb;
    private thumbOuterWidth;
    private thumbTotalWidth;
    private translateX;
    private thumbClickable;
    private settings;
    private $LG;
    constructor(instance: LightGallery, $LG: LgQuery);
    init(): void;
    build(): void;
    setThumbMarkup(): void;
    enableThumbDrag(): void;
    enableThumbSwipe(): void;
    rebuildThumbnails(): void;
    setTranslate(value: number): void;
    getPossibleTransformX(left: number): number;
    animateThumb(index: number): void;
    onThumbTouchMove(thumbDragUtils: ThumbDragUtils): ThumbDragUtils;
    onThumbTouchEnd(thumbDragUtils: ThumbDragUtils): ThumbDragUtils;
    getThumbHtml(thumb: string, index: number): string;
    getThumbItemHtml(items: ThumbnailGalleryItem[]): string;
    setThumbItemHtml(items: ThumbnailGalleryItem[]): void;
    setAnimateThumbStyles(): void;
    manageActiveClassOnSlideChange(): void;
    toggleThumbBar(): void;
    thumbKeyPress(): void;
    destroy(): void;
}
export {};
