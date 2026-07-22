import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    Injectable,
    signal,
} from '@angular/core';
import {
    getFacebookShareLink,
    getPinterestShareLink,
    getTwitterShareLink,
} from '@lightgallery/headless';
import {
    LG_PLUGIN_CONTEXT,
    type LgFeature,
    type LgGalleryItem,
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
    facebook: boolean;
    facebookDropdownText: string;
    twitter: boolean;
    twitterDropdownText: string;
    pinterest: boolean;
    pinterestDropdownText: string;
    /** Extra share options appended after the built-ins. */
    additionalShareOptions: ShareOption[];
    sharePluginStrings: { share: string };
}

export const shareSettings: ShareSettings = {
    share: true,
    facebook: true,
    facebookDropdownText: 'Facebook',
    twitter: true,
    twitterDropdownText: 'Twitter',
    pinterest: true,
    pinterestDropdownText: 'Pinterest',
    additionalShareOptions: [],
    sharePluginStrings: { share: 'Share' },
};

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
                      generateLink: getTwitterShareLink,
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
 * Dropdown open-state shared between the button and the outer overlay —
 * a per-gallery feature service (the Angular analog of React reading
 * `pluginOuterClassNames`); mirrored to the `lg-dropdown-active` class.
 */
@Injectable()
export class LgShareStateService {
    readonly active = signal(false);

    constructor() {
        const ctx = inject(LG_PLUGIN_CONTEXT);
        effect(() => {
            ctx.layout.setOuterClass('lg-dropdown-active', this.active());
        });
    }
}

@Component({
    selector: 'lg-share-button',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (settings().share) {
            <button
                type="button"
                class="lg-share lg-icon"
                [attr.aria-label]="settings().sharePluginStrings.share"
                aria-haspopup="true"
                [attr.aria-expanded]="state.active()"
                (click)="state.active.set(!state.active())"
            ></button>
            <!-- Sibling of the button (vanilla nested it inside, which is
                 invalid interactive nesting); the .lg-outer .lg-dropdown
                 CSS does not depend on the nesting. -->
            <ul class="lg-dropdown" [style.position]="'absolute'">
                @if (currentItem(); as item) {
                    @for (option of options(); track $index) {
                        <li>
                            <a
                                [class]="option.className ?? ''"
                                rel="noopener"
                                target="_blank"
                                [attr.href]="
                                    option.generateLink(item, currentUrl())
                                "
                            >
                                <span class="lg-icon"></span>
                                <span class="lg-dropdown-text">{{
                                    option.text
                                }}</span>
                            </a>
                        </li>
                    }
                }
            </ul>
        }
    `,
})
export class LgShareButtonComponent {
    private readonly ctx = inject(LG_PLUGIN_CONTEXT);
    protected readonly state = inject(LgShareStateService);
    protected readonly settings = computed(
        () => this.ctx.settings() as unknown as ShareSettings,
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
}

@Component({
    selector: 'lg-share-overlay',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (settings().share) {
            <div
                class="lg-dropdown-overlay"
                (click)="state.active.set(false)"
            ></div>
        }
    `,
})
export class LgShareOverlayComponent {
    private readonly ctx = inject(LG_PLUGIN_CONTEXT);
    protected readonly state = inject(LgShareStateService);
    protected readonly settings = computed(
        () => this.ctx.settings() as unknown as ShareSettings,
    );
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
            outer: LgShareOverlayComponent,
        },
        providers: [LgShareStateService],
    };
}
