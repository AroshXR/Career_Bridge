import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Home.css';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        const userData = queryParams.get('user');

        if (token) {
            localStorage.setItem('token', token);
            
            // If user data is also sent (from Google Login), store it
            if (userData) {
                try {
                    localStorage.setItem('user', decodeURIComponent(userData));
                } catch (e) {
                    console.error("Failed to parse user data from URL", e);
                }
            }

            navigate('/home', { replace: true });
        }
    }, [location, navigate]);

    // Try to get user name from localStorage
    let userName = 'Professional';
    try {
        const userString = localStorage.getItem('user');
        if (userString && userString !== 'undefined') {
            const user = JSON.parse(userString);
            userName = user?.firstName || user?.name || 'Professional';
        }
    } catch (e) { /* silent */ }

    const menuItems = [
        {
            id: 'job-analyzer',
            title: 'Trending Job Analyzer',
            description: 'Get real-time insights into job market trends and skill demands to stay ahead of the curve.',
            icon: 'trending_up',
            path: '/job-analyzer'
        },
        {
            id: 'skill-courses',
            title: 'Skill Courses',
            description: 'Enhance your expertise with curated learning resources tailored to your career goals.',
            icon: 'school',
            path: '/learning-resources'
        },
        {
            id: 'job-search',
            title: 'Smart Job Search',
            description: 'Discover opportunities that perfectly align with your skill set and aspirations.',
            icon: 'work_search',
            path: '/jobs'
        },
        {
            id: 'saved-jobs',
            title: 'Saved Jobs',
            description: 'Quickly access and manage the job opportunities you have bookmarked for later.',
            icon: 'bookmark',
            path: '/saved-jobs'
        },
        {
            id: 'profile',
            title: 'My Profile',
            description: 'Manage your skills, experience, certifications, and career preferences in one place.',
            icon: 'manage_accounts',
            path: '/profile'
        },
        {
            id: 'economy',
            title: 'Country Economy',
            description: 'Analyze global economic indicators and understand how they shape the job market.',
            icon: 'public',
            path: '/economy'
        }
    ];

    const stats = [
        { value: '12K+', label: 'Active Learners', icon: 'groups' },
        { value: '500+', label: 'Skill Courses', icon: 'menu_book' },
        { value: '3.2K', label: 'Job Listings', icon: 'work' },
        { value: '98%', label: 'Career Growth Rate', icon: 'trending_up' },
    ];

    const tips = [
        {
            icon: 'lightbulb',
            title: 'Build In-Demand Skills',
            desc: 'Focus on skills like AI, cloud, and data analysis — the fastest-growing areas in today\'s market.'
        },
        {
            icon: 'bar_chart',
            title: 'Track Market Trends',
            desc: 'Use the Job Analyzer regularly to spot emerging roles before they become highly competitive.'
        },
        {
            icon: 'rocket_launch',
            title: 'Act on Opportunities',
            desc: 'Save jobs you\'re interested in and apply early — top roles fill up within the first 48 hours.'
        }
    ];

    return (
        <div className="home-wrapper_home">
            <Navbar />

            {/* ── HERO BANNER ── */}
            <section className="home-hero_home">
                <div className="hero-text_home">
                    <span className="hero-eyebrow_home">Your Career Dashboard</span>
                    <h1>
                        Welcome Back,<br />
                        <span>{userName}</span>
                    </h1>
                    <p>
                        Everything you need to grow your career — job insights, curated courses,
                        and global economy data — all in one place.
                    </p>
                </div>

                {/* Floating Stat Chips */}
                <div className="hero-chips_home">
                    {stats.slice(0, 3).map((stat, i) => (
                        <div className="chip_home" key={i}>
                            <div className="chip-icon_home">
                                <span className="material-icons-round">{stat.icon}</span>
                            </div>
                            <div className="chip-info_home">
                                <span className="chip-value_home">{stat.value}</span>
                                <span className="chip-label_home">{stat.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FEATURE CARDS SECTION ── */}
            <div className="section-header_home">
                <div>
                    <span className="section-label_home">Explore Features</span>
                    <h2>What Would You<br />Like to Do Today?</h2>
                    <div className="section-divider_home"></div>
                </div>
            </div>

            <div className="cards-grid_home">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        id={`home-card-${item.id}`}
                        className="menu-card_home"
                        onClick={() => navigate(item.path)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && navigate(item.path)}
                    >
                        <div className="card-icon-wrap_home">
                            <span className="material-icons-round">{item.icon}</span>
                        </div>
                        <h3 className="card-title_home">{item.title}</h3>
                        <p className="card-desc_home">{item.description}</p>
                        <div className="card-footer_home">
                            <span className="card-cta_home">Explore Now</span>
                            <span className="material-icons-round card-arrow_home">arrow_forward</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── STATS BANNER ── */}
            <section className="stats-banner_home">
                {stats.map((stat, i) => (
                    <div className="stat-block_home" key={i}>
                        <div className="stat-number_home">{stat.value}</div>
                        <div className="stat-label_home">{stat.label}</div>
                    </div>
                ))}
            </section>

            {/* ── QUICK TIPS ── */}
            <section className="tips-section_home">
                <div>
                    <span className="section-label_home">Pro Tips</span>
                    <h2 style={{ fontSize: '2rem', fontWeight: '200', textTransform: 'uppercase', letterSpacing: '0.03em', margin: '0' }}>
                        Make the Most of<br />Career Bridge
                    </h2>
                    <div className="section-divider_home"></div>
                </div>
                <div className="tips-grid_home">
                    {tips.map((tip, i) => (
                        <div className="tip-card_home" key={i}>
                            <span className="material-icons-round tip-icon_home">{tip.icon}</span>
                            <div className="tip-content_home">
                                <h4>{tip.title}</h4>
                                <p>{tip.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Home;
