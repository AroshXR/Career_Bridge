import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './youtube_resources.css';
import ResourcesSave from './resources_save';
import ResourcesManage from './resources_manage';

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
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };

      const ytRes = await axios.get(`http://localhost:5000/api/v1/resources/search_resource/${skill}`, config);
      setYoutubeVideos(ytRes.data?.data || []);
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
          <h1>Find Your Learning Path - YouTube Resources</h1>
          <button className="manage-toggle-btn_learn" onClick={() => setShowManage(true)}>
            My Saved Resources 🔖
          </button>
        </div>
        <p>Search for any skill to find the best YouTube tutorials for you.</p>
        
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
            <button className="nav-btn_learn" onClick={() => navigate('/professional-courses')}>
              Search Professional Courses
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
              <span className="text-line_learn">Finding the best learning paths...</span>
            </div>
          </div>
        </div>
      )}

      {!loading && youtubeVideos.length > 0 && (
        <div className="results-wrapper_learn">
          <div className="tab-content_learn">
              <div className="resource-grid_learn">
                {youtubeVideos.map((video) => (
                  <div key={video.videoId} className="resource-card_learn">
                    <div className="card-image_learn">
                      <img src={video.thumbnail} alt={video.title} />
                      <span className="platform-badge_learn yt_learn">YouTube</span>
                    </div>
                    <div className="card-info_learn">
                      <h3>{video.title}</h3>
                      <p>{video.description.substring(0, 100)}...</p>
                      <div className="card-actions_learn">
                        <button
                          onClick={() => setSelectedVideo({ url: video.videoUrl, title: video.title })}
                          className="view-btn_learn"
                        >
                          Play Here
                        </button>
                        <button
                          onClick={() => setSavingResource({ ...video, title: video.title })}
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

      {selectedVideo && (
        <div className="video-modal_learn" onClick={() => setSelectedVideo(null)}>
          <div className="modal-content_learn" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn_learn" onClick={() => setSelectedVideo(null)}>×</button>
            <div className="video-container_learn">
              <iframe
                src={getEmbedUrl(selectedVideo.url)}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <h3>{selectedVideo.title}</h3>
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

export default YoutubeResources;
