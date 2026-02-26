import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './resources_manage.css';

const ResourcesManage = ({ onClose }) => {
  const [savedResources, setSavedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = '65d1234567890abcdef12345'; // Matching the dummy ID in ResourcesSave

  useEffect(() => {
    const fetchSavedResources = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/resources/get-by-id/${userId}`);
        setSavedResources(response.data);
      } catch (err) {
        console.error("Fetch Error:", err);
        if (err.response?.status === 404) {
          setSavedResources([]);
        } else {
          setError("Failed to load saved resources.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSavedResources();
  }, [userId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this resource?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/v1/resources/delete-resource/${id}`);
      setSavedResources(prev => prev.filter(res => res._id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete resource.");
    }
  };

  return (
    <div className="manage-container_learn_resman">
      <div className="manage-header_learn_resman">
        <button className="back-btn_learn_resman" onClick={onClose}>← Back to Search</button>
        <h1>Manage Your Resources</h1>
        <p>Track your learning progress and scheduled sessions.</p>
      </div>

      {loading ? (
        <div className="manage-loading_learn_resman">Loading your resources...</div>
      ) : error ? (
        <div className="manage-error_learn_resman">{error}</div>
      ) : savedResources.length === 0 ? (
        <div className="no-resources_learn_resman">
          <div className="empty-icon_learn_resman">🔖</div>
          <h3>No saved resources yet</h3>
          <p>Start searching and save resources you'd like to learn later.</p>
          <button className="search-now_btn_resman" onClick={onClose}>Go Search</button>
        </div>
      ) : (
        <div className="manage-grid_learn_resman">
          {savedResources.map((resource) => (
            <div key={resource._id} className="manage-card_learn_resman">
              <div className="manage-card-image_learn_resman">
                <img src={resource.thumbnail} alt={resource.videoTitle} />
                <span className="priority-badge_learn_resman" data-priority={resource.priority}>
                  {resource.priority}
                </span>
              </div>
              <div className="manage-card-info_learn_resman">
                <span className="skill-tag_manage_resman">{resource.skillName}</span>
                <h3>{resource.videoTitle}</h3>
                <div className="manage-meta_learn_resman">
                  <span className="meta-item_learn_resman">
                    📅 {new Date(resource.scheduledTime).toLocaleDateString()}
                  </span>
                  <span className="meta-item_learn_resman">
                    ⏰ {new Date(resource.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {resource.notes && <p className="manage-notes_learn_resman">"{resource.notes}"</p>}
                <div className="manage-actions_learn_resman">
                  <button
                    className="open-video_btn_resman"
                    onClick={() => window.open(resource.videoUrl, '_blank')}
                  >
                    Open Link
                  </button>
                  <button
                    className="delete-resource_btn_resman"
                    onClick={() => handleDelete(resource._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
      }
    </div >
  );
};

export default ResourcesManage;
