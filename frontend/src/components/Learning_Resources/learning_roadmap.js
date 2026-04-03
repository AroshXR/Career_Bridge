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

  if (showManage) {
    return <ResourcesManage onClose={() => setShowManage(false)} />;
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!skill.trim()) return;

    setLoading(true);
    setError(null);
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
          </div>
        </div>
      )}
    </div>
  );
}

export default LearningRoadmap;
