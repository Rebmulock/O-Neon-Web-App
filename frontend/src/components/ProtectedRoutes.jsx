import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("access");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export const InstructorRoute = ({ children }) => {
    const token = localStorage.getItem("access");
    const userRole = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (userRole !== "instructor") {
        return <Navigate to="/" replace />;
    }

    return children;
}

export const AdminRoute = ({ children }) => {
    const token = localStorage.getItem("access");
    const userRole = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (userRole !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}