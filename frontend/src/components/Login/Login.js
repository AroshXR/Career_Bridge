import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));

            if (response.data.data.user.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/home');
            }
        } catch (err) {
            setError(err.response?.data?.error?.errorDescription || err.response?.data?.description || 'Login failed');
        }
    };

    return (
        <div className="page-wrapper_log">

            {/* ── LEFT FORM PANEL ── */}
            <div className="form-panel_log">
                <div className="login-card_log">

                    {/* Back link */}
                    <Link to="/" className="back-link_log">
                        ← Back to Home
                    </Link>

                    {/* Accent bar + heading */}
                    <div className="accent-bar_log"></div>
                    <h1 className="login-heading_log">Welcome<br />Back</h1>
                    <p className="login-subtext_log">
                        Sign in to continue your career journey.
                    </p>

                    {/* Error */}
                    {error && <div className="error-message_log">{error}</div>}

                    {/* Form */}
                    <form className="login-form_log" onSubmit={handleLogin}>

                        {/* Email */}
                        <div className="form-group_log">
                            <label htmlFor="email_log">Email Address</label>
                            <input
                                id="email_log"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                title="Enter a valid email (e.g., example@mail.com)"
                            />
                        </div>

                        {/* Password */}
                        <div className="form-group_log">
                            <label htmlFor="password_log">Password</label>
                            <input
                                id="password_log"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength="8"
                                pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
                                title="Password must be at least 8 characters long, include one uppercase letter and one number"
                            />
                        </div>

                        {/* Forgot Password */}
                        <a href="#forgot" className="forgot-link_log">Forgot password?</a>

                        {/* Submit */}
                        <button type="submit" id="submit-login_log" className="submit-btn_log">
                            Login
                        </button>
                    </form>

                    {/* OR Divider */}
                    <div className="divider_log">
                        <span>or</span>
                    </div>

                    {/* Google Sign-In */}
                    <button
                        id="google-signin_log"
                        type="button"
                        className="google-btn_log"
                        onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
                    >
                        <img
                            className="google-logo_log"
                            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                            alt="Google Logo"
                        />
                        Continue with Google
                    </button>

                    {/* Footer */}
                    <div className="auth-footer_log">
                        Don't have an account?&nbsp;<Link to="/register">Sign Up</Link>
                    </div>
                </div>
            </div>

            {/* ── RIGHT HERO PANEL ── */}
            <div className="hero-panel_log">

                {/* Brand Logo */}
                <div className="panel-logo_log">
                    <Link to="/" className="logo-link_log">
                        <span className="logo-accent_log">Career</span>Bridge
                    </Link>
                </div>

                {/* Hero Text */}
                <div className="panel-content_log">
                    <span className="panel-eyebrow_log">Your Career Awaits</span>
                    <h2>Pick Up<br />Where You<br />Left Off</h2>
                    <p>
                        Access your personalized dashboard, track your progress,
                        and keep building towards your dream career.
                    </p>
                </div>

                {/* Feature List */}
                <div className="panel-features_log">
                    <div className="feature-item_log">
                        <div className="feature-icon_log">📊</div>
                        <span className="feature-text_log">Real-time job market trends</span>
                    </div>
                    <div className="feature-item_log">
                        <div className="feature-icon_log">🎯</div>
                        <span className="feature-text_log">Personalised skill roadmaps</span>
                    </div>
                    <div className="feature-item_log">
                        <div className="feature-icon_log">🌍</div>
                        <span className="feature-text_log">Global economy insights</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;