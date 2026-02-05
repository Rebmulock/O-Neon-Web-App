import "../styles/Dashboard.css"
import {NavLink, Outlet, useLocation} from "react-router-dom";

import usersIcon from "../assets/users-solid-full.svg";
import clipbaordIcon from "../assets/clipboard-check-solid-full.svg";

const AdminDashboard = () => {
    const adminNav = [
        { to: "users", label: "Manage Users", icon: usersIcon, alt: "user_icon" },
        { to: "requests", label: "Manage Requests", icon: clipbaordIcon, alt: "request_icon" },
    ];
    const location = useLocation();
    const showContent = location.pathname !== "/dashboard/instructor";

    return (
        <div className="dashboard-wrapper">
            <aside className="sidebar">
                {
                    adminNav.map((btn) => (
                        <NavLink
                            key={btn.to}
                            to={btn.to}
                            end
                            className="sidebar-button"
                        >
                            <img
                                src={btn.icon}
                                alt={btn.alt}
                                className="sidebar-icon"
                            />

                            <span>
                                {btn.label}
                            </span>
                        </NavLink>
                    ))
                }
            </aside>

            {showContent &&
                <main className="dashboard-content">
                    <Outlet />
                </main>
            }
        </div>
    )
}

export default AdminDashboard;