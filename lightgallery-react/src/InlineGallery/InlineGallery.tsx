import { InitDetail } from 'lightgallery/lg-events';
import lgAutoplay from 'lightgallery/plugins/autoplay';
import {
    default as lgShare,
    default as lgZoom,
} from 'lightgallery/plugins/share';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import React, { useCallback, useRef } from 'react';
import LightGallery from '../Lightgallery';

interface InlineGalleryProps {}

export const InlineGallery = (props: InlineGalleryProps) => {
    const inlineContainerRef = useRef(null);
    const onInit = useCallback((detail: InitDetail) => {
        console.log(detail, 'detail');
        detail && detail.instance.openGallery();
    }, []);
    return (
        <>
            <h2>React inline gallery</h2>
            <div
                ref={inlineContainerRef}
                id="inline-gallery-container"
                className="inline-gallery-container"
            ></div>
            <LightGallery
                onInit={onInit}
                container={() => {
                    return inlineContainerRef.current;
                }}
                zoom={true}
                thumbnail={true}
                rotate={false}
                mode="lg-slide-vertical"
                pager={false}
                closable={false}
                share={false}
                slideDelay={400}
                swipeToClose={true}
                // addClass="inline-gallery-container"
                plugins={[lgZoom, lgShare, lgAutoplay, lgThumbnail]}
                hash={true}
                download={true}
                fullScreen={false}
                showMaximizeIcon
                dynamic
                appendSubHtmlTo={'.lg-item'}
                easing="cubic-bezier(0.680, -0.550, 0.265, 1.550)"
                speed={1000}
                dynamicEl={[
                    {
                        src:
                            'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
                        responsive:
                            'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
                        thumb:
                            'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
                        subHtml: `<div class="lightGallery-captions">
                            <h4>Photo by <a href="https://unsplash.com/@dann">Dan</a></h4>
                            <p>Published on November 13, 2018</p>
                        </div>`,
                    },
                    {
                        src:
                            'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
                        responsive:
                            'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
                        thumb:
                            'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
                        subHtml: `<div class="lightGallery-captions">
                            <h4>Photo by <a href="https://unsplash.com/@kylepyt">Kyle Peyton</a></h4>
                            <p>Published on September 14, 2016</p>
                        </div>`,
                    },
                    {
                        src:
                            'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                        responsive:
                            'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
                        thumb:
                            'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
                        subHtml: `<div class="lightGallery-captions">
                            <h4>Photo by <a href="https://unsplash.com/@jxnsartstudio">Garrett Jackson</a></h4>
                            <p>Published on May 8, 2020</p>
                        </div>`,
                    },
                    {
                        src:
                            'https://images.unsplash.com/photo-1591634616938-1dfa7ee2e617?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
                        responsive:
                            'https://images.unsplash.com/photo-1591634616938-1dfa7ee2e617?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1591634616938-1dfa7ee2e617?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
                        thumb:
                            'https://images.unsplash.com/photo-1591634616938-1dfa7ee2e617?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
                        subHtml: `<div class="lightGallery-captions">
                            <h4>Photo by <a href="https://unsplash.com/@brookecagle">Brooke Cagle</a></h4>
                            <p>Description of the slide 4</p>
                        </div>`,
                    },
                    {
                        src:
                            'https://images.unsplash.com/photo-1543059509-6d53dbee1728?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                        responsive:
                            'https://images.unsplash.com/photo-1543059509-6d53dbee1728?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1543059509-6d53dbee1728?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
                        thumb:
                            'https://images.unsplash.com/photo-1543059509-6d53dbee1728?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
                        subHtml: `<div class="lightGallery-captions">
                            <h4>Photo by <a href="https://unsplash.com/@charlespostiaux">Charles Postiaux</a></h4>
                            <p>Published on November 24, 2018</p>
                        </div>`,
                    },
                    {
                        src:
                            'https://images.unsplash.com/photo-1609902726285-00668009f004?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                        responsive:
                            'https://images.unsplash.com/photo-1609902726285-00668009f004?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1609902726285-00668009f004?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
                        thumb:
                            'https://images.unsplash.com/photo-1609902726285-00668009f004?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
                        subHtml: `<div class="lightGallery-captions">
                            <h4>Photo by <a href="https://unsplash.com/@bruno_adam">Bruno Adam</a></h4>
                            <p>Published on January 6, 2021</p>
                        </div>`,
                    },
                    {
                        src:
                            'https://images.unsplash.com/photo-1573007974656-b958089e9f7b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
                        responsive:
                            'https://images.unsplash.com/photo-1573007974656-b958089e9f7b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1573007974656-b958089e9f7b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
                        thumb:
                            'https://images.unsplash.com/photo-1573007974656-b958089e9f7b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
                        subHtml: `<div class="lightGallery-captions">
                            <h4>Photo by <a href="https://unsplash.com/@sigmund">Sigmund</a></h4>
                            <p>Published on November 6, 2019</p>
                        </div>`,
                    },
                    {
                        src:
                            'https://images.unsplash.com/photo-1579406842270-ea87c39a8a12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
                        responsive:
                            'https://images.unsplash.com/photo-1579406842270-ea87c39a8a12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1579406842270-ea87c39a8a12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
                        thumb:
                            'https://images.unsplash.com/photo-1579406842270-ea87c39a8a12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
                        subHtml: `<div class="lightGallery-captions">
                            <h4>Photo by <a href="https://unsplash.com/@chow_parij">Parij Borgohain</a></h4>
                            <p>Published on January 19, 2020</p>
                        </div>`,
                    },
                    {
                        src:
                            'https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                        responsive:
                            'https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
                        thumb:
                            'https://images.unsplash.com/photo-1598911543663-37d77962beb1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
                        subHtml: `<div class="lightGallery-captions">
                            <h4>Photo by <a href="https://unsplash.com/@inespiazzese">Ines Piazzese</a></h4>
                            <p>Published on September 1, 2020</p>
                        </div>`,
                    },
                    {
                        src:
                            'https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                        responsive:
                            'https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
                        thumb:
                            'https://images.unsplash.com/photo-1560885673-2cdc12600ec8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
                        subHtml: `<div class="lightGallery-captions">
                            <h4>Photo by <a href="https://unsplash.com/@rdsaunders">Richard Saunders</a></h4>
                            <p>Published on June 19, 2019</p>
                        </div>`,
                    },
                    {
                        src:
                            'https://images.unsplash.com/photo-1571292064306-669f0e758231?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
                        responsive:
                            'https://images.unsplash.com/photo-1571292064306-669f0e758231?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1571292064306-669f0e758231?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
                        thumb:
                            'https://images.unsplash.com/photo-1571292064306-669f0e758231?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
                        subHtml: `<div class="lightGallery-captions">
                            <h4>Photo by <a href="https://unsplash.com/@jalanmeier">J. Meier</a></h4>
                            <p>Published on October 17, 2019</p>
                        </div>`,
                    },
                    {
                        src:
                            'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                        responsive:
                            'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
                        thumb:
                            'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
                        subHtml: `<div class="lightGallery-captions">
                            <h4>Photo by <a href="https://unsplash.com/@brookecagle">Brooke Cagle</a></h4>
                            <p>Published on October 6, 2020</p>
                        </div>`,
                    },
                ]}
            />
        </>
    );
};
export default InlineGallery;
