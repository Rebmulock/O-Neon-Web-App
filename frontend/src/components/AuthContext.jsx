import { createContext, useState, useEffect } from "react";
import { getProfile } from "./ApiRequest.jsx";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [profilePic, setProfilePic] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access"));

    useEffect(() => {
        const fetchProfile = async () => {
            if (!localStorage.getItem("access")) {
                setProfilePic(null);
                return;
            }

            try {
                const res = await getProfile();
                setProfilePic(res.data?.profile_pic || null);
            } catch (err) {
                setProfilePic(null);
            }
        };

        void fetchProfile();
    }, [isLoggedIn]);

    const login = () => setIsLoggedIn(true);
    const logout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
    };

    const updateProfilePic = (url) => {
        setProfilePic(url || null);
        if (url) localStorage.setItem("profile_pic", url);
    };

    return (
        <AuthContext.Provider value={{ profilePic, isLoggedIn, login, logout, updateProfilePic }}>
            {children}
        </AuthContext.Provider>
    );
};
