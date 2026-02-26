import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./dashboardUser.css";

const DashboardUser = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    age: "",
    industrialPreference: [],
    background: "",
    university: "",
    cv: "",
    profilePicture: "",
    portfolio: "",
    github: "",
    linkedin: ""
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!savedUser || !token) {
      navigate("/login");
      return;
    }
    setUser(savedUser);
    fetchUser(savedUser._id);
  }, [navigate]);

  const fetchUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/v1/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data) {
        setUser(response.data);
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          birthday: response.data.birthday ? response.data.birthday.split("T")[0] : "",
          age: response.data.age || "",
          industrialPreference: Array.isArray(response.data.industrialPreference)
            ? response.data.industrialPreference
            : (response.data.industrialPreference ? response.data.industrialPreference.split(",").map(s => s.trim()) : []),
          background: response.data.background || "",
          university: response.data.university || "",
          cv: response.data.cv || "",
          profilePicture: response.data.profilePicture || "",
          portfolio: response.data.portfolio || "",
          github: response.data.github || "",
          linkedin: response.data.linkedin || ""
        });
        setPreviewImage(response.data.profilePicture || "");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/upload/profile-picture/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (response.data.imageUrl) {
        setPreviewImage(response.data.imageUrl);
        setFormData((prev) => ({
          ...prev,
          profilePicture: response.data.imageUrl,
        }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("cv", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/upload/cv/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`
          },

        }
      );

      if (response.data.cvUrl) {
        setFormData((prev) => ({
          ...prev,
          cv: response.data.cvUrl,
        }));
        alert("CV uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading CV:", error);
      alert("Failed to upload CV");
    } finally {
      setUploading(false);
    }
  };

  const calculateAge = (birthday) => {
    if (!birthday) return "";
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Calculate age from birthday
      const calculatedAge = formData.birthday ? calculateAge(formData.birthday) : formData.age;

      // Prepare data for update
      const updateData = {
        name: formData.name,
        phone: formData.phone || undefined,
        birthday: formData.birthday || undefined,
        age: calculatedAge || undefined,
        industrialPreference: formData.industrialPreference.filter(s => s), // Remove empty strings
        background: formData.background || undefined,
        university: formData.university || undefined,
        cv: formData.cv || undefined,
        profilePicture: previewImage || formData.profilePicture || undefined,
        portfolio: formData.portfolio || undefined,
        github: formData.github || undefined,
        linkedin: formData.linkedin || undefined
      };

      // Remove undefined fields
      Object.keys(updateData).forEach(key =>
        updateData[key] === undefined && delete updateData[key]
      );

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/v1/users/${user._id}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (response.data) {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        setShowModal(false);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    // Show confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/v1/users/${user._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Clear local storage
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // Redirect to login
      navigate("/login");

    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    }
  };


  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="div29_user_dashboard">
      {/* LEFT PANEL - profile + details */}
      <div className="div33_left_profile">
        <div className="div41_photo_wrap">
          <img
            src={user.profilePicture || "https://via.placeholder.com/150"}
            alt="profile"
            className="img7_profile_avatar"
          />
        </div>

        <div className="div54_user_meta">
          <h2 className="h2_user_name">{user.name}</h2>
          <span className="p_user_id">ID: {user.userId}</span>
        </div>

        {/* detail bars */}
        <div className="form12_details_bars">
          <div className="div65_detail_bar">
            <span className="span18_label">Email</span>
            <span className="span19_value">{user.email}</span>
          </div>
          <div className="div65_detail_bar">
            <span className="span18_label">Phone</span>
            <span className="span19_value">{user.phone || "Not set"}</span>
          </div>
          <div className="div65_detail_bar">
            <span className="span18_label">Birthday</span>
            <span className="span19_value">
              {user.birthday ? new Date(user.birthday).toLocaleDateString() : "Not set"}
            </span>
          </div>
          <div className="div65_detail_bar">
            <span className="span18_label">Age</span>
            <span className="span19_value">{user.age || "Not set"}</span>
          </div>
          <div className="div65_detail_bar">
            <span className="span18_label">University</span>
            <span className="span19_value">{user.university || "Not set"}</span>
          </div>
          <div className="div65_detail_bar">
            <span className="span18_label">Background</span>
            <span className="span19_value">{user.background || "Not set"}</span>
          </div>
          <div className="div65_detail_bar">
            <span className="span18_label">Skills</span>
            <span className="span19_value">
              {Array.isArray(user.industrialPreference)
                ? user.industrialPreference.join(", ")
                : user.industrialPreference || "None"}
            </span>
          </div>
          {user.portfolio && (
            <div className="div65_detail_bar">
              <span className="span18_label">Portfolio</span>
              <a href={user.portfolio} target="_blank" rel="noopener noreferrer" className="span19_value link">
                View Portfolio
              </a>
            </div>
          )}
          {user.github && (
            <div className="div65_detail_bar">
              <span className="span18_label">GitHub</span>
              <a href={user.github} target="_blank" rel="noopener noreferrer" className="span19_value link">
                GitHub Profile
              </a>
            </div>
          )}
          {user.linkedin && (
            <div className="div65_detail_bar">
              <span className="span18_label">LinkedIn</span>
              <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="span19_value link">
                LinkedIn Profile
              </a>
            </div>
          )}
          {user.cv && (
            <div className="div65_detail_bar">
              <span className="span18_label">CV</span>
              <a href={user.cv} target="_blank" rel="noopener noreferrer" className="span19_value link">
                View CV
              </a>
            </div>
          )}
        </div>

        <div className="button_group">
          <button
            className="button8_update_profile"
            onClick={() => setShowModal(true)}
          >
            Update Profile
          </button>
          <button
            className="button8_logout"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            className="button8_delete_account"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* RIGHT PANEL - four clickable cards */}
      <div className="div90_right_grid">
        {/* Recent Activity Card */}
        <Link
          to="/recent-activity"
          className="dashboard_card card_recent_activity"
        >
          <h4 className="h4_section_title">📋 Recent Activity</h4>
          <div className="recent_activity_list">
            <div className="recent_activity_item">
              <span>Today</span> Viewed 3 jobs
            </div>
            <div className="recent_activity_item">
              <span>Yesterday</span> Applied to Frontend Dev
            </div>
          </div>
          <div className="view_all_link">View all activity →</div>
        </Link>

        {/* Recommended Card */}
        <Link to="/recommended" className="dashboard_card card_recommended">
          <h4 className="h4_section_title">⚡ Recommended for You</h4>
          <div className="recommended_skills">
            {(user.industrialPreference || ["React.js", "Node.js"]).map((skill, idx) => (
              <span key={idx} className="skill_tag">{skill}</span>
            ))}
          </div>
          <div className="view_all_link">See all recommendations →</div>
        </Link>

        {/* Progress Tracking Card */}
        <Link to="/progress" className="dashboard_card card_progress">
          <h4 className="h4_section_title">📊 Progress Tracking</h4>
          <div className="div113_progress_container">
            <div className="div114_progress_stat">
              <span>Profile completeness</span>
              <span>{calculateProfileCompleteness(user)}%</span>
            </div>
            <div className="progress17_bar_full">
              <div
                className="progress18_fill"
                style={{ width: `${calculateProfileCompleteness(user)}%` }}
              ></div>
            </div>
          </div>
          <div className="view_all_link">View detailed progress →</div>
        </Link>

        {/* Saved Jobs Card */}
        <Link to="/saved-jobs" className="dashboard_card card_saved_jobs">
          <h4 className="h4_section_title">🔖 Saved Jobs</h4>
          <ul className="ul22_saved_jobs">
            <li className="li23_job_item">
              <span className="span24_job_badge">Full-time</span>
              Software Engineer
            </li>
          </ul>
          <div className="view_all_link">View all saved jobs →</div>
        </Link>
      </div>

      {/* Profile Update Modal */}
      {showModal && (
        <div className="modal_overlay">
          <div className="modal_content modal_content_large">
            <div className="modal_header">
              <h2>Update Profile</h2>
              <button
                className="modal_close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="profile_form">
              {/* Profile Picture Upload */}
              <div className="form_group photo_upload_group">
                <label>Profile Photo</label>
                <div className="photo_upload_container">
                  <img
                    src={previewImage || "https://via.placeholder.com/150"}
                    alt="Preview"
                    className="photo_preview"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="photo_input"
                    id="photo-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="photo-upload" className="photo_upload_label">
                    {uploading ? "Uploading..." : "Choose Image"}
                  </label>
                </div>
              </div>

              <div className="form_row">
                <div className="form_group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form_group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
              </div>

              <div className="form_row">
                <div className="form_group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div className="form_group">
                  <label>Birthday</label>
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form_row">
                <div className="form_group">
                  <label>University</label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    placeholder="University of Colombo"
                  />
                </div>
                <div className="form_group">
                  <label>Background/Field</label>
                  <input
                    type="text"
                    name="background"
                    value={formData.background}
                    onChange={handleInputChange}
                    placeholder="Computer Science"
                  />
                </div>
              </div>

              <div className="form_group full_width">
                <label>Skills (comma separated)</label>
                <input
                  type="text"
                  name="industrialPreference"
                  value={formData.industrialPreference.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      industrialPreference: e.target.value.split(",").map((s) => s.trim()).filter(s => s),
                    })
                  }
                  placeholder="React.js, Node.js, MongoDB"
                />
              </div>

              <div className="form_row">
                <div className="form_group">
                  <label>Portfolio URL</label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
                <div className="form_group">
                  <label>GitHub URL</label>
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>

              <div className="form_row">
                {/* LinkedIn Field */}
                <div className="form_group">
                  <label>LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                {/* CV Upload Field - Now in the same row */}
                <div className="form_group">
                  <label>CV/Resume</label>
                  <div className="cv_upload_container">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCVUpload}
                      className="cv_input"
                      id="cv-upload"
                      disabled={uploading}
                    />
                    <label htmlFor="cv-upload" className="cv_upload_label">
                      {uploading ? "Uploading..." : " Upload CV"}
                    </label>
                    {formData.cv && (
                      <a href={formData.cv} target="_blank" rel="noopener noreferrer" className="view_cv_link">
                        View
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal_footer">
                <button
                  type="button"
                  className="cancel_btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save_btn" disabled={uploading}>
                  {uploading ? "Uploading..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to calculate profile completeness
const calculateProfileCompleteness = (user) => {
  const fields = [
    'profilePicture', 'phone', 'birthday', 'university', 'background',
    'industrialPreference', 'portfolio', 'github', 'linkedin', 'cv'
  ];

  const filledFields = fields.filter(field => {
    const value = user[field];
    if (!value) return false;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  });

  return Math.round((filledFields.length / fields.length) * 100);
};

export default DashboardUser;