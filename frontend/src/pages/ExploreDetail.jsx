import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCourseById, enrollInCourse } from "../components/ApiRequest.jsx";
import ExploreDetailCarousel from "../components/ExploreDetailCarousel.jsx";
import "../styles/ExploreDetail.css"
import defaultPic from "../assets/Guest.png";

const ExploreDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const handleEnroll = async () => {
        try {
            const response = await enrollInCourse(id);

            if (response.ok) {
                setCourse(prev => ({ ...prev, is_enrolled: true }));
                alert("Successfully enrolled in the course!");
            } else {
                alert(`Enrollment failed: ${response.status || "Unknown error"}`);
            }

        } catch (err) {
            alert(`Enrollment failed: ${err.message || "Network error"}`);
        }
    }

    if (loading) {
        return (
            <div className="explore-detail-container">
                <div className="loading">Loading course details...</div>
            </div>
        );
    }

    if (error) {
        if (error.status === 404) {
            navigate("/not-found");
        }

        return (
            <div className="explore-detail-container">
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <div className="explore-detail-container">
            <div className="course-detail-main">
                <ExploreDetailCarousel course={course}/>

                <div className="course-detail-info">
                    <h1>{course.title}</h1>
                    <p>{course.description}</p>
                </div>
            </div>

            <div className="course-detail-sidebar">
                <div className="course-image">
                    <img src={course.demo_img1} alt="Course Image"/>
                </div>

                <div className="course-detail-info">
                    <h2>{course.title}</h2>
                    <br/>
                    <p>{course.enrolls} Members</p>

                    <div className="course-instructor">
                        <img src={course.profile_pic || defaultPic} alt="" className="profile-pic"/>
                        <p>{course.instructor_name}</p>
                    </div>

                    <div className="enroll-button">
                        {course.is_enrolled ? (
                            <button>Go to Course</button>
                        ) : (
                            <button onClick={handleEnroll}>
                                Join for <strong>{Number(course.price) === 0 ? "FREE" : `$${course.price}`}</strong>
                            </button>

                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExploreDetail;