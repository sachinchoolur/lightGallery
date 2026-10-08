import { useMemo } from 'react';
import { LightGallery, type LgPlugin } from '@lightgallery/react';

import Autoplay from '@lightgallery/react/plugins/autoplay';
import Comment from '@lightgallery/react/plugins/comment';
import Fullscreen from '@lightgallery/react/plugins/fullscreen';
import Hash from '@lightgallery/react/plugins/hash';
import MediumZoom from '@lightgallery/react/plugins/mediumZoom';
import Pager from '@lightgallery/react/plugins/pager';
import RelativeCaption from '@lightgallery/react/plugins/relativeCaption';
import Rotate from '@lightgallery/react/plugins/rotate';
import Share from '@lightgallery/react/plugins/share';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Video from '@lightgallery/react/plugins/video';
import Zoom from '@lightgallery/react/plugins/zoom';

import { MIXED_ITEMS, MODES, type Mode } from '../../../shared/media';
import {
    Choice,
    Group,
    Panel,
    Readout,
    Tile,
    Toggle,
    flip,
    useSettings,
} from '../ui';

/**
 * Zoom before Rotate keeps zoom as the outermost slide wrapper, matching
 * the 2.x DOM. Order here is the order handed to `plugins`.
 */
const PLUGINS: { id: string; label: string; plugin: LgPlugin }[] = [
    { id: 'thumbnail', label: 'Thumbnail', plugin: Thumbnail },
    { id: 'zoom', label: 'Zoom', plugin: Zoom },
    { id: 'rotate', label: 'Rotate', plugin: Rotate },
    { id: 'video', label: 'Video', plugin: Video },
    { id: 'share', label: 'Share', plugin: Share },
    { id: 'autoplay', label: 'Autoplay', plugin: Autoplay },
    { id: 'fullscreen', label: 'Fullscreen', plugin: Fullscreen },
    { id: 'pager', label: 'Pager', plugin: Pager },
    { id: 'comment', label: 'Comment', plugin: Comment },
    { id: 'mediumZoom', label: 'Medium zoom', plugin: MediumZoom },
    {
        id: 'relativeCaption',
        label: 'Relative caption',
        plugin: RelativeCaption,
    },
    { id: 'hash', label: 'Hash', plugin: Hash },
];

const PRESETS: Record<string, string[]> = {
    Minimal: [],
    Typical: ['thumbnail', 'zoom', 'video'],
    'All plugins': PLUGINS.map((entry) => entry.id),
};

const DIRECTIONS = ['ltr', 'rtl'] as const;

export function CombinationsPage() {
    const [s, patch] = useSettings({
        active: PRESETS.Typical,
        mode: 'lg-slide' as Mode,
        direction: 'ltr' as (typeof DIRECTIONS)[number],
        actualSize: true,
        infiniteZoom: true,
        virtualization: false,
        allowMediaOverlap: false,
        download: true,
        counter: true,
        gestureButtons: false,
    });

    const plugins = useMemo(
        () =>
            PLUGINS.filter((entry) => s.active.includes(entry.id)).map(
                (entry) => entry.plugin,
            ),
        [s.active],
    );

    return (
        <section>
            <h2>Plugin combinations</h2>
            <p className="note">
                Images of every shape plus video slides. Toggle any mix of
                plugins and settings; the gallery rebuilds with exactly that
                combination.
            </p>
            <Panel>
                <Group title="Plugins">
                    {PLUGINS.map((entry) => (
                        <Toggle
                            key={entry.id}
                            label={entry.label}
                            checked={s.active.includes(entry.id)}
                            onChange={() =>
                                patch('active', flip(s.active, entry.id))
                            }
                        />
                    ))}
                </Group>
                <Group title="Presets">
                    {Object.entries(PRESETS).map(([label, ids]) => (
                        <button
                            key={label}
                            type="button"
                            onClick={() => patch('active', ids)}
                        >
                            {label}
                        </button>
                    ))}
                </Group>
                <Group title="Settings">
                    <Choice
                        label="Mode"
                        value={s.mode}
                        options={MODES}
                        onChange={(value) => patch('mode', value)}
                    />
                    <Choice
                        label="Direction"
                        value={s.direction}
                        options={DIRECTIONS}
                        onChange={(value) => patch('direction', value)}
                    />
                    <Toggle
                        label="actualSize"
                        checked={s.actualSize}
                        onChange={(value) => patch('actualSize', value)}
                    />
                    <Toggle
                        label="infiniteZoom"
                        checked={s.infiniteZoom}
                        onChange={(value) => patch('infiniteZoom', value)}
                    />
                    <Toggle
                        label="virtualization"
                        checked={s.virtualization}
                        onChange={(value) => patch('virtualization', value)}
                    />
                    <Toggle
                        label="allowMediaOverlap"
                        checked={s.allowMediaOverlap}
                        onChange={(value) => patch('allowMediaOverlap', value)}
                    />
                    <Toggle
                        label="download"
                        checked={s.download}
                        onChange={(value) => patch('download', value)}
                    />
                    <Toggle
                        label="counter"
                        checked={s.counter}
                        onChange={(value) => patch('counter', value)}
                    />
                    <Toggle
                        label="showGestureButtons (mobile)"
                        checked={s.gestureButtons}
                        onChange={(value) => patch('gestureButtons', value)}
                    />
                </Group>
            </Panel>
            <Readout>
                Active: <code>{s.active.join(' + ') || 'core only'}</code> ·{' '}
                <code>{s.mode}</code> · <code>{s.direction}</code>
            </Readout>
            <LightGallery
                key={JSON.stringify(s)}
                plugins={plugins}
                mode={s.mode}
                direction={s.direction}
                download={s.download}
                counter={s.counter}
                mobileSettings={{
                    controls: false,
                    showCloseIcon: false,
                    download: false,
                    showGestureButtons: s.gestureButtons,
                }}
                allowMediaOverlap={s.allowMediaOverlap}
                virtualization={
                    s.virtualization ? { slides: 5, thumbs: 'auto' } : undefined
                }
                zoom={{
                    showZoomInOutIcons: true,
                    actualSize: s.actualSize,
                    infiniteZoom: s.infiniteZoom,
                }}
            >
                <div className="grid">
                    {MIXED_ITEMS.map((item) => (
                        <Tile key={item.alt} item={item} caption={false} />
                    ))}
                </div>
            </LightGallery>
        </section>
    );
}
