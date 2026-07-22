import { NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    input,
    signal,
    untracked,
    type TemplateRef,
} from '@angular/core';
import {
    flipHorizontal,
    flipVertical,
    getRotateTransform,
    getSlideType,
    initialRotateSlice,
    rotateLeft,
    rotateRight,
    type RotateSlice,
} from '@lightgallery/headless';
import {
    LG_PLUGIN_CONTEXT,
    type LgFeature,
    type LgGalleryItem,
} from '@lightgallery/angular';

/**
 * Rotate feature (2.x `lg-rotate`): rotate/flip the current image.
 * Transform ownership follows the 005 slide-wrapper pattern; compose with
 * zoom as `[withZoom(), withRotate()]` so zoom stays outermost (2.x DOM).
 *
 * Deviation (noted, shared with React): 2.x kept rotate values for every
 * visited slide until close; here values live in the slide's wrapper, so
 * they reset if a slide leaves the windowed DOM.
 */

export interface RotateStrings {
    flipVertical: string;
    flipHorizontal: string;
    rotateLeft: string;
    rotateRight: string;
}

export interface RotateSettings {
    /** Enable the rotate buttons. */
    rotate: boolean;
    /** Rotate transition speed (ms). */
    rotateSpeed: number;
    rotateLeft: boolean;
    rotateRight: boolean;
    flipHorizontal: boolean;
    flipVertical: boolean;
    rotatePluginStrings: RotateStrings;
}

export const rotateSettings: RotateSettings = {
    rotate: true,
    rotateSpeed: 400,
    rotateLeft: true,
    rotateRight: true,
    flipHorizontal: true,
    flipVertical: true,
    rotatePluginStrings: {
        flipVertical: 'Flip vertical',
        flipHorizontal: 'Flip horizontal',
        rotateLeft: 'Rotate left',
        rotateRight: 'Rotate right',
    },
};

const ROTATE_LEFT_EVENT = 'lg-rotate-left';
const ROTATE_RIGHT_EVENT = 'lg-rotate-right';
const FLIP_HOR_EVENT = 'lg-flip-hor';
const FLIP_VER_EVENT = 'lg-flip-ver';

type RotateResolved = RotateSettings & Record<string, unknown>;

@Component({
    selector: 'lg-rotate-toolbar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (settings().rotate) {
            @if (settings().flipVertical) {
                <button
                    type="button"
                    class="lg-flip-ver lg-icon"
                    [attr.aria-label]="strings().flipVertical"
                    (click)="emit(FLIP_VER)"
                ></button>
            }
            @if (settings().flipHorizontal) {
                <button
                    type="button"
                    class="lg-flip-hor lg-icon"
                    [attr.aria-label]="strings().flipHorizontal"
                    (click)="emit(FLIP_HOR)"
                ></button>
            }
            @if (settings().rotateLeft) {
                <button
                    type="button"
                    class="lg-rotate-left lg-icon"
                    [attr.aria-label]="strings().rotateLeft"
                    (click)="emit(ROTATE_LEFT)"
                ></button>
            }
            @if (settings().rotateRight) {
                <button
                    type="button"
                    class="lg-rotate-right lg-icon"
                    [attr.aria-label]="strings().rotateRight"
                    (click)="emit(ROTATE_RIGHT)"
                ></button>
            }
        }
    `,
})
export class LgRotateToolbarComponent {
    private readonly ctx = inject(LG_PLUGIN_CONTEXT);
    protected readonly settings = computed(
        () => this.ctx.settings() as unknown as RotateResolved,
    );
    protected readonly strings = computed(
        () => this.settings().rotatePluginStrings,
    );
    protected readonly ROTATE_LEFT = ROTATE_LEFT_EVENT;
    protected readonly ROTATE_RIGHT = ROTATE_RIGHT_EVENT;
    protected readonly FLIP_HOR = FLIP_HOR_EVENT;
    protected readonly FLIP_VER = FLIP_VER_EVENT;

    protected emit(name: string): void {
        this.ctx.events.emit(name, undefined);
    }
}

@Component({
    selector: 'lg-rotate-wrapper',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet],
    template: `
        @if (enabled()) {
            <div
                class="lg-img-rotate"
                [style.position]="'absolute'"
                [style.inset]="'0'"
                [style.transform]="transform()"
                [style.transition-duration]="
                    settings().rotateSpeed + 'ms'
                "
            >
                <ng-container [ngTemplateOutlet]="content()" />
            </div>
        } @else {
            <ng-container [ngTemplateOutlet]="content()" />
        }
    `,
})
export class LgRotateWrapperComponent {
    readonly item = input.required<LgGalleryItem>();
    readonly index = input.required<number>();
    readonly isCurrent = input(false);
    readonly content = input.required<TemplateRef<unknown>>();

    private readonly ctx = inject(LG_PLUGIN_CONTEXT);
    protected readonly settings = computed(
        () => this.ctx.settings() as unknown as RotateResolved,
    );
    protected readonly enabled = computed(
        () =>
            this.settings().rotate &&
            getSlideType(this.item()) === 'image',
    );

    private readonly slice = signal<RotateSlice>(initialRotateSlice);
    protected readonly transform = computed(() =>
        getRotateTransform(this.slice()),
    );

    private readonly emitTimers = new Set<ReturnType<typeof setTimeout>>();

    constructor() {
        effect((onCleanup) => {
            if (!this.isCurrent() || !this.enabled()) {
                return;
            }
            const events = this.ctx.events;
            const offs = [
                events.on(ROTATE_LEFT_EVENT, () =>
                    this.commit(rotateLeft, 'rotateLeft'),
                ),
                events.on(ROTATE_RIGHT_EVENT, () =>
                    this.commit(rotateRight, 'rotateRight'),
                ),
                events.on(FLIP_HOR_EVENT, () =>
                    this.commit(flipHorizontal, 'flipHorizontal'),
                ),
                events.on(FLIP_VER_EVENT, () =>
                    this.commit(flipVertical, 'flipVertical'),
                ),
            ];
            onCleanup(() => offs.forEach((off) => off()));
        });
        inject(DestroyRef).onDestroy(() =>
            this.emitTimers.forEach((timer) => clearTimeout(timer)),
        );
    }

    private commit(
        transition: (slice: RotateSlice) => RotateSlice,
        eventName:
            | 'rotateLeft'
            | 'rotateRight'
            | 'flipHorizontal'
            | 'flipVertical',
    ): void {
        const next = transition(this.slice());
        this.slice.set(next);
        // The public event fires once the transition has settled (2.x).
        const timer = setTimeout(() => {
            this.emitTimers.delete(timer);
            switch (eventName) {
                case 'rotateLeft':
                    this.ctx.emit('rotateLeft', { rotate: next.rotate });
                    break;
                case 'rotateRight':
                    this.ctx.emit('rotateRight', { rotate: next.rotate });
                    break;
                case 'flipHorizontal':
                    this.ctx.emit('flipHorizontal', {
                        flipHorizontal: next.flipHorizontal,
                    });
                    break;
                case 'flipVertical':
                    this.ctx.emit('flipVertical', {
                        flipVertical: next.flipVertical,
                    });
            }
        }, untracked(this.settings).rotateSpeed + 10);
        this.emitTimers.add(timer);
    }
}

export function withRotate(
    options: Partial<RotateSettings> = {},
): LgFeature<RotateSettings> {
    return {
        name: 'rotate',
        defaults: rotateSettings,
        options,
        slots: {
            toolbar: LgRotateToolbarComponent,
            slideWrapper: LgRotateWrapperComponent,
        },
    };
}
