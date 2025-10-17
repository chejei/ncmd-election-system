import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useRef, useState } from "react";
import "swiper/css";

export default function Slider({ items }) {
    const slideRefs = useRef([]);
    const swiperRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState(0);

    useEffect(() => {
        const heights = slideRefs.current
            .map((ref) => (ref ? ref.offsetHeight : 0))
            .filter((h) => Number.isFinite(h) && h > 0); // ✅ avoid Infinity

        const tallest = heights.length ? Math.max(...heights) : 0;
        setMaxHeight(tallest);
    }, [items]);

    const scrollLeft = () => {
        swiperRef.current?.slidePrev();
    };

    const scrollRight = () => {
        swiperRef.current?.slideNext();
    };

    return (
        <div className="w-full mx-auto py-8 relative">
            <Swiper
                spaceBetween={0}
                slidesPerView={1}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
            >
                {items.map((item, index) => (
                    <SwiperSlide
                        key={index}
                        style={{
                            height: maxHeight > 0 ? `${maxHeight}px` : "auto",
                        }}
                        ref={(el) => (slideRefs.current[index] = el)}
                        className="slide"
                    >
                        <div className="h-full bg-white shadow-lg border rounded-xl p-6 text-center">
                            <h2 className="text-xl font-bold">{item.title}</h2>
                            {item.img && (
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-100 object-contain rounded-md mb-4"
                                />
                            )}
                            <p className="mt-2 text-gray-600">{item.text}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            {/* Left Button */}
            <button
                onClick={scrollLeft}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-full shadow-lg z-1"
            >
                ‹
            </button>

            {/* Right Button */}
            <button
                onClick={scrollRight}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-full shadow-lg z-1"
            >
                ›
            </button>
        </div>
    );
}
