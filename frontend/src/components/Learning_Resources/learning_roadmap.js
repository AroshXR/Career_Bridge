import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './learning_roadmap.css';
import ResourcesManage from './resources_manage';

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
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };

      const roadmapRes = await axios.get(`http://localhost:5000/api/v1/resources/roadmap/${skill}`, config);
      setRoadmap(roadmapRes.data?.data?.roadmap || []);
    } catch (err) {
      const apiErrorMsg = err.response?.data?.error?.errorDescription || err.response?.data?.message;
      console.error("Error fetching resources:", err.response || err);
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
    saving:    { text: '⏳ Saving to your progress...',          color: '#f39c12' },
    success:   { text: '✅ Added to your Progress Page!',        color: '#27ae60' },
    duplicate: { text: '⚠️ You are already following this roadmap.', color: '#e67e22' },
    error:     { text: '❌ Could not save. Please try again.',  color: '#e74c3c' },
  };

  return (
    <div className="learning-container_learn">
      <div className="search-header_learn">
        <div className="header-top_learn">
          <h1>Find Your Learning Path - Learning Roadmap</h1>
          <button className="manage-toggle-btn_learn" onClick={() => setShowManage(true)}>
            My Saved Resources 🔖
          </button>
        </div>
        <p>Search for any skill to generate an AI personalized 10-step roadmap.</p>
        
        <form onSubmit={handleSearch} className="search-box_learn">
          <input
            type="text"
            placeholder="What do you want to learn? (e.g. React, Python)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Search'}
          </button>
        </form>

        <div className="nav-buttons-container_learn">
            <button className="nav-btn_learn" onClick={() => navigate('/learning-resources')}>
              Search YouTube Courses
            </button>
            <button className="nav-btn_learn" onClick={() => navigate('/professional-courses')}>
              Search Professional Courses
            </button>
        </div>
      </div>

      {error && <div className="error-message_learn">{error}</div>}

      {loading && (
        <div className="loading-wrapper_learn">
          <div className="loading-content_learn">
            <div className="loader-sphere_learn">
              <div className="sphere-inner_learn"></div>
              <div className="sphere-outer_learn"></div>
            </div>
            <div className="loading-text_learn">
              <span className="text-line_learn">Analyzing your request...</span>
            </div>
          </div>
        </div>
      )}

      {!loading && roadmap.length > 0 && (
        <div className="results-wrapper_learn">
          <div className="tab-content_learn">
              <div className="roadmap-container_learn">
                <div className="roadmap-line_learn"></div>
                {roadmap.map((step, index) => (
                  <div key={index} className="roadmap-item_learn">
                    <div className="step-number_learn">{index + 1}</div>
                    <div className="step-content_learn">
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
        </div>
      )}
    </div>
  );
}

export default LearningRoadmap;
