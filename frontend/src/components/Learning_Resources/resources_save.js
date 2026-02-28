import React, { useState } from 'react';
import axios from 'axios';
import './resources_save.css';

const ResourcesSave = ({ resource, onClose, skillName }) => {
  const [formData, setFormData] = useState({
    userId: '65d1234567890abcdef12345', // Dummy MongoDB ObjectId for now
    userEmail: 'user@example.com',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      ...formData,
      skillId: '65dabcdef123456789012345', // Dummy skillId
      skillName: skillName || 'Skill',
      videoTitle: resource.title,
      videoUrl: resource.videoUrl,
      thumbnail: resource.thumbnail
    };

    try {
      const response = await axios.post('http://localhost:5000/api/v1/resources/save-resource', payload);
      setMessage({ type: 'success', text: response.data.message });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Save Error:", error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save resource' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="save-modal_overlay_ressave">
      <div className="save-modal_content_ressave">
        <button className="save-close_btn_ressave" onClick={onClose}>×</button>
        <h2>Save Resource</h2>
        <div className="resource-preview_save_ressave">
          <img src={resource.thumbnail} alt={resource.title} />
          <p>{resource.title}</p>
        </div>

        {message && (
          <div className={`message_save_ressave ${message.type}_save_ressave`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="save-form_learn_ressave">
          <div className="form-group_save_ressave">
            <label>Email Address</label>
            <input
              type="email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group_save_ressave">
            <label>Schedule Time (Reminder)</label>
            <input
              type="datetime-local"
              name="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group_save_ressave">
            <label>Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="form-group_save_ressave">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes here..."
              rows="3"
            ></textarea>
          </div>
          <button type="submit" className="submit-save_btn_ressave" disabled={loading}>
            {loading ? 'Saving...' : 'Confirm Save'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResourcesSave;
