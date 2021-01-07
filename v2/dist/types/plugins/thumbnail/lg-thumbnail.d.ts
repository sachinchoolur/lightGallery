import { lgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import { DynamicItem } from '../../lg-utils';
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
declare global {
    interface Window {
        LG: (selector: any) => lgQuery;
    }
}
interface ThumbnailDynamicItem extends DynamicItem {
    thumb: string;
}
export declare class Thumbnail {
    private core;
    private $thumbOuter;
    private $lgThumb;
    private thumbOuterWidth;
    private thumbTotalWidth;
    private translateX;
    private thumbClickable;
    private s;
    constructor(instance: LightGallery);
    init(): void;
    build(): void;
    setThumbMarkup(): void;
    enableThumbDrag(): void;
    enableThumbSwipe(): void;
    addNewThumbnails(items: ThumbnailDynamicItem[]): void;
    appendThumbItems(items: ThumbnailDynamicItem[]): void;
    setTranslate(value: number): void;
    getPossibleTransformX(left: number): number;
    animateThumb(index: number): void;
    onThumbTouchMove(thumbDragUtils: ThumbDragUtils): ThumbDragUtils;
    onThumbTouchEnd(thumbDragUtils: ThumbDragUtils): ThumbDragUtils;
    getVimeoErrorThumbSize(size: string): string;
    getThumbHtml(thumb: any, index: number): string;
    setThumbItemHtml(items: ThumbnailDynamicItem[]): void;
    getThumbnails(): void;
    loadVimeoThumbs($thumb: lgQuery, size: string): void;
    setAnimateThumbStyles(): void;
    manageActiveClas(): void;
    toggleThumbBar(): void;
    thumbKeyPress(): void;
    destroy(clear?: boolean): void;
}
export {};
