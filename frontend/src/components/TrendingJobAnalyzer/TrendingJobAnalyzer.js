import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './TrendingJobAnalyzer.css';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import API_BASE_URL from '../../apiConfig';

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
  if (l.includes('high')) return 'high_trendJob';
  if (l.includes('medium')) return 'medium_trendJob';
  return 'low_trendJob';
};

const TrendingJobAnalyzer = () => {
  const [roles, setRoles] = useState([]);
  const [stats, setStats] = useState({ totalMarketSignals: 0, analyzedRoles: 0 });
  const [loading, setLoading] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [error, setError] = useState(null);
  const [currentCategory, setCurrentCategory] = useState("Information Technology");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const rolesPerPage = 10;

  const fetchTrendingJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setHasAnalyzed(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/trendingJobAnalyzer/getTrendingJobs?category=${encodeURIComponent(currentCategory)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status === "00") {
        setRoles(response.data.data.roles || []);
        setStats(response.data.data.stats || { totalMarketSignals: 0, analyzedRoles: 0 });

        // Also fetch saved jobs to mark them
        const savedResp = await axios.get(
          `${API_BASE_URL}/api/v1/trendingJobAnalyzer/getSavedJobs`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (savedResp.data.status === "00") {
          const ids = new Set((savedResp.data.data.jobs || []).map(j => j.jobId));
          setSavedJobIds(ids);
        }
      }
    } catch (err) {
      setError("Failed to load trending data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentCategory]);

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

  /* Reset page on category change, but don't auto-fetch */
  useEffect(() => {
    setCurrentPage(1);
  }, [currentCategory]);

  /* pagination */
  const indexOfLast = currentPage * rolesPerPage;
  const indexOfFirst = indexOfLast - rolesPerPage;
  const currentRoles = roles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(roles.length / rolesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveRole = async (role) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/v1/trendingJobAnalyzer/saveJob`,
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
      setSavedJobIds(prev => new Set([...prev, `trend_${role.title.replace(/\s+/g, '_').toLowerCase()}`]));
      alert(`${role.title} saved to your career interests!`);
    } catch (err) {
      if (err.response?.data?.message?.includes("already saved")) {
        alert("Role already saved!");
      } else {
        alert("Failed to save role. Please try again.");
      }
    }
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
          <span className="select-label_trendJob">Select Industry</span>
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

      {/* ── States: initial / loading / error / content ── */}
      {!hasAnalyzed && !loading ? (
        <div className="initial-analysis-area_trendJob">
          <div className="initial-card_trendJob">
            <span className="material-icons-round launch-icon_trendJob">rocket_launch</span>
            <h2>Ready to scan the market?</h2>
            <p>Select your industry above and click "Start Analysis" to generate real-time growth insights and salary benchmarks.</p>
            <button className="start-analysis-btn_trendJob" onClick={fetchTrendingJobs}>
              <span className="material-icons-round">analytics</span>
              Start Market Analysis
            </button>
          </div>
        </div>
      ) : loading ? (
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
                        className={`save-btn_trendJob ${savedJobIds.has(`trend_${role.title.replace(/\s+/g, '_').toLowerCase()}`) ? 'saved-btn_trendJob' : ''}`}
                        onClick={() => handleSaveRole(role)}
                        disabled={savedJobIds.has(`trend_${role.title.replace(/\s+/g, '_').toLowerCase()}`)}
                      >
                        <span className="material-icons-round">
                          {savedJobIds.has(`trend_${role.title.replace(/\s+/g, '_').toLowerCase()}`) ? 'bookmark_check' : 'bookmark_add'}
                        </span>
                        {savedJobIds.has(`trend_${role.title.replace(/\s+/g, '_').toLowerCase()}`) ? 'Saved' : 'Save'}
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
