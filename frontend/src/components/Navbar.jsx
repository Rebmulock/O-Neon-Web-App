import {Link} from "react-router-dom";
import {useState} from "react";

import "../styles/Navbar.css";
import logoPic from "../assets/ONeon.png";
import guestPic from "../assets/Guest.png";

const Navbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <nav className="navbar">
            <Link to="/" className="logo-container">
                <img className="navbar-logo" src={logoPic} alt="Logo"/>
            </Link>

            <div className="profile-wrapper">
                <img
                    className="navbar-profile" src={guestPic} alt="Guest"
                    onClick={() => setOpen(prev => !prev)}
                />

                {open && (
                    <div className="profile-menu">
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar;