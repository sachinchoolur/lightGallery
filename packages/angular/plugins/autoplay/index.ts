import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    Injectable,
    signal,
    untracked,
} from '@angular/core';
import {
    LG_FEATURE_INIT,
    LG_PLUGIN_CONTEXT,
    type LgFeature,
} from '@lightgallery/angular';

/**
 * Autoplay feature (2.x `lg-autoplay`): slideshow timer with progress bar.
 * The toolbar button and the timer service talk over the event bus;
 * run-state is mirrored to the `lg-show-autoplay` outer class (2.x parity,
 * drives the progress-bar CSS).
 */

export interface AutoplaySettings {
    /** Enable the autoplay feature. */
    autoplay: boolean;
    /** Start the slideshow as soon as the first slide loads. */
    slideShowAutoplay: boolean;
    /** Time (ms) between transitions (added to `speed`). */
    slideShowInterval: number;
    /** Show the progress bar. */
    progressBar: boolean;
    /** Keep the slideshow running after user navigation. */
    forceSlideShowAutoplay: boolean;
    /** Show the play/pause toolbar button. */
    autoplayControls: boolean;
    autoplayPluginStrings: { toggleAutoplay: string };
}

export const autoplaySettings: AutoplaySettings = {
    autoplay: true,
    slideShowAutoplay: false,
    slideShowInterval: 5000,
    progressBar: true,
    forceSlideShowAutoplay: false,
    autoplayControls: true,
    autoplayPluginStrings: { toggleAutoplay: 'Toggle Autoplay' },
};

const TOGGLE_EVENT = 'lg-autoplay-toggle';

type AutoplayResolved = AutoplaySettings & { speed: number };

@Component({
    selector: 'lg-autoplay-button',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (settings().autoplay && settings().autoplayControls) {
            <button
                type="button"
                class="lg-autoplay-button lg-icon"
                [attr.aria-label]="
                    settings().autoplayPluginStrings.toggleAutoplay
                "
                (click)="ctx.events.emit(TOGGLE, undefined)"
            ></button>
        }
    `,
})
export class LgAutoplayButtonComponent {
    protected readonly ctx = inject(LG_PLUGIN_CONTEXT);
    protected readonly settings = computed(
        () => this.ctx.settings() as unknown as AutoplayResolved,
    );
    protected readonly TOGGLE = TOGGLE_EVENT;
}

@Component({
    selector: 'lg-autoplay-progress',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (settings().autoplay && settings().progressBar) {
            <div class="lg-progress-bar" [class.lg-start]="running()">
                <!-- Recreating the element restarts the width transition
                     each cycle (the React key={cycle} trick). -->
                @for (cycle of [cycle()]; track cycle) {
                    <div
                        class="lg-progress"
                        [style.transition]="
                            running()
                                ? 'width ' + duration() + 'ms ease 0s'
                                : null
                        "
                    ></div>
                }
            </div>
        }
    `,
})
export class LgAutoplayProgressComponent {
    private readonly ctx = inject(LG_PLUGIN_CONTEXT);
    protected readonly settings = computed(
        () => this.ctx.settings() as unknown as AutoplayResolved,
    );
    protected readonly running = signal(false);
    protected readonly cycle = signal(0);
    protected readonly duration = computed(
        () => this.settings().speed + this.settings().slideShowInterval,
    );

    constructor() {
        const offs = [
            this.ctx.events.on('autoplayStart', () => {
                this.running.set(true);
                this.cycle.update((value) => value + 1);
            }),
            this.ctx.events.on('autoplayStop', () =>
                this.running.set(false),
            ),
            this.ctx.events.on('beforeSlide', () =>
                this.cycle.update((value) => value + 1),
            ),
        ];
        inject(DestroyRef).onDestroy(() => offs.forEach((off) => off()));
    }
}

/** The slideshow timer (React `useAutoplayPlugin` twin). */
@Injectable()
export class LgAutoplayService {
    private readonly ctx = inject(LG_PLUGIN_CONTEXT);
    private interval: ReturnType<typeof setInterval> | null = null;
    private fromAuto = false;
    private pausedOnDrag = false;
    private pausedOnSlideChange = false;

    // Narrow computeds: the effect must re-run only when these BOOLEANS
    // change, never per state/settings object identity (a re-run tears the
    // running show down through its cleanup).
    private readonly enabled = computed(
        () =>
            (this.ctx.settings() as unknown as AutoplayResolved).autoplay,
    );
    private readonly open = computed(() => this.ctx.state().open);

    constructor() {
        effect((onCleanup) => {
            if (!this.enabled() || !this.open()) {
                return;
            }
            untracked(() => this.bind(onCleanup));
        });
        inject(DestroyRef).onDestroy(() => this.stop());
    }

    private settings(): AutoplayResolved {
        return untracked(this.ctx.settings) as unknown as AutoplayResolved;
    }

    private stop(): void {
        if (this.interval !== null) {
            clearInterval(this.interval);
            this.interval = null;
            this.ctx.layout.setOuterClass('lg-show-autoplay', false);
            this.ctx.emit('autoplayStop', {
                index: untracked(this.ctx.state).currentIndex,
            });
        }
    }

    private start(): void {
        if (this.interval !== null) {
            return;
        }
        const cfg = this.settings();
        this.ctx.layout.setOuterClass('lg-show-autoplay', true);
        this.ctx.emit('autoplayStart', {
            index: untracked(this.ctx.state).currentIndex,
        });
        this.interval = setInterval(() => {
            const state = untracked(this.ctx.state);
            const next =
                state.currentIndex + 1 < state.slidesCount
                    ? state.currentIndex + 1
                    : 0;
            this.fromAuto = true;
            this.ctx.emit('autoplay', { index: next });
            this.ctx.actions.navigate(next, 'next');
        }, cfg.speed + cfg.slideShowInterval);
    }

    private bind(onCleanup: (fn: () => void) => void): void {
        const events = this.ctx.events;
        const offs = [
            events.on(TOGGLE_EVENT, () => {
                if (this.interval !== null) {
                    this.stop();
                } else {
                    this.start();
                }
            }),
            // Pause during drags; resume after (2.x behavior).
            events.on('dragStart', () => {
                if (this.interval !== null) {
                    this.stop();
                    this.pausedOnDrag = true;
                }
            }),
            events.on('dragEnd', () => {
                if (this.pausedOnDrag) {
                    this.pausedOnDrag = false;
                    this.start();
                }
            }),
            // User-initiated navigation stops the show unless forced.
            events.on('beforeSlide', () => {
                if (!this.fromAuto && this.interval !== null) {
                    this.stop();
                    this.pausedOnSlideChange = true;
                } else {
                    this.pausedOnSlideChange = false;
                }
                this.fromAuto = false;
            }),
            events.on('afterSlide', () => {
                if (
                    this.pausedOnSlideChange &&
                    this.interval === null &&
                    this.settings().forceSlideShowAutoplay
                ) {
                    this.pausedOnSlideChange = false;
                    this.start();
                }
            }),
        ];

        let startedFromLoad: (() => void) | null = null;
        if (this.settings().slideShowAutoplay) {
            startedFromLoad = events.on('slideItemLoad', () => {
                startedFromLoad?.();
                startedFromLoad = null;
                this.start();
            });
        }

        onCleanup(() => {
            offs.forEach((off) => off());
            startedFromLoad?.();
            this.stop();
        });
    }
}

export function withAutoplay(
    options: Partial<AutoplaySettings> = {},
): LgFeature<AutoplaySettings> {
    return {
        name: 'autoplay',
        defaults: autoplaySettings,
        options,
        slots: {
            toolbar: LgAutoplayButtonComponent,
            outer: LgAutoplayProgressComponent,
        },
        providers: [
            LgAutoplayService,
            {
                provide: LG_FEATURE_INIT,
                useExisting: LgAutoplayService,
                multi: true,
            },
        ],
    };
}
