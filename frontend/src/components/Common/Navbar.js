import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Safety parsing for user data
    const userString = localStorage.getItem('user');
    let user = null;
    try {
        if (userString && userString !== "undefined") {
            user = JSON.parse(userString);
        }
    } catch (e) {
        console.error("Navbar: Error parsing user", e);
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <NavLink to="/" className="logo-link">
                    <span className="logo-accent">Career</span> Bridge
                </NavLink>
            </div>

            <div className="navbar-links">
                <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    Dashboard
                </NavLink>
                <NavLink to="/job-analyzer" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    Job Analyzer
                </NavLink>
                <NavLink to="/learning-resources" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    Courses
                </NavLink>
                <NavLink to="/saved-jobs" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    Saved Jobs
                </NavLink>
            </div>

            <div className="navbar-user">
                {token ? (
                    <div className="user-info">
                        <NavLink to="/profile" className="profile-link">
                            <span className="user-name">Welcome, {user?.name || 'Professional'}</span>
                        </NavLink>
                        <button className="logout-navbar-btn" onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <div className="auth-links">
                        <NavLink to="/login" className="login-nav-btn">Login</NavLink>
                        <NavLink to="/register" className="register-nav-btn">Register</NavLink>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
