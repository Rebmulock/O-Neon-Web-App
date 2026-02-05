import "../styles/Dashboard.css"
import { NavLink, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

import plusCircle from "../assets/circle-plus-solid-full.svg";
import listIcon from "../assets/list-solid-full.svg";
import coinIcon from "../assets/coins-solid-full.svg";

const InstructorDashboard = () => {
    const instructorNav = [
        { to: "create", label: "Create Course", icon: plusCircle, alt: "plus_circle_button" },
        { to: "overview", label: "Overview", icon: listIcon, alt: "list_button" },
        { to: "credit", label: "Credit", icon: coinIcon, alt: "credit" },
    ];
    const location = useLocation();
    const showContent = location.pathname !== "/dashboard/instructor";

    return (
        <div className="dashboard-wrapper">
            <aside className="sidebar">
                {
                    instructorNav.map((btn) => (
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

export default InstructorDashboard;