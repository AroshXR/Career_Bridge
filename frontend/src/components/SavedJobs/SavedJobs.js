import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SavedJobs.css';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import API_BASE_URL from '../../apiConfig';

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showUpdateSuccess, setShowUpdateSuccess] = useState(null);
    const navigate = useNavigate();

    // No hardcoded username - fetched via token on backend

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const fetchSavedJobs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/api/v1/trendingJobAnalyzer/getSavedJobs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.status === "00") {
                setSavedJobs(response.data.data.jobs || []);
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching saved jobs:", err);
            setError("Failed to load saved jobs. Please ensure the backend server is running.");
            setLoading(false);
        }
    };

    const handleDeleteJob = async (id) => {
        if (!window.confirm("Are you sure you want to remove this job?")) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${API_BASE_URL}/api/v1/trendingJobAnalyzer/deleteSavedJob/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.status === "00") {
                setSavedJobs(savedJobs.filter(job => job._id !== id));
            }
        } catch (err) {
            console.error("Error deleting job:", err);
            alert("Failed to delete job.");
        }
    };

    const handleUpdateJob = async (id, updates) => {
        try {
            // Backend now uses PUT for update as requested by user
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_BASE_URL}/api/v1/trendingJobAnalyzer/updateSavedJob/${id}`, updates, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.status === "00") {
                setSavedJobs(savedJobs.map(job => job._id === id ? { ...job, ...updates } : job));
                setShowUpdateSuccess(id);
                setTimeout(() => setShowUpdateSuccess(null), 2000);
            }
        } catch (err) {
            console.error("Error updating job:", err);
            alert("Failed to update job.");
        }
    };

    const handleAnalyzeSkills = (job) => {
        // Navigate to skill analyzer with the jobId and title
        // The jobId in our saved jobs already has the 'trend_' prefix if it came from Trending Analyzer
        navigate('/skill-analyzer', { state: { autoAnalyzeJobId: job.jobId, jobTitle: job.title } });
    };

    if (loading) {
        return (
            <div className="loading-area_savedJobs">
                <div className="loader-ring_savedJobs"></div>
                <p className="loading-msg_savedJobs">Curating your saved opportunities...</p>
            </div>
        );
    }

    return (
        <>
            <Navbar />
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
                                    <div className="job-info">
                                        <h3 className="job-title">{job.title}</h3>
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

                                <div className="job-meta-row">
                                    <div className="notes-section">
                                        <label>Career Notes</label>
                                        <textarea
                                            className="notes-textarea"
                                            placeholder="Add notes about your interest, interview dates, etc..."
                                            defaultValue={job.notes || ''}
                                            id={`notes-${job._id}`}
                                        ></textarea>
                                        <div className="update-btn-container">
                                            <button
                                                className="update-notes-btn"
                                                onClick={() => {
                                                    const newNote = document.getElementById(`notes-${job._id}`).value;
                                                    handleUpdateJob(job._id, { notes: newNote });
                                                }}
                                            >
                                                Update Notes
                                            </button>
                                            {showUpdateSuccess === job._id && (
                                                <span className="update-indicator">✓ Saved!</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="card-actions">
                                    <button
                                        className="analyze-btn"
                                        onClick={() => handleAnalyzeSkills(job)}
                                    >
                                        <span className="material-icons-round">manage_search</span>
                                        Analyse Skills
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteJob(job._id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SavedJobs;
