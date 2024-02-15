/* eslint-disable jsx-a11y/alt-text */
import lgVideo from 'lightgallery/plugins/video';
import lgZoom from 'lightgallery/plugins/zoom';
import React, { useCallback, useState } from 'react';
import LightGallery from '../Lightgallery';

interface UpdateSlidesProps {}

export const UpdateSlides = (props: UpdateSlidesProps) => {
    const [items, setItems] = useState([
        {
            id: '1',
            size: '1400-933',
            src:
                'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
            thumb:
                'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
            subHtml: `<div class="lightGallery-captions">
                  <h4>Photo by <a href="https://unsplash.com/@dann">Dan</a></h4>
                  <p>Published on November 13, 2018</p>
              </div>`,
        },
        {
            id: '2',
            size: '1400-933',
            src:
                'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
            thumb:
                'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
            subHtml: `<div class="lightGallery-captions">
                  <h4>Photo by <a href="https://unsplash.com/@kylepyt">Kyle Peyton</a></h4>
                  <p>Published on September 14, 2016</p>
              </div>`,
        },
        {
            id: '3',
            size: '1400-932',
            src:
                'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
            thumb:
                'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
            subHtml: `<div class="lightGallery-captions">
                  <h4>Photo by <a href="https://unsplash.com/@jxnsartstudio">Garrett Jackson</a></h4>
                  <p>Published on May 8, 2020</p>
              </div>`,
        } as any,
    ]);

    const addItem = useCallback(() => {
        setItems((prev) => [
            ...prev,
            {
                id: prev.length + 1,
                size: '1400-933',
                src:
                    'https://images.unsplash.com/photo-1609902726285-00668009f004?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
                thumb:
                    'https://images.unsplash.com/photo-1609902726285-00668009f004?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                  <h4>Photo by <a href="https://unsplash.com/@bruno_adam">Bruno Adam</a></h4>
                  <p>Published on January 6, 2021</p>
              </div>`,
            },
            {
                id: prev.length + 2,
                size: '1400-933',
                src:
                    'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
                thumb:
                    'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
                subHtml: `<div class="lightGallery-captions">
                      <h4>Photo by <a href="https://unsplash.com/@dann">Dan</a></h4>
                      <p>Published on November 13, 2018</p>
                  </div>`,
            },
        ]);
    }, []);

    const getItems = useCallback(() => {
        return items.map((item) => {
            return (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a
                    key={item.id}
                    data-lg-size={item.size}
                    className="gallery-item"
                    data-src={item.src}
                >
                    <img
                        style={{ maxWidth: '280px' }}
                        className="img-responsive"
                        src={item.thumb}
                    />
                </a>
            );
        });
    }, [items]);

    return (
        <>
            <h2>React Updating slides gallery</h2>
            <button onClick={addItem}>Add new item</button>
            <LightGallery
                plugins={[lgVideo, lgZoom]}
                elementClassNames="custom-class-name"
                preload={4}
            >
                {getItems()}
            </LightGallery>
        </>
    );
};
export default UpdateSlides;
