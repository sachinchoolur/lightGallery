import {
    getOriginCropFlight,
    getOriginTransform,
    getOriginWindow,
    isWholeImage,
    parseBackgroundFit,
    parseCssPosition,
    parseCssUrl,
    parseObjectFit,
    type OriginWindowInput,
    type RectLike,
} from '@lightgallery/headless';
import { useEffect, useRef, type CSSProperties, type ReactElement } from 'react';

import { useGalleryInternal, useGallerySettings } from '../../context';
import { useIsoLayoutEffect } from '../../hooks';
import type {
    LgPlugin,
    OriginFlightInput,
    OriginFlightOverride,
    PluginContext,
    SlidesWrapperProps,
} from '../types';

/**
 * originCrop plugin (vanilla `lg-origin-crop`): zoom-from-origin flights
 * from cropped thumbnails. A grid tile cropped with `object-fit: cover`
 * (or `background-size: cover`) shows a window of the image, and the
 * built-in flight squashes the whole image into the tile. With this
 * plugin the window grows from the tile at a uniform scale while two
 * boxes around the slides crop the rest of the image, revealed as the
 * flight lands; the close flies back the same way. The plugin reads the
 * thumbnail's computed fit and position, so no markup is needed;
 * thumbnails the built-in flight lands exactly keep it.
 */

export interface OriginCropSettings {
    /** Enable/disable flights from a thumbnail's crop. */
    originCrop: boolean;
}

export const originCropSettings: OriginCropSettings = {
    originCrop: true,
};

// The stage boxes at rest, and the easing the flight rules fall back to.
const REST = 'translate3d(0, 0, 0)';
const DEFAULT_EASING = 'cubic-bezier(0, 0, 0.25, 1)';
const TIMING_FUNCTION = /^\s*([a-z-]+\([^)]*\)|[a-z-]+)/i;
const RECT_EPSILON = 0.5;

// A stage box fills the stage (.lg-content) as .lg-inner does.
const BOX: CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};

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

/**
 * The flight for a trigger when the built-in one cannot land it exactly: a
 * cropped thumbnail, one letterboxed in its box, or a background
 * thumbnail. Undefined otherwise, and the gallery flies as it always does.
 */
export function resolveOriginCropFlight(
    input: OriginFlightInput,
): OriginFlightOverride | undefined {
    const { trigger: thumb, triggerRect: box, imageSize } = input;
    if (!thumb) {
        return undefined;
    }
    const img = thumb instanceof HTMLImageElement;
    const style = window.getComputedStyle(thumb);
    const dummySrc = img
        ? undefined
        : parseCssUrl(style.getPropertyValue('background-image'));
    if (!img && !dummySrc) {
        return undefined;
    }
    const origin = getOriginWindow({
        box,
        imageSize,
        ...getThumbPaint(thumb, style),
    });
    const cropped = !isWholeImage(origin.window);
    if (img && !cropped && sameRect(origin.rect, box)) {
        return undefined;
    }
    const stage = {
        triggerRect: origin.rect,
        containerRect: input.containerRect,
        top: input.top,
        bottom: input.bottom,
    };
    if (!cropped) {
        return {
            transform: getOriginTransform({ ...stage, imageSize }),
            region: origin.region,
            dummySrc,
        };
    }
    const crop = getOriginCropFlight({
        ...stage,
        imageSize,
        window: origin.window,
    });
    return {
        transform: crop.transform,
        boxes: { outer: crop.outer, inner: crop.inner },
        region: origin.region,
        dummySrc,
    };
}

/**
 * The two stage boxes around the slides. Inert at rest; through a flight
 * from a cropped thumbnail they hide their overflow and translate against
 * each other so that their intersection is the thumbnail's box, opening
 * (or closing) with the slide on its duration and easing. They render in
 * the same commit as the slide's own flight steps, so each frame agrees.
 */
export function OriginCropStage({
    originAnim,
    children,
}: SlidesWrapperProps): ReactElement {
    const settings = useGallerySettings();
    const internal = useGalleryInternal();
    const easingRef = useRef(DEFAULT_EASING);
    const boxes = originAnim?.boxes;

    // The slide's flight classes are on once armed: read its easing so
    // the boxes follow the same curve.
    useIsoLayoutEffect(() => {
        if (originAnim?.stage !== 'armed') {
            return;
        }
        const slide = internal.refs.getCurrentSlide();
        const timing = slide
            ? window
                  .getComputedStyle(slide)
                  .getPropertyValue('transition-timing-function')
            : '';
        easingRef.current =
            (TIMING_FUNCTION.exec(timing) || [])[1] || DEFAULT_EASING;
    }, [originAnim?.stage, internal]);

    let outer: CSSProperties = BOX;
    let inner: CSSProperties = BOX;
    if (originAnim && boxes) {
        const atCrop = !!originAnim.closing || originAnim.stage !== 'run';
        const transitioning = originAnim.stage !== 'init';
        const shared: CSSProperties = {
            ...BOX,
            overflow: 'hidden',
            transitionProperty: transitioning ? 'transform' : 'none',
            transitionDuration: transitioning
                ? `${settings.startAnimationDuration}ms`
                : undefined,
            transitionTimingFunction: transitioning
                ? easingRef.current
                : undefined,
        };
        outer = { ...shared, transform: atCrop ? boxes.outer : REST };
        inner = { ...shared, transform: atCrop ? boxes.inner : REST };
    }
    return (
        <div className="lg-origin-crop" style={outer}>
            <div className="lg-origin-crop" style={inner}>
                {children}
            </div>
        </div>
    );
}

function useOriginCropPlugin(ctx: PluginContext): void {
    const enabled = (ctx.settings as unknown as OriginCropSettings).originCrop;
    const { layout } = ctx;
    useEffect(() => {
        if (!enabled) {
            return;
        }
        layout.overrideOriginFlight(resolveOriginCropFlight);
        return () => layout.overrideOriginFlight(null);
    }, [enabled, layout]);
}

const OriginCrop: LgPlugin<OriginCropSettings> = {
    name: 'originCrop',
    defaults: originCropSettings,
    usePlugin: useOriginCropPlugin,
    slots: { slidesWrapper: OriginCropStage },
};

declare module '../../types' {
    interface LightGalleryPluginSettings {
        originCrop: Partial<OriginCropSettings>;
    }
}

export default OriginCrop;
