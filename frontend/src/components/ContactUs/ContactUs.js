import React, { useState } from 'react';
import './ContactUs.css';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const object = {
            ...formData,
            access_key: process.env.REACT_APP_WEB3FORMS_ACCESS_KEY
        };
        const json = JSON.stringify(object);

        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: json
            }).then((res) => res.json());

            if (res.success) {
                console.log("Success", res);
                setSubmitted(true);
                setFormData({ name: '', email: '', subject: '', message: '' });
                // Reset success message after 5 seconds
                setTimeout(() => setSubmitted(false), 5000);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page">
            <Navbar />

            <main className="contact-container">
                <header className="contact-header">
                    <h1>Get in Touch</h1>
                    <p>Have questions or feedback? We'd love to hear from you. Our team is here to help you bridge the gap in your career.</p>
                </header>

                <div className="contact-grid">
                    {/* Contact Info */}
                    <section className="contact-info">
                        <div className="info-card">
                            <span className="material-icons-round">email</span>
                            <h3>Email Us</h3>
                            <p>support@careerbridge.com</p>
                        </div>
                        <div className="info-card">
                            <span className="material-icons-round">phone</span>
                            <h3>Call Us</h3>
                            <p>+94 (71) 123-4567</p>
                            <p>Mon-Fri, 9am - 6pm EST</p>
                        </div>
                    </section>

                    {/* Contact Form */}
                    <section className="contact-form-container">
                        {submitted ? (
                            <div className="success-message">
                                <span className="material-icons-round">check_circle</span>
                                <h2>Message Sent!</h2>
                                <p>Thank you for reaching out. Our team will get back to you shortly.</p>
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="subject">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="How can we help?"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Your message here..."
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="submit-btn_contact" disabled={loading}>
                                    {loading ? "Sending..." : "Send Message"}
                                    {!loading && <span className="material-icons-round">send</span>}
                                </button>
                            </form>
                        )}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ContactUs;
