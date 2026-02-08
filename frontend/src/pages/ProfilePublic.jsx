import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserProfileById } from "../components/ApiRequest.jsx";
import defaultPic from "../assets/Guest.png";
import "../styles/Profile.css";

const ProfilePublic = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserProfileById(id);
                if (response.ok) {
                    setUser(response.data);
                } else {
                    setError(`Error: ${response.status}`);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        void fetchUser();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

   return (
        <div className="profile-wrapper">
            <div className="profile-image">
                <img
                    src={user.profile_pic || defaultPic}
                    alt={`${user.first_name} ${user.last_name}`}
                />
            </div>

            <div className="profile-box middle-box">
                <h2>{user.first_name} {user.last_name}</h2>
                <p><strong>Username:</strong> <span className="placeholder-text">{user.username}</span></p>
                <p><strong>Email:</strong> <span className="placeholder-text">{user.email}</span></p>
                <p><strong>Role:</strong> <span className="placeholder-text">{user.role}</span></p>
                <p><strong>Joined:</strong> <span className="placeholder-text">{new Date(user.date_joined).toLocaleDateString()}</span></p>
            </div>
        </div>
    );
};

export default ProfilePublic;
