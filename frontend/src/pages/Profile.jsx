import { useEffect, useState } from "react";
import { getProfile, updateProfile, deleteAccount } from "../components/ApiRequest.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import defaultProfilePic from "../assets/Guest.png";
import pencilIcon from "../assets/pencil-solid-full.svg";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [preview, setPreview] = useState(null);
    const [originalValue, setOriginalValue] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profileData = await getProfile();
                setUser(profileData.data);

            } catch (error) {
                console.error("Failed to load profile:", error);
            }
        };

        void loadProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();

            Object.entries(user).forEach(([key, value]) => {
                formData.append(key, value);
            });

            if (profileImg) {
                formData.append("profile_pic", profileImg);
            }

            const updatedUser = await updateProfile(formData);
            setUser(updatedUser.data);

            setEditingField(null);
            setProfileImg(null);
            setPreview(null);

        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    const handleDelete = async () => {
        try {
            const result = await deleteAccount();

            if (result.ok) {
                localStorage.removeItem("access");
                setDeleteModalOpen(false);
                navigate("/");
                console.log("Account deleted!");
            } else {
                console.log(`Failed to delete account. Status: ${result.status}`);
            }

        } catch (error) {
            console.error(error);
        }
    };

    const renderField = (label, field) => (
        <p>
            <strong>{label}:</strong>{" "}
            {editingField === field ? (
                <input
                    type="text"
                    name={field}
                    value={user[field]}
                    autoFocus
                    onChange={handleChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            setEditingField(null);
                        }

                        if (e.key === "Escape") {
                            setUser(prev => ({
                                ...prev,
                                [field]: originalValue
                            }));
                            setEditingField(null);
                        }
                    }}
                    onBlur={() => setEditingField(null)}
                />
            ) : (
                <>
                    <span
                        onClick={() => {
                            setOriginalValue(user[field]);
                            setEditingField(field);
                        }}
                    >
                        {user[field]}
                    </span>
                    <img
                        src={pencilIcon}
                        alt="Edit"
                        className="inline-edit-icon"
                        onClick={() => {
                            setOriginalValue(user[field]);
                            setEditingField(field);
                        }}
                    />
                </>
            )}
        </p>
    );


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
            <div className="profile-image">
                <img src={preview || user.profile_pic || defaultProfilePic} alt="Profile picture"/>

                <label className="edit-avatar">
                    <img src={pencilIcon} alt="Edit avatar"/>
                    <input
                        name="profile_pic"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                                        const imageFile = e.target.files[0];
                                        if (imageFile) {
                                            setProfileImg(imageFile);
                                            setPreview(URL.createObjectURL(imageFile));
                                        }
                                    }}
                    />
                </label>
            </div>

            <div className="profile-box left-box">
                <h2>Your Info</h2>

                {renderField("First name", "first_name")}
                {renderField("Last name", "last_name")}
                {renderField("Username", "username")}
                {renderField("Email", "email")}

                <div className="button-group">
                    <button className="save-btn" onClick={handleSave}>
                        Save
                    </button>

                    <button
                        className="delete-btn"
                        onClick={() => setDeleteModalOpen(true)}
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            {user.role === "student" && (
                <>
                    <div className="profile-box middle-box">
                        <h2>Projects</h2>
                        <p className="placeholder-text">No projects yet.</p>
                    </div>

                    <div className="profile-box right-box">
                        <h2>Statistics</h2>
                        <p className="placeholder-text">Empty for now.</p>
                    </div>
                </>
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
