import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../apiConfig';
import './Feedback.css';

const FeedbackForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        rating: 5,
        note: '',
        name: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const userString = localStorage.getItem('user');
    const user = userString && userString !== 'undefined' ? JSON.parse(userString) : null;
    const token = localStorage.getItem('token');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const payload = {
                rating: formData.rating,
                note: formData.note,
                ...(user ? {} : { name: formData.name, email: formData.email })
            };

            const response = await axios.post(`${API_BASE_URL}/api/v1/feedback`, payload, config);

            if (response.data.status === "00") {
                setMessage({ type: 'success', text: 'Thank you! Your feedback has been submitted for approval.' });
                setFormData({ rating: 5, note: '', name: '', email: '' });
                if (onSuccess) onSuccess();
            } else {
                setMessage({ type: 'error', text: response.data.description || 'Failed to submit feedback' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error?.errorDescription || 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="feedback-form_fb">
            <div className="feedback-header_fb" style={{ marginBottom: '30px' }}>
                <span className="eyebrow_fb">Share Your Thoughts</span>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '200', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dark_fb)' }}>
                    Your Experience Matters
                </h3>
            </div>
            
            {message.text && (
                <div style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    marginBottom: '30px',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    backgroundColor: message.type === 'success' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                    color: message.type === 'success' ? '#27ae60' : '#c0392b',
                    border: `1px solid ${message.type === 'success' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)'}`
                }}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                {!user && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group_fb">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                required
                            />
                        </div>
                        <div className="form-group_fb">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                required
                            />
                        </div>
                    </div>
                )}

                <div className="form-group_fb">
                    <label>How would you rate us?</label>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => setFormData({ ...formData, rating: num })}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: `2px solid ${formData.rating === num ? 'var(--primary_fb)' : 'transparent'}`,
                                    background: formData.rating === num ? 'var(--primary_fb)' : 'var(--bg-gray_fb)',
                                    color: formData.rating === num ? '#fff' : 'var(--text-muted_fb)',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group_fb">
                    <label>Share your experience</label>
                    <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        rows="5"
                        placeholder="Tell us about your journey with Skill Bridge..."
                        required
                    />
                </div>

                <button type="submit" className="submit-btn_fb" disabled={loading}>
                    {loading ? 'Sending...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm;
