import { listUsers, deleteUser, updateRole } from "../components/ApiRequest.jsx";
import {useEffect, useState} from "react";
import "../styles/AdminUsers.css"
import trashIcon from "../assets/trash-can-solid-full.svg";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [userToDelete, setUserToDelete] = useState(null);
    const ROLES = ["student", "instructor", "admin"];
    const [roleChanges, setRoleChanges] = useState({});
    const hasChanges = Object.keys(roleChanges).length > 0;
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await listUsers();

                if (response.ok) {
                    const sortedUsers = response.data.sort((a, b) => a.id - b.id);
                    setUsers(sortedUsers);
                } else {
                    const messages = response.data
                        ? Object.values(response.data).flat()
                        : [`Failed to fetch users (${response.status})`];

                    setErrorMsg(messages.join(" | "));
                }
            } catch (err) {
                setErrorMsg(err.message || "Failed to fetch users.");
            }
        }

        void fetchUsers();
    }, []);

    const handleRoleChange = (userId, newRole) => {
        setRoleChanges(prev => ({ ...prev, [userId]: newRole }));
    };

    const handleUpdate = async () => {
        setErrorMsg("");

        try {
            const updates = Object.entries(roleChanges).map(([id, role]) => ({
                id,
                role
            }));

            const results = await Promise.all(
                updates.map(u => updateRole(u.id, { role: u.role }))
            );
            const failed = results.find(r => !r.ok);

            if (failed) {
                const messages = failed.data
                    ? Object.values(failed.data).flat()
                    : ["Failed to update roles"];

                setErrorMsg(messages.join(" | "));
                return;
            }


            setUsers(prev => prev.map(u => ({
                ...u,
                role: roleChanges[u.id] || u.role
            })));

            setRoleChanges({});
        } catch (err) {
            setErrorMsg(err.message || "Failed to update roles.");
        }
    };

    const handleDiscard = () => {
        setRoleChanges({});
    };

    return (
        <div className="users-container">
            <div className="users-header">
                <h1>Admin Users Page</h1>

                <div className="header-buttons">
                    <button
                        className="save-btn"
                        onClick={handleUpdate}
                        disabled={!hasChanges}
                        style={{ opacity: hasChanges ? 1 : 0.5 }}
                    >
                        Save
                    </button>

                    <button
                        className="discard-btn"
                        onClick={handleDiscard}
                        disabled={!hasChanges}
                        style={{ opacity: hasChanges ? 1 : 0.5, marginLeft: "8px" }}
                    >
                        Discard changes
                    </button>
                </div>
            </div>

            <div className="user-table-container">
                {users.length > 0 ? (
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>First name</th>
                                <th>Last name</th>
                                <th>Nickname</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.first_name}</td>
                                    <td>{user.last_name}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {user.role === "admin" ? (
                                            user.role
                                        ) : (
                                            <select
                                                className="role-dropdown"
                                                value={roleChanges[user.id] || user.role}
                                                onChange={e => handleRoleChange(user.id, e.target.value)}
                                            >
                                                {ROLES.map(r => (
                                                    <option key={r} value={r}>
                                                        {r}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="delete-btn-red"
                                            onClick={() => setUserToDelete(user)}
                                        >
                                            <img src={trashIcon} alt="Delete" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No users found.</p>
                )}
            </div>

            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

            {userToDelete && (
                <div className="delete-modal-backdrop">
                    <div className="delete-modal">
                        <h2>Delete user</h2>

                        <table className="delete-course-table">
                            <tbody>
                                <tr>
                                    <td>First name</td>
                                    <td>{userToDelete.first_name}</td>
                                </tr>
                                <tr>
                                    <td>Last name</td>
                                    <td>{userToDelete.last_name}</td>
                                </tr>
                                <tr>
                                    <td>Username</td>
                                    <td>{userToDelete.username}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td>{userToDelete.email}</td>
                                </tr>
                                <tr>
                                    <td>Role</td>
                                    <td>{userToDelete.role}</td>
                                </tr>
                            </tbody>
                        </table>

                        <p className="delete-warning">
                            This action <strong>cannot be undone</strong>.
                        </p>

                        <div className="delete-modal-actions">
                            <button
                                className="btn-cancel"
                                onClick={() => setUserToDelete(null)}
                            >
                                Cancel
                            </button>

                            <button
                                className="btn-delete"
                                onClick={async () => {
                                    setErrorMsg("");

                                    try {
                                        const result = await deleteUser(userToDelete.id);

                                        if (!result.ok) {
                                            const messages = result.data
                                                ? Object.values(result.data).flat()
                                                : ["Failed to delete user"];
                                            setErrorMsg(messages.join(" | "));
                                            return;
                                        }

                                        setUsers(prev =>
                                            prev.filter(u => u.id !== userToDelete.id)
                                        );

                                        setUserToDelete(null);
                                    } catch {
                                        setErrorMsg("Failed to delete user.");
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
    )
}

export default AdminUsers;