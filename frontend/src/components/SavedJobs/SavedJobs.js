import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SavedJobs.css';

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Dummy username for simulation
    const username = "aroshana_sandeep";

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const fetchSavedJobs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/v1/jobs/saved/${username}`);
            if (response.data.success) {
                setSavedJobs(response.data.savedJobs);
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching saved jobs:", err);
            setError("Failed to load saved jobs. Please ensure the backend server is running.");
            setLoading(false);
        }
    };

    if (loading) return <div className="loader">Loading your saved jobs...</div>;

    return (
        <div className="saved-jobs-container">
            <header className="saved-jobs-header">
                <button className="back-btn" onClick={() => navigate('/home')}>← Back to Dashboard</button>
                <h1>My Saved Jobs</h1>
                <p>You have {savedJobs.length} jobs saved.</p>
            </header>

            {error && <div className="error-message">{error}</div>}

            <div className="job-feed">
                {savedJobs.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔖</div>
                        <h3>No saved jobs yet</h3>
                        <p>Browse the Job Analyzer and save opportunities you're interested in.</p>
                        <button className="browse-btn" onClick={() => navigate('/job-analyzer')}>
                            Browse Trending Jobs
                        </button>
                    </div>
                ) : (
                    savedJobs.map((job) => (
                        <div key={job._id} className="feed-card">
                            <div className="card-header">
                                <div className="company-logo">{job.company.charAt(0)}</div>
                                <div className="job-info">
                                    <h3 className="job-title">{job.title}</h3>
                                    <p className="company-name">{job.company} • {job.location}</p>
                                    <p className="post-date text-muted">Saved on {new Date(job.savedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="card-body">
                                <p className="job-description">
                                    {job.description && job.description.length > 200
                                        ? `${job.description.substring(0, 200)}...`
                                        : job.description}
                                </p>
                            </div>
                            <div className="card-actions">
                                <button
                                    className="apply-btn"
                                    onClick={() => window.open(job.url, '_blank')}
                                >
                                    View on Adzuna
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SavedJobs;
