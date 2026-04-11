import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import './Splash.css';
import analyzerImg from '../Splash/analyzer_home.png';
import coursesImg from '../Splash/courses_home.png';
import economyImg from '../Splash/economy_home.png';
import dataAi3d from '../Splash/data_ai_3d.png';
import collaboration3d from '../Splash/collaboration_3d.png';
import Footer from '../Common/Footer';
import FeedbackList from '../Feedback/FeedbackList';

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


            {/* 3D IMAGE MOVING SECTION */}
            <section className="three-d-section_splash">
                <div className="three-d-container_splash">
                    <div className="three-d-gallery_splash">
                        <div className="three-d-item_splash">
                            <img src="https://th.bing.com/th?q=Career+Growth+for+Business+Student&w=120&h=120&c=1&rs=1&qlt=70&o=7&cb=1&dpr=1.6&pid=InlineBlock&rm=3&mkt=en-US&cc=US&setlang=en&adlt=moderate&t=1&mw=247" alt="Career Growth" />
                            <div className="three-d-label_splash">Growth</div>
                        </div>
                        <div className="three-d-item_splash">
                            <img src={analyzerImg} alt="Analyzing" />
                            <div className="three-d-label_splash">Job Analyzer</div>
                        </div>
                        <div className="three-d-item_splash">
                            <img src={dataAi3d} alt="Data & AI" />
                            <div className="three-d-label_splash">Intelligence</div>
                        </div>
                        <div className="three-d-item_splash">
                            <img src={collaboration3d} alt="Collaboration" />
                            <div className="three-d-label_splash">Unison</div>
                        </div>
                        <div className="three-d-item_splash">
                            <img src={economyImg} alt="Economy" />
                            <div className="three-d-label_splash">Economy Insights</div>
                        </div>
                    </div>
                </div>
                <div className="three-d-content_splash">
                    <h2>Step into the Future</h2>
                    <p>Join us. Build your skills. Grow yourself. Grow the economy.</p>
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

            {/* FEEDBACK SECTION */}
            <section className="feedback-section_splash" style={{ padding: '120px 20px' }}>
                <div className="feedback-container_fb" style={{ maxWidth: '1300px', margin: '0 auto' }}>
                    <div className="feedback-header_fb">
                        <span className="eyebrow_fb">Voices of Success</span>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: '200', textTransform: 'uppercase', marginBottom: '20px' }}>
                            Success Stories
                        </h2>
                        <div style={{ width: '80px', height: '4px', background: 'var(--primary_fb)', margin: '0 auto 40px' }}></div>
                        <p className="subtitle_fb">Discover how Skill Bridge is transforming careers across the globe.</p>
                    </div>

                    <FeedbackList layout="row" limit={3} />
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Splash;

