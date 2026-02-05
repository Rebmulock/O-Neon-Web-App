import { useEffect, useState, useContext } from "react";
import { getProfile, updateProfile, deleteAccount } from "../components/ApiRequest.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import defaultProfilePic from "../assets/Guest.png";
import pencilIcon from "../assets/pencil-solid-full.svg";
import { AuthContext } from "../components/AuthContext.jsx";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [originalUser, setOriginalUser] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [preview, setPreview] = useState(null);
    const { updateProfilePic } = useContext(AuthContext);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profileData = await getProfile();
                setUser(profileData.data);
                setOriginalUser(profileData.data);
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

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSave = async () => {
        const newErrors = {};

        if (!user.first_name?.trim()) {
            newErrors.first_name = "First name is required";
        }

        if (!user.last_name?.trim()) {
            newErrors.last_name = "Last name is required";
        }

        if (!user.username?.trim()) {
            newErrors.username = "Username is required";
        } else if (!/^[a-zA-Z0-9_.-]+$/.test(user.username)) {
            newErrors.username = "Username can contain only letters, numbers, _, . or -";
        }

        if (!user.email?.trim()) {
            newErrors.email = "Email is required";
        } else if (!isValidEmail(user.email)) {
            newErrors.email = "Invalid email format";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {
            const formData = new FormData();

            Object.entries(user).forEach(([key, value]) => {
                if (value !== originalUser[key]) {
                    formData.append(key, value);
                }
            });

            if (profileImg && profileImg !== originalUser["profile_pic"]) {
                formData.append("profile_pic", profileImg);
                console.log(profileImg)
            }

            if ([...formData.entries()].length === 0) {
                setEditingField(null);
                console.log("No changes to save.");
                return;
            }

            const updatedUser = await updateProfile(formData);
            setUser(updatedUser.data);
            setOriginalUser(updatedUser.data);
            updateProfilePic(updatedUser.data.profile_pic);
            setEditingField(null);
            setProfileImg(null);
            setPreview(null);
            setErrors({});
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
        <>
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
                                    [field]: originalUser[field]
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
                                setEditingField(field);
                            }}
                        />
                    </>
                )}
            </p>

            {errors[field] && (
                <div className="field-error">
                    {errors[field]}
                </div>
            )}
        </>
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
