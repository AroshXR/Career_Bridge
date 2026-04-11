import React from 'react';
import './Loading.css';

const Loading = ({ message = "Loading your experience..." }) => {
    return (
        <div className="loading-overlay_skill">
            <div className="loading-content_skill">
                <div className="spinner_skill">
                    <div className="inner-spinner_skill"></div>
                </div>
                <div className="loading-branding_skill">
                    <span className="logo-accent_skill">Career</span> Bridge
                </div>
                <p className="loading-message_skill">{message}</p>
            </div>
        </div>
    );
};

export default Loading;
