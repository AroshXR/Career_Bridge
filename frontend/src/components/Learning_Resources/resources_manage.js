import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './resources_manage.css';
import NavBar from '../Common/Navbar';
import Footer from '../Common/Footer';
import API_BASE_URL from '../../apiConfig';

const ResourcesManage = ({ onClose }) => {
  const [savedResources, setSavedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for Video Playback
  const [selectedVideo, setSelectedVideo] = useState(null);

  // States for Edit Mode
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const userId = user?._id || user?.id || '';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSavedResources = async () => {
      if (!userId || !token) {
        setError("Please login to view saved resources.");
        setLoading(false);
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_BASE_URL}/api/v1/resources/get-by-id/${userId}`, config);
        setSavedResources(response.data.data || []);
      } catch (err) {
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
  }, [userId, token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this resource?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_BASE_URL}/api/v1/resources/resource-delete/${id}`, config);
      setSavedResources(prev => prev.filter(res => res._id !== id));
    } catch (err) {
      alert("Failed to delete resource.");
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
      const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1` : url;
    } catch (err) {
      return url;
    }
  };

  const isYoutube = (url) => url && (url.includes('youtube.com') || url.includes('youtu.be'));

  const startEditing = (resource) => {
    setEditingId(resource._id);
    setEditFormData({
      id: resource._id,
      scheduledTime: new Date(resource.scheduledTime).toISOString().slice(0, 16),
      priority: resource.priority,
      notes: resource.notes || ''
    });
    setUpdateMessage(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateMessage(null);

    // Validation 1: Past date check
    if (new Date(editFormData.scheduledTime) < new Date()) {
      setUpdateMessage({ type: 'error', text: 'Scheduled time cannot be in the past.' });
      setUpdateLoading(false);
      return;
    }

    // Validation 2: Character limit check
    if (editFormData.notes && editFormData.notes.length > 500) {
      setUpdateMessage({ type: 'error', text: 'Notes must be 500 characters or less.' });
      setUpdateLoading(false);
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put(`${API_BASE_URL}/api/v1/resources/update-save-resource`, editFormData, config);
      setSavedResources(prev => prev.map(res => res._id === editFormData.id ? response.data.data : res));
      setUpdateMessage({ type: 'success', text: 'Updated!' });
      setTimeout(() => setEditingId(null), 1500);
    } catch (err) {
      setUpdateMessage({ type: 'error', text: 'Update failed.' });
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="page-wrapper_man">

        {/* ── HERO ── */}
        <section className="hero_man">
          <div>
            <span className="hero-eyebrow_man">Your Library</span>
            <h1>Saved Resources</h1>
            <p>Track your learning progress and scheduled sessions in one place.</p>
          </div>
          <button className="back-btn_man" onClick={onClose}>
            <span className="material-icons-round">arrow_back</span>
            Back to Search
          </button>
        </section>

        {/* ── CONTENT ── */}
        <div className="content-area_man">
          {loading ? (
            <div className="state-center_man">
              <div className="loader-ring_man"></div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', color: '#666' }}>
                Loading your resources...
              </span>
            </div>
          ) : error ? (
            <div className="error-bar_man">
              <span className="material-icons-round">error_outline</span>
              {error}
            </div>
          ) : savedResources.length === 0 ? (
            <div className="state-center_man">
              <span className="material-icons-round state-icon_man">bookmark_border</span>
              <h3>No saved resources yet</h3>
              <p>Start searching and save resources you'd like to learn later.</p>
              <button className="go-search-btn_man" onClick={onClose}>
                <span className="material-icons-round">search</span>
                Go Search
              </button>
            </div>
          ) : (
            <>
              <span className="section-label_man">Your saved content</span>
              <h2>My Resources ({savedResources.length})</h2>
              <div className="manage-grid_man">
                {savedResources.map((resource) => (
                  <div key={resource._id} className="manage-card_man">
                    <div className="card-thumb_man">
                      <img
                        src={resource.thumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop`}
                        alt={resource.videoTitle}
                      />
                      <span className="priority-badge_man" data-priority={resource.priority}>
                        {resource.priority}
                      </span>
                    </div>
                    <div className="card-body_man">
                      <span className="skill-tag_man">{resource.skillName}</span>
                      <h3>{resource.videoTitle}</h3>
                      <div className="card-meta_man">
                        <span className="meta-chip_man">
                          <span className="material-icons-round">calendar_today</span>
                          {new Date(resource.scheduledTime).toLocaleDateString()}
                        </span>
                        <span className="meta-chip_man">
                          <span className="material-icons-round">schedule</span>
                          {new Date(resource.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {resource.notes && (
                        <p className="card-notes_man">"{resource.notes}"</p>
                      )}
                      <div className="card-actions_man">
                        {isYoutube(resource.videoUrl) ? (
                          <button className="watch-btn_man" onClick={() => setSelectedVideo({ url: resource.videoUrl, title: resource.videoTitle })}>
                            <span className="material-icons-round">play_circle</span>
                            Watch Now
                          </button>
                        ) : (
                          <button className="open-btn_man" onClick={() => window.open(resource.videoUrl, '_blank')}>
                            <span className="material-icons-round">open_in_new</span>
                            Open Link
                          </button>
                        )}
                        <button className="edit-action-btn" onClick={() => startEditing(resource)}>
                          <span className="material-icons-round">edit</span>
                          Edit
                        </button>
                        <button className="delete-btn_man" onClick={() => handleDelete(resource._id)}>
                          <span className="material-icons-round">delete_outline</span>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── VIDEO MODAL ── */}
        {selectedVideo && (
          <div className="video-modal_ytres" style={{ zIndex: 999999 }} onClick={() => setSelectedVideo(null)}>
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

        {/* ── UPDATE MODAL ── */}
        {editingId && (
          <div className="modal-overlay_resave" onClick={() => setEditingId(null)}>
            <div className="modal-panel_resave" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header_resave">
                <h2>
                  <span className="material-icons-round">edit_calendar</span>
                  Update Plan
                </h2>
                <button className="close-btn_resave" onClick={() => setEditingId(null)}>
                  <span className="material-icons-round">close</span>
                </button>
              </div>

              <div className="modal-body_resave">
                <form onSubmit={handleUpdate} className="save-form_resave">
                  
                  <div className="form-group_resave">
                    <label>
                      <span className="material-icons-round">event</span>
                      Update Schedule
                    </label>
                    <input 
                      type="datetime-local" 
                      name="scheduledTime"
                      value={editFormData.scheduledTime}
                      onChange={handleEditChange}
                      required
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>

                  <div className="form-group_resave">
                    <label>
                      <span className="material-icons-round">flag</span>
                      Priority
                    </label>
                    <div className="priority-options_resave">
                      {['Low', 'Medium', 'High'].map(p => (
                        <button
                          key={p}
                          type="button"
                          data-val={p}
                          className={`priority-option_resave${editFormData.priority === p ? ' selected_resave' : ''}`}
                          onClick={() => setEditFormData(prev => ({ ...prev, priority: p }))}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group_resave">
                    <label>
                      <span className="material-icons-round">notes</span>
                      Notes (Max 500 characters)
                    </label>
                    <textarea 
                      name="notes"
                      value={editFormData.notes}
                      onChange={handleEditChange}
                      placeholder="Add any notes here..."
                      rows="3"
                      maxLength="500"
                    />
                  </div>

                  {updateMessage && (
                    <div className={`message-banner_resave ${updateMessage.type}_resave`}>
                      <span className="material-icons-round">
                        {updateMessage.type === 'success' ? 'check_circle' : 'error_outline'}
                      </span>
                      {updateMessage.text}
                    </div>
                  )}

                  <button type="submit" className="submit-btn_resave" disabled={updateLoading}>
                    <span className="material-icons-round">{updateLoading ? 'hourglass_top' : 'save'}</span>
                    {updateLoading ? 'Updating...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default ResourcesManage;
