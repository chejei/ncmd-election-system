import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token) {
        const redirectTo = role === "voter" ? "/voter" : "/login";
        return <Navigate to={redirectTo} replace />;
    }

    if (role && userRole !== role) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        return <Navigate to="/" replace />; // redirect if wrong role
    }

    return children;
};

export default ProtectedRoute;
