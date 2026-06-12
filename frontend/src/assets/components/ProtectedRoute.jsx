// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
export function ProtectedRoute({ children, allowedRoles }) {
    const { user, role, loading } = useAuth();
    
    if(loading) return null;
    // not logged in → go to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // logged in but wrong role → go to dashboard
    if (allowedRoles && !allowedRoles.includes(role)) {
        alert("You can not access this page!")
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}   
