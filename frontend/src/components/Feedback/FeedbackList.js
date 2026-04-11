import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../apiConfig';
import './Feedback.css';

const FeedbackList = ({ layout, limit }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApprovedFeedbacks = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/feedback/public`);
                if (response.data.status === "00") {
                    let data = response.data.data;
                    if (limit) data = data.slice(0, limit);
                    setFeedbacks(data);
                }
            } catch (err) {
                console.error("Error fetching feedbacks:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchApprovedFeedbacks();
    }, [limit]);

    if (loading) return <div className="no-data_fb">Loading feedbacks...</div>;
    if (feedbacks.length === 0) return <div className="no-data_fb">Be the first to leave a feedback!</div>;

    const gridClass = layout === 'row' ? 'feedback-row_fb' : 'feedback-grid_fb';

    return (
        <div className={gridClass}>
            {feedbacks.map((fb) => (
                <div key={fb._id} className="feedback-card_fb">
                    <div className="card-header_fb">
                        <div>
                            <span className="user-name_fb">{fb.userName}</span>
                            <span className="user-email_fb">{fb.userEmail.replace(/(.{3})(.*)(@.*)/, "$1***$3")}</span>
                        </div>
                        <div className="rating-stars_fb">
                            {'★'.repeat(fb.rating)}
                        </div>
                    </div>
                    <p className="feedback-note_fb">"{fb.note}"</p>
                    <div className="card-footer_fb">
                        <span>{new Date(fb.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--primary_fb)' }}>
                            <span className="material-icons-round" style={{ fontSize: '18px' }}>verified</span>
                            <span style={{ fontSize: '0.7rem' }}>Verified Review</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeedbackList;
