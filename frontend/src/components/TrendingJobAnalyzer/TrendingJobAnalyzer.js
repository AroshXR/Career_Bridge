import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TrendingJobAnalyzer.css';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';

const CATEGORIES = [
  "Information Technology",
  "Artificial Intelligence & Data",
  "Cybersecurity",
  "Engineering",
  "Healthcare & Medical Services",
  "Finance & FinTech",
  "Digital Marketing",
  "Renewable Energy & Sustainability",
  "Logistics & Supply Chain",
  "Education & E-Learning",
  "Creative & Media",
  "Remote & Freelance Services",
  "Human Resources",
  "Hospitality & Tourism",
  "Agriculture & Food Technology",
  "Manufacturing & Industrial Operations",
  "Legal & Compliance",
  "Real Estate & Property Management",
  "Biotechnology & Pharmaceuticals",
  "Telecommunications",
  "Government & Public Administration",
  "Retail & E-Commerce",
  "Social Sciences"
];

const LOADING_MESSAGES = [
  "Aggregating global market signals...",
  "Fetching real-time job data...",
  "Analysing demand trends...",
  "Identifying high-growth roles...",
  "Structuring trending path data...",
  "Almost done — finalising insights..."
];

const getBadgeClass = (level = '') => {
  const l = level.toLowerCase();
  if (l.includes('high'))   return 'high_trendJob';
  if (l.includes('medium')) return 'medium_trendJob';
  return 'low_trendJob';
};

const TrendingJobAnalyzer = () => {
  const navigate = useNavigate();
  const [roles, setRoles]       = useState([]);
  const [stats, setStats]       = useState({ totalMarketSignals: 0, analyzedRoles: 0 });
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [currentCategory, setCurrentCategory] = useState("Information Technology");
  const [currentPage, setCurrentPage]         = useState(1);
  const [loadingMsg, setLoadingMsg]           = useState(LOADING_MESSAGES[0]);

  const rolesPerPage = 10;

  /* rotating loading messages */
  useEffect(() => {
    if (!loading) return;
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[idx]);
    }, 4500);
    return () => clearInterval(interval);
  }, [loading]);

  /* fetch on category change */
  useEffect(() => {
    fetchTrendingJobs();
    setCurrentPage(1);
  }, [currentCategory]);

  const fetchTrendingJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/v1/trendingJobAnalyzer/getTrendingJobs?category=${encodeURIComponent(currentCategory)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status === "00") {
        setRoles(response.data.data.roles || []);
        setStats(response.data.data.stats || { totalMarketSignals: 0, analyzedRoles: 0 });
      }
    } catch (err) {
      setError("Failed to load trending data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* pagination */
  const indexOfLast   = currentPage * rolesPerPage;
  const indexOfFirst  = indexOfLast - rolesPerPage;
  const currentRoles  = roles.slice(indexOfFirst, indexOfLast);
  const totalPages    = Math.ceil(roles.length / rolesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveRole = async (role) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/v1/trendingJobAnalyzer/saveJob',
        {
          jobId: `trend_${role.title.replace(/\s+/g, '_').toLowerCase()}`,
          title: role.title,
          description: role.description,
          company: "Market Opportunity",
          location: "Global / Remote",
          url: "#"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`${role.title} saved to your career interests!`);
    } catch (err) {
      if (err.response?.data?.message?.includes("already saved")) {
        alert("Role already saved!");
      } else {
        alert("Failed to save role. Please try again.");
      }
    }
  };

  const handleAnalyzeSkills = async (role) => {
    const jobId = `trend_${role.title.replace(/\s+/g, '_').toLowerCase()}`;
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/v1/trendingJobAnalyzer/saveJob',
        {
          jobId,
          title: role.title,
          description: role.description,
          company: "Market Opportunity",
          location: "Global / Remote",
          url: "#"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      // "already saved" is fine — still proceed to analyzer
      if (!err.response?.data?.message?.includes("already saved")) {
        alert("Failed to prepare job for analysis. Please try again.");
        return;
      }
    }
    navigate('/skill-analyzer', { state: { autoAnalyzeJobId: jobId, jobTitle: role.title } });
  };

  return (
    <div className="page-wrapper_trendJob">
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero_trendJob">
        <div className="hero-text_trendJob">
          <span className="hero-eyebrow_trendJob">AI Market Intelligence</span>
          <h1>Trending Job<br />Analyzer</h1>
          <p>
            Discover high-velocity growth roles powered by global talent signals.
            Filter by industry and explore in-demand skills and salary benchmarks.
          </p>
        </div>

        <div className="hero-controls_trendJob">
          <label htmlFor="category-select_trendJob" className="select-label_trendJob">Select Industry</label>
          <div className="select-wrap_trendJob">
            <select
              id="category-select_trendJob"
              className="category-select_trendJob"
              value={currentCategory}
              onChange={(e) => setCurrentCategory(e.target.value)}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <span className="material-icons-round select-arrow_trendJob">expand_more</span>
          </div>
          <button
            className="refresh-btn_trendJob"
            onClick={fetchTrendingJobs}
            disabled={loading}
          >
            <span className="material-icons-round">refresh</span>
            Refresh Market Data
          </button>
        </div>
      </section>

      {/* ── States: loading / error / content ── */}
      {loading ? (
        <div className="loading-area_trendJob">
          <div className="loader-ring_trendJob"></div>
          <p className="loading-msg_trendJob">{loadingMsg}</p>
        </div>
      ) : error ? (
        <div className="error-area_trendJob">
          <span className="material-icons-round error-icon_trendJob">error_outline</span>
          <p>{error}</p>
          <button className="retry-btn_trendJob" onClick={fetchTrendingJobs}>
            <span className="material-icons-round">replay</span>
            Retry Analysis
          </button>
        </div>
      ) : (
        <>
          {/* ── STATS STRIP ── */}
          <div className="stats-strip_trendJob">
            <div className="stat-item_trendJob">
              <span className="material-icons-round stat-icon_trendJob">signal_cellular_alt</span>
              <span className="stat-value_trendJob">{stats.totalMarketSignals.toLocaleString()}</span>
              <span className="stat-label_trendJob">Market Signals</span>
            </div>
            <div className="stat-item_trendJob">
              <span className="material-icons-round stat-icon_trendJob">trending_up</span>
              <span className="stat-value_trendJob">{roles.length}</span>
              <span className="stat-label_trendJob">Growth Roles</span>
            </div>
            <div className="stat-item_trendJob">
              <span className="material-icons-round stat-icon_trendJob">public</span>
              <span className="stat-value_trendJob">Global</span>
              <span className="stat-label_trendJob">Region</span>
            </div>
            <div className="stat-item_trendJob">
              <span className="material-icons-round stat-icon_trendJob">category</span>
              <span className="stat-value_trendJob">{currentCategory.split(' ')[0]}</span>
              <span className="stat-label_trendJob">Current Sector</span>
            </div>
          </div>

          {/* ── MAIN CONTENT ── */}
          <div className="main-content_trendJob">

            {/* Section heading */}
            <div className="section-head_trendJob">
              <div>
                <span className="section-label_trendJob">Professional Insights</span>
                <h2>Growth Paths <span>— {currentCategory}</span></h2>
                <p className="section-sub_trendJob">
                  Roles showing high velocity and demand &nbsp;·&nbsp; Page {currentPage} of {totalPages || 1}
                </p>
              </div>
            </div>

            {/* ── ROLE CARDS GRID ── */}
            <div className="role-grid_trendJob">
              {currentRoles.map((role, index) => (
                <div key={index} className="role-card_trendJob">

                  {/* Demand badge */}
                  <span className={`demand-badge_trendJob ${getBadgeClass(role.demand_level)}`}>
                    <span className="material-icons-round">bolt</span>
                    {role.demand_level} Demand
                  </span>

                  <h3 className="role-title_trendJob">{role.title}</h3>
                  <p className="role-desc_trendJob">{role.description}</p>

                  {/* Growth trend */}
                  <div className="growth-row_trendJob">
                    <span className="material-icons-round">show_chart</span>
                    <span><strong>Trend:</strong> {role.growth_factor}</span>
                  </div>

                  {/* Skill tags */}
                  <div className="skill-tags_trendJob">
                    {(role.key_skills || []).map((skill, sIdx) => (
                      <span key={sIdx} className="skill-tag_trendJob">{skill}</span>
                    ))}
                  </div>

                  {/* Card footer */}
                  <div className="card-footer_trendJob">
                    <div className="salary-est_trendJob">
                      <span className="material-icons-round">payments</span>
                      {role.average_salary}
                    </div>
                    <div className="card-actions_trendJob">
                      <button
                        className="analyze-btn_trendJob"
                        onClick={() => handleAnalyzeSkills(role)}
                      >
                        <span className="material-icons-round">manage_search</span>
                        Analyse Skills
                      </button>
                      <button
                        className="save-btn_trendJob"
                        onClick={() => handleSaveRole(role)}
                      >
                        <span className="material-icons-round">bookmark_add</span>
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── PAGINATION ── */}
            {totalPages > 1 && (
              <div className="pagination_trendJob">
                <button
                  className="pag-prev_trendJob"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <span className="material-icons-round">arrow_back_ios</span>
                  Previous
                </button>

                <div className="page-numbers_trendJob">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      className={`page-num_trendJob${currentPage === i + 1 ? ' active_trendJob' : ''}`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  className="pag-next_trendJob"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <span className="material-icons-round">arrow_forward_ios</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default TrendingJobAnalyzer;
