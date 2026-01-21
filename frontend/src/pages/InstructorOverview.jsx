import { useState, useEffect } from "react";
import { getCourses } from "../components/ApiRequest.jsx";
import "../styles/Overview.css";
import trashIcon from "../assets/trash-can-solid-full.svg";
import { deleteCourse } from "../components/ApiRequest.jsx";

const InstructorOverview = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courseToDelete, setCourseToDelete] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getCourses();

                setCourses(response.data)

            } catch (err) {

                console.error(err);
                setError("Failed to fetch courses");

            } finally {
                setLoading(false);
            }
        };

        void fetchCourses();
    }, []);

    if (loading) return <p>Loading courses...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="overview-container">
            <h1>Courses Overview</h1>

            <div className="overview-table-container">
                <table className="overview-table">
                    <thead>
                        <tr>
                            <th >Title</th>
                            <th >Price</th>
                            <th >Created At</th>
                            <th >Updated At</th>
                            <th >Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(course => (
                            <tr key={course.id}>
                                <td >{course.title}</td>
                                <td >
                                    {course.price ? `$${course.price}` : "Free"}
                                </td>
                                <td>
                                    {new Date(course.created_at).toLocaleString("sk-SK", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </td>

                                <td>
                                    {course.updated_at
                                        ? new Date(course.updated_at).toLocaleString("sk-SK", {
                                              day: "2-digit",
                                              month: "2-digit",
                                              year: "numeric",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          })
                                        : "-"}
                                </td>
                                <td className="overview-actions">
                                    <button className="edit">✏️</button>
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
                                <td>
                                    {courseToDelete.price
                                        ? `$${courseToDelete.price}`
                                        : "Free"}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <p className="delete-warning">
                        This action <strong>cannot be undone</strong>.
                    </p>

                    <div className="delete-modal-actions">
                        <button
                            className="btn-cancel"
                            onClick={() => setCourseToDelete(null)}
                        >
                            Cancel
                        </button>

                        <button
                            className="btn-delete"
                            onClick={async () => {
                                try {
                                    await deleteCourse(courseToDelete.id);
                                    setCourses(prev =>
                                        prev.filter(c => c.id !== courseToDelete.id)
                                    );
                                    setCourseToDelete(null);
                                } catch (err) {
                                    console.error(err);
                                    alert("Failed to delete course");
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