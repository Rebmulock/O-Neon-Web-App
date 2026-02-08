import { useEffect, useState } from "react";
import "../styles/InstructorRequests.css";
import { listPendingCourses } from "../components/ApiRequest.jsx";

const InstructorRequests = () => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await listPendingCourses();
                if (response.ok) {
                    setCourses(response.data);
                    setError(null);
                } else {
                    setError(`Failed to fetch instructor courses: ${response.status}`);
                }
            } catch (err) {
                setError("Error fetching courses: " + (err.message || err));
            }
        };

        void fetchCourses();
    }, []);

    return (
        <div className="users-container">
            <div className="users-header">
                <h1>My Course Requests</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="requests-tables">
                <div className="user-table-wrapper">
                    <h2>My Courses</h2>
                    <div className="user-table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(course => (
                                    <tr key={course.id}>
                                        <td>{course.title}</td>
                                        <td>{course.pending ? "Pending" : "Approved"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorRequests;