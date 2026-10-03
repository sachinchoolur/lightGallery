import lightGallery from 'lightgallery';
import lgVideo from 'lightgallery/plugins/video';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-video.css';
import './demo.css';

lightGallery(document.getElementById('gallery'), {
    plugins: [lgVideo],
    // The next two are the defaults, written out. A video slide shows its
    // poster with a play button; the player loads when play is pressed.
    videoFacade: true,
    // YouTube videos are embedded through youtube-nocookie.com.
    youTubeNoCookie: true,
    // By default the first video starts playing as the gallery opens, which
    // loads its player at once. Off, so every slide starts as a facade.
    autoplayFirstVideo: false,
});
