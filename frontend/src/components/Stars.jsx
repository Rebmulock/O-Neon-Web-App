const Stars = ({ rating }) => {
    const rounded = Math.round(rating || 0);
    const total = 5;

    return (
        <div>
            {[...Array(total)].map((_, i) => (
                <span key={i} style={{ color: i < rounded ? "#facc15" : "#d1d5db" }}>
                ★
                </span>
            ))}
        </div>
    );
};

export default Stars;
