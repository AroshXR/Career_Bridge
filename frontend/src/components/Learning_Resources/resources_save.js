import React, { useState } from 'react';
import axios from 'axios';
import './resources_save.css';
import API_BASE_URL from '../../apiConfig';

const ResourcesSave = ({ resource, onClose, skillName }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const [formData, setFormData] = useState({
    userId: user?._id || user?.id || '',
    userEmail: user?.email || '',
    scheduledTime: '',
    priority: 'Medium',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const setPriority = (val) => {
    setFormData(prev => ({ ...prev, priority: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const token = localStorage.getItem('token');
    const payload = {
      ...formData,
      skillId: '65dabcdef123456789012345',
      skillName: skillName || 'Skill',
      videoTitle: resource.title,
      videoUrl: resource.videoUrl,
      thumbnail: resource.thumbnail
    };
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(`${API_BASE_URL}/api/v1/resources/save-resource`, payload, config);
      setMessage({ type: 'success', text: response.data.message || 'Resource saved successfully!' });
      setTimeout(() => { onClose(); }, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.error?.errorDescription || error.response?.data?.message || 'Failed to save resource';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay_resave" onClick={onClose}>
      <div className="modal-panel_resave" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header_resave">
          <h2>
            <span className="material-icons-round">bookmark_add</span>
            Save Resource
          </h2>
          <button className="close-btn_resave" onClick={onClose}>
            <span className="material-icons-round">close</span>
          </button>
        </div>

        <div className="modal-body_resave">
          {/* Resource preview */}
          <div className="preview-strip_resave">
            <img
              className="preview-thumb_resave"
              src={resource.thumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop`}
              alt={resource.title}
            />
            <p className="preview-title_resave">{resource.title}</p>
          </div>

          {/* Message banner */}
          {message && (
            <div className={`message-banner_resave ${message.type}_resave`}>
              <span className="material-icons-round">
                {message.type === 'success' ? 'check_circle' : 'error_outline'}
              </span>
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="save-form_resave">

            <div className="form-group_resave">
              <label>
                <span className="material-icons-round">email</span>
                Email Address
              </label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group_resave">
              <label>
                <span className="material-icons-round">event</span>
                Schedule Reminder
              </label>
              <input
                type="datetime-local"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleChange}
                required
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
                    className={`priority-option_resave${formData.priority === p ? ' selected_resave' : ''}`}
                    onClick={() => setPriority(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group_resave">
              <label>
                <span className="material-icons-round">notes</span>
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any notes here..."
                rows="3"
              />
            </div>

            <button type="submit" className="submit-btn_resave" disabled={loading}>
              <span className="material-icons-round">{loading ? 'hourglass_top' : 'save'}</span>
              {loading ? 'Saving...' : 'Confirm Save'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResourcesSave;
