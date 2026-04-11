import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './learning_roadmap.css';
import ResourcesManage from './resources_manage';
import NavBar from '../Common/Navbar';
import Footer from '../Common/Footer';
import API_BASE_URL from '../../apiConfig';

function LearningRoadmap() {
  const navigate = useNavigate();
  const [skill, setSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState([]);
  const [error, setError] = useState(null);
  const [showManage, setShowManage] = useState(false);
  const [followUpStatus, setFollowUpStatus] = useState(null); // null | 'saving' | 'success' | 'duplicate' | 'error'

  if (showManage) {
    return <ResourcesManage onClose={() => setShowManage(false)} />;
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!skill.trim()) return;
    setLoading(true);
    setError(null);
    setFollowUpStatus(null);
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const roadmapRes = await axios.get(`${API_BASE_URL}/api/v1/resources/roadmap/${skill}`, config);
      setRoadmap(roadmapRes.data?.data?.roadmap || []);
    } catch (err) {
      const apiErrorMsg = err.response?.data?.error?.errorDescription || err.response?.data?.message;
      setError(apiErrorMsg ? `Failed to fetch: ${apiErrorMsg}` : `Failed to fetch resources: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUp = async () => {
    setFollowUpStatus('saving');
    try {
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = storedUser._id;

      if (!userId) {
        setFollowUpStatus('error');
        return;
      }

      const tasks = roadmap.map(step => ({ title: step, completed: false }));

      await axios.post(
        `${API_BASE_URL}/api/v1/progress`,
        { userId, skillName: skill, tasks },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFollowUpStatus('success');
    } catch (err) {
      const msg = err.response?.data?.error?.errorDescription || err.response?.data?.message || '';
      if (err.response?.status === 400 && msg.toLowerCase().includes('already')) {
        setFollowUpStatus('duplicate');
      } else {
        setFollowUpStatus('error');
      }
    }
  };

  const followUpMessages = {
    saving: { text: 'Saving to your progress...', type: 'saving' },
    success: { text: 'Added to your Progress Page!', type: 'success' },
    duplicate: { text: 'You are already following this roadmap.', type: 'duplicate' },
    error: { text: 'Could not save. Please try again.', type: 'error' },
  };

  return (
    <div>
      <NavBar />
      <div className="page-wrapper_roadmap">

        {/* ── HERO ── */}
        <section className="hero_roadmap">
          <div className="header-actions_roadmap">
            <div>
              <span className="hero-eyebrow_roadmap">AI-Powered Learning</span>
              <h1>Learning Roadmap</h1>
              <p>Search for any skill to generate an AI-personalised 10-step learning roadmap.</p>
            </div>
            <button className="saved-btn_roadmap" onClick={() => setShowManage(true)}>
              <span className="material-icons-round">bookmark</span>
              My Saved Resources
            </button>
          </div>
        </section>

        {/* ── SEARCH ── */}
        <div className="search-section_roadmap">
          <form onSubmit={handleSearch} className="search-form_roadmap">
            <input
              id="roadmap-search-input_roadmap"
              type="text"
              placeholder="What skill do you want to master? (e.g. React, Python, AWS)"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />
            <button type="submit" className="search-btn_roadmap" disabled={loading}>
              <span className="material-icons-round">{loading ? 'hourglass_top' : 'map'}</span>
              {loading ? 'Processing...' : 'Generate'}
            </button>
          </form>
        </div>

        {/* ── NAV TABS ── */}
        <div className="nav-tabs_roadmap">
          <button className="nav-tab_roadmap" onClick={() => navigate('/learning-resources')}>
            <span className="material-icons-round">smart_display</span>
            YouTube Courses
          </button>
          <button className="nav-tab_roadmap" onClick={() => navigate('/professional-courses')}>
            <span className="material-icons-round">school</span>
            Professional Courses
          </button>
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div className="error-bar_roadmap">
            <span className="material-icons-round">error_outline</span>
            {error}
          </div>
        )}

        {/* ── LOADING ── */}
        {loading && (
          <div className="loading-area_roadmap">
            <div className="loader-ring_roadmap"></div>
            <span className="loading-text_roadmap">Analysing your request...</span>
          </div>
        )}

        {/* ── ROADMAP RESULTS ── */}
        {!loading && roadmap.length > 0 && (
          <div className="results-area_roadmap">
            <span className="results-label_roadmap">Your personalised plan</span>
            <h2>Roadmap for "{skill}"</h2>
            <div className="roadmap-timeline_roadmap">
              {roadmap.map((step, index) => (
                <div key={index} className="roadmap-step_roadmap" style={{ '--i': index }}>
                  <div className="step-dot_roadmap">{index + 1}</div>
                  <div className="step-card_roadmap">
                    <p>{step}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Follow Up UI */}
            <div className="follow-up-section_roadmap">
              <button
                className={`follow-up-btn_roadmap ${followUpStatus === 'success' ? 'success' : ''}`}
                onClick={handleFollowUp}
                disabled={followUpStatus === 'saving' || followUpStatus === 'success'}
              >
                {followUpStatus === 'saving' ? 'Saving...' : followUpStatus === 'success' ? 'Following' : 'Follow Up'}
              </button>

              {followUpStatus && followUpMessages[followUpStatus] && (
                <p className={`follow-up-status_roadmap ${followUpMessages[followUpStatus].type}`}>
                  {followUpMessages[followUpStatus].text}
                </p>
              )}

              {followUpStatus === 'success' && (
                <button
                  className="view-progress-btn_roadmap"
                  onClick={() => navigate('/progress')}
                >
                  View Progress Page
                  <span className="material-icons-round">east</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default LearningRoadmap;
