import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './resources_manage.css';
import NavBar from '../Common/Navbar';
import Footer from '../Common/Footer';
import API_BASE_URL from '../../apiConfig';

const ResourcesManage = ({ onClose }) => {
  const [savedResources, setSavedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const userId = user?._id || user?.id || '';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSavedResources = async () => {
      if (!userId || !token) {
        setError("Please login to view saved resources.");
        setLoading(false);
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_BASE_URL}/api/v1/resources/get-by-id/${userId}`, config);
        setSavedResources(response.data.data || []);
      } catch (err) {
        if (err.response?.status === 404) {
          setSavedResources([]);
        } else {
          setError("Failed to load saved resources.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSavedResources();
  }, [userId, token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this resource?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_BASE_URL}/api/v1/resources/resource-delete/${id}`, config);
      setSavedResources(prev => prev.filter(res => res._id !== id));
    } catch (err) {
      alert("Failed to delete resource.");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="page-wrapper_man">

        {/* ── HERO ── */}
        <section className="hero_man">
          <div>
            <span className="hero-eyebrow_man">Your Library</span>
            <h1>Saved Resources</h1>
            <p>Track your learning progress and scheduled sessions in one place.</p>
          </div>
          <button className="back-btn_man" onClick={onClose}>
            <span className="material-icons-round">arrow_back</span>
            Back to Search
          </button>
        </section>

        {/* ── CONTENT ── */}
        <div className="content-area_man">
          {loading ? (
            <div className="state-center_man">
              <div className="loader-ring_man"></div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', color: '#666' }}>
                Loading your resources...
              </span>
            </div>
          ) : error ? (
            <div className="error-bar_man">
              <span className="material-icons-round">error_outline</span>
              {error}
            </div>
          ) : savedResources.length === 0 ? (
            <div className="state-center_man">
              <span className="material-icons-round state-icon_man">bookmark_border</span>
              <h3>No saved resources yet</h3>
              <p>Start searching and save resources you'd like to learn later.</p>
              <button className="go-search-btn_man" onClick={onClose}>
                <span className="material-icons-round">search</span>
                Go Search
              </button>
            </div>
          ) : (
            <>
              <span className="section-label_man">Your saved content</span>
              <h2>My Resources ({savedResources.length})</h2>
              <div className="manage-grid_man">
                {savedResources.map((resource) => (
                  <div key={resource._id} className="manage-card_man">
                    <div className="card-thumb_man">
                      <img
                        src={resource.thumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop`}
                        alt={resource.videoTitle}
                      />
                      <span className="priority-badge_man" data-priority={resource.priority}>
                        {resource.priority}
                      </span>
                    </div>
                    <div className="card-body_man">
                      <span className="skill-tag_man">{resource.skillName}</span>
                      <h3>{resource.videoTitle}</h3>
                      <div className="card-meta_man">
                        <span className="meta-chip_man">
                          <span className="material-icons-round">calendar_today</span>
                          {new Date(resource.scheduledTime).toLocaleDateString()}
                        </span>
                        <span className="meta-chip_man">
                          <span className="material-icons-round">schedule</span>
                          {new Date(resource.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {resource.notes && (
                        <p className="card-notes_man">"{resource.notes}"</p>
                      )}
                      <div className="card-actions_man">
                        <button className="open-btn_man" onClick={() => window.open(resource.videoUrl, '_blank')}>
                          <span className="material-icons-round">open_in_new</span>
                          Open Link
                        </button>
                        <button className="delete-btn_man" onClick={() => handleDelete(resource._id)}>
                          <span className="material-icons-round">delete_outline</span>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResourcesManage;
