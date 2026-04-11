import React from 'react';
import { NavLink } from 'react-router-dom';
import './PrivacyPolicy.css';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-page">
            <Navbar />

            <main className="privacy-container">
                <section className="privacy-card">
                    <header className="privacy-header">
                        <span className="material-icons-round">privacy_tip</span>
                        <h1>Privacy Policy</h1>
                        <p>Last Updated: April 11, 2026</p>
                    </header>

                    <div className="privacy-content">
                        <div className="policy-block">
                            <h3>1. Data Collection</h3>
                            <p>We collect basic information like your name, email, and professional preferences to provide personalized career insights and job matching.</p>
                        </div>

                        <div className="policy-block">
                            <h3>2. Data Usage</h3>
                            <p>Your data is used solely to enhance your experience within Career Bridge. We never sell your personal information to third parties.</p>
                        </div>

                        <div className="policy-block">
                            <h3>3. 3rd Party Services</h3>
                            <p>We use trusted partners like Web3Forms for support messages and Google for secure authentication. Each partner has their own privacy standards.</p>
                        </div>

                        <div className="policy-block">
                            <h3>4. Your Rights</h3>
                            <p>You have full control over your data. You can view, update, or delete your account at any time through your profile dashboard.</p>
                        </div>

                        <div className="policy-block">
                            <h3>5. Security</h3>
                            <p>We implement industry-standard security measures to protect your account and personal details from unauthorized access.</p>
                        </div>
                    </div>

                    <div className="privacy-footer-note">
                        <p>Questions about our privacy? <NavLink to="/contact">Contact us here</NavLink> or email <a href="mailto:support@careerbridge.com">support@careerbridge.com</a></p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
