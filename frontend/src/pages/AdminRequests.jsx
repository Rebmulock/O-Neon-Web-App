import { useEffect, useState } from "react";
import "../styles/AdminRequests.css";
import { listPendingInstructors, approveInstructor } from "../components/ApiRequest.jsx";
import checkIcon from "../assets/check-solid-full.svg";
import crossIcon from "../assets/xmark-solid-full.svg";

const AdminRequests = () => {
    const [pendingInstructors, setPendingInstructors] = useState([]);
    const [pendingCourses, setPendingCourses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const response = await listPendingInstructors();

                if (response.ok) {
                    setPendingInstructors(response.data);
                } else {
                    throw new Error(`Failed to fetch pending instructors: ${response.status}`);
                }

                setPendingCourses([
                    { id: 1, title: "React Basics", instructor: "John Doe" },
                    { id: 2, title: "Advanced Python", instructor: "Jane Smith" },
                ]);
            } catch (err) {
                setError(err);
            }
        };

        void fetchPending();
    }, []);

    const handleInstructorDecision = async (userId, approve) => {
        try {
            const response = await approveInstructor(userId, { approve });

            if (!response.ok) {
                throw new Error("Approval request failed");
            }

            setPendingInstructors(prev =>
                prev.filter(user => user.id !== userId)
            );

        } catch (err) {
            console.error(err);
            setError(err);
        }
    };

    return (
        <div className="users-container">
            <div className="users-header">
                <h1>Admin Requests Page</h1>
            </div>

            <div className="requests-tables">
                <div className="user-table-wrapper">
                    <h2>Pending Instructors</h2>
                    <div className="user-table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>First name</th>
                                    <th>Last name</th>
                                    <th>Nickname</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {pendingInstructors.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.first_name}</td>
                                        <td>{user.last_name}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>

                                        <td className="requests-actions">
                                            <button
                                                className="table-btn approve"
                                                onClick={() => handleInstructorDecision(user.id, true)}
                                            >
                                                <img
                                                    src={checkIcon}
                                                    alt="Approve"
                                                />
                                            </button>

                                            <button
                                                className="table-btn reject"
                                                onClick={() => handleInstructorDecision(user.id, false)}
                                            >
                                                <img
                                                    src={crossIcon}
                                                    alt="Reject"
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="user-table-wrapper">
                    <h2>Pending Courses</h2>
                    <div className="user-table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Instructor</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {pendingCourses.map(course => (
                                    <tr key={course.id}>
                                        <td>{course.title}</td>
                                        <td>{course.instructor}</td>
                                        <td>
                                            {/* Dummy table */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {error && (
                <p style={{color: "red"}}>
                    Error fetching requests: {error.message || error}
                </p>
            )}
        </div>
    );
};

export default AdminRequests;
