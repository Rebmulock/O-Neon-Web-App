import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";

import "../styles/Navbar.css";
import logoPic from "../assets/ONeonLogoV2.svg";
import guestPic from "../assets/Guest.png";
import chatPic from "../assets/chat.png";
import homePic from "../assets/home.png";
import compassPic from "../assets/compass.png";
import dashboardPic from "../assets/dashboard.png";
import loginIcon from "../assets/arrow-right-to-bracket-solid-full.svg";
import {useIsMobile} from "../hooks/useIsMobile.jsx";
import { AuthContext } from "./AuthContext.jsx";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const indicatorRef = useRef(null);
    const buttonsRef = useRef([]);
    const isMobile = useIsMobile(768);
    const location = useLocation();
    const { profilePic, isLoggedIn, logout } = useContext(AuthContext);

    const handleThisPageClick = (e, targetPath) => {

        if (location.pathname === targetPath) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        if (!indicatorRef.current) return;

        const activeButton = buttonsRef.current.find(btn =>
            btn?.classList.contains("active")
        );

        if (activeButton) {
            indicatorRef.current.style.transform = `translateX(${activeButton.offsetLeft}px)`;
            indicatorRef.current.style.width = `${activeButton.offsetWidth}px`;
            indicatorRef.current.style.opacity = "1";
        } else {
            indicatorRef.current.style.opacity = "0";
        }

    }, [location.pathname]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar">

            <NavLink className="logo-container" to="/">
                <img
                    className="navbar-logo"
                    onClick={(e) => handleThisPageClick(e, "/")}
                    src={logoPic}
                    alt="Logo"
                />
            </NavLink>

            <div className="nav-buttons">
                <span className="nav-indicator" ref={indicatorRef} />

                {
                    [
                        { to: "/", label: "Home", icon: homePic },
                        { to: "/explore", label: "Explore", icon: compassPic },
                        ...(isLoggedIn ? [{ to: "/chats", label: "Chats", icon: chatPic }] : []),
                        ...(localStorage.getItem("role") === "instructor" ? [{ to: "/dashboard/instructor", label: "Dashboard", icon: dashboardPic }] : []),
                        ...(localStorage.getItem("role") === "admin" ? [{ to: "/dashboard/admin", label: "Dashboard", icon: dashboardPic }] : [])
                    ].map((btn, idx) => (
                        <NavLink
                            key={btn.to}
                            to={btn.to}
                            className="nav-button"
                            ref={(el) => (buttonsRef.current[idx] = el)}
                            onClick={(e) => handleThisPageClick(e, btn.to)}
                        >
                            {isMobile ? <img src={btn.icon} alt={btn.label}/> : btn.label}
                        </NavLink>
                    ))
                }
            </div>

            <div className="profile-btn-wrapper" ref={menuRef}>
                {isLoggedIn ? (
                    <img
                        className="navbar-profile-btn"
                        src={profilePic || guestPic}
                        alt="Guest"
                        onClick={() => setOpen(prev => !prev)}
                    />
                ) : (
                    <img
                        className="navbar-profile-btn"
                        src={loginIcon}
                        alt="Guest"
                        onClick={() => setOpen(prev => !prev)}
                    />
                )}


                {open && (
                    <div className="profile-btn-menu">
                        {isLoggedIn ? (
                            <>
                                <Link
                                    className="profile-btn-menu-item"
                                    onClick={() => setOpen(false)}
                                    to="/profile"
                                >
                                    Profile
                                </Link>

                                <div
                                    className="profile-btn-menu-item"
                                    onClick={() => {
                                        logout();
                                        setOpen(false);
                                        window.location.href = "/";
                                    }}
                                >
                                    Logout
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    className="profile-btn-menu-item"
                                    onClick={() => setOpen(false)}
                                    to="/login"
                                >
                                    Login
                                </Link>

                                <Link
                                    className="profile-btn-menu-item"
                                    onClick={() => setOpen(false)}
                                    to="/register"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
