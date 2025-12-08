import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../components/ApiRequest.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editData, setEditData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        username: ""
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profileData = await getProfile();
                setUser(profileData.data);
                setEditData({
                    first_name: profileData.data.first_name,
                    last_name: profileData.data.last_name,
                    email: profileData.data.email,
                    username: profileData.data.username
                });

            } catch (error) {
                console.error("Failed to load profile:", error);
            }
        };

        void loadProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const updatedUser = await updateProfile(editData);
            setUser(updatedUser.data);
            setModalOpen(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("Failed to save changes.");
        }
    };

    const handleDelete = () => {
        localStorage.removeItem("access");
        setDeleteModalOpen(false);
        navigate("/");

        alert("Account deleted!");
    };

    if (!user) {
        return (
            <div className="profile-loading">
                <h1>Your Profile</h1>
                <p>Loading user data...</p>
            </div>
        );
    }

    return (
        <div className="profile-wrapper">

            <div className="profile-box left-box">
                <h2>Your Info</h2>
                <p><strong>First name:</strong> {user.first_name}</p>
                <p><strong>Last name:</strong> {user.last_name}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>

                <div className="button-group">
                    <button
                        className="edit-btn"
                        onClick={() => setModalOpen(true)}
                    >
                        Edit
                    </button>

                    <button
                        className="delete-btn"
                        onClick={() => setDeleteModalOpen(true)}
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            <div className="profile-box middle-box">
                <h2>Projects</h2>
                <p className="placeholder-text">No projects yet.</p>
            </div>

            <div className="profile-box right-box">
                <h2>Statistics</h2>
                <p className="placeholder-text">Empty for now.</p>
            </div>

            {modalOpen && (
                <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setModalOpen(false)}>×</button>
                        <h2>Edit Profile</h2>
                        <div className="modal-form">
                            <input
                                type="text"
                                name="first_name"
                                placeholder="First name"
                                value={editData.first_name}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Last name"
                                value={editData.last_name}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="username"
                                placeholder="Nickname"
                                value={editData.username}
                                onChange={handleChange}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={editData.email}
                                onChange={handleChange}
                            />
                            <button className="save-btn" onClick={handleSave}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteModalOpen && (
                <div className="modal-overlay" onClick={() => setDeleteModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setDeleteModalOpen(false)}>×</button>
                        <h2>Confirm Delete</h2>
                        <p>Are you sure you want to delete your account?</p>
                        <div className="modal-buttons">
                            <button className="confirm-btn" onClick={handleDelete}>Confirm</button>
                            <button className="cancel-btn" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
