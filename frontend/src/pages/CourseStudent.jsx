import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getCourseById, sendRating } from "../components/ApiRequest.jsx";
import "../styles/CourseStudent.css";

const CourseStudent = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideRef = useRef(null);
    const [rating, setRating] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await getCourseById(id);
                if (response.ok) {
                    setCourse(response.data);
                } else {
                    setError(response);
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        void fetchCourse();
    }, [id]);

    if (loading) {
        return <div className="course-student-container"><p>Loading...</p></div>;
    }

    if (error) return <div className="course-student-container"><p>Error loading course</p></div>;
    if (!course) return null;

    const slides = course.slides || [];
    const totalSlides = slides.length + 1;
    const isRatingPage = currentSlide === totalSlides - 1;
    const isLastSlide = currentSlide === totalSlides - 2;

    const getVisiblePages = () => {
        if (totalSlides <= 3) return [...Array(totalSlides).keys()].map(i => i + 1);
        if (currentSlide < 1) return [1, 2, 3, "...", totalSlides];
        if (currentSlide > totalSlides - 2) return [1, "...", totalSlides - 2, totalSlides - 1, totalSlides];
        return [currentSlide, currentSlide + 1, currentSlide + 2, "...", totalSlides];
    };

    const handlePageClick = (page) => {
        if (page === "...") return;
        setCurrentSlide(page - 1);
        if (slideRef.current) slideRef.current.scrollTop = 0;
    };

    const handleSendRating = async () => {
        if (rating === 0) {
            alert("Please select a rating first!");
            return;
        }

        setSubmitting(true);
        try {
            const response = await sendRating(id, { rating: rating });
            if (response.ok) {
                setIsSubmitted(true);
            } else {
                alert("Failed to send rating.");
            }
        } catch (err) {
            console.error("Rating error:", err);
            alert("An error occurred while sending rating.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="course-student-container">
            <div className="course-student-slide">
                {!isRatingPage ? (
                    slides[currentSlide] && (
                        <div className="slide-content" ref={slideRef}>
                            <h1>{slides[currentSlide].title}</h1>
                            <div className="slide-body">
                                {slides[currentSlide].blocks.map(block => (
                                    <div key={block.id}>
                                        {block.block_type === "heading" && <h3>{block.value}</h3>}
                                        {block.block_type === "description" && <p className="slide-desc">{block.value}</p>}
                                        {block.block_type === "image" && <img src={block.image} alt="Slide image"/>}
                                        {block.block_type === "quiz-question" && (
                                            <div className="quiz-question">
                                                <p>{block.quiz_data.question}</p>
                                                <ul>
                                                    {block.quiz_data.answers.map((answer, idx) => (
                                                        <li key={idx}>{answer}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ) : (
                    <div className="slide-content rating-page">
                        <h1>Course Evaluation</h1>
                        <div className="slide-body">
                            <div className="rating-section">
                                <h3>How would you rate this course?</h3>
                                {isSubmitted ? (
                                    <div className="success-msg">
                                        <p>✅ Your rating ({rating}/5) was submitted. Thank you!</p>
                                    </div>
                                ) : (
                                    <div className="rating-wrapper">
                                        <div className="stars">
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    className={`rating-star ${rating >= num ? "selected" : ""}`}
                                                    onClick={() => setRating(num)}
                                                >
                                                    {rating >= num ? "★" : "☆"}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            className="send-rating-btn"
                                            onClick={handleSendRating}
                                            disabled={rating === 0 || submitting}
                                        >
                                            {submitting ? "Sending..." : "Send rating"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="course-student-pages">
                {getVisiblePages().map((page, idx) => (
                    <button
                        key={idx}
                        className={`page-btn ${currentSlide + 1 === page ? "active" : ""}`}
                        onClick={() => handlePageClick(page)}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CourseStudent;