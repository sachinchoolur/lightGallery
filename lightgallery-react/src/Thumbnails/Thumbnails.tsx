/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import LightGallery from '../Lightgallery';

/* eslint-disable-next-line */
interface ThumbnailsProps {}

export const Thumbnails = (props: ThumbnailsProps) => {
    return (
        <>
            <h2>React thumbnails gallery</h2>
            <LightGallery
                zoom={false}
                thumbnail={false}
                rotate={false}
                mode="lg-slide-vertical"
                pager={false}
                plugins={[]}
                hash={false}
                download={false}
                fullScreen={false}
                easing="cubic-bezier(0.680, -0.550, 0.265, 1.550)"
                speed={1000}
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
