import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Splash.css';

const Splash = () => {
    const navigate = useNavigate();

    return (
        <div className="splash-container">
            <div className="splash-content">
                <h1>Skill Bridge</h1>
                <p>Bridge the gap between your skills and your dream career.</p>
                <button
                    className="get-started-btn"
                    onClick={() => navigate('/login')}
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default Splash;
