import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import './Splash.css';
import analyzerImg from './analyzer_home.png';
import coursesImg from './courses_home.png';
import economyImg from './economy_home.png';
import Footer from '../Common/Footer';

const Splash = () => {
    const navigate = useNavigate();

    return (
        <div className="splash-container_splash">
            {/* STICKY HEADER */}
            <header className="splash-header_splash">
                <div className="navbar-logo">
                    <NavLink to="/" className="logo-link">
                        <span className="logo-accent">Career</span> Bridge
                    </NavLink>
                </div>
                <nav className="nav-links_splash">
                    <button className="login-btn_splash" onClick={() => navigate('/login')}>Login</button>
                    <button className="register-btn_splash" onClick={() => navigate('/register')}>Sign Up</button>
                </nav>
            </header>

            {/* HERO SECTION */}
            <section className="hero_splash">
                <div className="hero-content_splash">
                    <span className="hero-eyebrow_splash">Future Career Ready</span>
                    <h1>Bridge the gap to your dream career</h1>
                    <p>Connecting your current skills to the world's most sought-after opportunities with data-driven insights and curated learning.</p>
                    <button className="get-started-btn_splash" onClick={() => navigate('/login')}>
                        Get Started Now
                    </button>
                </div>
            </section>


            {/* FEATURE SECTION 1: JOB ANALYZER (IMAGE LEFT) */}
            <section className="feature-section_splash">
                <div className="feature-image_splash">
                    <img src={analyzerImg} alt="Job Analyzer" />
                </div>
                <div className="feature-content_splash">
                    <span>Market Data</span>
                    <h2>Trending Job Analyzer</h2>
                    <p>
                        Stay ahead of time with real-time insights into the job market.
                        Identify which skills are trending and how the industry is evolving globally.
                    </p>
                    <button className="hero-btn_splash" onClick={() => navigate('/login')}>
                        Analyze Market Trends
                    </button>
                </div>
            </section>

            {/* FEATURE SECTION 2: SKILL COURSES (IMAGE RIGHT - ALT) */}
            <section className="feature-section_splash alt_splash">
                <div className="feature-image_splash">
                    <img src={coursesImg} alt="Skill Courses" />
                </div>
                <div className="feature-content_splash">
                    <span>Expert Training</span>
                    <h2>Curated Skill Courses</h2>
                    <p>
                        Elevate your professional profile with courses specifically tailored
                        to your career goals. We bridge the knowledge gap through expert guidance.
                    </p>
                    <button className="hero-btn_splash" onClick={() => navigate('/login')}>
                        Start Learning Today
                    </button>
                </div>
            </section>

            {/* FEATURE SECTION 3: ECONOMY INSIGHTS (IMAGE LEFT) */}
            <section className="feature-section_splash">
                <div className="feature-image_splash">
                    <img src={economyImg} alt="Country Economy" />
                </div>
                <div className="feature-content_splash">
                    <span>Global Perspective</span>
                    <h2>Country Economy Insights</h2>
                    <p>
                        Understand the bigger picture. We analyze economic indicators and how they
                        directly impact the job market on a local and global scale.
                    </p>
                    <button className="hero-btn_splash" onClick={() => navigate('/login')}>
                        View Economic Trends
                    </button>
                </div>
            </section>

            {/* CALL TO ACTION BANNER */}
            <section className="cta-banner_splash">
                <h2>Transform your future with Skill Bridge</h2>
                <div className="cta-buttons_splash">
                    <button className="cta-btn_splash" onClick={() => navigate('/register')}>Join Now</button>
                    <button className="cta-btn-outline_splash" onClick={() => navigate('/login')}>Login Now</button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Splash;

