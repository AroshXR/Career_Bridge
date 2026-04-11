import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component
 * @param {children} React components to be rendered if authenticated
 * @param {adminOnly} Boolean flag to restrict route to admin users only
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem('token');
    const urlToken = new URLSearchParams(window.location.search).get('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    // Check if token exists in localStorage or in the URL (for social login redirects)
    if (!token && !urlToken) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    // Check if admin restriction is required
    if (adminOnly && user && user.role !== 'admin') {
        // Redirect regular users from admin pages back to user home/profile
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default ProtectedRoute;
