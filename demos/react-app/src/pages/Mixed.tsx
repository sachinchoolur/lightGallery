import { LightGallery, type LgPlugin } from '@lightgallery/react';
import Autoplay from '@lightgallery/react/plugins/autoplay';
import Fullscreen from '@lightgallery/react/plugins/fullscreen';
import Rotate from '@lightgallery/react/plugins/rotate';
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
    useSettings,
} from '../ui';

export function MixedPage() {
    const [s, patch] = useSettings({
        thumbnail: true,
        zoom: true,
        rotate: false,
        video: true,
        fullscreen: true,
        autoplay: false,
        mode: 'lg-slide' as Mode,
    });

    // Zoom before Rotate keeps zoom as the outermost slide wrapper.
    const plugins = [
        s.thumbnail && Thumbnail,
        s.zoom && Zoom,
        s.rotate && Rotate,
        s.video && Video,
        s.fullscreen && Fullscreen,
        s.autoplay && Autoplay,
    ].filter(Boolean) as LgPlugin[];

    return (
        <section>
            <h2>Mixed media</h2>
            <p className="note">
                Videos interleaved with images of every size and shape, so the
                slide type changes on almost every step. Zoom an image, then
                swipe to a video and back; play a video, then swipe away. Turn
                the Video plugin off to see how video slides degrade.
            </p>
            <Panel>
                <Group title="Plugins">
                    <Toggle
                        label="Thumbnail"
                        checked={s.thumbnail}
                        onChange={(value) => patch('thumbnail', value)}
                    />
                    <Toggle
                        label="Zoom"
                        checked={s.zoom}
                        onChange={(value) => patch('zoom', value)}
                    />
                    <Toggle
                        label="Rotate"
                        checked={s.rotate}
                        onChange={(value) => patch('rotate', value)}
                    />
                    <Toggle
                        label="Video"
                        checked={s.video}
                        onChange={(value) => patch('video', value)}
                    />
                    <Toggle
                        label="Fullscreen"
                        checked={s.fullscreen}
                        onChange={(value) => patch('fullscreen', value)}
                    />
                    <Toggle
                        label="Autoplay"
                        checked={s.autoplay}
                        onChange={(value) => patch('autoplay', value)}
                    />
                </Group>
                <Group title="Transition">
                    <Choice
                        label="Mode"
                        value={s.mode}
                        options={MODES}
                        onChange={(value) => patch('mode', value)}
                    />
                </Group>
            </Panel>
            <Readout>{MIXED_ITEMS.length} slides</Readout>
            <LightGallery
                key={JSON.stringify(s)}
                plugins={plugins}
                mode={s.mode}
                zoom={{ showZoomInOutIcons: true, actualSize: true }}
            >
                <div className="grid">
                    {MIXED_ITEMS.map((item) => (
                        <Tile key={item.alt} item={item} />
                    ))}
                </div>
            </LightGallery>
        </section>
    );
}
