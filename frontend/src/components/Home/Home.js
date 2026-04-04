import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
            // After saving the token, remove it from the URL by replacing history state
            navigate('/home', { replace: true });
        }
    }, [location, navigate]);

    const menuItems = [
        {
            id: 'job-analyzer',
            title: 'Trending Job Analyzer',
            description: 'Get real-time insights into job market trends and skill demands.',
            icon: '📊',
            path: '/job-analyzer'
        },
        {
            id: 'skill-courses',
            title: 'Skill Courses',
            description: 'Enhance your expertise with curated courses tailored for you.',
            icon: '🎓',
            path: '/learning-resources'
        },
        {
            id: 'job-search',
            title: 'Smart Job Search',
            description: 'Find opportunities that perfectly match your skill set.',
            icon: '🔍',
            path: '/jobs'
        },
        {
            id: 'saved-jobs',
            title: 'Saved Jobs',
            description: 'Quickly access and manage the job opportunities you have saved.',
            icon: '🔖',
            path: '/saved-jobs'
        },
        {
            id: 'profile',
            title: 'My Profile',
            description: 'Manage your skills, experience, and career preferences.',
            icon: '👤',
            path: '/profile'
        },
        {
            id: 'economy',
            title: 'Country Economy',
            description: 'Analyze global economic trends and job market indicators.',
            icon: '🌐',
            path: '/economy'
        },
        {
            id: 'skill-analyzer',
            title: 'Job Skill Analyzer',
            description: 'Get an AI-powered skill roadmap for your saved jobs.',
            icon: '🧠',
            path: '/skill-analyzer'
        }
    ];

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="header-content">
                    <h1>Skill Bridge Dashboard</h1>
                    <p>Unlock your potential and bridge the gap to your dream career.</p>
                </div>
                <div className="user-profile">
                    <span>Welcome, User!</span>
                    <button className="logout-btn" onClick={() => navigate('/')}>Logout</button>
                </div>
            </header>

            <main className="home-main">
                <div className="cards-grid">
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            className="menu-card"
                            onClick={() => navigate(item.path)}
                        >
                            <div className="card-icon">{item.icon}</div>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <div className="card-footer">
                                <span>Explore Now</span>
                                <span className="arrow">→</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Home;
