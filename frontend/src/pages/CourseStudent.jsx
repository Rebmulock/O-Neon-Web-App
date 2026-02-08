import { useParams } from "react-router-dom";
import {useState, useEffect, useRef, useMemo} from "react";
import { getCourseById, sendRating, markSlideViewed } from "../components/ApiRequest.jsx";
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
    const [submitting, setSubmitting] = useState(false)
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [checkedSlides, setCheckedSlides] = useState({});

    const slides = useMemo(() => course?.slides || [], [course?.slides]);
    const totalSlides = slides.length + 1;
    const isRatingPage = currentSlide === totalSlides - 1;

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

    useEffect(() => {
        if (!course?.id || !slides[currentSlide]) return;

        const slideId = slides[currentSlide].id;

        const markViewed = async () => {
            try {
                const res = await markSlideViewed(course.id, slideId);

                if (!res.ok) {
                    setError("Failed to mark slide as viewed:" + res.data.detail || res.data.message);
                }

            } catch (err) {
                setError(err.message || String(err));
            }
        };

        void markViewed();
    }, [currentSlide, slides, course?.id]);

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

    const handleAnswerSelect = (slideIndex, blockId, answerIndex) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [slideIndex]: {
                ...(prev[slideIndex] || {}),
                [blockId]: answerIndex
            }
        }));
    };

    const handleCheckSlide = () => {
        setCheckedSlides(prev => ({
            ...prev,
            [currentSlide]: true
        }));
    };

    const allQuestionsAnswered = currentSlide < slides.length
        ? slides[currentSlide].blocks
            .filter(b => b.block_type === "quiz-question")
            .every(b => selectedAnswers[currentSlide]?.[b.id] !== undefined)
        : true;

    if (loading) {
        return <div className="course-student-container"><p>Loading...</p></div>;
    }

    if (error) return <div className="course-student-container"><p>Error loading course</p></div>;
    if (!course) return null;

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
                                        {block.block_type === "file" && (
                                            <div
                                                className="file-download-block"
                                                onClick={() => window.open(block.file, "_blank")}
                                            >
                                                📄 {block.file.split("/").pop()}
                                            </div>
                                        )}
                                        {block.block_type === "quiz-question" && (
                                            <div className="quiz-question">
                                                <p>{block.quiz_data.question}</p>
                                                <ul>
                                                    {block.quiz_data.answers.map((answer, idx) => {
                                                        const selected = selectedAnswers[currentSlide]?.[block.id] === idx;
                                                        const isChecked = checkedSlides[currentSlide];
                                                        const correctIndex = block.quiz_data.correctIndex;

                                                        let className = "";
                                                        if (isChecked) {
                                                            if (idx === correctIndex) className = "correct";
                                                            else if (selected) className = "wrong";
                                                        } else if (selected) {
                                                            className = "selected";
                                                        }

                                                        return (
                                                            <li
                                                                key={idx}
                                                                className={className}
                                                                onClick={() =>
                                                                    !isChecked && handleAnswerSelect(currentSlide, block.id, idx)
                                                                }
                                                            >
                                                                {answer}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        )}

                                    </div>
                                ))}

                                {slides[currentSlide].blocks.some(b => b.block_type === "quiz-question") &&
                                    !checkedSlides[currentSlide] && (
                                        <button
                                            className="check-quiz-btn"
                                            onClick={handleCheckSlide}
                                            disabled={!allQuestionsAnswered || checkedSlides[currentSlide]}
                                        >
                                            Check Answers
                                        </button>
                                )}
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