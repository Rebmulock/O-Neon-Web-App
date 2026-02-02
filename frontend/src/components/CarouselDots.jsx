const CarouselDots = ({ images, current, setCurrent }) => {
    return (
        <div className="dots">
            {images.map((_, i) => (
                <span
                    key={i}
                    className={`dot ${i === current ? "active" : ""}`}
                    onClick={() => setCurrent(i)}
                />
            ))}
        </div>
    );
};

export default CarouselDots;
