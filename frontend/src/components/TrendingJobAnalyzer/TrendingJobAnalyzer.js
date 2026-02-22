import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TrendingJobAnalyzer.css';

const TrendingJobAnalyzer = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [savedJobIds, setSavedJobIds] = useState(new Set());
    const [user, setUser] = useState({ name: 'User', preferredField: 'Software Engineering' });
    const [country, setCountry] = useState('gb');
    const [limit, setLimit] = useState(10);

    // Supported countries for Adzuna
    const countries = [
        { code: 'gb', name: 'United Kingdom' },
        { code: 'us', name: 'United States' },
        { code: 'in', name: 'India' },
        { code: 'ca', name: 'Canada' },
        { code: 'au', name: 'Australia' },
        { code: 'de', name: 'Germany' },
        { code: 'fr', name: 'France' },
        { code: 'nl', name: 'Netherlands' },
        { code: 'at', name: 'Austria' },
        { code: 'br', name: 'Brazil' },
    ];

    // Dummy username for simulation
    const username = "aroshana_sandeep";

    useEffect(() => {
        fetchTrendingJobs();
        fetchSavedJobs();
    }, [country, limit]); // Re-fetch when country or limit changes

    const fetchTrendingJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`http://localhost:5000/api/v1/jobs/trending?country=${country}&limit=${limit}`);
            if (response.data.success) {
                setJobs(response.data.jobs);
                setUser(prev => ({ ...prev, ...response.data.user }));
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching jobs:", err);
            setError(err.response?.data?.message || "Failed to load trending jobs. Please ensure the backend server is running.");
            setLoading(false);
        }
    };

    const fetchSavedJobs = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/jobs/saved/${username}`);
            if (response.data.success) {
                const ids = new Set(response.data.savedJobs.map(job => job.jobId));
                setSavedJobIds(ids);
            }
        } catch (err) {
            console.error("Error fetching saved job IDs:", err);
        }
    };

    const handleSaveJob = async (job) => {
        try {
            const response = await axios.post('http://localhost:5000/api/v1/jobs/save', {
                jobId: job.id.toString(),
                title: job.title,
                company: job.company,
                location: job.location,
                description: job.description,
                url: job.url,
                username: username
            });

            if (response.data.success) {
                setSavedJobIds(prev => new Set([...prev, job.id.toString()]));
                alert("Job saved successfully!");
            }
        } catch (err) {
            console.error("Error saving job:", err);
            alert(err.response?.data?.message || "Failed to save job.");
        }
    };

    return (
        <div className="analyzer-container">
            <header className="analyzer-header">
                <div className="header-info">
                    <h1>Trending Job Analyzer</h1>
                    <p>Curated opportunities for <strong>{user.preferredField}</strong></p>
                </div>
                <div className="header-actions">
                    <div className="country-selector">
                        <label htmlFor="country-select">Target Region</label>
                        <select
                            id="country-select"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        >
                            {countries.map(c => (
                                <option key={c.code} value={c.code}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="limit-selector">
                        <label htmlFor="limit-select">Show Results</label>
                        <select
                            id="limit-select"
                            value={limit}
                            onChange={(e) => setLimit(e.target.value)}
                        >
                            {[5, 10, 20, 50].map(val => (
                                <option key={val} value={val}>{val} Jobs</option>
                            ))}
                        </select>
                    </div>
                    <div className="user-indicator">
                        {user.name}
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="loader">Analyzing {countries.find(c => c.code === country)?.name} job market...</div>
            ) : error ? (
                <div className="error-message">
                    <div className="error-icon">⚠️</div>
                    <p>{error}</p>
                    <button className="retry-btn" onClick={fetchTrendingJobs}>Try Again</button>
                </div>
            ) : (
                <>
                    <div className="stats-strip">
                        <div className="stat-item">
                            <span className="stat-label">Live Opportunities</span>
                            <span className="stat-value">{jobs.length}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Market Trend</span>
                            <span className="stat-value">↑ Steady</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Currency</span>
                            <span className="stat-value">{country === 'us' ? 'USD' : country === 'in' ? 'INR' : 'GBP'}</span>
                        </div>
                    </div>

                    <div className="job-feed">
                        {jobs.map((job) => (
                            <div key={job.id} className="feed-card">
                                <div className="card-header">
                                    <div className="company-logo">
                                        {job.company ? job.company.charAt(0) : 'J'}
                                    </div>
                                    <div className="job-info">
                                        <h3 className="job-title">{job.title}</h3>
                                        <div className="company-name">
                                            <span>{job.company}</span>
                                            <span className="dot">•</span>
                                            <span>{job.location}</span>
                                        </div>
                                        <p className="post-date">Posted {new Date(job.created).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <p className="job-description">
                                        {job.description.length > 280
                                            ? `${job.description.substring(0, 280)}...`
                                            : job.description}
                                    </p>
                                    <div className="job-tags">
                                        <span className="tag">{job.field}</span>
                                        {job.salary_min && (
                                            <span className="tag salary">
                                                {country === 'in' ? '₹' : country === 'us' ? '$' : '£'}
                                                {Math.round(job.salary_min).toLocaleString()} -
                                                {country === 'in' ? '₹' : country === 'us' ? '$' : '£'}
                                                {Math.round(job.salary_max).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="card-actions">
                                    <button
                                        className="apply-btn"
                                        onClick={() => window.open(job.url, '_blank')}
                                    >
                                        Apply Now
                                    </button>
                                    <button
                                        className={`save-btn ${savedJobIds.has(job.id.toString()) ? 'saved' : ''}`}
                                        onClick={() => handleSaveJob(job)}
                                        disabled={savedJobIds.has(job.id.toString())}
                                    >
                                        {savedJobIds.has(job.id.toString()) ? '✓ Saved' : 'Save for Later'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default TrendingJobAnalyzer;
