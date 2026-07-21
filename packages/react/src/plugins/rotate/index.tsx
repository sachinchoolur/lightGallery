import { useEffect, useState, type ReactElement } from 'react';
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

import { useGalleryInternal } from '../../context';
import { usePluginSettings } from '../runtime';
import type { LgPlugin, SlideWrapperProps } from '../types';

/**
 * Rotate plugin (2.x `lg-rotate`): rotate/flip the current image. Transform
 * ownership follows the 005 slide-wrapper pattern; compose with zoom as
 * `plugins={[Zoom, Rotate]}` so zoom stays outermost (2.x DOM order).
 *
 * Deviation (noted): 2.x kept rotate values for every visited slide until
 * close; here values live in the slide's wrapper, so they reset if a slide
 * leaves the windowed DOM.
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

function RotateToolbar(): ReactElement | null {
    const internal = useGalleryInternal();
    const settings = usePluginSettings<RotateSettings>();
    if (!settings.rotate) {
        return null;
    }
    const emit = (name: string) => internal.events.emit(name, undefined);
    const strings = settings.rotatePluginStrings;
    return (
        <>
            {settings.flipVertical && (
                <button
                    type="button"
                    aria-label={strings.flipVertical}
                    className="lg-flip-ver lg-icon"
                    onClick={() => emit(FLIP_VER_EVENT)}
                />
            )}
            {settings.flipHorizontal && (
                <button
                    type="button"
                    aria-label={strings.flipHorizontal}
                    className="lg-flip-hor lg-icon"
                    onClick={() => emit(FLIP_HOR_EVENT)}
                />
            )}
            {settings.rotateLeft && (
                <button
                    type="button"
                    aria-label={strings.rotateLeft}
                    className="lg-rotate-left lg-icon"
                    onClick={() => emit(ROTATE_LEFT_EVENT)}
                />
            )}
            {settings.rotateRight && (
                <button
                    type="button"
                    aria-label={strings.rotateRight}
                    className="lg-rotate-right lg-icon"
                    onClick={() => emit(ROTATE_RIGHT_EVENT)}
                />
            )}
        </>
    );
}

function RotateWrapper({
    item,
    isCurrent,
    children,
}: SlideWrapperProps): ReactElement {
    const internal = useGalleryInternal();
    const settings = usePluginSettings<RotateSettings>();
    const enabled = settings.rotate && getSlideType(item) === 'image';
    const [slice, setSlice] = useState<RotateSlice>(initialRotateSlice);

    useEffect(() => {
        if (!isCurrent || !enabled) {
            return;
        }
        const { events } = internal;
        const commit = (
            transition: (slice: RotateSlice) => RotateSlice,
            eventName: string,
            payload: (next: RotateSlice) => Record<string, number>,
        ) => {
            setSlice((previous) => {
                const next = transition(previous);
                window.setTimeout(
                    () => events.emit(eventName, payload(next)),
                    settings.rotateSpeed + 10,
                );
                return next;
            });
        };
        const offs = [
            events.on(ROTATE_LEFT_EVENT, () =>
                commit(rotateLeft, 'rotateLeft', (next) => ({
                    rotate: next.rotate,
                })),
            ),
            events.on(ROTATE_RIGHT_EVENT, () =>
                commit(rotateRight, 'rotateRight', (next) => ({
                    rotate: next.rotate,
                })),
            ),
            events.on(FLIP_HOR_EVENT, () =>
                commit(flipHorizontal, 'flipHorizontal', (next) => ({
                    flipHorizontal: next.flipHorizontal,
                })),
            ),
            events.on(FLIP_VER_EVENT, () =>
                commit(flipVertical, 'flipVertical', (next) => ({
                    flipVertical: next.flipVertical,
                })),
            ),
        ];
        return () => offs.forEach((off) => off());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCurrent, enabled]);

    if (!enabled) {
        return <>{children}</>;
    }

    return (
        <div
            className="lg-img-rotate"
            style={{
                position: 'absolute',
                inset: 0,
                transform: getRotateTransform(slice),
                transitionDuration: `${settings.rotateSpeed}ms`,
            }}
        >
            {children}
        </div>
    );
}

const Rotate: LgPlugin<RotateSettings> = {
    name: 'rotate',
    defaults: rotateSettings,
    slots: {
        toolbar: RotateToolbar,
        slideWrapper: RotateWrapper,
    },
};

declare module '../../types' {
    interface LightGalleryPluginSettings {
        rotate: Partial<RotateSettings>;
    }
}

export default Rotate;
