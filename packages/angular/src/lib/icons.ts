import { NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Directive,
    inject,
    input,
    TemplateRef,
} from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

/**
 * Custom icons (`<ng-template [lgIcon]="names" let-name>`): the consumer
 * declares which icon names the template handles and renders an SVG per
 * name (typically an `@switch` on the context). The gallery renders the
 * template instead of the font glyphs for exactly those names. The
 * `lg-icon-custom` class suppresses the glyph; the shared vanilla CSS
 * sizes the SVG and, for state-pair buttons, toggles which of the two
 * provided icons is visible (`lg-inline`, `lg-show-autoplay`,
 * `lg-fullscreen-on` — the same states that swapped the glyphs).
 */

import type { LgIconName } from '@lightgallery/headless';

export type { LgIconName };

/** Template context: the icon name being rendered. */
export interface LgIconContext {
    $implicit: LgIconName;
}

@Directive({
    selector: 'ng-template[lgIcon]',
})
export class LgIconDirective {
    /** The icon names this template handles. */
    readonly lgIcon = input.required<LgIconName[]>();

    readonly templateRef = inject(TemplateRef<LgIconContext>);

    static ngTemplateContextGuard(
        _dir: LgIconDirective,
        _ctx: unknown,
    ): _ctx is LgIconContext {
        return true;
    }
}

const toKebab = (name: string): string =>
    name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

/**
 * The slot when it covers every requested name, else undefined. State
 * pairs pass both names in [default-state, active-state] order — a
 * half-covered pair keeps the font glyphs so no state ends up iconless.
 */
export function resolveIconSlot(
    slot: LgIconDirective | undefined,
    names: LgIconName[],
): LgIconDirective | undefined {
    return slot && names.every((name) => slot.lgIcon().includes(name))
        ? slot
        : undefined;
}

/**
 * Wrapped icon renderer — one `.lg-ci` span per name inside a button.
 * Renders the consumer's `lgIcon` template when the slot covers the
 * names, else the built-in SVG defaults the call site passes (each
 * feature imports its own group from headless, so its icons ship in
 * its own bundle).
 */
@Component({
    selector: 'lg-ci',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet],
    template: `
        @for (name of names(); track name) {
        <span [class]="'lg-ci lg-ci-' + kebab(name)" aria-hidden="true">
            @if (slot(); as s) {
            <ng-container
                *ngTemplateOutlet="
                    s.templateRef;
                    context: { $implicit: name }
                "
            />
            } @else {
            <span [innerHTML]="trust(name)"></span>
            }
        </span>
        }
    `,
})
export class LgCiComponent {
    readonly slot = input<LgIconDirective | undefined>(undefined);
    readonly names = input.required<LgIconName[]>();
    /** Built-in SVG strings rendered when no template covers a name. */
    readonly icons = input<Partial<Record<LgIconName, string>> | undefined>(
        undefined,
    );
    protected readonly kebab = toKebab;
    private readonly sanitizer = inject(DomSanitizer);

    /** Vendored static asset strings, not user input — safe to trust. */
    protected trust(name: LgIconName): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(
            this.icons()?.[name] ?? '',
        );
    }
}
