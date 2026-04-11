import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './youtube_resources.css';
import ResourcesSave from './resources_save';
import ResourcesManage from './resources_manage';
import NavBar from '../Common/Navbar';
import Footer from '../Common/Footer';
import API_BASE_URL from '../../apiConfig';

function YoutubeResources() {
  const navigate = useNavigate();
  const [skill, setSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [savingResource, setSavingResource] = useState(null);
  const [showManage, setShowManage] = useState(false);

  if (showManage) {
    return <ResourcesManage onClose={() => setShowManage(false)} />;
  }

  const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
      const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1` : url;
    } catch (err) {
      return url;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!skill.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const ytRes = await axios.get(`${API_BASE_URL}/api/v1/resources/search_resource/${skill}`, config);
      setYoutubeVideos(ytRes.data?.data || []);
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
      <div className="page-wrapper_ytres">

        {/* ── HERO ── */}
        <section className="hero_ytres">
          <div className="header-actions_ytres">
            <div>
              <span className="hero-eyebrow_ytres">Free Video Tutorials</span>
              <h1>
                <span className="material-icons-round yt-icon_ytres">smart_display</span>
                YouTube Resources
              </h1>
              <p>Discover top-rated YouTube tutorials curated to match your learning goals.</p>
            </div>
            <button className="saved-btn_ytres" onClick={() => setShowManage(true)}>
              <span className="material-icons-round">bookmark</span>
              My Saved Resources
            </button>
          </div>
        </section>

        {/* ── SEARCH ── */}
        <div className="search-section_ytres">
          <form onSubmit={handleSearch} className="search-form_ytres">
            <input
              id="yt-search-input_ytres"
              type="text"
              placeholder="What skill do you want to master? (e.g. React, Python, AWS)"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />
            <button type="submit" className="search-btn_ytres" disabled={loading}>
              <span className="material-icons-round">{loading ? 'hourglass_top' : 'search'}</span>
              {loading ? 'Processing...' : 'Search'}
            </button>
          </form>
        </div>

        {/* ── NAV TABS ── */}
        <div className="nav-tabs_ytres">
          <button className="nav-tab_ytres" onClick={() => navigate('/professional-courses')}>
            <span className="material-icons-round">school</span>
            Professional Courses
          </button>
          <button className="nav-tab_ytres" onClick={() => navigate('/learning-roadmap')}>
            <span className="material-icons-round">map</span>
            Generate Roadmap
          </button>
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div className="error-bar_ytres">
            <span className="material-icons-round">error_outline</span>
            {error}
          </div>
        )}

        {/* ── LOADING ── */}
        {loading && (
          <div className="loading-area_ytres">
            <div className="loader-ring_ytres"></div>
            <span className="loading-text_ytres">Finding the best learning paths...</span>
          </div>
        )}

        {/* ── RESULTS ── */}
        {!loading && youtubeVideos.length > 0 && (
          <div className="results-area_ytres">
            <span className="results-label_ytres">search results</span>
            <h2>Videos for "{skill}"</h2>
            <div className="videos-grid_ytres">
              {youtubeVideos.map((video) => (
                <div key={video.videoId} className="video-card_ytres">
                  <div className="card-thumb_ytres" onClick={() => setSelectedVideo({ url: video.videoUrl, title: video.title })}>
                    <img src={video.thumbnail} alt={video.title} />
                    <div className="play-overlay_ytres">
                      <div className="play-icon_ytres">
                        <span className="material-icons-round">play_arrow</span>
                      </div>
                    </div>
                    <span className="yt-badge_ytres">
                      <span className="material-icons-round">smart_display</span>
                      YouTube
                    </span>
                  </div>
                  <div className="card-body_ytres">
                    <h3>{video.title}</h3>
                    <p className="card-desc_ytres">{video.description?.substring(0, 100)}...</p>
                    <div className="card-actions_ytres">
                      <button
                        className="play-btn_ytres"
                        onClick={() => setSelectedVideo({ url: video.videoUrl, title: video.title })}
                      >
                        <span className="material-icons-round">play_circle</span>
                        Play Here
                      </button>
                      <button
                        className="save-btn_ytres"
                        onClick={() => setSavingResource({ ...video, title: video.title })}
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

        {/* ── VIDEO MODAL ── */}
        {selectedVideo && (
          <div className="video-modal_ytres" onClick={() => setSelectedVideo(null)}>
            <div className="video-modal-content_ytres" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn_ytres" onClick={() => setSelectedVideo(null)}>
                <span className="material-icons-round">close</span>
              </button>
              <div className="video-iframe-wrap_ytres">
                <iframe
                  src={getEmbedUrl(selectedVideo.url)}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="modal-title_ytres">{selectedVideo.title}</p>
            </div>
          </div>
        )}

        {/* ── SAVE MODAL ── */}
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

export default YoutubeResources;
