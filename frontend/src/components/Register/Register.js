import React from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Create Account</h2>
                <form>
                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" placeholder="John" />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" placeholder="Doe" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="example@mail.com" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="Create a password" />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" placeholder="Repeat your password" />
                    </div>
                    <button type="submit" className="register-btn">Register Now</button>
                </form>
                <div className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
