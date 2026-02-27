import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TrendingJobAnalyzer.css';
import { Link } from 'react-router-dom';

const TrendingJobAnalyzer = () => {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [stats, setStats] = useState({ totalMarketSignals: 0, analyzedRoles: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentCategory, setCurrentCategory] = useState("Information Technology");
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : { name: 'Professional' };
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [loadingMessage, setLoadingMessage] = useState("Aggregating global market signals...");
    const rolesPerPage = 10;
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric' });


    const loadingMessages = [
        "Aggregating global market ...",
        "Fetching real-time data...",
        "Analyzing trends...",
        `Parallelizing ${currentDate} insights...`,
        "Refinement in progress: Suggesting top growth roles...",
        "Nearly there! Structuring trending path data..."
    ];

    useEffect(() => {
        let interval;
        if (loading) {
            let index = 0;
            interval = setInterval(() => {
                index = (index + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[index]);
            }, 4500);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const categories = [
        "Information Technology",
        "Artificial Intelligence & Data",
        "Cybersecurity",
        "Engineering",
        "Healthcare & Medical Services",
        "Finance & FinTech",
        "Digital Marketing",
        "Renewable Energy & Sustainability",
        "Logistics & Supply Chain",
        "Education & E-Learning",
        "Creative & Media",
        "Remote & Freelance Services",
        "Human Resources",
        "Hospitality & Tourism",
        "Agriculture & Food Technology",
        "Manufacturing & Industrial Operations",
        "Legal & Compliance",
        "Real Estate & Property Management",
        "Biotechnology & Pharmaceuticals",
        "Telecommunications",
        "Government & Public Administration",
        "Retail & E-Commerce",
        "Social Sciences"
    ];

    useEffect(() => {
        fetchTrendingJobs();
        setCurrentPage(1); // Reset to page 1 on category change
    }, [currentCategory]);

    const fetchTrendingJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:5000/api/v1/trendingJobAnalyzer/getTrendingJobs?category=${encodeURIComponent(currentCategory)}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.status === "00") {
                setRoles(response.data.data.roles || []);
                setStats(response.data.data.stats || { totalMarketSignals: 0, analyzedRoles: 0 });
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching roles:", err);
            setError("Failed to load trending data. Please try again.");
            setLoading(false);
        }
    };

    // Pagination Logic
    const indexOfLastRole = currentPage * rolesPerPage;
    const indexOfFirstRole = indexOfLastRole - rolesPerPage;
    const currentRoles = roles.slice(indexOfFirstRole, indexOfLastRole);
    const totalPages = Math.ceil(roles.length / rolesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCheckSkills = (roleTitle) => {
        // This will navigate or trigger the Skill Analyzer for the specific role
        console.log(`Analyzing skills for: ${roleTitle}`);
        alert(`Starting skill analysis for ${roleTitle}. (Integration with JobSkillAnalyzer)`);
        // Future: window.location.href = `/skills/analyze?role=${encodeURIComponent(roleTitle)}`;
    };

    const handleSaveRole = async (role) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/v1/trendingJobAnalyzer/saveJob', {
                jobId: `trend_${role.title.replace(/\s+/g, '_').toLowerCase()}`,
                title: role.title,
                description: role.description,
                company: "Market Opportunity",
                location: "Global / Remote",
                url: "#"
                // username removed - backend handles it via token
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`${role.title} saved to your career interests!`);
        } catch (err) {
            console.error("Error saving role:", err);
            if (err.response?.data?.message?.includes("already saved")) {
                alert("Role already saved!");
            } else {
                alert("Failed to save role. Please try again.");
            }
        }
    };

    return (
        <div className="analyzer-container">
            <header className="analyzer-header">
                <div className="header-top-left">
                    <Link to="/home" className="back-btn">
                        <span className="back-icon">←</span> Back
                    </Link>
                    <div className="header-info">
                        <h1>Global Trend Analyzer</h1>
                        <p>Professional Path Insights for <strong>{currentCategory}</strong></p>
                    </div>
                </div>
                <div className="header-actions">
                    <button
                        className="refresh-btn"
                        onClick={fetchTrendingJobs}
                        disabled={loading}
                    >
                        <span>↻</span> Refresh Market Data
                    </button>
                    <div className="category-selector">
                        <label htmlFor="category-select">Industry</label>
                        <select
                            id="category-select"
                            value={currentCategory}
                            onChange={(e) => setCurrentCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="loader">
                    <div className="loader-spinner"></div>
                    <p className="loading-text">{loadingMessage}</p>
                </div>
            ) : error ? (
                <div className="error-message">
                    <div className="error-icon">⚠️</div>
                    <p>{error}</p>
                    <button className="retry-btn" onClick={fetchTrendingJobs}>Retry Analysis</button>
                </div>
            ) : (
                <>
                    <div className="stats-strip">
                        <div className="stat-item">
                            <span className="stat-label">Market Signals Analyzed</span>
                            <span className="stat-value">{stats.totalMarketSignals}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Identified Growth Roles</span>
                            <span className="stat-value">{roles.length}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Region</span>
                            <span className="stat-value">Global</span>
                        </div>
                    </div>

                    <div className="section-header">
                        <h2>Identified Growth Paths <span>Professional Insights</span></h2>
                        <p>Roles showing high velocity and demand across the {currentCategory} sector (Page {currentPage} of {totalPages})</p>
                    </div>

                    <div className="role-grid">
                        {currentRoles.map((role, index) => (
                            <div key={index} className="role-card">
                                <div className="role-badge">{role.demand_level} Demand</div>
                                <h3>{role.title}</h3>
                                <p className="role-desc">{role.description}</p>
                                <div className="growth-info">
                                    <strong>Trend:</strong> {role.growth_factor}
                                </div>
                                <div className="skill-tags">
                                    {role.key_skills.map((skill, sIdx) => (
                                        <span key={sIdx} className="skill-tag">{skill}</span>
                                    ))}
                                </div>
                                <div className="role-footer">
                                    <div className="salary-est">Est. Salary: {role.average_salary}</div>
                                    <div className="role-actions">
                                        <button
                                            className="analyze-skills-btn"
                                            onClick={() => handleCheckSkills(role.title)}
                                        >
                                            Analyze Skills
                                        </button>
                                        <button
                                            className="save-role-btn"
                                            onClick={() => handleSaveRole(role)}
                                        >
                                            Save Role
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pag-btn"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>

                            <div className="page-numbers">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        className={`page-num ${currentPage === i + 1 ? 'active' : ''}`}
                                        onClick={() => handlePageChange(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                className="pag-btn"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TrendingJobAnalyzer;
