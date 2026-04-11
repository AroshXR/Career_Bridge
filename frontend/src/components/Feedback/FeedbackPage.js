import React from 'react';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import FeedbackForm from './FeedbackForm';
import FeedbackList from './FeedbackList';
import './Feedback.css';

const FeedbackPage = () => {
    return (
        <div style={{ background: 'var(--bg-white_fb)', minHeight: '100vh', paddingTop: '80px' }}>
            <Navbar />
            
            <div className="feedback-container_fb">
                <div className="feedback-header_fb">
                    <span className="eyebrow_fb">Community Reviews</span>
                    <h2>Share Your Experience</h2>
                    <p className="subtitle_fb">Your insights help us bridge the gap to a better career future for everyone.</p>
                </div>

                <FeedbackForm />

                <div className="feedback-header_fb" style={{ marginTop: '120px' }}>
                    <span className="eyebrow_fb">Testimonials</span>
                    <h2>What Others Are Saying</h2>
                    <div style={{ width: '60px', height: '4px', background: 'var(--primary_fb)', margin: '20px auto' }}></div>
                </div>

                <FeedbackList />
            </div>

            <Footer />
        </div>
    );
};

export default FeedbackPage;
