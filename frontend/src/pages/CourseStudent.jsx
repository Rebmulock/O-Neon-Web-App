import { useParams } from "react-router-dom";
import {useState, useEffect, useRef} from "react";
import { getCourseById } from "../components/ApiRequest.jsx";
import "../styles/CourseStudent.css"


const CourseStudent = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideRef = useRef(null);

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
        return (
            <div className="course-student-container">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) return <div className="course-student-container"><p>Error loading course</p></div>;

    if (!course) return null;

    const slides = course.slides || [];
    const totalSlides = slides.length;

    const getVisiblePages = () => {
        if (totalSlides <= 3) {
          return [...Array(totalSlides).keys()].map(i => i + 1);
        }

        if (currentSlide < 1) return [1, 2, 3, "...", totalSlides];
        if (currentSlide > totalSlides - 2) return [1, "...", totalSlides - 2, totalSlides - 1, totalSlides];

        return [currentSlide, currentSlide + 1, currentSlide + 2, "...", totalSlides];
    };

    const handlePageClick = (page) => {
        if (page === "...") return;

        setCurrentSlide(page - 1);

        if (slideRef.current) {
            slideRef.current.scrollTop = 0;
        }
    };

    return (
        <div className="course-student-container">
            <div className="course-student-slide">
                {slides[currentSlide] && (
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