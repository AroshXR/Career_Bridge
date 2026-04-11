import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            });

            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));

            alert('Registration successful! Please login.');
            navigate('/login');

        } catch (err) {
            setError(err.response?.data?.error?.errorDescription || err.response?.data?.description || 'Registration failed');
        }
    };

    return (
        <div className="page-wrapper_reg">

            {/* ── LEFT HERO PANEL ── */}
            <div className="hero-panel_reg">

                {/* Brand Logo */}
                <div className="panel-logo_reg">
                    <Link to="/" className="logo-link_reg">
                        <span className="logo-accent_reg">Career</span>Bridge
                    </Link>
                </div>

                {/* Hero Text */}
                <div className="panel-content_reg">
                    <span className="panel-eyebrow_reg">Future Career Ready</span>
                    <h2>Bridge the<br />Gap to Your<br />Dream Career</h2>
                    <p>
                        Connecting your current skills to the world's most sought-after
                        opportunities with data-driven insights and curated learning.
                    </p>
                </div>

                {/* Stats Strip */}
                <div className="panel-stats_reg">
                    <div className="stat-item_reg">
                        <span className="stat-number_reg">12K+</span>
                        <span className="stat-label_reg">Active Learners</span>
                    </div>
                    <div className="stat-item_reg">
                        <span className="stat-number_reg">500+</span>
                        <span className="stat-label_reg">Skill Courses</span>
                    </div>
                    <div className="stat-item_reg">
                        <span className="stat-number_reg">98%</span>
                        <span className="stat-label_reg">Career Growth</span>
                    </div>
                </div>
            </div>

            {/* ── RIGHT FORM PANEL ── */}
            <div className="form-panel_reg">
                <div className="register-card_reg">

                    {/* Back link */}
                    <Link to="/" className="back-link_reg">
                        ← Back to Home
                    </Link>

                    {/* Accent bar + heading */}
                    <div className="accent-bar_reg"></div>
                    <h1 className="register-heading_reg">Create<br />Account</h1>
                    <p className="register-subtext_reg">
                        Join thousands of professionals growing their careers.
                    </p>

                    {/* Error */}
                    {error && <div className="error-message_reg">{error}</div>}

                    {/* Form */}
                    <form className="register-form_reg" onSubmit={handleSubmit}>

                        {/* Name Row */}
                        <div className="form-row_reg">
                            <div className="form-group_reg">
                                <label htmlFor="firstName_reg">First Name</label>
                                <input
                                    id="firstName_reg"
                                    type="text"
                                    name="firstName"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group_reg">
                                <label htmlFor="lastName_reg">Last Name</label>
                                <input
                                    id="lastName_reg"
                                    type="text"
                                    name="lastName"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="form-group_reg">
                            <label htmlFor="email_reg">Email Address</label>
                            <input
                                id="email_reg"
                                type="email"
                                name="email"
                                placeholder="example@mail.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
                                title="Enter a valid email address (e.g., example@mail.com)"
                            />
                        </div>

                        {/* Password */}
                        <div className="form-group_reg">
                            <label htmlFor="password_reg">Password</label>
                            <input
                                id="password_reg"
                                type="password"
                                name="password"
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                               minLength="8"
                                pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
                                title="Password must be at least 8 characters long, include one uppercase letter and one number"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="form-group_reg">
                            <label htmlFor="confirmPassword_reg">Confirm Password</label>
                            <input
                                id="confirmPassword_reg"
                                type="password"
                                name="confirmPassword"
                                placeholder="Repeat your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength="8"
                            />
                        </div>

                        {/* Submit */}
                        <button type="submit" id="submit-register_reg" className="submit-btn_reg">
                            Register Now
                        </button>
                    </form>

                    {/* OR Divider */}
                    <div className="divider_reg">
                        <span>or</span>
                    </div>

                    {/* Google Sign-In */}
                    <button
                        id="google-signin_reg"
                        type="button"
                        className="google-btn_reg"
                        onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
                    >
                        <img
                            className="google-logo_reg"
                            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                            alt="Google Logo"
                        />
                        Continue with Google
                    </button>

                    {/* Footer */}
                    <div className="auth-footer_reg">
                        Already have an account?&nbsp;<Link to="/login">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;