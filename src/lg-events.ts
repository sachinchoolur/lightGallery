import { VideoSource } from './plugins/video/lg-video';

/**
 * List of lightGallery events
 * All events should be documented here
 * Below interfaces are used to build the website documentations
 * */
export const lGEvents = {
    afterAppendSlide: 'afterAppendSlide.lg',
    hasVideo: 'hasVideo.lg',
    containerResize: 'containerResize.lg',
    appendSlides: 'appendSlides.lg',
    afterAppendSubHtml: 'afterAppendSubHtml.lg',
    beforeOpen: 'beforeOpen.lg',
    afterOpen: 'afterOpen.lg',
    slideItemLoad: 'slideItemLoad.lg',
    beforeSlide: 'beforeSlide.lg',
    afterSlide: 'afterSlide.lg',
    posterClick: 'posterClick.lg',
    dragStart: 'dragStart.lg',
    dragMove: 'dragMove.lg',
    dragEnd: 'dragEnd.lg',
    beforeNextSlide: 'beforeNextSlide.lg',
    beforePrevSlide: 'beforePrevSlide.lg',
    beforeClose: 'beforeClose.lg',
    afterClose: 'afterClose.lg',
};

/**
 * Fired when the slide content has been inserted into it's slide container.
 * @name afterAppendSlide.lg
 */
export interface AfterAppendSlideEventDetail {
    /**
     * Index of the slide
     */
    index: number;
}

/**
 * Fired immediately before opening the gallery
 * @name beforeOpen.lg
 */
export interface BeforeOpenDetail {}

/**
 * Fired immediately after opening the gallery
 * @name afterOpen
 */
export interface AfterOpenDetail {}

/**
 * Fired once the media inside the slide has been completely loaded .
 * @name slideItemLoad
 */
export interface SlideItemLoadDetail {
    /**
     * Index of the slide
     */
    index: number;
}

/**
 * fired immediately before each slide transition.
 * @name beforeSlide
 */
export interface BeforeSlideDetail {
    /**
     * Index of the previous slide
     */
    prevIndex: number;
    /**
     * Index of the slide
     */
    index: number;
    /**
     * true if slide function called via touch event or mouse drag
     */
    fromTouch: boolean;
    /**
     * true if slide function called via thumbnail click
     */
    fromThumb: boolean;
}

/**
 * fired immediately after each slide transition.
 * @name afterSlide
 */
export interface AfterSlideDetail {
    /**
     * Index of the previous slide
     */
    prevIndex: number;
    /**
     * Index of the slide
     */
    index: number;
    /**
     * true if slide function called via touch event or mouse drag
     */
    fromTouch: boolean;
    /**
     * true if slide function called via thumbnail click
     */
    fromThumb: boolean;
}

/**
 * Fired when the video poster is clicked.
 * @name posterClick
 */
export interface PosterClickDetail {}

/**
 * Fired when the drag event to move to different slide starts.
 * @name dragStart
 */
export interface DragStartDetail {}

/**
 * Fired periodically during the drag operation.
 * @name dragMove
 */
export interface DragMoveDetail {}

/**
 * Fired when the user has finished the drag operation
 * @name dragEnd
 */
export interface DragEndDetail {}

/**
 * Fired immediately before the start of the close process.
 * @name beforeClose
 */
export interface BeforeCloseDetail {}

/**
 * Fired immediately once lightGallery is closed.
 * @name afterClose
 */
export interface AfterCloseDetail {}

/**
 * Fired immediately before each "next" slide transition
 * @name beforeNextSlide
 */
export interface BeforeNextSlideDetail {
    /**
     * Index of the slide
     */
    index: number;
    /**
     * true if slide function called via touch event or mouse drag
     */
    fromTouch: boolean;
}

/**
 * Fired immediately before each "prev" slide transition
 * @name beforePrevSlide
 */
export interface BeforePrevSlideDetail {
    /**
     * Index of the slide
     */
    index: number;
    /**
     * true if slide function called via touch event or mouse drag
     */
    fromTouch: boolean;
}

/**
 * Fired when the sub-html content (ex : title/ description) has been appended into the slide.
 * @name afterAppendSubHtml
 */
export interface AfterAppendSubHtmlDetail {
    /**
     * Index of the slide
     */
    index: number;
}

/**
 * Fired when the sub-html content (ex : title/ description) has been appended into the slide.
 * @name containerResize.lg
 */
export interface ContainerResizeDetail {
    /**
     * Index of the slide
     */
    index: number;
}

/**
 * Event fired when lightGallery detects video slide
 * @name hasVideo.lg
 */
export interface HasVideoDetail {
    /**
     * Index of the slide,
     */
    index: number;
    /**
     * Video source
     */
    src: string;
    /**
     * HTML5 video source if available
     * <p>
       HTML5 video source = source: {
            src: string;
            type: string;
        }[];
        attributes: HTMLVideoElement;
     * </p>
     */
    html5Video: VideoSource;
    /**
     * True if video has poster
     */
    hasPoster: boolean;
}
