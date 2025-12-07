import {Link} from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import "../styles/Navbar.css";
import logoPic from "../assets/ONeon.png";
import guestPic from "../assets/Guest.png";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar">
            <Link className="logo-container" to="/">
                <img className="navbar-logo" src={logoPic} alt="Logo"/>
            </Link>

            <div className="profile-wrapper" ref={menuRef}>
                <img
                    className="navbar-profile" src={guestPic} alt="Guest"
                    onClick={() => setOpen(prev => !prev)}
                />

                {open && (
                    <div className="profile-menu">
                        {localStorage.getItem("access_token") ? (
                            <>
                                <Link className="profile-menu-item"
                                      onClick={() => {
                                        setOpen(false);
                                      }}
                                      to="/profile">
                                    Profile
                                </Link>

                                <Link className="profile-menu-item"
                                    onClick={() => {
                                        localStorage.removeItem("access_token");
                                        setOpen(false);
                                    }}
                                    to="/"
                                >
                                    Logout
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link className="profile-menu-item"
                                      onClick={() => {
                                        setOpen(false);
                                      }}
                                      to="/login">
                                    Login
                                </Link>

                                <Link className="profile-menu-item"
                                      onClick={() => {
                                        setOpen(false);
                                      }}
                                      to="/register">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar;