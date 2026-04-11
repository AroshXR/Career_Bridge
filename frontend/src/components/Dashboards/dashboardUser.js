import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./dashboardUser.css";
import Footer from "../Common/Footer";
import Header from "../Common/Navbar";
import API_BASE_URL from "../../apiConfig";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Dynamic dashboard states
  const [progressData, setProgressData] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, time: "Today", text: "Logged into dashboard" },
    { id: 2, time: "Yesterday", text: "Updated profile details" }
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      let userId;
      const storedUserStr = localStorage.getItem("user");
      if (storedUserStr) {
        const storedUser = JSON.parse(storedUserStr);
        userId = storedUser._id;
      } else {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          userId = payload.id;
        } catch {
          console.error("Could not decode token payload");
          return;
        }
      }

      if (!userId) return;

      const response = await fetch(
        `${API_BASE_URL}/api/v1/users/${userId}`,
        {
          headers: { "Authorization": `Bearer ${token}` }
        }
      );
      const data = await response.json();

      const userData = data.data || data;
      setUser(userData);
      setFormData(userData);
      setPreviewImage(userData.profilePicture || "/default-avatar.png");
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchDashboardData(user._id);
    }
  }, [user]);

  const fetchDashboardData = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Fetch Progress
      const progressRes = await fetch(`${API_BASE_URL}/api/v1/progress/user/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (progressRes.ok) {
        const pData = await progressRes.json();
        setProgressData(pData.data || []);
      }

      // Fetch Saved Jobs
      const jobsRes = await fetch(`${API_BASE_URL}/api/v1/trendingJobAnalyzer/getSavedJobs`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (jobsRes.ok) {
        const jData = await jobsRes.json();
        // Backend returns { jobs: [...], count: ... } for getSavedJobs
        const jobsArray = jData.data?.jobs || jData.data || [];
        setSavedJobs(Array.isArray(jobsArray) ? jobsArray : []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  if (!user) {
    return <div style={{ padding: "2rem", textAlign: "center", fontSize: "1.2rem", fontWeight: "bold" }}>Loading profile...</div>;
  }

  const handleCVUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert CV to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          cv: reader.result,
          cvName: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

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
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateMessage(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Prepare data to send
      const dataToSend = {
        phone: formData.phone || "",
        education: formData.education || "",
        experience: formData.experience || "",
        location: formData.location || "",
        title: formData.title || "",
        bio: formData.bio || "",
        portfolio: formData.portfolio || "",
        github: formData.github || "",
        linkedin: formData.linkedin || "",
        profilePicture: formData.profilePicture || user.profilePicture || "",
        cv: formData.cv || user.cv || "",
      };

      console.log("📤 Sending update data:", dataToSend);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/users/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const updatedData = await response.json();
      const updatedUser = updatedData.data || updatedData;

      // Keep original name and email
      updatedUser.name = user.name;
      updatedUser.email = user.email;

      setUser(updatedUser);
      setFormData(updatedUser);

      console.log("✅ Profile updated successfully!");
      setUpdateMessage({ type: "success", text: "Profile updated successfully!" });

      setTimeout(() => {
        setShowModal(false);
        setUpdateMessage(null);
      }, 1500);

    } catch (error) {
      console.error("❌ Error updating user:", error);
      setUpdateMessage({ type: "error", text: error.message || "Failed to update profile" });
    } finally {
      setUpdating(false);
    }
  };



  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/v1/users/${user._id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      console.log("🗑️ Account deleted successfully");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/register");
    } catch (error) {
      console.error("❌ Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  const handleCVGenerator = () => {
    navigate("/cv-generator");
  };

  const handleViewCV = () => {
    if (user.cv) {
      window.open(user.cv, '_blank');
    } else {
      alert("No CV uploaded yet. Please upload your CV in the update profile section.");
    }
  };

  return (
    <div className="user-dashboard-wrapper">
      <Header />

      <div className="div29_user_dashboard">
        {/* LEFT PANEL - profile + details */}
        <div className="div33_left_profile">
          <div className="div41_photo_wrap">
            <img
              src={user.profilePicture || "/default-avatar.png"}
              referrerPolicy="no-referrer"
              onError={(e) => { e.target.src = "/default-avatar.png"; }}
              alt="profile"
              className="img7_profile_avatar"
            />
          </div>

          <div className="div54_user_meta">
            <h2 className="h2_user_name">{user.name}</h2>
            <span className="p_user_id">ID: {user.userId || user._id}</span>
          </div>

          <div className="form12_details_bars">
            <div className="div65_detail_bar">
              <span className="span18_label">Email</span>
              <span className="span19_value">{user.email || "Not provided"}</span>
            </div>
            <div className="div65_detail_bar">
              <span className="span18_label">Phone</span>
              <span className="span19_value">{user.phone || "Not provided"}</span>
            </div>
            <div className="div65_detail_bar">
              <span className="span18_label">Education</span>
              <span className="span19_value">{user.education || "Not provided"}</span>
            </div>
            <div className="div65_detail_bar">
              <span className="span18_label">Experience</span>
              <span className="span19_value">{user.experience || "Not provided"}</span>
            </div>
            <div className="div65_detail_bar">
              <span className="span18_label">CV / Resume</span>
              <span
                className="span19_value"
                style={{ cursor: user.cv ? "pointer" : "default", color: user.cv ? "#007bff" : "#666" }}
                onClick={handleViewCV}
              >
                {user.cv ? "📄 View CV" : "Not uploaded"}
              </span>
            </div>
          </div>

          <button
            className="button8_update_profile"
            onClick={() => setShowModal(true)}
          >
            Update profile
          </button>

          {/* CV Generator Button */}
          <button
            className="button9_cv_generator"
            onClick={handleCVGenerator}
          >
            Generate CV
          </button>

          {/* Delete Account Button */}
          <button
            className="button11_delete_account"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Account
          </button>
        </div>

        {/* RIGHT PANEL - four clickable cards */}
        <div className="div90_right_grid">
          <Link
            to="/recent-activity"
            className="dashboard_card card_recent_activity"
          >
            <h4 className="h4_section_title">📋 Recent Activity</h4>
            <div className="recent_activity_list">
              {recentActivities.map(activity => (
                <div key={activity.id} className="recent_activity_item">
                  <span>{activity.time}</span> {activity.text}
                </div>
              ))}
            </div>
            <div className="view_all_link">View all activity →</div>
          </Link>

          <Link to="/recommended" className="dashboard_card card_recommended">
            <h4 className="h4_section_title">✨ Recommended for You</h4>
            <p style={{ marginBottom: "1rem", color: "#2c3e6d" }}>
              Based on your skills:
            </p>
            <div className="recommended_skills">
              <span className="skill_tag">Meta Front-End Developer</span>
              <span className="skill_tag">Complete Python Bootcamp</span>
              <span className="skill_tag">AWS Cloud Practitioner</span>
            </div>
            <div className="view_all_link">See all recommendations →</div>
          </Link>

          <Link to="/progress" className="dashboard_card card_progress">
            <h4 className="h4_section_title">📊 Progress Tracking</h4>
            <div className="div113_progress_container">
              {progressData.length > 0 ? (
                progressData.slice(0, 3).map((prog, idx) => (
                  <div key={prog._id || idx} style={{ marginBottom: "1rem" }}>
                    <div className="div114_progress_stat">
                      <span>{prog.skillName}</span>
                      <span>{prog.progressPercentage || 0}%</span>
                    </div>
                    <div className="progress17_bar_full">
                      <div
                        className="progress18_fill"
                        style={{ width: `${prog.progressPercentage || 0}%`, background: prog.progressPercentage === 100 ? '#27ae60' : '#6c5ce7' }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "20px 0", color: "#666", textAlign: "center" }}>
                  <span>No follow up courses yet</span>
                </div>
              )}
            </div>
            <div className="view_all_link">View detailed progress →</div>
          </Link>

          <Link to="/saved-jobs" className="dashboard_card card_saved_jobs">
            <h4 className="h4_section_title">🔖 Saved Jobs</h4>
            <ul className="ul22_saved_jobs">
              {savedJobs.length > 0 ? (
                savedJobs.slice(0, 3).map((job, idx) => (
                  <li key={job.jobId || idx} className="li23_job_item" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <span className="span24_job_badge">{job.workMode || job.location || "Job"}</span>
                    {job.title || job.jobTitle} · {job.company || job.companyName}
                  </li>
                ))
              ) : (
                <div style={{ padding: "20px 0", color: "#666", textAlign: "center" }}>
                  <span>No saved jobs</span>
                </div>
              )}
            </ul>
            <div className="view_all_link">View all saved jobs →</div>
          </Link>
        </div>

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="modal_overlay">
            <div className="modal_content" style={{ maxWidth: "400px" }}>
              <div className="modal_header">
                <h2>Delete Account</h2>
                <button
                  className="modal_close"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  ×
                </button>
              </div>
              <div style={{ padding: "20px", textAlign: "center" }}>
                <p style={{ marginBottom: "20px", color: "#e74c3c", fontSize: "18px" }}>
                  ⚠️ Warning: This action cannot be undone!
                </p>
                <p style={{ marginBottom: "20px" }}>
                  Are you sure you want to permanently delete your account? All your data will be lost.
                </p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#95a5a6",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#e74c3c",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Yes, Delete My Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Update Modal */}
        {showModal && formData && (
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

              {/* Success/Error Message */}
              {updateMessage && (
                <div className={`update-message ${updateMessage.type}`} style={{
                  padding: "10px",
                  marginBottom: "15px",
                  borderRadius: "4px",
                  backgroundColor: updateMessage.type === "success" ? "#d4edda" : "#f8d7da",
                  color: updateMessage.type === "success" ? "#155724" : "#721c24",
                  border: `1px solid ${updateMessage.type === "success" ? "#c3e6cb" : "#f5c6cb"}`
                }}>
                  {updateMessage.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="profile_form">
                {/* Profile Picture Upload */}
                <div className="form_group photo_upload_group">
                  <label>Profile Photo</label>
                  <div className="photo_upload_container">
                    <img
                      src={previewImage || user.profilePicture || "/default-avatar.png"}
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.target.src = "/default-avatar.png"; }}
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

                {/* Name and Email - Read Only */}
                <div className="form_row">
                  <div className="form_group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={user.name || ""}
                      disabled
                      style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
                    />
                  </div>

                  <div className="form_group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={user.email || ""}
                      disabled
                      style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
                    />
                  </div>
                </div>

                {/* Phone and Location */}
                <div className="form_row">
                  <div className="form_group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      pattern="[0-9]{10}"
                      maxLength="10"
                    />
                  </div>

                  <div className="form_group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location || ""}
                      onChange={handleInputChange}
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                {/* Education and Experience */}
                <div className="form_row">
                  <div className="form_group">
                    <label>Education</label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education || ""}
                      onChange={handleInputChange}
                      placeholder="e.g., B.Sc. Computer Science"
                      pattern="[A-Za-z\s]+"
                    />
                  </div>

                  <div className="form_group">
                    <label>Experience</label>
                    <select
                      name="experience"
                      value={formData.experience || ""}
                      onChange={handleInputChange}
                    >
                      <option value="">Select experience level</option>
                      <option value="0-2 years">0-2 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5-8 years">5-8 years</option>
                      <option value="8+ years">8+ years</option>
                    </select>
                  </div>
                </div>

                {/* Title and Skills */}
                <div className="form_row">
                  <div className="form_group">
                    <label>Professional Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title || ""}
                      onChange={handleInputChange}
                      placeholder="e.g., Senior Developer"
                      pattern="[A-Za-z\s]+"
                    />
                  </div>

                  <div className="form_group">
                    <label>Skills (comma separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={(formData.industrialPreference || []).join(", ")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          industrialPreference: e.target.value.split(",").map((s) => s.trim()).filter(s => s),
                        })
                      }
                      placeholder="React, Node.js, Python"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="form_row">
                  <div className="form_group">
                    <label>Portfolio URL</label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio || ""}
                      onChange={handleInputChange}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>

                  <div className="form_group">
                    <label>GitHub URL</label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github || ""}
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
                      value={formData.linkedin || ""}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div className="form_group">
                    <label>CV / Resume</label>
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
                        {formData.cv ? "Update CV" : "Upload CV"}
                      </label>
                      {formData.cv && (
                        <div className="cv_file_info">
                          <span className="cv_file_name">✓ CV uploaded</span>
                          <button
                            type="button"
                            className="cv_view_btn"
                            onClick={() => window.open(formData.cv, '_blank')}
                            style={{
                              marginLeft: "10px",
                              padding: "2px 8px",
                              backgroundColor: "#007bff",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px"
                            }}
                          >
                            View
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="form_group full_width">
                  <label>Bio / About Me</label>
                  <textarea
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Tell us about yourself, your experience, and career goals..."
                  ></textarea>
                </div>

                <div className="modal_footer">
                  <button
                    type="button"
                    className="cancel_btn"
                    onClick={() => setShowModal(false)}
                    disabled={updating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save_btn"
                    disabled={updating}
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      <Footer />

    </div>
  );
};

export default UserDashboard;