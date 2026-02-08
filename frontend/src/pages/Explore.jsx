import "../styles/Explore.css"
import { useState, useEffect } from "react";
import { getCourses } from "../components/ApiRequest.jsx";
import {useNavigate} from "react-router-dom";

const Explore = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            setError("");

            try {
                const response = await getCourses();

                if (!response.ok) {
                    const messages = response.data
                        ? Object.values(response.data).flat()
                        : ["Failed to fetch courses"];
                    setError(messages.join(" | "));

                    return;
                }

                setCourses(response.data)

            } catch (err) {
                setError(err.message || "Failed to fetch courses.");
            } finally {
                setLoading(false);
            }
        };

        void fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="explore-container">
                <div className="loading">Loading courses...</div>
            </div>);
    }

    return (
        <div className="explore-container">
            <div className="search-container">

            </div>

            <div className="course-list">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="course-card"
                        onClick={() => navigate("/explore/" + course.id)}
                    >
                        <img src={course.demo_img1} alt="No Image" className="card-img"/>

                        <div className="course-info">
                            <h2 className="card-title">{course.title}</h2>
                            <p className="card-desc">{course.description}</p>

                            <div className="card-footer">
                                <p>{course.enrolls}</p>
                                <strong>{Number(course.price) !== 0 ? "$" + course.price : "FREE"}</strong>
                            </div>
                        </div>
                    </div>
                ))}

                {error && <div className="error">{error}</div>}
            </div>
        </div>
    )
}

export default Explore;