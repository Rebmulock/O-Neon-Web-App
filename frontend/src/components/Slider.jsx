import { useEffect, useState } from "react";

const Slider = ({ images }) => {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        setCurrent((prev) => ((prev + 1) % images.length));
    }

    const prevSlide = () => {
        setCurrent((prev) => ((prev - 1 + images.length) % images.length));
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrent(prev => (prev + 1) % images.length);
        }, 5000);

        return () => clearTimeout(timer);
    }, [current, images.length]);

    return (
        <div className="slider">
            {images.map((img, i) => (
                <div
                    key={i}
                    className={`slide ${i === current ? "active" : ""}`}
                    style={{ backgroundImage: `url(${img})` }}
                />
            ))}

            <button className="arrow left" onClick={prevSlide}>‹</button>
            <button className="arrow right" onClick={nextSlide}>›</button>

            <div className="dots">
                {images.map((_, i) => (
                    <span
                        key={i}
                        className={`dot ${i === current ? "active" : ""}`}
                        onClick={() => setCurrent(i)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slider;