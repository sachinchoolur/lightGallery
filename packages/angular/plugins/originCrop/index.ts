import { NgTemplateOutlet } from '@angular/common';
import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    Injectable,
    Injector,
    input,
    signal,
    type TemplateRef,
} from '@angular/core';
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
import {
    LG_FEATURE_INIT,
    LG_PLUGIN_CONTEXT,
    type LgFeature,
    type OriginAnimation,
    type OriginFlightInput,
    type OriginFlightOverride,
} from '@lightgallery/angular';

/**
 * originCrop feature (vanilla `lg-origin-crop`): zoom-from-origin flights
 * from cropped thumbnails. A grid tile cropped with `object-fit: cover`
 * (or `background-size: cover`) shows a window of the image, and the
 * built-in flight squashes the whole image into the tile. With this
 * feature the window grows from the tile at a uniform scale while two
 * boxes around the slides crop the rest of the image, revealed as the
 * flight lands; the close flies back the same way. The feature reads the
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
const BOX: Record<string, string> = {
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
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
 * the same change detection pass as the slide's own flight steps, so each
 * frame agrees.
 */
@Component({
    selector: 'lg-origin-crop-stage',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet],
    template: `
        <div class="lg-origin-crop" [style]="outerStyle()">
            <div class="lg-origin-crop" [style]="innerStyle()">
                <ng-container [ngTemplateOutlet]="content()" />
            </div>
        </div>
    `,
})
export class LgOriginCropStageComponent {
    readonly originAnim = input<OriginAnimation | null>(null);
    readonly content = input.required<TemplateRef<unknown>>();

    private readonly ctx = inject(LG_PLUGIN_CONTEXT);
    private readonly injector = inject(Injector);
    private readonly easing = signal(DEFAULT_EASING);

    constructor() {
        // The slide's flight classes are on once armed and rendered: read
        // its easing so the boxes follow the same curve when they open.
        effect(() => {
            if (this.originAnim()?.stage !== 'armed') {
                return;
            }
            afterNextRender(() => this.readEasing(), {
                injector: this.injector,
            });
        });
    }

    private readEasing(): void {
        const slide = this.ctx.refs.getCurrentSlide();
        const timing = slide
            ? window
                  .getComputedStyle(slide)
                  .getPropertyValue('transition-timing-function')
            : '';
        this.easing.set(
            (TIMING_FUNCTION.exec(timing) || [])[1] || DEFAULT_EASING,
        );
    }

    private readonly styles = computed(
        (): [Record<string, string>, Record<string, string>] => {
            const anim = this.originAnim();
            const boxes = anim?.boxes;
            if (!anim || !boxes) {
                return [BOX, BOX];
            }
            const atCrop = !!anim.closing || anim.stage !== 'run';
            const transitioning = anim.stage !== 'init';
            const shared: Record<string, string> = {
                ...BOX,
                overflow: 'hidden',
                'transition-property': transitioning ? 'transform' : 'none',
            };
            if (transitioning) {
                shared['transition-duration'] = `${
                    this.ctx.settings().startAnimationDuration
                }ms`;
                shared['transition-timing-function'] = this.easing();
            }
            return [
                { ...shared, transform: atCrop ? boxes.outer : REST },
                { ...shared, transform: atCrop ? boxes.inner : REST },
            ];
        },
    );
    protected readonly outerStyle = computed(() => this.styles()[0]);
    protected readonly innerStyle = computed(() => this.styles()[1]);
}

@Injectable()
export class LgOriginCropService {
    private readonly ctx = inject(LG_PLUGIN_CONTEXT);

    constructor() {
        effect((onCleanup) => {
            const enabled = (
                this.ctx.settings() as unknown as OriginCropSettings
            ).originCrop;
            if (!enabled) {
                return;
            }
            this.ctx.layout.overrideOriginFlight(resolveOriginCropFlight);
            onCleanup(() => this.ctx.layout.overrideOriginFlight(null));
        });
    }
}

export function withOriginCrop(
    options: Partial<OriginCropSettings> = {},
): LgFeature<OriginCropSettings> {
    return {
        name: 'originCrop',
        defaults: originCropSettings,
        options,
        providers: [
            LgOriginCropService,
            {
                provide: LG_FEATURE_INIT,
                useExisting: LgOriginCropService,
                multi: true,
            },
        ],
        slots: { slidesWrapper: LgOriginCropStageComponent },
    };
}
