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
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            // Store both token and user data
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
        <div className="login-container">
            <div className="login-card">
                <h2>Welcome Back</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">Login</button>
                </form>

                <div className="google-auth-separator" style={{ textAlign: "center", margin: "15px 0", fontSize: "14px", color: "#888" }}>
                    <span>or</span>
                </div>

                <button
                    type="button"
                    onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
                    style={{ padding: "10px 20px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "10px", backgroundColor: "#fff", color: "#333", border: "1px solid #ddd", borderRadius: "5px", cursor: "pointer", width: "100%", fontWeight: "bold", marginBottom: "15px" }}
                >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Logo" width="20" height="20" />
                    Continue with Google
                </button>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;