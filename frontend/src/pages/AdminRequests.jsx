import { useEffect, useState } from "react";
import "../styles/AdminRequests.css";
import { listPendingInstructors, approveInstructor, listPendingCourses, approveCourse } from "../components/ApiRequest.jsx";
import checkIcon from "../assets/check-solid-full.svg";
import crossIcon from "../assets/xmark-solid-full.svg";

const AdminRequests = () => {
    const [pendingInstructors, setPendingInstructors] = useState([]);
    const [pendingCourses, setPendingCourses] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const fetchPending = async () => {
            setErrorMsg("");

            try {
                let response = await listPendingInstructors();

                if (response.ok) {
                    setPendingInstructors(response.data);
                } else {
                    const messages = response.data
                        ? Object.values(response.data).flat()
                        : ["Failed to fetch pending instructors"];
                    setErrorMsg(messages.join(" | "));

                    return;
                }

                response = await listPendingCourses();

                if (response.ok) {
                    setPendingCourses(response.data);
                } else {
                    const messages = response.data
                        ? Object.values(response.data).flat()
                        : ["Failed to fetch pending courses"];
                    setErrorMsg(messages.join(" | "));
                }

            } catch (err) {
               setErrorMsg(err.message || "Failed to load requests");
            }
        };

        void fetchPending();
    }, []);

    const handleInstructorDecision = async (userId, approve) => {
        setErrorMsg("");

        try {
            const response = await approveInstructor(userId, { approve });

            if (!response.ok) {
                const messages = response.data
                    ? Object.values(response.data).flat()
                    : ["Approval request failed"];
                setErrorMsg(messages.join(" | "));

                return;
            }

            setPendingInstructors(prev =>
                prev.filter(user => user.id !== userId)
            );

        } catch (err) {
            setErrorMsg(err.message || "Approval request failed.");
        }
    };

    const handleCourseDecision = async (courseId, approve) => {
        setErrorMsg("");

        try {
            const response = await approveCourse(courseId, { approve });

            if (!response.ok) {
                const messages = response.data
                    ? Object.values(response.data).flat()
                    : ["Approval request failed"];
                setErrorMsg(messages.join(" | "));

                return;
            }

            setPendingCourses(prev =>
                prev.filter(course => course.id !== courseId)
            );

        } catch (err) {
            setErrorMsg(err.message || "Approval request failed.");
        }
    }

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
                                        <td className="requests-actions">
                                            <button
                                                className="table-btn approve"
                                                onClick={() => handleCourseDecision(course.id, true)}
                                            >
                                                <img
                                                    src={checkIcon}
                                                    alt="Approve"
                                                />
                                            </button>

                                            <button
                                                className="table-btn reject"
                                                onClick={() => handleCourseDecision(course.id, false)}
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

            </div>

            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        </div>
    );
};

export default AdminRequests;
