/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import LightGallery, { LightGalleryProps } from '../Lightgallery';
import lgAutoplay from 'lightgallery/plugins/autoplay';
import {
    default as lgShare,
    default as lgZoom,
} from 'lightgallery/plugins/share';
import lgThumbnail from 'lightgallery/plugins/thumbnail';

/* eslint-disable-next-line */
interface ThumbnailsProps {}

export const Thumbnails = (props: ThumbnailsProps) => {
    const [showCounter, setShowCounter] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [easing, setEasing] = useState('0.680, -0.550, 0.265, 1.550');
    const [download, setDownload] = useState(false);
    const [speed, setSpeed] = useState(1000);
    const [transition, setTransition] = useState<
        Pick<LightGalleryProps, 'mode'>['mode']
    >('lg-slide');
    const handleTransitionChange = (event: any) => {
        setTransition(event.target.value);
    };
    const handleEasingChange = (event: any) => {
        setEasing(event.target.value);
    };

    return (
        <>
            <h2>React Thumbnails Gallery</h2>
            <div className="controls">
                <SelectEasingComponent
                    easing={easing}
                    handleEasingChange={handleEasingChange}
                />
                <SelectModeComponent
                    transition={transition}
                    handleTransitionChange={handleTransitionChange}
                />
                <button onClick={() => setShowCounter((p) => !p)}>
                    {showCounter ? 'Hide' : 'Show'} Progress Count
                </button>
                <button onClick={() => setShowControls((p) => !p)}>
                    {showControls ? 'Hide' : 'Show'} Controls
                </button>
                <button onClick={() => setDownload((p) => !p)}>
                    {download ? 'Hide' : 'Show'} Download
                </button>
                <label htmlFor="speed">
                    Speed
                </label>
                <input
                    id="speed"
                    type="number"
                    defaultValue={speed}
                    onBlur={(e) => {
                        setSpeed(Number(e.target.value));
                    }}
                />
            </div>
            <LightGallery
                zoom={true}
                thumbnail={true}
                share={true}
                counter={showCounter}
                rotate={true}
                controls={showControls}
                mode={transition}
                easing={`cubic-bezier(${easing})`}
                pager={true}
                plugins={[lgZoom, lgShare, lgAutoplay, lgThumbnail]}
                hash={false}
                download={download}
                fullScreen={false}
                speed={speed}
                elementClassNames='thumbnails-gallery'
            >
                <a
                    className="gallery-item"
                    data-lg-size="400-267-375, 600-400-480, 1600-1067"
                    data-src="https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80"
                    data-responsive="https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=400&q=100 375, https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=600&q=100 480"
                    data-sub-html="<h4>Photo by - <a href='https://unsplash.com/@tobbes_rd' >Tobias Rademacher </a></h4><p> Location - <a href='https://unsplash.com/s/photos/puezgruppe%2C-wolkenstein-in-gr%C3%B6den%2C-s%C3%BCdtirol%2C-italien'>Puezgruppe, Wolkenstein in Gröden, Südtirol, Italien</a>layers of blue.</p>"
                    data-slide-name="fading-light"
                    data-tweet-text="lightGallery slide  1"
                    data-twitter-share-url="share/twitter-share-url"
                    data-reddit-title="Fading Light"
                    data-disqus-identifier="photo-1609342122563-a43ac8917a3a"
                    data-disqus-url="https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80"
                    data-fb-html='<div class="fb-comments" data-href="http://sachinchoolur.github.io/lightGallery/demos/comment-box.html#lg=1&slide=0" data-width="400" data-numposts="5"></div>'
                >
                    <img
                        className="img-responsive"
                        src="https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80"
                    />
                </a>
                <a
                    className="gallery-item"
                    data-lg-size="400-600-375, 600-900-480, 1600-2400"
                    data-pinterest-text="Pin it2"
                    data-tweet-text="lightGallery slide  2"
                    data-slide-name="Bowness-bay"
                    data-reddit-title="Bowness Bay"
                    data-disqus-identifier="1608481337062-4093bf3ed404"
                    data-disqus-url="https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80"
                    data-fb-html='<div class="fb-comments" data-href="http://sachinchoolur.github.io/lightGallery/demos/comment-box.html#lg=1&slide=1" data-width="400" data-numposts="5"></div>'
                    data-src="https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80"
                    data-responsive="https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=400&q=80 375, https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=600&q=80 480"
                    data-sub-html="<h4>Photo by - <a href='https://unsplash.com/@therawhunter' >Massimiliano Morosinotto </a></h4><p> Location - <a href='https://unsplash.com/s/photos/tre-cime-di-lavaredo%2C-italia'>Tre Cime di Lavaredo, Italia</a>This is the Way</p>"
                >
                    <img
                        className="img-responsive"
                        src="https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80"
                    />
                </a>
                <a
                    className="gallery-item"
                    data-lg-size="400-600-375, 600-900-480, 1600-2400"
                    data-pinterest-text="Pin it3"
                    data-tweet-text="lightGallery slide  3"
                    data-reddit-title="Sunset Serenity"
                    data-src="https://images.unsplash.com/photo-1605973029521-8154da591bd7?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80"
                    data-responsive="https://images.unsplash.com/photo-1605973029521-8154da591bd7?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=400&q=80 375, https://images.unsplash.com/photo-1605973029521-8154da591bd7?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=600&q=80 480"
                    data-sub-html="<h4>Photo by - <a href='https://unsplash.com/@thesaboo' >Sascha Bosshard </a></h4><p> Location - <a href='https://unsplash.com/s/photos/pizol%2C-mels%2C-schweiz'>Pizol, Mels, Schweiz</a></p>"
                    data-fb-html='<div class="fb-comments" data-href="http://sachinchoolur.github.io/lightGallery/demos/comment-box.html#lg=1&slide=2" data-width="400" data-numposts="5"></div>'
                    data-slide-name="Sunset-serenity"
                >
                    <img
                        width="150"
                        height="100"
                        className="img-responsive"
                        src="https://images.unsplash.com/photo-1605973029521-8154da591bd7?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80"
                    />
                </a>
                <a
                    className="gallery-item"
                    data-slide-name="photo-by-yusuf-evli"
                    data-lg-size="400-600-375, 600-899-480, 1600-2398"
                    data-pinterest-text="Pin it4"
                    data-tweet-text="lightGallery slide  4"
                    data-reddit-title="Sunset Serenity"
                    data-src="https://images.unsplash.com/photo-1526281216101-e55f00f0db7a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80"
                    data-responsive="https://images.unsplash.com/photo-1526281216101-e55f00f0db7a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=400&q=80 375, https://images.unsplash.com/photo-1526281216101-e55f00f0db7a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=600&q=80 480"
                    data-fb-html='<div class="fb-comments" data-href="http://sachinchoolur.github.io/lightGallery/demos/comment-box.html#lg=1&slide=3" data-width="400" data-numposts="5"></div>'
                    data-sub-html="<h4>Photo by - <a href='https://unsplash.com/@yusufevli' >Yusuf Evli </a></h4><p> Foggy Road</p>"
                >
                    <img
                        width="300"
                        className="img-responsive"
                        src="https://images.unsplash.com/photo-1526281216101-e55f00f0db7a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80"
                    />
                </a>
            </LightGallery>
        </>
    );
};
export default Thumbnails;

const SelectEasingComponent = ({ handleEasingChange, easing }: any) => {
    return (
        <div className="choose-select-option-wrap">
            <span className="choose-select-option">Change easing : </span>
            <select
                id="select-easing"
                className="mrb30 select"
                value={easing}
                onChange={handleEasingChange}
            >
                <optgroup label="defaults">
                    <option value="0.250, 0.250, 0.750, 0.750">linear</option>
                    <option value="0.250, 0.100, 0.250, 1.000">
                        ease (default)
                    </option>
                    <option value="0.420, 0.000, 1.000, 1.000">ease-in</option>
                    <option value="0.000, 0.000, 0.580, 1.000">ease-out</option>
                    <option value="0.420, 0.000, 0.580, 1.000">
                        ease-in-out
                    </option>
                </optgroup>
                <optgroup label="Penner Equations (approximated)">
                    <option value="0.550, 0.085, 0.680, 0.530">
                        easeInQuad
                    </option>
                    <option value="0.550, 0.055, 0.675, 0.190">
                        easeInCubic
                    </option>
                    <option value="0.550, 0.085, 0.680, 0.530">
                        easeInQuad
                    </option>
                    <option value="0.550, 0.055, 0.675, 0.190">
                        easeInCubic
                    </option>
                    <option value="0.895, 0.030, 0.685, 0.220">
                        easeInQuart
                    </option>
                    <option value="0.755, 0.050, 0.855, 0.060">
                        easeInQuint
                    </option>
                    <option value="0.470, 0.000, 0.745, 0.715">
                        easeInSine
                    </option>
                    <option value="0.950, 0.050, 0.795, 0.035">
                        easeInExpo
                    </option>
                    <option value="0.600, 0.040, 0.980, 0.335">
                        easeInCirc
                    </option>
                    <option value="0.600, -0.280, 0.735, 0.045">
                        easeInBack
                    </option>
                    <option value="0.250, 0.460, 0.450, 0.940">
                        easeOutQuad
                    </option>
                    <option value="0.215, 0.610, 0.355, 1.000">
                        easeOutCubic
                    </option>
                    <option value="0.165, 0.840, 0.440, 1.000">
                        easeOutQuart
                    </option>
                    <option value="0.230, 1.000, 0.320, 1.000">
                        easeOutQuint
                    </option>
                    <option value="0.390, 0.575, 0.565, 1.000">
                        easeOutSine
                    </option>
                    <option value="0.190, 1.000, 0.220, 1.000">
                        easeOutExpo
                    </option>
                    <option value="0.075, 0.820, 0.165, 1.000">
                        easeOutCirc
                    </option>
                    <option value="0.175, 0.885, 0.320, 1.275">
                        easeOutBack
                    </option>
                    <option value="0.455, 0.030, 0.515, 0.955">
                        easeInOutQuad
                    </option>
                    <option value="0.645, 0.045, 0.355, 1.000">
                        easeInOutCubic
                    </option>
                    <option value="0.770, 0.000, 0.175, 1.000">
                        easeInOutQuart
                    </option>
                    <option value="0.860, 0.000, 0.070, 1.000">
                        easeInOutQuint
                    </option>
                    <option value="0.445, 0.050, 0.550, 0.950">
                        easeInOutSine
                    </option>
                    <option value="1.000, 0.000, 0.000, 1.000">
                        easeInOutExpo
                    </option>
                    <option value="0.785, 0.135, 0.150, 0.860">
                        easeInOutCirc
                    </option>
                    <option value="0.680, -0.550, 0.265, 1.550">
                        easeInOutBack
                    </option>
                </optgroup>
            </select>
        </div>
    );
};

const SelectModeComponent = ({ handleTransitionChange, transition }: any) => {
    return (
        <div className="choose-select-option-wrap">
            <span className="choose-select-option">Change transition : </span>
            <select
                id="select-easing"
                className="mrb30 select"
                value={transition}
                onChange={handleTransitionChange}
            >
                <option value="lg-slide">lg-slide</option>
                <option value="lg-fade">lg-fade</option>
                <option value="lg-zoom-in">lg-zoom-in</option>
                <option value="lg-zoom-in-big">lg-zoom-in-big</option>
                <option value="lg-zoom-out">lg-zoom-out</option>
                <option value="lg-zoom-out-big">lg-zoom-out-big</option>
                <option value="lg-zoom-out-in">lg-zoom-out-in</option>
                <option value="lg-zoom-in-out">lg-zoom-in-out</option>
                <option value="lg-soft-zoom">lg-soft-zoom</option>
                <option value="lg-scale-up">lg-scale-up</option>
                <option value="lg-slide-circular">lg-slide-circular</option>
                <option value="lg-slide-circular-vertical">
                    lg-slide-circular-vertical
                </option>
                <option value="lg-slide-vertical">lg-slide-vertical</option>
                <option value="lg-slide-vertical-growth">
                    lg-slide-vertical-growth
                </option>
                <option value="lg-slide-skew-only">lg-slide-skew-only</option>
                <option value="lg-slide-skew-only-rev">
                    lg-slide-skew-only-rev
                </option>
                <option value="lg-slide-skew-only-y">
                    lg-slide-skew-only-y
                </option>
                <option value="lg-slide-skew-only-y-rev">
                    lg-slide-skew-only-y-rev
                </option>
                <option value="lg-slide-skew">lg-slide-skew</option>
                <option value="lg-slide-skew-rev">lg-slide-skew-rev</option>
                <option value="lg-slide-skew-cross">lg-slide-skew-cross</option>
                <option value="lg-slide-skew-cross-rev">
                    lg-slide-skew-cross-rev
                </option>
                <option value="lg-slide-skew-ver">lg-slide-skew-ver</option>
                <option value="lg-slide-skew-ver-rev">
                    lg-slide-skew-ver-rev
                </option>
                <option value="lg-slide-skew-ver-cross">
                    lg-slide-skew-ver-cross
                </option>
                <option value="lg-slide-skew-ver-cross-rev">
                    lg-slide-skew-ver-cross-rev
                </option>
                <option value="lg-lollipop">lg-lollipop</option>
                <option value="lg-lollipop-rev">lg-lollipop-rev</option>
                <option value="lg-rotate">lg-rotate</option>
                <option value="lg-rotate-rev">lg-rotate-rev</option>
                <option value="lg-tube">lg-tube</option>
            </select>
        </div>
    );
};
