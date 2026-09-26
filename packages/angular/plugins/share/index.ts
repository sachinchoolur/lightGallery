import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    Injectable,
    signal,
    untracked,
    viewChild,
} from '@angular/core';
import {
    canNativeShare,
    consumeBackdropPress,
    getFacebookShareLink,
    getPinterestShareLink,
    getSharePayload,
    getXShareLink,
    shareDefaultIcons,
} from '@lightgallery/headless';
import {
    LG_PLUGIN_CONTEXT,
    type LgFeature,
    type LgGalleryItem,
    LgCiComponent,
    resolveIconSlot,
    type LgIconDirective,
    type LgIconName,
} from '@lightgallery/angular';

/**
 * Share feature (2.x `lg-share`): toolbar dropdown with per-slide share
 * links. Migration difference vs 2.x (documented): `additionalShareOptions`
 * takes typed `{ text, className, generateLink }` objects instead of raw
 * `dropdownHTML` strings.
 */

export interface ShareOption {
    /** Dropdown label. */
    text: string;
    /** Class for the icon `<span>` (e.g. `lg-share-facebook`). */
    className?: string;
    generateLink: (item: LgGalleryItem, currentUrl: string) => string;
}

export interface ShareSettings {
    /** Enable the share button. */
    share: boolean;
    /**
     * Prefer the OS share sheet (`navigator.share`) over the dropdown menu
     * when the browser supports it (URL-sharing only — the image file is
     * never attached; the dropdown remains the automatic fallback).
     * Defaults to true on touch devices, false on desktop.
     */
    preferNativeShare?: boolean;
    facebook: boolean;
    facebookDropdownText: string;
    twitter: boolean;
    twitterDropdownText: string;
    pinterest: boolean;
    pinterestDropdownText: string;
    /** Extra share options appended after the built-ins. */
    additionalShareOptions: ShareOption[];
    /**
     * @deprecated Set these labels on the core `strings` object instead —
     * an explicitly set key here still wins (alias).
     */
    sharePluginStrings?: { share?: string };
}

export const shareSettings: ShareSettings = {
    share: true,
    facebook: true,
    facebookDropdownText: 'Facebook',
    twitter: true,
    twitterDropdownText: 'X',
    pinterest: true,
    pinterestDropdownText: 'Pinterest',
    additionalShareOptions: [],
};

/** Web Share default: the OS sheet is where sharing shines on touch devices. */
function isTouchDevice(): boolean {
    return (
        typeof window !== 'undefined' &&
        (navigator.maxTouchPoints > 0 || 'ontouchstart' in window)
    );
}

function getShareOptions(settings: ShareSettings): ShareOption[] {
    return [
        ...(settings.facebook
            ? [
                  {
                      text: settings.facebookDropdownText,
                      className: 'lg-share-facebook',
                      generateLink: getFacebookShareLink,
                  },
              ]
            : []),
        ...(settings.twitter
            ? [
                  {
                      text: settings.twitterDropdownText,
                      className: 'lg-share-twitter',
                      generateLink: getXShareLink,
                  },
              ]
            : []),
        ...(settings.pinterest
            ? [
                  {
                      text: settings.pinterestDropdownText,
                      className: 'lg-share-pinterest',
                      generateLink: getPinterestShareLink,
                  },
              ]
            : []),
        ...settings.additionalShareOptions,
    ];
}

/**
 * Dropdown open state, a per-gallery feature service (the Angular analog
 * of React reading `pluginOuterClassNames`); mirrored to the
 * `lg-dropdown-active` class.
 */
@Injectable()
export class LgShareStateService {
    readonly active = signal(false);

    constructor() {
        const ctx = inject(LG_PLUGIN_CONTEXT);
        effect(() => {
            ctx.layout.setOuterClass('lg-dropdown-active', this.active());
        });
        // The service outlives a close, so an open dropdown would still be
        // open on the next open.
        effect(() => {
            if (!ctx.state().open) {
                this.active.set(false);
            }
        });
    }
}

@Component({
    selector: 'lg-share-button',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LgCiComponent],
    template: `
        @if (settings().share) {
        <!-- Button and dropdown share a wrapper: it is the dropdown's
                 positioning context, so the menu hangs under the control
                 that opened it (nesting the list inside the button would
                 be invalid). -->
        <div class="lg-share-outer" #outer>
            <button
                #button
                type="button"
                class="lg-share lg-icon lg-icon-custom"
                [attr.aria-label]="
                    settings().sharePluginStrings?.share ?? coreStrings().share
                "
                [attr.aria-haspopup]="nativeFirst() ? null : 'true'"
                [attr.aria-expanded]="nativeFirst() ? null : state.active()"
                (click)="onShareClick()"
            >
                <lg-ci
                    [slot]="ciShare()"
                    [names]="['share']"
                    [icons]="defaultIcons"
                />
            </button>
            <ul class="lg-dropdown" [style.position]="'absolute'">
                @if (currentItem(); as item) { @for (option of options(); track
                $index) {
                <li>
                    <a
                        [class]="option.className ?? ''"
                        rel="noopener"
                        target="_blank"
                        [attr.href]="option.generateLink(item, currentUrl())"
                    >
                        <span class="lg-icon lg-icon-custom">
                            <lg-ci
                                [slot]="socialIcon(option.className)"
                                [names]="[socialName(option.className)]"
                                [icons]="defaultIcons"
                            />
                        </span>
                        <span class="lg-dropdown-text">{{ option.text }}</span>
                    </a>
                </li>
                } }
            </ul>
        </div>
        }
    `,
})
export class LgShareButtonComponent {
    private readonly ctx = inject(LG_PLUGIN_CONTEXT);
    protected readonly defaultIcons = shareDefaultIcons;
    protected readonly ciShare = computed(() =>
        resolveIconSlot(this.ctx.icons?.(), ['share']),
    );
    protected socialName(cls: string | undefined): LgIconName {
        return cls === 'lg-share-facebook'
            ? 'shareFacebook'
            : cls === 'lg-share-pinterest'
            ? 'sharePinterest'
            : 'shareX';
    }
    protected socialIcon(cls: string | undefined): LgIconDirective | undefined {
        return resolveIconSlot(this.ctx.icons?.(), [this.socialName(cls)]);
    }
    protected readonly state = inject(LgShareStateService);
    private readonly outerRef = viewChild<ElementRef<HTMLElement>>('outer');
    private readonly buttonRef =
        viewChild<ElementRef<HTMLButtonElement>>('button');
    private listening = false;

    constructor() {
        // While open, the dropdown dismisses like the More options menu:
        // on a press anywhere outside it, on Escape (the gallery stays
        // open) and when focus tabs out of it.
        effect(() => {
            const open = this.state.active();
            untracked(() => this.listenOutside(open));
        });
        inject(DestroyRef).onDestroy(() => this.listenOutside(false));
    }

    protected readonly settings = computed(
        () => this.ctx.settings() as unknown as ShareSettings,
    );
    protected readonly coreStrings = computed(
        () => this.ctx.settings().strings,
    );
    protected readonly currentItem = computed(
        () => this.ctx.items()[this.ctx.state().currentIndex],
    );
    protected readonly options = computed(() =>
        getShareOptions(this.settings()),
    );

    protected currentUrl(): string {
        return typeof window !== 'undefined' ? window.location.href : '';
    }

    /**
     * Web Share hybrid: try the OS sheet first where preferred and
     * available; the dropdown stays rendered as the automatic fallback.
     */
    protected nativeFirst(): boolean {
        return (
            (this.settings().preferNativeShare ?? isTouchDevice()) &&
            typeof navigator !== 'undefined' &&
            typeof navigator.share === 'function'
        );
    }

    protected onShareClick(): void {
        const item = this.currentItem();
        if (this.nativeFirst() && item) {
            const payload = getSharePayload(item, this.currentUrl());
            if (canNativeShare(navigator, payload)) {
                // Rejection = user dismissed the sheet (AbortError).
                navigator.share(payload).catch(() => undefined);
                return;
            }
        }
        this.state.active.set(!this.state.active());
    }

    private close(returnFocus: boolean): void {
        this.state.active.set(false);
        if (returnFocus) {
            this.buttonRef()?.nativeElement.focus();
        }
    }

    private listenOutside(on: boolean): void {
        if (on === this.listening) {
            return;
        }
        this.listening = on;
        if (on) {
            document.addEventListener('pointerdown', this.onPointerDown, true);
            document.addEventListener('keydown', this.onKeydown, true);
        } else {
            document.removeEventListener(
                'pointerdown',
                this.onPointerDown,
                true,
            );
            document.removeEventListener('keydown', this.onKeydown, true);
        }
    }

    private readonly onPointerDown = (event: Event): void => {
        const target = event.target as Node | null;
        if (target && this.outerRef()?.nativeElement.contains(target)) {
            return;
        }
        consumeBackdropPress(event);
        this.close(false);
    };

    private readonly onKeydown = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
            // The dropdown is the topmost layer: Escape closes it, not
            // the gallery behind it.
            event.preventDefault();
            event.stopPropagation();
            this.close(true);
            return;
        }
        if (event.key !== 'Tab') {
            return;
        }
        // Tabbing between the button and its links keeps the dropdown;
        // tabbing out of it closes it.
        const outer = this.outerRef()?.nativeElement;
        const focusable = outer
            ? Array.from(outer.querySelectorAll<HTMLElement>('button, a[href]'))
            : [];
        const index = focusable.indexOf(document.activeElement as HTMLElement);
        if (
            index !== -1 &&
            (event.shiftKey ? index === 0 : index === focusable.length - 1)
        ) {
            this.close(false);
        }
    };
}

export function withShare(
    options: Partial<ShareSettings> = {},
): LgFeature<ShareSettings> {
    return {
        name: 'share',
        defaults: shareSettings,
        options,
        slots: {
            toolbar: LgShareButtonComponent,
        },
        providers: [LgShareStateService],
    };
}
