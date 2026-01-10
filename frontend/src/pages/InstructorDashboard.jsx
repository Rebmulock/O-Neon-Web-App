import "../styles/Dashboard.css"
import { NavLink } from "react-router-dom";

import plusCircle from "../assets/circle-plus-solid-full.svg";
import listIcon from "../assets/list-solid-full.svg";
import coinIcon from "../assets/coins-solid-full.svg";

const InstructorDashboard = () => {
    const instructorNav = [
        { to: "create", label: "Create Course", icon: plusCircle },
        { to: "overview", label: "Overview", icon: listIcon },
        { to: "credit", label: "Credit", icon: coinIcon },
    ];

    return (
        <div>
            <aside className="sidebar">
                {
                    instructorNav.map((btn, index) => (
                        <NavLink
                            key={btn.to}
                            to={btn.to}
                            end
                            className="sidebar-button"
                            onClick={(e) => e.preventDefault()}
                        >
                            <img
                                src={btn.icon}
                                alt="plus_circle_button"
                                className="sidebar-icon"
                            />

                            <span>
                                {btn.label}
                            </span>
                        </NavLink>
                    ))
                }
            </aside>
        </div>
    )
}

export default InstructorDashboard;