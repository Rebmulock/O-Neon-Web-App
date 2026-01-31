import "../styles/Homepage.css";
import Slider from "../components/Slider.jsx";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import img1 from "../assets/best-ai-courses-featured-img-1884950393.jpg";
import img2 from "../assets/Best_GenerativeAI_Courses-1388192624.jpg";
import img3 from "../assets/best-ai-courses-featured-img-1884950393.jpg";
import img4 from "../assets/Best_GenerativeAI_Courses-1388192624.jpg";

const Homepage = () => {
    const images = [img1, img2, img3, img4];
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 1000px)");

        const updateIsMobile = () => setIsMobile(mediaQuery.matches);

        updateIsMobile();
        mediaQuery.addEventListener("change", updateIsMobile);

        return () => mediaQuery.removeEventListener("change", updateIsMobile);
    }, []);

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
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={16}
                        grabCursor={true}
                    >
                        {images.map((img, i) => (
                            <SwiperSlide key={i}>
                                <img src={img} alt={`Featured ${i + 1}`} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <Slider images={images}>

                    </Slider>
                )}
            </section>
        </div>
    );
}

export default Homepage;