import { listUsers, deleteUser, updateRole } from "../components/ApiRequest.jsx";
import {useEffect, useState} from "react";
import "../styles/AdminUsers.css"
import trashIcon from "../assets/trash-can-solid-full.svg";

const AdminUsers = () => {
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [userToDelete, setUserToDelete] = useState(null);
    const ROLES = ["student", "instructor", "admin"];
    const [roleChanges, setRoleChanges] = useState({});
    const hasChanges = Object.keys(roleChanges).length > 0;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await listUsers();

                if (response.ok) {
                    const sortedUsers = response.data.sort((a, b) => a.id - b.id);
                    setUsers(sortedUsers);
                } else {
                    throw new Error(`Failed to fetch users: ${response.status}`);
                }
            } catch (err) {
                setError(err);
            }
        }

        void fetchUsers();
    }, []);

    const handleRoleChange = (userId, newRole) => {
        setRoleChanges(prev => ({ ...prev, [userId]: newRole }));
    };

    const handleUpdate = async () => {
        try {
            const updates = Object.entries(roleChanges).map(([id, role]) => ({
                id,
                role
            }));

            await Promise.all(updates.map(u => updateRole(u.id, { role: u.role })));

            setUsers(prev => prev.map(u => ({
                ...u,
                role: roleChanges[u.id] || u.role
            })));

            setRoleChanges({});
        } catch (err) {
            console.error(err);
            alert("Failed to update roles");
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
                                    try {
                                        await deleteUser(userToDelete.id);

                                        setUsers(prev =>
                                            prev.filter(u => u.id !== userToDelete.id)
                                        );

                                        setUserToDelete(null);
                                    } catch (err) {
                                        console.error(err);
                                        alert("Failed to delete user");
                                    }
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {error &&
                <p style={{color: "red"}}>
                    Error fetching users: {error.message || error}
                </p>
            }
        </div>
    )
}

export default AdminUsers;