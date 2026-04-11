import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../apiConfig';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import Loading from '../Common/Loading';
import './Feedback.css';

const AdminFeedbackView = () => {
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved
    const token = localStorage.getItem('token');

    const fetchFeedbacks = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`${API_BASE_URL}/api/v1/feedback`, config);
            if (response.data.status === "00") {
                setFeedbacks(response.data.data);
            }
        } catch (err) {
            console.error("Error fetching admin feedbacks:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleApprove = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.patch(`${API_BASE_URL}/api/v1/feedback/${id}/approve`, {}, config);
            if (response.data.status === "00") {
                fetchFeedbacks();
            }
        } catch (err) { console.error(err); }
    };

    const handleReject = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.patch(`${API_BASE_URL}/api/v1/feedback/${id}/reject`, {}, config);
            if (response.data.status === "00") {
                fetchFeedbacks();
            }
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this feedback permanently?")) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.delete(`${API_BASE_URL}/api/v1/feedback/${id}`, config);
            if (response.data.status === "00") {
                fetchFeedbacks();
            }
        } catch (err) { console.error(err); }
    };

    const filteredFeedbacks = feedbacks.filter(fb => {
        if (filter === 'all') return true;
        return fb.status === filter;
    });

    return (
        <div className="admin-page-wrapper">
            <Navbar />
            <div className="admin-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <div className="feedback-header_fb" style={{ textAlign: 'left', margin: 0 }}>
                        <span className="eyebrow_fb">Moderation Panel</span>
                        <h2>User Feedback</h2>
                        <p className="subtitle_fb" style={{ margin: 0 }}>Review and manage community submissions.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/admin-dashboard')}
                        className="refresh-btn"
                        style={{ background: 'var(--text-dark_fb)', color: '#fff' }}
                    >
                        <span className="material-icons-round">dashboard</span> Admin Dashboard
                    </button>
                </div>

                <div className="filter-container_fb">
                    {['all', 'pending', 'approved'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`filter-btn_fb ${filter === type ? 'active' : ''}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <Loading message="Fetching Moderation Queue..." />
                ) : filteredFeedbacks.length === 0 ? (
                    <div className="no-data_fb">No {filter !== 'all' ? filter : ''} feedbacks in the queue.</div>
                ) : (
                    <div className="feedback-grid_fb">
                        {filteredFeedbacks.map((fb) => (
                            <div key={fb._id} className="feedback-card_fb">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                                    <span className={`status-badge_fb status-${fb.status}_fb`}>{fb.status}</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ccc', letterSpacing: '1px' }}>ID: {fb.feedback_id}</span>
                                </div>
                                <div className="card-header_fb">
                                    <div>
                                        <span className="user-name_fb">{fb.userName}</span>
                                        <span className="user-email_fb" style={{ textTransform: 'lowercase' }}>{fb.userEmail}</span>
                                    </div>
                                    <div className="rating-stars_fb">
                                        {'★'.repeat(fb.rating)}
                                    </div>
                                </div>
                                <p className="feedback-note_fb" style={{ minHeight: '80px' }}>"{fb.note}"</p>
                                
                                <div className="admin-controls_fb">
                                    {fb.status === 'pending' && (
                                        <button className="admin-btn_fb approve-btn_fb" onClick={() => handleApprove(fb._id)}>
                                            <span className="material-icons-round" style={{ fontSize: '18px' }}>check_circle</span> Approve
                                        </button>
                                    )}
                                    <button className="admin-btn_fb reject-btn_fb" onClick={() => handleReject(fb._id)}>
                                        <span className="material-icons-round" style={{ fontSize: '18px' }}>delete_sweep</span> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default AdminFeedbackView;
