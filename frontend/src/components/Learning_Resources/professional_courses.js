import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './professional_courses.css';
import ResourcesSave from './resources_save';
import ResourcesManage from './resources_manage';
import NavBar from '../Common/Navbar';
import Footer from '../Common/Footer';

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
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const profRes = await axios.get(`http://localhost:5000/api/v1/resources/search_professional/${skill}`, config);
      setProfessionalCourses(profRes.data?.data || []);
    } catch (err) {
      const apiErrorMsg = err.response?.data?.error?.errorDescription || err.response?.data?.message;
      setError(apiErrorMsg ? `Failed to fetch: ${apiErrorMsg}` : `Failed to fetch resources: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="page-wrapper_prof">

        {/* ── HERO ── */}
        <section className="hero_prof">
          <div className="header-actions_prof">
            <div>
              <span className="hero-eyebrow_prof">Expert-Led Training</span>
              <h1>Professional Courses</h1>
              <p>Discover top-rated courses from Udemy, Coursera, and more — tailored to your skills.</p>
            </div>
            <button className="saved-btn_prof" onClick={() => setShowManage(true)}>
              <span className="material-icons-round">bookmark</span>
              My Saved Resources
            </button>
          </div>
        </section>

        {/* ── SEARCH ── */}
        <div className="search-section_prof">
          <form onSubmit={handleSearch} className="search-form_prof">
            <input
              id="prof-search-input_prof"
              type="text"
              placeholder="What skill do you want to master? (e.g. React, Python, AWS)"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />
            <button type="submit" className="search-btn_prof" disabled={loading}>
              <span className="material-icons-round">{loading ? 'hourglass_top' : 'search'}</span>
              {loading ? 'Processing...' : 'Search'}
            </button>
          </form>
        </div>

        {/* ── NAV TABS ── */}
        <div className="nav-tabs_prof">
          <button className="nav-tab_prof" onClick={() => navigate('/learning-resources')}>
            <span className="material-icons-round">smart_display</span>
            YouTube Courses
          </button>
          <button className="nav-tab_prof" onClick={() => navigate('/learning-roadmap')}>
            <span className="material-icons-round">map</span>
            Generate Roadmap
          </button>
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div className="error-bar_prof">
            <span className="material-icons-round">error_outline</span>
            {error}
          </div>
        )}

        {/* ── LOADING ── */}
        {loading && (
          <div className="loading-area_prof">
            <div className="loader-ring_prof"></div>
            <span className="loading-text_prof">Curating premium resources...</span>
          </div>
        )}

        {/* ── RESULTS ── */}
        {!loading && professionalCourses.length > 0 && (
          <div className="results-area_prof">
            <span className="results-label_prof">Search results</span>
            <h2>Courses for "{skill}"</h2>
            <div className="courses-grid_prof">
              {professionalCourses.map((course, index) => (
                <div key={index} className="course-card_prof">
                  <div className="card-thumbnail_prof">
                    <img
                      src={course.thumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop`}
                      alt={course.title}
                    />
                    <span className="platform-badge_prof">{course.platform}</span>
                  </div>
                  <div className="card-body_prof">
                    <h3>{course.title}</h3>
                    <div className="course-meta_prof">
                      {course.duration && (
                        <span className="meta-item_prof">
                          <span className="material-icons-round">schedule</span>
                          {course.duration}
                        </span>
                      )}
                      {course.price && (
                        <span className="price-tag_prof">
                          <span className="material-icons-round">sell</span>
                          {course.price}
                        </span>
                      )}
                    </div>
                    <div className="card-actions_prof">
                      <button
                        className="goto-btn_prof"
                        onClick={() => window.open(course.videoUrl, '_blank', 'noopener,noreferrer')}
                      >
                        <span className="material-icons-round">open_in_new</span>
                        Go to Course
                      </button>
                      <button
                        className="save-btn_prof"
                        onClick={() => setSavingResource({ ...course })}
                      >
                        <span className="material-icons-round">bookmark_add</span>
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
      <Footer />
    </div>
  );
}

export default ProfessionalCourses;
