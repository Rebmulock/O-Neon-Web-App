import { Swiper, SwiperSlide } from "swiper/react";
import { useRef, useState } from "react";
import CarouselDots from "../components/CarouselDots.jsx";
import "swiper/css";

const ExploreDetailCarousel = ({ course }) => {
    const slides = [
        course.demo_video,
        course.demo_img1,
        course.demo_img2,
        course.demo_img3
    ].filter(Boolean);
    const [current, setCurrent] = useState(0);
    const swiperRef = useRef(null);

    const goToSlide = (index) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(index);
        }
        setCurrent(index);
    };

    return (
        <div className="course-detail-carousel">
            {slides.length === 0 ? (
                <div className="no-image">
                    No Image
                </div>
            ) : (
                <Swiper
                slidesPerView={1}
                spaceBetween={16}
                grabCursor={true}
                onSlideChange={(swiper) => setCurrent(swiper.activeIndex)}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
            >
                {slides.map((item, i) => (
                    <SwiperSlide key={i}>
                        {item.endsWith(".mp4") ? (
                            <video controls className="carousel-video">
                                <source src={item} type="video/mp4" />
                            </video>
                        ) : (
                            <img src={item} alt={`Demo ${i}`} className="carousel-img" />
                        )}
                    </SwiperSlide>
                ))}

            </Swiper>
            )}

            {slides.length > 1 && (
                <CarouselDots classname="carousel-dots" images={slides} current={current} setCurrent={goToSlide}/>
            )}
        </div>
    );
};

export default ExploreDetailCarousel;
