import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './professional_courses.css';
import ResourcesSave from './resources_save';
import ResourcesManage from './resources_manage';

function ProfessionalCourses() {
  const navigate = useNavigate();
  const [skill, setSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [professionalCourses, setProfessionalCourses] = useState([]);
  const [error, setError] = useState(null);
  const [savingResource, setSavingResource] = useState(null);
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

      const profRes = await axios.get(`http://localhost:5000/api/v1/resources/search_professional/${skill}`, config);
      setProfessionalCourses(profRes.data?.data || []);
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
          <h1>Find Your Learning Path - Professional Courses</h1>
          <button className="manage-toggle-btn_learn" onClick={() => setShowManage(true)}>
            My Saved Resources 🔖
          </button>
        </div>
        <p>Search for any skill to find the best Professional Courses for you.</p>
        
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
            <button className="nav-btn_learn" onClick={() => navigate('/learning-roadmap')}>
              Generate Roadmap
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
              <span className="text-line_learn">Curating premium resources...</span>
            </div>
          </div>
        </div>
      )}

      {!loading && professionalCourses.length > 0 && (
        <div className="results-wrapper_learn">
          <div className="tab-content_learn">
              <div className="resource-grid_learn">
                {professionalCourses.map((course, index) => (
                  <div key={index} className="resource-card_learn">
                    <div className="card-image_learn">
                      <img src={course.thumbnail} alt={course.title} />
                      <span className="platform-badge_learn prof_learn">{course.platform}</span>
                    </div>
                    <div className="card-info_learn">
                      <h3>{course.title}</h3>
                      <div className="course-meta_learn">
                        <span>Duration: {course.duration}</span>
                        <span className="price_learn">{course.price}</span>
                      </div>
                      <div className="card-actions_learn">
                        <button
                          onClick={() => window.open(course.videoUrl, '_blank', 'noopener,noreferrer')}
                          className="view-btn_learn"
                        >
                          Go to Course
                        </button>
                        <button
                          onClick={() => setSavingResource({ ...course })}
                          className="save-btn-inline_learn"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </div>
      )}

      {savingResource && (
        <ResourcesSave
          resource={savingResource}
          skillName={skill}
          onClose={() => setSavingResource(null)}
        />
      )}
    </div>
  );
}

export default ProfessionalCourses;
