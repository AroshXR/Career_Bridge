import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './learning_roadmap.css';
import ResourcesManage from './resources_manage';
import NavBar from '../Common/Navbar';
import Footer from '../Common/Footer';

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
      const roadmapRes = await axios.get(`http://localhost:5000/api/v1/resources/roadmap/${skill}`, config);
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
        'http://localhost:5000/api/v1/progress',
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
    saving: { text: '⏳ Saving to your progress...', color: '#f39c12' },
    success: { text: '✅ Added to your Progress Page!', color: '#27ae60' },
    duplicate: { text: '⚠️ You are already following this roadmap.', color: '#e67e22' },
    error: { text: '❌ Could not save. Please try again.', color: '#e74c3c' },
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

            {/* Follow Up Button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '24px 0 8px' }}>
              <button
                onClick={handleFollowUp}
                disabled={followUpStatus === 'saving' || followUpStatus === 'success'}
                style={{
                  padding: '12px 36px',
                  background: followUpStatus === 'success' ? '#27ae60' : 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '30px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: followUpStatus === 'saving' || followUpStatus === 'success' ? 'default' : 'pointer',
                  boxShadow: '0 4px 15px rgba(108,92,231,0.4)',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px'
                }}
              >
                {followUpStatus === 'saving' ? '⏳ Saving...' : followUpStatus === 'success' ? '✅ Following!' : '🚀 Follow Up'}
              </button>

              {followUpStatus && followUpMessages[followUpStatus] && (
                <p style={{ marginTop: '10px', color: followUpMessages[followUpStatus].color, fontWeight: '600', fontSize: '14px' }}>
                  {followUpMessages[followUpStatus].text}
                </p>
              )}

              {followUpStatus === 'success' && (
                <button
                  onClick={() => navigate('/progress')}
                  style={{
                    marginTop: '8px',
                    padding: '8px 22px',
                    background: 'transparent',
                    color: '#6c5ce7',
                    border: '2px solid #6c5ce7',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  View Progress Page →
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
