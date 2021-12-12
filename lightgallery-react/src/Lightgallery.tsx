//https://github.com/facebook/create-react-app/issues/8785
import * as React from 'react';

import { LightGallerySettings } from 'lightgallery/lg-settings';
import LightGallery from 'lightgallery';
import {
    AfterSlideDetail,
    InitDetail,
    ContainerResizeDetail,
    AfterAppendSubHtmlDetail,
    BeforeOpenDetail,
    AfterOpenDetail,
    SlideItemLoadDetail,
    BeforeSlideDetail,
    PosterClickDetail,
    DragStartDetail,
    DragMoveDetail,
    DragEndDetail,
    BeforeNextSlideDetail,
    BeforePrevSlideDetail,
    BeforeCloseDetail,
    AfterCloseDetail,
    FlipHorizontalDetail,
    FlipVerticalDetail,
    RotateLeftDetail,
    RotateRightDetail,
} from 'lightgallery/lg-events';

interface LgEvents {
    onAfterAppendSlide?: (detail: AfterSlideDetail) => void;
    onInit?: (detail: InitDetail) => void;
    onHasVideo?: (detail: InitDetail) => void;
    onContainerResize?: (detail: ContainerResizeDetail) => void;
    onAfterAppendSubHtml?: (detail: AfterAppendSubHtmlDetail) => void;
    onBeforeOpen?: (detail: BeforeOpenDetail) => void;
    onAfterOpen?: (detail: AfterOpenDetail) => void;
    onSlideItemLoad?: (detail: SlideItemLoadDetail) => void;
    onBeforeSlide?: (detail: BeforeSlideDetail) => void;
    onAfterSlide?: (detail: AfterSlideDetail) => void;
    onPosterClick?: (detail: PosterClickDetail) => void;
    onDragStart?: (detail: DragStartDetail) => void;
    onDragMove?: (detail: DragMoveDetail) => void;
    onDragEnd?: (detail: DragEndDetail) => void;
    onBeforeNextSlide?: (detail: BeforeNextSlideDetail) => void;
    onBeforePrevSlide?: (detail: BeforePrevSlideDetail) => void;
    onBeforeClose?: (detail: BeforeCloseDetail) => void;
    onAfterClose?: (detail: AfterCloseDetail) => void;
    onRotateLeft?: (detail: RotateLeftDetail) => void;
    onRotateRight?: (detail: RotateRightDetail) => void;
    onFlipHorizontal?: (detail: FlipHorizontalDetail) => void;
    onFlipVertical?: (detail: FlipVerticalDetail) => void;
}

export interface LightGalleryProps extends LgEvents, LightGallerySettings {
    children?: any;
    elementClassNames?: string;
}

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
    onRotateLeft: 'lgRotateLeft',
    onRotateRight: 'lgRotateRight',
    onFlipHorizontal: 'lgFlipHorizontal',
    onFlipVertical: 'lgFlipVertical',
};

const LG: React.FC<LightGalleryProps> = ({
    children,
    elementClassNames,
    onAfterAppendSlide,
    onInit,
    onHasVideo,
    onContainerResize,
    onAfterAppendSubHtml,
    onBeforeOpen,
    onAfterOpen,
    onSlideItemLoad,
    onBeforeSlide,
    onAfterSlide,
    onPosterClick,
    onDragStart,
    onDragMove,
    onDragEnd,
    onBeforeNextSlide,
    onBeforePrevSlide,
    onBeforeClose,
    onAfterClose,
    onRotateLeft,
    onRotateRight,
    onFlipHorizontal,
    onFlipVertical,
    ...restProps
}: LightGalleryProps) => {
    const $lg = React.useRef<HTMLDivElement>(null);

    const registerEvents = React.useCallback(() => {
        if (onAfterAppendSlide && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onAfterAppendSlide, ((
                event: CustomEvent,
            ) => {
                onAfterAppendSlide(event.detail);
            }) as EventListener);
        }
        if (onInit && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onInit, ((
                event: CustomEvent,
            ) => {
                onInit(event.detail);
            }) as EventListener);
        }
        if (onHasVideo && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onHasVideo, ((
                event: CustomEvent,
            ) => {
                onHasVideo(event.detail);
            }) as EventListener);
        }
        if (onContainerResize && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onContainerResize, ((
                event: CustomEvent,
            ) => {
                onContainerResize(event.detail);
            }) as EventListener);
        }
        if (onAfterAppendSubHtml && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onAfterAppendSubHtml, ((
                event: CustomEvent,
            ) => {
                onAfterAppendSubHtml(event.detail);
            }) as EventListener);
        }
        if (onBeforeOpen && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onBeforeOpen, ((
                event: CustomEvent,
            ) => {
                onBeforeOpen(event.detail);
            }) as EventListener);
        }
        if (onAfterOpen && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onAfterOpen, ((
                event: CustomEvent,
            ) => {
                onAfterOpen(event.detail);
            }) as EventListener);
        }
        if (onSlideItemLoad && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onSlideItemLoad, ((
                event: CustomEvent,
            ) => {
                onSlideItemLoad(event.detail);
            }) as EventListener);
        }
        if (onBeforeSlide && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onBeforeSlide, ((
                event: CustomEvent,
            ) => {
                onBeforeSlide(event.detail);
            }) as EventListener);
        }
        if (onAfterSlide && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onAfterSlide, ((
                event: CustomEvent,
            ) => {
                onAfterSlide(event.detail);
            }) as EventListener);
        }
        if (onPosterClick && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onPosterClick, ((
                event: CustomEvent,
            ) => {
                onPosterClick(event.detail);
            }) as EventListener);
        }
        if (onDragStart && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onDragStart, ((
                event: CustomEvent,
            ) => {
                onDragStart(event.detail);
            }) as EventListener);
        }
        if (onDragMove && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onDragMove, ((
                event: CustomEvent,
            ) => {
                onDragMove(event.detail);
            }) as EventListener);
        }
        if (onDragEnd && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onDragEnd, ((
                event: CustomEvent,
            ) => {
                onDragEnd(event.detail);
            }) as EventListener);
        }
        if (onBeforeNextSlide && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onBeforeNextSlide, ((
                event: CustomEvent,
            ) => {
                onBeforeNextSlide(event.detail);
            }) as EventListener);
        }
        if (onBeforePrevSlide && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onBeforePrevSlide, ((
                event: CustomEvent,
            ) => {
                onBeforePrevSlide(event.detail);
            }) as EventListener);
        }
        if (onBeforeClose && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onBeforeClose, ((
                event: CustomEvent,
            ) => {
                onBeforeClose(event.detail);
            }) as EventListener);
        }
        if (onAfterClose && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onAfterClose, ((
                event: CustomEvent,
            ) => {
                onAfterClose(event.detail);
            }) as EventListener);
        }
        if (onRotateLeft && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onRotateLeft, ((
                event: CustomEvent,
            ) => {
                onRotateLeft(event.detail);
            }) as EventListener);
        }
        if (onRotateRight && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onRotateRight, ((
                event: CustomEvent,
            ) => {
                onRotateRight(event.detail);
            }) as EventListener);
        }
        if (onFlipHorizontal && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onFlipHorizontal, ((
                event: CustomEvent,
            ) => {
                onFlipHorizontal(event.detail);
            }) as EventListener);
        }
        if (onFlipVertical && $lg && $lg.current) {
            $lg.current.addEventListener(LgMethods.onFlipVertical, ((
                event: CustomEvent,
            ) => {
                onFlipVertical(event.detail);
            }) as EventListener);
        }
    }, [
        onAfterAppendSlide,
        onAfterAppendSubHtml,
        onAfterClose,
        onRotateLeft,
        onRotateRight,
        onFlipHorizontal,
        onFlipVertical,
        onAfterOpen,
        onAfterSlide,
        onBeforeClose,
        onBeforeNextSlide,
        onBeforeOpen,
        onBeforePrevSlide,
        onBeforeSlide,
        onContainerResize,
        onDragEnd,
        onDragMove,
        onDragStart,
        onHasVideo,
        onInit,
        onPosterClick,
        onSlideItemLoad,
    ]);

    React.useEffect(() => {
        registerEvents();
        const lightGallery = LightGallery(
            ($lg.current as unknown) as HTMLElement,
            restProps,
        );
        return function cleanup() {
            lightGallery.destroy();
        };
    }, []);

    return (
        <div
            className={`lg-react-element ${
                elementClassNames ? elementClassNames : ''
            }`}
            ref={$lg}
        >
            {children}
        </div>
    );
};
export default LG;
