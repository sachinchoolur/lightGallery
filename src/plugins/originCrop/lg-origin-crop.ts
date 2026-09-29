import {
    getOriginCropFlight,
    getOriginTransform,
    getOriginWindow,
    isUsableOriginRect,
    isWholeImage,
    parseBackgroundFit,
    parseCssPosition,
    parseCssUrl,
    parseObjectFit,
    type FractionRect,
    type OriginWindowInput,
    type RectLike,
} from '@lightgallery/headless';

import { lGEvents } from '../../lg-events';
import { ImageSize } from '../../lg-utils';
import { LightGallery } from '../../lightgallery';
import {
    OriginCropSettings,
    originCropSettings,
} from './lg-origin-crop-settings';

/**
 * A flight the built-in one cannot land exactly: from a cropped thumbnail,
 * one letterboxed in its box, or a background thumbnail.
 */
interface CropFlight {
    /** The trigger the flight leaves from or returns to. */
    element: HTMLElement;

    /** The slide's transform on the thumbnail. */
    transform: string;

    /**
     * The stage boxes' transforms that crop the slide to the thumbnail's
     * box, for a cropped thumbnail.
     */
    stage?: { outer: string; inner: string };

    /** The part of the image the thumbnail file covers: sizes the dummy. */
    region: FractionRect;

    /** A background thumbnail's image, which flies as the dummy. */
    dummySrc?: string;
}

interface Transition {
    duration: string;
    easing: string;
}

// The stage boxes at rest: the end of an opening flight, the start of a
// closing one.
const STAGE_REST = 'translate3d(0, 0, 0)';

// How the core rests the slide when it flips an opening flight.
const SLIDE_REST = /^(none|translate3d\(0(px)?,\s*0(px)?,\s*0(px)?\))$/;

// An opening flight whose flip was never seen lets go of the crop this
// long after the flight's duration, so the image never stays cropped.
const FLIP_GRACE = 300;

// The timing functions of a computed list (`cubic-bezier(0, 0, 0.25, 1), ease`).
const TIMING_FUNCTIONS = /[a-z-]+\([^)]*\)|[a-z-]+/gi;

const RECT_EPSILON = 0.5;

function sameRect(a: RectLike, b: RectLike): boolean {
    return (
        Math.abs(a.left - b.left) < RECT_EPSILON &&
        Math.abs(a.top - b.top) < RECT_EPSILON &&
        Math.abs(a.width - b.width) < RECT_EPSILON &&
        Math.abs(a.height - b.height) < RECT_EPSILON
    );
}

/**
 * How a trigger paints its thumbnail: an img's object-fit/-position and
 * natural size, or the size/position keywords of a background image.
 */
function getThumbPaint(
    thumb: HTMLElement,
    style: CSSStyleDeclaration,
): Pick<OriginWindowInput, 'thumbSize' | 'fit' | 'position'> {
    if (thumb instanceof HTMLImageElement) {
        return {
            thumbSize:
                thumb.naturalWidth > 0
                    ? {
                          width: thumb.naturalWidth,
                          height: thumb.naturalHeight,
                      }
                    : undefined,
            fit: parseObjectFit(style.getPropertyValue('object-fit')),
            position: parseCssPosition(
                style.getPropertyValue('object-position'),
            ),
        };
    }
    return {
        fit:
            parseBackgroundFit(style.getPropertyValue('background-size')) ||
            'fill',
        position: parseCssPosition(
            style.getPropertyValue('background-position'),
        ),
    };
}

/** The duration and easing an element's transform transitions with. */
function getTransformTransition(
    el: HTMLElement,
    fallbackDuration: string,
): Transition {
    const style = window.getComputedStyle(el);
    const properties = style
        .getPropertyValue('transition-property')
        .split(',')
        .map((property) => property.trim());
    const durations = style
        .getPropertyValue('transition-duration')
        .split(',')
        .map((duration) => duration.trim());
    const easings =
        style
            .getPropertyValue('transition-timing-function')
            .match(TIMING_FUNCTIONS) || [];
    let index = properties.indexOf('transform');
    if (index < 0) {
        index = Math.max(0, properties.indexOf('all'));
    }
    return {
        duration: durations[index % durations.length] || fallbackDuration,
        easing: easings.length ? easings[index % easings.length] : 'ease',
    };
}

// A stage box fills the stage (.lg-content) as .lg-inner does. Styled
// inline, so the plugin needs no stylesheet.
function createStageBox(): HTMLElement {
    const box = document.createElement('div');
    box.className = 'lg-origin-crop';
    box.style.position = 'absolute';
    box.style.top = '0';
    box.style.right = '0';
    box.style.bottom = '0';
    box.style.left = '0';
    return box;
}

/**
 * Zoom-from-origin flights from cropped thumbnails. A grid tile cropped
 * with `object-fit: cover` (or `background-size: cover`) shows a window of
 * the image, and the built-in flight squashes the whole image into the
 * tile. With this plugin the window grows from the tile at a uniform
 * scale while two boxes around the slides crop the rest of the image,
 * revealed as the flight lands; the close flies back the same way. The
 * plugin reads the thumbnail's computed fit and position, so no markup is
 * needed. Thumbnails the built-in flight lands exactly keep it.
 *
 * The core's flight is untouched: the plugin replaces the flight's
 * transform through `getOriginTransform` and follows each of the core's
 * flight steps with the crop, in the same task.
 */
export default class OriginCrop {
    core: LightGallery;
    settings: OriginCropSettings;

    // Two boxes around .lg-inner, inside the stage. Inert at rest; during a
    // flight from a cropped thumbnail they hide their overflow and
    // translate against each other so that their intersection is the
    // thumbnail's box. The core's own elements are never styled.
    private outerBox?: HTMLElement;
    private innerBox?: HTMLElement;

    // The flight the core asked for last: the opening one, or the closing
    // one once `closing` is set.
    private flight?: CropFlight;
    private closing = false;
    private stageMoved = false;

    private observer?: MutationObserver;
    private flipGrace?: ReturnType<typeof setTimeout>;

    private restoreCore?: () => void;

    constructor(instance: LightGallery) {
        // get lightGallery core plugin instance
        this.core = instance;

        // extend module default settings with lightGallery core settings
        this.settings = { ...originCropSettings, ...this.core.settings };

        return this;
    }

    init(): void {
        if (!this.settings.originCrop) {
            return;
        }
        this.wrapStage();
        this.patchCore();
        this.core.LGel.on(`${lGEvents.beforeOpen}.originCrop`, () =>
            this.onBeforeOpen(),
        );
        this.core.LGel.on(`${lGEvents.beforeClose}.originCrop`, () =>
            this.onBeforeClose(),
        );
        this.core.LGel.on(`${lGEvents.afterClose}.originCrop`, () =>
            this.onAfterClose(),
        );
    }

    destroy(): void {
        this.stopFollowing();
        this.core.LGel.off('.originCrop');
        this.resetStage();
        this.unwrapStage();
        if (this.restoreCore) {
            this.restoreCore();
            this.restoreCore = undefined;
        }
        this.flight = undefined;
    }

    /**
     * Takes over the core's flight hooks: the flight's transform, and the
     * dummy that flies in place of the loading image.
     */
    private patchCore(): void {
        const core = this.core;
        const getCoreTransform = core.getOriginTransform;
        const getCoreDummyStyles = core.getDummyImgStyles;
        const getCoreDummy = core.getDummyImageContent;

        core.getOriginTransform = (element, imageSize) => {
            const flight = this.getFlight(element, imageSize);
            this.flight = flight;
            if (this.closing) {
                this.followClose();
            }
            return flight
                ? flight.transform
                : getCoreTransform.call(core, element, imageSize);
        };

        // A pre-cropped thumbnail file covers only a region of the image:
        // the dummy showing it covers that region of the image box.
        core.getDummyImgStyles = (imageSize) => {
            const region = this.flight && this.flight.region;
            if (!imageSize || !region || isWholeImage(region)) {
                return getCoreDummyStyles.call(core, imageSize);
            }
            return `width:${imageSize.width * region.width}px;
                margin-left: ${imageSize.width * (region.x - 0.5)}px;
                margin-top: ${imageSize.height * (region.y - 0.5)}px;
                height:${imageSize.height * region.height}px`;
        };

        // A background thumbnail has no img for the core to fly: its
        // background image flies as the dummy.
        core.getDummyImageContent = ($currentSlide, index, alt) => {
            const content = getCoreDummy.call(core, $currentSlide, index, alt);
            const flight = this.flight;
            if (
                content ||
                !flight ||
                !flight.dummySrc ||
                core.items[index] !== flight.element
            ) {
                return content;
            }
            const dummy = document.createElement('img');
            dummy.alt = alt || '';
            dummy.src = flight.dummySrc;
            dummy.className = 'lg-dummy-img';
            dummy.style.cssText = core.getDummyImgStyles(core.currentImageSize);
            $currentSlide.addClass('lg-first-slide');
            core.outer.addClass('lg-first-slide-loading');
            return dummy;
        };

        this.restoreCore = () => {
            core.getOriginTransform = getCoreTransform;
            core.getDummyImgStyles = getCoreDummyStyles;
            core.getDummyImageContent = getCoreDummy;
        };
    }

    /**
     * The flight from (or back to) a trigger, when the built-in flight
     * cannot land it exactly: a cropped thumbnail, one letterboxed in its
     * box, or a background thumbnail. Undefined otherwise, and the core
     * flies as it always does.
     */
    private getFlight(
        element: HTMLElement,
        imageSize?: ImageSize,
    ): CropFlight | undefined {
        if (!imageSize || !(imageSize.width > 0) || !(imageSize.height > 0)) {
            return;
        }
        const img = element.querySelector('img');
        const thumb: HTMLElement = img || element;
        const bounds = thumb.getBoundingClientRect();
        const box: RectLike = {
            left: bounds.left,
            top: bounds.top,
            width: bounds.width,
            height: bounds.height,
        };
        // A hidden or collapsed trigger: the core opens or closes about
        // the stage centre.
        if (!isUsableOriginRect(box)) {
            return;
        }
        const style = window.getComputedStyle(thumb);
        const dummySrc = img
            ? undefined
            : parseCssUrl(style.getPropertyValue('background-image'));
        if (!img && !dummySrc) {
            return;
        }
        const origin = getOriginWindow({
            box,
            imageSize,
            ...getThumbPaint(thumb, style),
        });
        const cropped = !isWholeImage(origin.window);
        if (img && !cropped && sameRect(origin.rect, box)) {
            return;
        }

        const outerRect = this.core.outer.get().getBoundingClientRect();
        const containerRect: RectLike = {
            left: outerRect.left,
            top: outerRect.top,
            width: outerRect.width,
            // Element height, as the core measures it.
            height: this.core.outer.height(),
        };
        const { top, bottom } = this.core.mediaContainerPosition;
        const flight = { element, region: origin.region, dummySrc };
        if (!cropped) {
            return {
                ...flight,
                transform: getOriginTransform({
                    triggerRect: origin.rect,
                    containerRect,
                    top,
                    bottom,
                    imageSize,
                }),
            };
        }
        const crop = getOriginCropFlight({
            triggerRect: origin.rect,
            containerRect,
            top,
            bottom,
            imageSize,
            window: origin.window,
        });
        return {
            ...flight,
            transform: crop.transform,
            stage: { outer: crop.outer, inner: crop.inner },
        };
    }

    /**
     * The opening flight, whose transform the core has just asked for. For
     * a cropped thumbnail the stage crops to the thumbnail before anything
     * shows (the gallery is still transparent), then follows the slide.
     */
    private onBeforeOpen(): void {
        const stage = this.flight && this.flight.stage;
        if (!stage || !this.outerBox) {
            return;
        }
        this.setStage(stage.outer, stage.inner);
        // Commit the crop now, so that the stage's transition, set at the
        // flip, runs from it. The slide is not current yet, so this style
        // flush cannot start a transition on it.
        this.outerBox.getBoundingClientRect();
        this.followOpen(this.core.getSlideItem(this.core.index).get());
    }

    /**
     * Follows the opening slide with the stage. Mutation records are
     * delivered at the end of the task that made them, before the browser
     * renders, so the stage moves in the same frame as each of the core's
     * steps: when the core flips the slide to rest, the stage opens with it
     * on the slide's duration and easing; when the core settles the flight,
     * the stage lets go.
     */
    private followOpen(slide: HTMLElement): void {
        this.stopFollowing();
        let flipped = false;
        this.observer = new MutationObserver(() => {
            const flying = slide.classList.contains('lg-start-end-progress');
            if (
                !flipped &&
                flying &&
                SLIDE_REST.test(slide.style.transform.trim())
            ) {
                flipped = true;
                clearTimeout(this.flipGrace);
                this.setStage(
                    STAGE_REST,
                    STAGE_REST,
                    this.getSlideTransition(slide),
                );
            } else if (flipped && !flying) {
                this.stopFollowing();
                this.resetStage();
            }
        });
        this.observer.observe(slide, {
            attributes: true,
            attributeFilter: ['class', 'style'],
        });
        this.flipGrace = setTimeout(() => {
            if (!flipped) {
                this.stopFollowing();
                this.resetStage();
            }
        }, this.core.settings.startAnimationDuration + FLIP_GRACE);
    }

    private onBeforeClose(): void {
        // An opening flight still running hands the stage over to the close.
        this.stopFollowing();
        this.closing = true;
    }

    /**
     * The closing flight, whose transform the core has just asked for. The
     * core puts the slide on it right after, in the same task; once it has,
     * the stage follows on the slide's duration and easing: onto the
     * thumbnail's box for a cropped thumbnail, else back to rest if an
     * opening flight left it cropped.
     */
    private followClose(): void {
        const stage = this.flight && this.flight.stage;
        if (!stage && !this.stageMoved) {
            return;
        }
        void Promise.resolve().then(() => {
            const slide = this.core.getSlideItem(this.core.index).get();
            if (!this.closing || !slide) {
                return;
            }
            this.setStage(
                stage ? stage.outer : STAGE_REST,
                stage ? stage.inner : STAGE_REST,
                this.getSlideTransition(slide),
            );
        });
    }

    private onAfterClose(): void {
        this.resetStage();
        this.closing = false;
        this.flight = undefined;
    }

    private getSlideTransition(slide: HTMLElement): Transition {
        return getTransformTransition(
            slide,
            this.core.settings.startAnimationDuration + 'ms',
        );
    }

    /**
     * Crops the stage: both boxes hide their overflow and take their
     * transforms, instantly or on a transition.
     */
    private setStage(
        outer: string,
        inner: string,
        transition?: Transition,
    ): void {
        const boxes: [HTMLElement | undefined, string][] = [
            [this.outerBox, outer],
            [this.innerBox, inner],
        ];
        boxes.forEach(([box, transform]) => {
            if (!box) {
                return;
            }
            box.style.overflow = 'hidden';
            box.style.transitionProperty = transition ? 'transform' : 'none';
            box.style.transitionDuration = transition
                ? transition.duration
                : '';
            box.style.transitionTimingFunction = transition
                ? transition.easing
                : '';
            box.style.transform = transform;
        });
        this.stageMoved = true;
    }

    /** Lets go of the crop: the boxes are inert again. */
    private resetStage(): void {
        [this.outerBox, this.innerBox].forEach((box) => {
            if (!box) {
                return;
            }
            box.style.overflow = '';
            box.style.transitionProperty = '';
            box.style.transitionDuration = '';
            box.style.transitionTimingFunction = '';
            box.style.transform = '';
        });
        this.stageMoved = false;
    }

    private stopFollowing(): void {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = undefined;
        }
        clearTimeout(this.flipGrace);
        this.flipGrace = undefined;
    }

    private wrapStage(): void {
        const inner = this.core.$inner.get();
        const parent = inner && inner.parentNode;
        if (!parent) {
            return;
        }
        this.outerBox = createStageBox();
        this.innerBox = createStageBox();
        parent.insertBefore(this.outerBox, inner);
        this.outerBox.appendChild(this.innerBox);
        this.innerBox.appendChild(inner);
    }

    private unwrapStage(): void {
        const inner = this.core.$inner.get();
        const outerBox = this.outerBox;
        if (outerBox && inner && outerBox.parentNode) {
            outerBox.parentNode.insertBefore(inner, outerBox);
            outerBox.remove();
        }
        this.outerBox = undefined;
        this.innerBox = undefined;
    }
}
