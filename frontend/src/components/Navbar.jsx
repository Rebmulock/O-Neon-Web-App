import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import "../styles/Navbar.css";
import logoPic from "../assets/ONeonLogoV2.svg";
import guestPic from "../assets/Guest.png";

const Navbar = () => {
    const [open, setOpen] = useState(false);

    const menuRef = useRef(null);
    const indicatorRef = useRef(null);
    const buttonsRef = useRef([]);

    const location = useLocation();

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

                <NavLink
                    to="/"
                    end
                    className="nav-button"
                    ref={(el) => (buttonsRef.current[0] = el)}
                    onClick={(e) => handleThisPageClick(e, "/")}
                >
                    Home
                </NavLink>

                <NavLink
                    to="/courses"
                    className="nav-button"
                    ref={(el) => (buttonsRef.current[1] = el)}
                    onClick={(e) => handleThisPageClick(e, "/courses")}
                >
                    Courses
                </NavLink>

                <NavLink
                    to="/chats"
                    className="nav-button"
                    ref={(el) => (buttonsRef.current[2] = el)}
                    onClick={(e) => handleThisPageClick(e, "/chats")}
                >
                    Chats
                </NavLink>
            </div>

            <div className="profile-btn-wrapper" ref={menuRef}>
                <img
                    className="navbar-profile-btn"
                    src={guestPic}
                    alt="Guest"
                    onClick={() => setOpen(prev => !prev)}
                />

                {open && (
                    <div className="profile-btn-menu">
                        {localStorage.getItem("access") ? (
                            <>
                                <Link
                                    className="profile-btn-menu-item"
                                    onClick={() => setOpen(false)}
                                    to="/profile"
                                >
                                    Profile
                                </Link>

                                <Link
                                    className="profile-btn-menu-item"
                                    onClick={() => {
                                        localStorage.removeItem("access");
                                        setOpen(false);
                                    }}
                                    to="/"
                                >
                                    Logout
                                </Link>
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
