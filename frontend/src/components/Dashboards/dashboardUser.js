import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./dashboardUser.css";

const UserDashboard = () => {
  // dummy user data
  const [user, setUser] = useState({
    name: "Alex Morgan",
    id: "USR-8246",
    email: "a.morgan@skillpath.dev",
    memberSince: "2024",
    profilePic: "https://via.placeholder.com/150/4f7df3/ffffff?text=AM",
    savedJobsCount: 8,
    progress: 68,
    // Additional profile fields
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    title: "Senior Frontend Developer",
    skills: ["React", "TypeScript", "UI/UX"],
    experience: "5 years",
    education: "M.S. Computer Science",
    portfolio: "https://alexmorgan.dev",
    github: "https://github.com/alexmorgan",
    linkedin: "https://linkedin.com/in/alexmorgan",
    bio: "Passionate frontend developer with 5+ years of experience building responsive web applications.",
  });

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [previewImage, setPreviewImage] = useState(user.profilePic);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData((prev) => ({
          ...prev,
          profilePic: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(formData);
    setShowModal(false);
  };

  return (
    <div className="div29_user_dashboard">
      {/* LEFT PANEL - profile + details */}
      <div className="div33_left_profile">
        <div className="div41_photo_wrap">
          <img
            src={user.profilePic}
            alt="profile"
            className="img7_profile_avatar"
          />
        </div>

        <div className="div54_user_meta">
          <h2 className="h2_user_name">{user.name}</h2>
          <span className="p_user_id">ID: {user.id}</span>
        </div>

        {/* detail bars */}
        <div className="form12_details_bars">
          <div className="div65_detail_bar">
            <span className="span18_label">Email</span>
            <span className="span19_value">{user.email}</span>
          </div>
          <div className="div65_detail_bar">
            <span className="span18_label">Phone</span>
            <span className="span19_value">{user.phone}</span>
          </div>
          <div className="div65_detail_bar">
            <span className="span18_label">Location</span>
            <span className="span19_value">{user.location}</span>
          </div>
          <div className="div65_detail_bar">
            <span className="span18_label">Title</span>
            <span className="span19_value">{user.title}</span>
          </div>
          <div className="div65_detail_bar">
            <span className="span18_label">Since</span>
            <span className="span19_value">{user.memberSince}</span>
          </div>
          <div className="div65_detail_bar">
            <span className="span18_label">Jobs saved</span>
            <span className="span19_value">{user.savedJobsCount}</span>
          </div>
        </div>

        <button
          className="button8_update_profile"
          onClick={() => setShowModal(true)}
        >
          ✎ Update profile
        </button>
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
            <div className="recent_activity_item">
              <span>2 days ago</span> Updated profile
            </div>
          </div>
          <div className="view_all_link">View all activity →</div>
        </Link>

        {/* Recommended Card */}
        <Link to="/recommended" className="dashboard_card card_recommended">
          <h4 className="h4_section_title">⚡ Recommended for You</h4>
          <p style={{ marginBottom: "1rem", color: "#2c3e6d" }}>
            Based on your skills and interests:
          </p>
          <div className="recommended_skills">
            <span className="skill_tag">React.js</span>
            <span className="skill_tag">UI/UX Design</span>
            <span className="skill_tag">TypeScript</span>
            <span className="skill_tag">Node.js</span>
          </div>
          <div className="view_all_link">See all recommendations →</div>
        </Link>

        {/* Progress Tracking Card */}
        <Link to="/progress" className="dashboard_card card_progress">
          <h4 className="h4_section_title">📊 Progress Tracking</h4>
          <div className="div113_progress_container">
            <div className="div114_progress_stat">
              <span>Profile completeness</span>
              <span>{user.progress}%</span>
            </div>
            <div className="progress17_bar_full">
              <div
                className="progress18_fill"
                style={{ width: `${user.progress}%` }}
              ></div>
            </div>
            <div className="div114_progress_stat">
              <span>Applications</span>
              <span>2/5 completed</span>
            </div>
            <div className="progress17_bar_full">
              <div className="progress18_fill" style={{ width: "40%" }}></div>
            </div>
            <p
              style={{
                fontSize: "0.95rem",
                marginTop: "1rem",
                color: "#314d8c",
              }}
            >
              Next milestone: Add portfolio
            </p>
          </div>
          <div className="view_all_link">View detailed progress →</div>
        </Link>

        {/* Saved Jobs Card */}
        <Link to="/saved-jobs" className="dashboard_card card_saved_jobs">
          <h4 className="h4_section_title">🔖 Saved Jobs</h4>
          <ul className="ul22_saved_jobs">
            <li className="li23_job_item">
              <span className="span24_job_badge">Full-time</span>
              Senior React Dev · TechCorp
            </li>
            <li className="li23_job_item">
              <span className="span24_job_badge">Remote</span>
              Product Designer · DesignStudio
            </li>
            <li className="li23_job_item">
              <span className="span24_job_badge">Intern</span>
              Junior ML Engineer · AI Labs
            </li>
          </ul>
          <div className="view_all_link">View all saved jobs →</div>
        </Link>
      </div>

      {/* Profile Update Modal */}
      {showModal && (
        <div className="modal_overlay">
          <div className="modal_content">
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
                    src={previewImage}
                    alt="Preview"
                    className="photo_preview"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="photo_input"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="photo_upload_label">
                    Choose Image
                  </label>
                </div>
              </div>

              {/* Form Fields - 2 column layout */}
              <div className="form_row">
                <div className="form_group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form_group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
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
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="form_group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="form_row">
                <div className="form_group">
                  <label>Professional Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Senior Developer"
                  />
                </div>

                <div className="form_group">
                  <label>Experience</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                  >
                    <option value="0-2 years">0-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-8 years">5-8 years</option>
                    <option value="8+ years">8+ years</option>
                  </select>
                </div>
              </div>

              <div className="form_row">
                <div className="form_group">
                  <label>Education</label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    placeholder="Highest degree"
                  />
                </div>

                <div className="form_group">
                  <label>Skills (comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        skills: e.target.value.split(",").map((s) => s.trim()),
                      })
                    }
                    placeholder="React, Node.js, Python"
                  />
                </div>
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

                <div className="form_group">
                  <label>Upload CV (PDF)</label>
                  <div className="cv_upload_container">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCVUpload}
                      className="cv_input"
                      id="cv-upload"
                    />
                    <label htmlFor="cv-upload" className="cv_upload_label">
                      <span className="cv_upload_icon">📄</span>
                      Choose CV File
                    </label>
                    {formData.cvName && (
                      <div className="cv_file_info">
                        <span className="cv_file_name">{formData.cvName}</span>
                        <button
                          type="button"
                          className="cv_remove_btn"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              cvFile: null,
                              cvName: "",
                            })
                          }
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form_group full_width">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>

              <div className="modal_footer">
                <button
                  type="button"
                  className="cancel_btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save_btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;


//dashboard