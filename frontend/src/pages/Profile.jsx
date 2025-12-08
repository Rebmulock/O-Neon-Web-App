import { useEffect, useState } from "react";
import { getProfile } from "../components/ApiRequest.jsx";
import "../styles/Profile.css";

const Profile = () => {
    const [user, setUser] = useState(null);

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

                <button className="edit-btn">Edit</button>
            </div>

            <div className="profile-box middle-box">
                <h2>Projects</h2>
                <p className="placeholder-text">No projects yet.</p>
            </div>

            <div className="profile-box right-box">
                <h2>Statistics</h2>
                <p className="placeholder-text">Empty for now.</p>
            </div>

        </div>
    );
};

export default Profile;
