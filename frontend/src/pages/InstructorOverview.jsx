import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses, deleteCourse } from "../components/ApiRequest.jsx";
import "../styles/Overview.css";
import trashIcon from "../assets/trash-can-solid-full.svg";
import pencilIcon from "../assets/pencil-solid-full.svg";
import caretDownIcon from "../assets/caret-down-solid-full.svg";
import { useIsMobile } from "../hooks/useIsMobile.jsx";

const InstructorOverview = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const isMobile = useIsMobile(768);
    const [openCourseId, setOpenCourseId] = useState(null);

    const toggleCourse = (id) => {
        setOpenCourseId(prev => (prev === id ? null : id));
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getCourses();
                setCourses(response.data);
                setError(null);
            } catch (err) {
                setError("Failed to fetch courses: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        void fetchCourses();
    }, []);

    if (loading) return <p>Loading courses...</p>;

    return (
        <div className="overview-container">
            <h1>Courses Overview</h1>
            {error && <div className="error-message">{error}</div>}
            <div className="overview-list-container">
                {isMobile ? (
                    courses.map(course => (
                        <div
                            className="mobile-overview-list"
                            onClick={() => toggleCourse(course.id)}
                            key={course.id}
                        >
                            <div className={`mobile-course-header ${openCourseId === course.id ? "open" : ""}`}>
                                <div className="dropdown-icon">
                                    <img src={caretDownIcon} alt="Caret down" />
                                </div>
                                <div className="course-title">{course.title}</div>
                                <div className="course-price">{course.price ? `$${course.price}` : "Free"}</div>
                            </div>

                            {openCourseId === course.id && (
                                <div className="mobile-course-details">
                                    <div className="course-detail-row">Title: {course.title}</div>
                                    <div className="course-detail-row">Price: {course.price ? `$${course.price}` : "Free"}</div>
                                    <div className="course-detail-row">
                                        Created At: {new Date(course.created_at).toLocaleString("sk-SK", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                    <div className="course-detail-row">
                                        Updated At: {course.updated_at
                                            ? new Date(course.updated_at).toLocaleString("sk-SK", {
                                                  day: "2-digit",
                                                  month: "2-digit",
                                                  year: "numeric",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                              })
                                            : "-"}
                                    </div>
                                    <div className="overview-actions">
                                        <button
                                            className="edit"
                                            onClick={() => navigate(`/dashboard/instructor/update/${course.id}`)}
                                        >
                                            <img src={pencilIcon} alt="Edit" />
                                        </button>
                                        <button
                                            className="delete-btn-red"
                                            onClick={() => setCourseToDelete(course)}
                                        >
                                            <img src={trashIcon} alt="Delete" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <table className="overview-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Price</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.id}>
                                    <td>{course.title}</td>
                                    <td>{course.price ? `$${course.price}` : "Free"}</td>
                                    <td>{new Date(course.created_at).toLocaleString("sk-SK", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}</td>
                                    <td>{course.updated_at
                                        ? new Date(course.updated_at).toLocaleString("sk-SK", {
                                              day: "2-digit",
                                              month: "2-digit",
                                              year: "2-digit",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          })
                                        : "-"}
                                    </td>
                                    <td className="overview-actions">
                                        <button
                                            className="edit"
                                            onClick={() => navigate(`/dashboard/instructor/update/${course.id}`)}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="delete-btn-red"
                                            onClick={() => setCourseToDelete(course)}
                                        >
                                            <img src={trashIcon} alt="Delete" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {courseToDelete && (
                <div className="delete-modal-backdrop">
                    <div className="delete-modal">
                        <h2>Delete course</h2>
                        <table className="delete-course-table">
                            <tbody>
                                <tr>
                                    <td>Title</td>
                                    <td>{courseToDelete.title}</td>
                                </tr>
                                <tr>
                                    <td>Price</td>
                                    <td>{courseToDelete.price ? `$${courseToDelete.price}` : "Free"}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="delete-warning">
                            This action <strong>cannot be undone</strong>.
                        </p>
                        <div className="delete-modal-actions">
                            <button className="btn-cancel" onClick={() => setCourseToDelete(null)}>Cancel</button>
                            <button
                                className="btn-delete"
                                onClick={async () => {
                                    try {
                                        await deleteCourse(courseToDelete.id);
                                        setCourses(prev => prev.filter(c => c.id !== courseToDelete.id));
                                        setCourseToDelete(null);
                                        setError(null);
                                    } catch (err) {
                                        setError("Failed to delete course: " + err.message);
                                    }
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstructorOverview;
