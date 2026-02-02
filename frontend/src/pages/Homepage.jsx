import "../styles/Homepage.css";
import Slider from "../components/Slider.jsx";
import { NavLink } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import CarouselDots from "../components/CarouselDots.jsx";
import { useRef, useState } from "react";
import "swiper/css";

import img1 from "../assets/best-ai-courses-featured-img-1884950393.jpg";
import img2 from "../assets/Best_GenerativeAI_Courses-1388192624.jpg";
import img3 from "../assets/best-ai-courses-featured-img-1884950393.jpg";
import img4 from "../assets/Best_GenerativeAI_Courses-1388192624.jpg";


const Homepage = () => {
    const images = [img1, img2, img3, img4];
    const isMobile = useIsMobile();
    const [current, setCurrent] = useState(0);
    const swiperRef = useRef(null);

    const goToSlide = (index) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(index);
        }
        setCurrent(index);
    };

    return (
        <div>
            <section className="hero" id="hero-section">
                <h1>Master Data. Master the Future.</h1>

                <p>Practical courses in data analytics and AI designed to prepare you for the real world. Learn to
                    analyze, predict, and build intelligent solutions.
                </p>

                <NavLink to="/explore">Learn More</NavLink>
            </section>

            <section className="slider-container" id="slider-section">
                <h1>Featured Courses</h1>

                {isMobile ? (
                    <>
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={16}
                            grabCursor={true}
                            onSlideChange={(swiper) => setCurrent(swiper.activeIndex)}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                        >
                            {images.map((img, i) => (
                                <SwiperSlide key={i}>
                                    <img src={img} alt={`Featured ${i + 1}`} />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <CarouselDots images={images} current={current} setCurrent={goToSlide} />
                    </>
                ) : (
                    <Slider images={images}>

                    </Slider>
                )}
            </section>
        </div>
    );
}

export default Homepage;