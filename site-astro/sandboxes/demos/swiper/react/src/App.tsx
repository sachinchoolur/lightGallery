import { useRef } from 'react';
import { LightGallery, LightGalleryItem } from '@lightgallery/react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide, type SwiperClass } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'lightgallery/css/lightgallery.css';
import './carousel.css';

const slides = [10, 11, 15, 16].map((id, index) => ({
    src: `https://picsum.photos/id/${id}/1600/1067`,
    thumb: `https://picsum.photos/id/${id}/960/640`,
    alt: `Sample photo ${index + 1}`,
    // WIDTH-HEIGHT of the full-size image; lets it open from its slide.
    lgSize: '1600-1067',
}));

export default function App() {
    const swiper = useRef<SwiperClass | null>(null);

    return (
        <>
            <h1>lightGallery with a Swiper carousel</h1>
            {/* When the gallery goes to another slide, move the carousel to
                the same slide, so the image closes into its slide. */}
            <LightGallery
                onBeforeSlide={({ index }) => swiper.current?.slideTo(index, 0)}
            >
                <Swiper
                    modules={[Navigation]}
                    navigation
                    onSwiper={(instance) => {
                        swiper.current = instance;
                    }}
                >
                    {slides.map((slide) => (
                        <SwiperSlide key={slide.src}>
                            <LightGalleryItem item={slide} href={slide.src}>
                                <img src={slide.thumb} alt={slide.alt} />
                            </LightGalleryItem>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </LightGallery>
        </>
    );
}
