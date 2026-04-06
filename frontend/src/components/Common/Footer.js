import React from 'react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section brand">
                    <h3>Career Bridge</h3>
                    <p>Elevating career paths through intelligent market analysis and skill bridges.</p>
                </div>

                <div className="footer-section links">
                    <h4>Platform</h4>
                    <ul>
                        <li><a href="/home">Dashboard</a></li>
                        <li><a href="/job-analyzer">Trend Analyzer</a></li>
                        <li><a href="/courses">Skill Courses</a></li>
                    </ul>
                </div>

                <div className="footer-section links">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="/faq">FAQ</a></li>
                        <li><a href="/contact">Contact Support</a></li>
                        <li><a href="/privacy">Privacy Policy</a></li>
                    </ul>
                </div>

                <div className="footer-section contact">
                    <h4>Stay Connected</h4>
                    <div className="social-placeholder">
                        <span>LinkedIn</span> | <span>Twitter</span> | <span>GitHub</span>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} Career Bridge. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
