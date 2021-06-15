import { Component, ElementRef, Input } from '@angular/core';
import lightGallery from 'lightgallery';
import {
    AfterAppendSubHtmlDetail,
    AfterCloseDetail,
    AfterOpenDetail,
    AfterSlideDetail,
    BeforeCloseDetail,
    BeforeNextSlideDetail,
    BeforeOpenDetail,
    BeforePrevSlideDetail,
    BeforeSlideDetail,
    ContainerResizeDetail,
    DragEndDetail,
    DragMoveDetail,
    DragStartDetail,
    InitDetail,
    PosterClickDetail,
    SlideItemLoadDetail,
} from 'lightgallery/lg-events';
import { LightGallerySettings } from 'lightgallery/lg-settings';
import { LightGallery } from 'lightgallery/lightgallery';

const LgMethods = {
    onAfterAppendSlide: 'lgAfterAppendSlide',
    onInit: 'lgInit',
    onHasVideo: 'lgHasVideo',
    onContainerResize: 'lgContainerResize',
    onUpdateSlides: 'lgUpdateSlides',
    onAfterAppendSubHtml: 'lgAfterAppendSubHtml',
    onBeforeOpen: 'lgBeforeOpen',
    onAfterOpen: 'lgAfterOpen',
    onSlideItemLoad: 'lgSlideItemLoad',
    onBeforeSlide: 'lgBeforeSlide',
    onAfterSlide: 'lgAfterSlide',
    onPosterClick: 'lgPosterClick',
    onDragStart: 'lgDragStart',
    onDragMove: 'lgDragMove',
    onDragEnd: 'lgDragEnd',
    onBeforeNextSlide: 'lgBeforeNextSlide',
    onBeforePrevSlide: 'lgBeforePrevSlide',
    onBeforeClose: 'lgBeforeClose',
    onAfterClose: 'lgAfterClose',
};

@Component({
    selector: 'lightgallery',
    template: '<ng-content></ng-content>',
    styles: [],
})
export class LightgalleryComponent {
    private LG!: LightGallery;
    private lgInitialized = false;
    constructor(private _elementRef: ElementRef) {
        this._elementRef = _elementRef;
    }

    @Input() settings!: LightGallerySettings;
    @Input() onAfterAppendSlide?: (detail: AfterSlideDetail) => void;
    @Input() onInit?: (detail: InitDetail) => void;
    @Input() onHasVideo?: (detail: InitDetail) => void;
    @Input() onContainerResize?: (detail: ContainerResizeDetail) => void;
    @Input() onAfterAppendSubHtml?: (detail: AfterAppendSubHtmlDetail) => void;
    @Input() onBeforeOpen?: (detail: BeforeOpenDetail) => void;
    @Input() onAfterOpen?: (detail: AfterOpenDetail) => void;
    @Input() onSlideItemLoad?: (detail: SlideItemLoadDetail) => void;
    @Input() onBeforeSlide?: (detail: BeforeSlideDetail) => void;
    @Input() onAfterSlide?: (detail: AfterSlideDetail) => void;
    @Input() onPosterClick?: (detail: PosterClickDetail) => void;
    @Input() onDragStart?: (detail: DragStartDetail) => void;
    @Input() onDragMove?: (detail: DragMoveDetail) => void;
    @Input() onDragEnd?: (detail: DragEndDetail) => void;
    @Input() onBeforeNextSlide?: (detail: BeforeNextSlideDetail) => void;
    @Input() onBeforePrevSlide?: (detail: BeforePrevSlideDetail) => void;
    @Input() onBeforeClose?: (detail: BeforeCloseDetail) => void;
    @Input() onAfterClose?: (detail: AfterCloseDetail) => void;

    ngAfterViewChecked(): void {
        if (!this.lgInitialized) {
            this.registerEvents();
            this.LG = lightGallery(
                this._elementRef.nativeElement as HTMLElement,
                this.settings,
            );
            this.lgInitialized = true;
        }
    }

    ngOnDestroy(): void {
        this.LG.destroy();
        this.lgInitialized = false;
    }

    private registerEvents(): void {
        if (this.onAfterAppendSlide) {
            this._elementRef.nativeElement.addEventListener(
                LgMethods.onAfterAppendSlide,
                ((event: CustomEvent) => {
                    this.onAfterAppendSlide &&
                        this.onAfterAppendSlide(event.detail);
                }) as EventListener,
            );
        }
        if (this.onInit) {
            this._elementRef.nativeElement.addEventListener(LgMethods.onInit, ((
                event: CustomEvent,
            ) => {
                this.onInit && this.onInit(event.detail);
            }) as EventListener);
        }
        if (this.onHasVideo) {
            this._elementRef.nativeElement.addEventListener(
                LgMethods.onHasVideo,
                ((event: CustomEvent) => {
                    this.onHasVideo && this.onHasVideo(event.detail);
                }) as EventListener,
            );
        }
        if (this.onContainerResize) {
            this._elementRef.nativeElement.addEventListener(
                LgMethods.onContainerResize,
                ((event: CustomEvent) => {
                    this.onContainerResize &&
                        this.onContainerResize(event.detail);
                }) as EventListener,
            );
        }
        if (this.onAfterAppendSubHtml) {
            this._elementRef.nativeElement.addEventListener(
                LgMethods.onAfterAppendSubHtml,
                ((event: CustomEvent) => {
                    this.onAfterAppendSubHtml &&
                        this.onAfterAppendSubHtml(event.detail);
                }) as EventListener,
            );
        }
        if (this.onBeforeOpen) {
            this._elementRef.nativeElement.addEventListener(
                LgMethods.onBeforeOpen,
                ((event: CustomEvent) => {
                    this.onBeforeOpen && this.onBeforeOpen(event.detail);
                }) as EventListener,
            );
        }
        if (this.onAfterOpen) {
            this._elementRef.nativeElement.addEventListener(
                LgMethods.onAfterOpen,
                ((event: CustomEvent) => {
                    this.onAfterOpen && this.onAfterOpen(event.detail);
                }) as EventListener,
            );
        }
        if (this.onSlideItemLoad) {
            this._elementRef.nativeElement.addEventListener(
                LgMethods.onSlideItemLoad,
                ((event: CustomEvent) => {
                    this.onSlideItemLoad && this.onSlideItemLoad(event.detail);
                }) as EventListener,
            );
        }
        if (this.onBeforeSlide) {
            this._elementRef.nativeElement.addEventListener(
                LgMethods.onBeforeSlide,
                ((event: CustomEvent) => {
                    this.onBeforeSlide && this.onBeforeSlide(event.detail);
                }) as EventListener,
            );
        }
        if (this.onAfterSlide) {
            this._elementRef.nativeElement.addEventListener(
                LgMethods.onAfterSlide,
                ((event: CustomEvent) => {
                    this.onAfterSlide && this.onAfterSlide(event.detail);
                }) as EventListener,
            );
        }
        if (this.onPosterClick) {
            this._elementRef.nativeElement.addEventListener(
                LgMethods.onPosterClick,
                ((event: CustomEvent) => {
                    this.onPosterClick && this.onPosterClick(event.detail);
                }) as EventListener,
            );
        }
        if (this.onDragStart) {
            this._elementRef.nativeElement.addEventListener(
                LgMethods.onDragStart,
                ((event: CustomEvent) => {
                    this.onDragStart && this.onDragStart(event.detail);
                }) as EventListener,
            );
        }
        if (this.onDragMove) {
            this._elementRef.nativeElement.addEventListener(
                LgMethods.onDragMove,
                ((event: CustomEvent) => {
                    this.onDragMove && this.onDragMove(event.detail);
                }) as EventListener,
            );
        }
        if (this.onDragEnd) {
            this._elementRef.nativeElement.addEventListener(
                LgMethods.onDragEnd,
                ((event: CustomEvent) => {
                    this.onDragEnd && this.onDragEnd(event.detail);
                }) as EventListener,
            );
        }
        if (this.onBeforeNextSlide) {
            this._elementRef.nativeElement.addEventListener(
                LgMethods.onBeforeNextSlide,
                ((event: CustomEvent) => {
                    this.onBeforeNextSlide &&
                        this.onBeforeNextSlide(event.detail);
                }) as EventListener,
            );
        }
        if (this.onBeforePrevSlide) {
            this._elementRef.nativeElement.addEventListener(
                LgMethods.onBeforePrevSlide,
                ((event: CustomEvent) => {
                    this.onBeforePrevSlide &&
                        this.onBeforePrevSlide(event.detail);
                }) as EventListener,
            );
        }
        if (this.onBeforeClose) {
            this._elementRef.nativeElement.addEventListener(
                LgMethods.onBeforeClose,
                ((event: CustomEvent) => {
                    this.onBeforeClose && this.onBeforeClose(event.detail);
                }) as EventListener,
            );
        }
        if (this.onAfterClose) {
            this._elementRef.nativeElement.addEventListener(
                LgMethods.onAfterClose,
                ((event: CustomEvent) => {
                    this.onAfterClose && this.onAfterClose(event.detail);
                }) as EventListener,
            );
        }
    }
}
