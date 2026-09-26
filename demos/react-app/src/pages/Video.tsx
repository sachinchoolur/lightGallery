import { LightGallery, type LgPlugin } from '@lightgallery/react';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Video from '@lightgallery/react/plugins/video';
import Zoom from '@lightgallery/react/plugins/zoom';

import { VIDEO_ITEMS, VIDEO_PROVIDERS } from '../../../shared/media';
import {
    Group,
    Panel,
    Readout,
    Tile,
    Toggle,
    flip,
    useSettings,
} from '../ui';

export function VideoPage() {
    const [s, patch] = useSettings({
        providers: [...VIDEO_PROVIDERS],
        thumbnail: true,
        zoom: false,
        loadYouTubeThumbnail: true,
        autoplayFirstVideo: false,
        videoFacade: true,
        youTubeNoCookie: true,
        gotoNextSlideOnVideoEnd: true,
        autoplayVideoOnSlide: false,
    });

    const items = VIDEO_ITEMS.filter((item) =>
        s.providers.some((provider) => item.tags.includes(provider)),
    );
    const plugins = [
        Video,
        s.thumbnail && Thumbnail,
        s.zoom && Zoom,
    ].filter(Boolean) as LgPlugin[];

    return (
        <section>
            <h2>Video</h2>
            <p className="note">
                YouTube, Vimeo, Wistia and self-hosted HTML5, each with an
                explicit poster and without one. With facades on, the player
                loads only when you press play. On a phone, check play, pause
                when swiping away, fullscreen and rotation; mobile browsers
                usually only autoplay muted video.
            </p>
            <Panel>
                <Group title="Providers">
                    {VIDEO_PROVIDERS.map((entry) => (
                        <Toggle
                            key={entry}
                            label={entry}
                            checked={s.providers.includes(entry)}
                            onChange={() =>
                                patch('providers', flip(s.providers, entry))
                            }
                        />
                    ))}
                </Group>
                <Group title="Video settings">
                    <Toggle
                        label="videoFacade"
                        checked={s.videoFacade}
                        onChange={(value) => patch('videoFacade', value)}
                    />
                    <Toggle
                        label="autoplayFirstVideo"
                        checked={s.autoplayFirstVideo}
                        onChange={(value) => patch('autoplayFirstVideo', value)}
                    />
                    <Toggle
                        label="autoplayVideoOnSlide"
                        checked={s.autoplayVideoOnSlide}
                        onChange={(value) =>
                            patch('autoplayVideoOnSlide', value)
                        }
                    />
                    <Toggle
                        label="gotoNextSlideOnVideoEnd"
                        checked={s.gotoNextSlideOnVideoEnd}
                        onChange={(value) =>
                            patch('gotoNextSlideOnVideoEnd', value)
                        }
                    />
                    <Toggle
                        label="youTubeNoCookie"
                        checked={s.youTubeNoCookie}
                        onChange={(value) => patch('youTubeNoCookie', value)}
                    />
                </Group>
                <Group title="Other plugins">
                    <Toggle
                        label="Thumbnail"
                        checked={s.thumbnail}
                        onChange={(value) => patch('thumbnail', value)}
                    />
                    <Toggle
                        label="loadYouTubeThumbnail"
                        checked={s.loadYouTubeThumbnail}
                        onChange={(value) =>
                            patch('loadYouTubeThumbnail', value)
                        }
                    />
                    <Toggle
                        label="Zoom"
                        checked={s.zoom}
                        onChange={(value) => patch('zoom', value)}
                    />
                </Group>
            </Panel>
            <Readout>{items.length} videos</Readout>
            <LightGallery
                key={JSON.stringify(s)}
                plugins={plugins}
                video={{
                    autoplayFirstVideo: s.autoplayFirstVideo,
                    videoFacade: s.videoFacade,
                    youTubeNoCookie: s.youTubeNoCookie,
                    gotoNextSlideOnVideoEnd: s.gotoNextSlideOnVideoEnd,
                    autoplayVideoOnSlide: s.autoplayVideoOnSlide,
                }}
                thumbnail={{ loadYouTubeThumbnail: s.loadYouTubeThumbnail }}
            >
                <div className="grid">
                    {items.map((item) => (
                        <Tile key={item.alt} item={item} />
                    ))}
                </div>
            </LightGallery>
        </section>
    );
}
