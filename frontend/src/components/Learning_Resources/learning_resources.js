import React, { useState } from 'react';
import axios from 'axios';
import './learning_resources.css';

function LearningResources() {
  const [skill, setSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [professionalCourses, setProfessionalCourses] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [activeTab, setActiveTab] = useState('youtube');
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

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
      const [ytRes, profRes, roadmapRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/resources/search_resource/${skill}`),
        axios.get(`http://localhost:5000/api/v1/resources/search_professional/${skill}`),
        axios.get(`http://localhost:5000/api/v1/resources/roadmap/${skill}`)
      ]);

      setYoutubeVideos(ytRes.data);
      setProfessionalCourses(profRes.data);
      setRoadmap(roadmapRes.data.roadmap);
    } catch (err) {
      console.error("Error fetching resources:", err);
      setError("Failed to fetch resources. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="learning-container_learn">
      <div className="search-header_learn">
        <h1>Find Your Learning Path</h1>
        <p>Search for any skill and we'll find the best resources for you.</p>
        <form onSubmit={handleSearch} className="search-box_learn">
          <input
            type="text"
            placeholder="What do you want to learn? (e.g. React, Python, UI Design)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Search'}
          </button>
        </form>
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
              <span className="text-line_learn">Finding the best learning paths...</span>
              <span className="text-line_learn">Curating premium resources...</span>
            </div>
          </div>
        </div>
      )}

      {!loading && (youtubeVideos.length > 0 || professionalCourses.length > 0 || roadmap.length > 0) && (
        <div className="results-wrapper_learn">
          <div className="tabs_learn">
            <button
              className={activeTab === 'youtube' ? 'tab_learn active_learn' : 'tab_learn'}
              onClick={() => setActiveTab('youtube')}
            >
              YouTube Tutorials
            </button>
            <button
              className={activeTab === 'professional' ? 'tab_learn active_learn' : 'tab_learn'}
              onClick={() => setActiveTab('professional')}
            >
              Professional Courses
            </button>
            <button
              className={activeTab === 'roadmap' ? 'tab_learn active_learn' : 'tab_learn'}
              onClick={() => setActiveTab('roadmap')}
            >
              Learning Roadmap
            </button>
          </div>

          <div className="tab-content_learn">
            {activeTab === 'youtube' && (
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
                      <button
                        onClick={() => setSelectedVideo({ url: video.videoUrl, title: video.title })}
                        className="view-btn_learn"
                      >
                        Watch Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'professional' && (
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
                      <button
                        onClick={() => window.open(course.videoUrl, '_blank', 'noopener,noreferrer')}
                        className="view-btn_learn"
                      >
                        View Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'roadmap' && (
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
            )}
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
    </div>
  );
}

export default LearningResources;
