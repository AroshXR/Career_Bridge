import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Splash.css';

const Splash = () => {
    const navigate = useNavigate();

    return (
        <div className="splash-container">
            <div className="splash-content">
                <h1>Career Bridge</h1>
                <p>Bridge the gap between your skills and your dream career.</p>
                <button
                    className="get-started-btn"
                    onClick={() => navigate('/login')}
                >
                    Get Started
                </button>
            </div>
            <span className="rule_splash"> <hr /> </span>
            <div className="splash-content-2">
                <h2>Career Bridge</h2>
                <p>Bridge the gap between your skills and your dream career.</p>
            </div>
        </div>
    );
};

export default Splash;
