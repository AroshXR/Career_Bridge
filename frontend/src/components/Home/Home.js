import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

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
            path: '/courses'
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
        }
    ];

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="header-content">
                    <h1>Career Bridge Dashboard</h1>
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
