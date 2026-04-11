import React from 'react';
import { NavLink } from 'react-router-dom';
import './Footer.css';

/* ─── Inline SVG brand icons (not in Material Icons) ─────────────────────── */
const LinkedInIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const TwitterXIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const GitHubIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
);

const YouTubeIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

const CourseraIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
        <path d="M11.76 0C5.272 0 0 5.272 0 11.76s5.272 11.76 11.76 11.76 11.76-5.272 11.76-11.76S18.248 0 11.76 0zm0 21.36c-5.29 0-9.6-4.31-9.6-9.6s4.31-9.6 9.6-9.6 9.6 4.31 9.6 9.6-4.31 9.6-9.6 9.6zm4.32-9.6c0 2.387-1.933 4.32-4.32 4.32S7.44 14.147 7.44 11.76 9.373 7.44 11.76 7.44s4.32 1.933 4.32 4.32z" />
    </svg>
);

/* ─── Footer Component ────────────────────────────────────────────────────── */
const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">

                {/* ── Brand ── */}
                <div className="footer-section brand">
                    <div className="footer-brand-wrap">
                        <NavLink to="/" className="footer-logo-link">
                            <span className="footer-logo-accent">Career</span> Bridge
                        </NavLink>
                    </div>
                    <p>Elevating career paths through intelligent market analysis and skill bridges.</p>

                    {/* Social + Career Platform icons */}
                    <div className="footer-social">
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                            className="social-icon-btn social-linkedin" aria-label="LinkedIn">
                            <LinkedInIcon />
                            LinkedIn
                        </a>
                        <a href="https://x.com" target="_blank" rel="noopener noreferrer"
                            className="social-icon-btn social-twitter" aria-label="X / Twitter">
                            <TwitterXIcon />
                            X / Twitter
                        </a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                            className="social-icon-btn social-github" aria-label="GitHub">
                            <GitHubIcon />
                            GitHub
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                            className="social-icon-btn social-youtube" aria-label="YouTube">
                            <YouTubeIcon />
                            YouTube
                        </a>
                        <a href="https://coursera.org" target="_blank" rel="noopener noreferrer"
                            className="social-icon-btn social-coursera" aria-label="Coursera">
                            <CourseraIcon />
                            Coursera
                        </a>
                        <a href="https://roadmap.sh" target="_blank" rel="noopener noreferrer"
                            className="social-icon-btn" aria-label="Roadmap.sh">
                            <span className="material-icons-round" style={{ fontSize: '16px' }}>map</span>
                            Roadmap.sh
                        </a>
                    </div>
                </div>

                {/* ── Platform links ── */}
                <div className="footer-section links">
                    <h4>
                        <span className="material-icons-round footer-h-icon">apps</span>
                        Platform
                    </h4>
                    <ul>
                        <li>
                            <NavLink to="/home">
                                <span className="material-icons-round">dashboard</span>
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/job-analyzer">
                                <span className="material-icons-round">trending_up</span>
                                Trend Analyzer
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/learning-resources">
                                <span className="material-icons-round">school</span>
                                Skill Courses
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/learning-roadmap">
                                <span className="material-icons-round">map</span>
                                Learning Roadmap
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/saved-jobs">
                                <span className="material-icons-round">bookmark</span>
                                Saved Jobs
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/economy">
                                <span className="material-icons-round">public</span>
                                Economy Hub
                            </NavLink>
                        </li>
                    </ul>
                </div>

                {/* ── Support links ── */}
                <div className="footer-section links">
                    <h4>
                        <span className="material-icons-round footer-h-icon">support_agent</span>
                        Support
                    </h4>
                    <ul>
                        <li>
                            <a href="/feedback">
                                <span className="material-icons-round">feedback</span>
                                Feedback
                            </a>
                        </li>
                        <li>
                            <NavLink to="/contact">
                                <span className="material-icons-round">mail_outline</span>
                                Contact Support
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/privacy">
                                <span className="material-icons-round">privacy_tip</span>
                                Privacy Policy
                            </NavLink>
                        </li>
                    </ul>
                </div>

            </div>

            <div className="footer-bottom">
                <p>
                    <span className="material-icons-round footer-copy-icon">copyright</span>
                    {currentYear} <span className="footer-bottom-brand">Career Bridge</span>. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
