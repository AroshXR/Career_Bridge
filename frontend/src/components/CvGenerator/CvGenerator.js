import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatePDF, saveCV, loadSavedCV, importFromGitHub } from '../../services/cvService';
import './CvGenerator.css';

const CvGenerator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [cvData, setCvData] = useState({
    personal: {
      name: '',
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      portfolio: '',
      summary: ''
    },
    education: [],
    experience: [],
    skills: [],
    languages: [],
    certifications: [],
    projects: [],
    achievements: []
  });

  // Load saved CV data on mount
  useEffect(() => {
    const fetchSavedCV = async () => {
      const saved = await loadSavedCV();
      if (saved) {
        setCvData(saved);
      }
    };
    fetchSavedCV();
  }, []);

  // Handle personal info changes
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setCvData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [name]: value
      }
    }));
  };

  // Handle GitHub import
  const handleGitHubImport = async () => {
    if (!cvData.personal.github) {
      alert('Please enter your GitHub username');
      return;
    }

    setLoading(true);
    try {
      // Extract username from URL or use as is
      const username = cvData.personal.github.split('/').pop() || cvData.personal.github;
      const githubData = await importFromGitHub(username);
      
      setCvData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          ...githubData.personal
        },
        skills: githubData.skills || prev.skills,
        projects: githubData.projects || prev.projects
      }));
      
      alert('GitHub data imported successfully!');
    } catch (error) {
      alert('Failed to import GitHub data. Please fill manually.');
    } finally {
      setLoading(false);
    }
  };

  // Handle PDF generation
  const handleGeneratePDF = async () => {
    if (!cvData.personal.name || !cvData.personal.email) {
      alert('Please fill in your name and email at minimum');
      return;
    }

    setLoading(true);
    try {
      await generatePDF(cvData);
    } catch (error) {
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!cvData.personal.name || !cvData.personal.email) {
      alert('Please fill in your name and email before saving');
      return;
    }

    setLoading(true);
    try {
      await saveCV(cvData);
      alert('CV saved successfully!');
    } catch (error) {
      alert('Failed to save CV');
    } finally {
      setLoading(false);
    }
  };

  // Add education
  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }]
    }));
  };

  // Remove education
  const removeEducation = (index) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Update education
  const updateEducation = (index, field, value) => {
    const updated = [...cvData.education];
    updated[index][field] = value;
    setCvData(prev => ({ ...prev, education: updated }));
  };

  // Add experience
  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: []
      }]
    }));
  };

  // Remove experience
  const removeExperience = (index) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Update experience
  const updateExperience = (index, field, value) => {
    const updated = [...cvData.experience];
    updated[index][field] = value;
    setCvData(prev => ({ ...prev, experience: updated }));
  };

  // Add achievement to experience
  const addAchievement = (expIndex) => {
    const updated = [...cvData.experience];
    if (!updated[expIndex].achievements) {
      updated[expIndex].achievements = [];
    }
    updated[expIndex].achievements.push('');
    setCvData(prev => ({ ...prev, experience: updated }));
  };

  // Update achievement
  const updateAchievement = (expIndex, achIndex, value) => {
    const updated = [...cvData.experience];
    updated[expIndex].achievements[achIndex] = value;
    setCvData(prev => ({ ...prev, experience: updated }));
  };

  // Remove achievement
  const removeAchievement = (expIndex, achIndex) => {
    const updated = [...cvData.experience];
    updated[expIndex].achievements = updated[expIndex].achievements.filter((_, i) => i !== achIndex);
    setCvData(prev => ({ ...prev, experience: updated }));
  };

  // Add skill
  const addSkill = () => {
    setCvData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', level: 'Intermediate' }]
    }));
  };

  // Remove skill
  const removeSkill = (index) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Update skill
  const updateSkill = (index, field, value) => {
    const updated = [...cvData.skills];
    updated[index][field] = value;
    setCvData(prev => ({ ...prev, skills: updated }));
  };

  // Add language
  const addLanguage = () => {
    setCvData(prev => ({
      ...prev,
      languages: [...prev.languages, { name: '', proficiency: 'Professional' }]
    }));
  };

  // Remove language
  const removeLanguage = (index) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  // Update language
  const updateLanguage = (index, field, value) => {
    const updated = [...cvData.languages];
    updated[index][field] = value;
    setCvData(prev => ({ ...prev, languages: updated }));
  };

  // Add project
  const addProject = () => {
    setCvData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: '',
        description: '',
        technologies: [],
        githubLink: '',
        liveLink: ''
      }]
    }));
  };

  // Remove project
  const removeProject = (index) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Update project
  const updateProject = (index, field, value) => {
    const updated = [...cvData.projects];
    updated[index][field] = value;
    setCvData(prev => ({ ...prev, projects: updated }));
  };

  // Add technology to project
  const addTechnology = (projIndex) => {
    const updated = [...cvData.projects];
    if (!updated[projIndex].technologies) {
      updated[projIndex].technologies = [];
    }
    updated[projIndex].technologies.push('');
    setCvData(prev => ({ ...prev, projects: updated }));
  };

  // Update technology
  const updateTechnology = (projIndex, techIndex, value) => {
    const updated = [...cvData.projects];
    updated[projIndex].technologies[techIndex] = value;
    setCvData(prev => ({ ...prev, projects: updated }));
  };

  // Remove technology
  const removeTechnology = (projIndex, techIndex) => {
    const updated = [...cvData.projects];
    updated[projIndex].technologies = updated[projIndex].technologies.filter((_, i) => i !== techIndex);
    setCvData(prev => ({ ...prev, projects: updated }));
  };

  return (
    <div className="cv-generator-container">
      <div className="cv-header">
        <button className="back-btn" onClick={() => navigate('/profile')}>
          ← Back to Dashboard
        </button>
        <h1>Professional CV Generator</h1>
        <div className="header-actions">
          <button 
            className="save-btn"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : '💾 Save CV'}
          </button>
          <button 
            className="generate-btn"
            onClick={handleGeneratePDF}
            disabled={loading}
          >
            {loading ? 'Generating...' : '📄 Generate PDF'}
          </button>
        </div>
      </div>

      {/* Progress Tabs */}
      <div className="progress-tabs">
        <button 
          className={`tab ${activeSection === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveSection('personal')}
        >
          Personal
        </button>
        <button 
          className={`tab ${activeSection === 'education' ? 'active' : ''}`}
          onClick={() => setActiveSection('education')}
        >
          Education
        </button>
        <button 
          className={`tab ${activeSection === 'experience' ? 'active' : ''}`}
          onClick={() => setActiveSection('experience')}
        >
          Experience
        </button>
        <button 
          className={`tab ${activeSection === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveSection('skills')}
        >
          Skills
        </button>
        <button 
          className={`tab ${activeSection === 'additional' ? 'active' : ''}`}
          onClick={() => setActiveSection('additional')}
        >
          Additional
        </button>
      </div>

      <div className="cv-content">
        {/* Personal Information Section */}
        {activeSection === 'personal' && (
          <div className="section personal-section">
            <h2>Personal Information</h2>
            <p className="section-hint">Fill in your basic details (Name and Email are required)</p>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={cvData.personal.name}
                  onChange={handlePersonalChange}
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={cvData.personal.email}
                  onChange={handlePersonalChange}
                />
              </div>
              
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 234 567 890"
                  value={cvData.personal.phone}
                  onChange={handlePersonalChange}
                />
              </div>
              
              <div className="form-group">
                <label>LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedin"
                  placeholder="https://linkedin.com/in/username"
                  value={cvData.personal.linkedin}
                  onChange={handlePersonalChange}
                />
              </div>
              
              <div className="form-group github-group">
                <label>GitHub Username</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    name="github"
                    placeholder="username"
                    value={cvData.personal.github}
                    onChange={handlePersonalChange}
                  />
                  <button 
                    onClick={handleGitHubImport}
                    disabled={loading}
                    className="github-import-btn"
                  >
                    {loading ? '...' : 'Import'}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>Portfolio URL</label>
                <input
                  type="url"
                  name="portfolio"
                  placeholder="https://yourportfolio.com"
                  value={cvData.personal.portfolio}
                  onChange={handlePersonalChange}
                />
              </div>
            </div>
            
            <div className="form-group full-width">
              <label>Professional Summary</label>
              <textarea
                name="summary"
                placeholder="Write a brief summary about yourself, your experience, and career goals..."
                value={cvData.personal.summary}
                onChange={handlePersonalChange}
                rows="5"
              />
            </div>
          </div>
        )}

        {/* Education Section */}
        {activeSection === 'education' && (
          <div className="section education-section">
            <h2>Education</h2>
            <p className="section-hint">Add your educational background (Only filled entries will appear in PDF)</p>
            
            {cvData.education.length === 0 ? (
              <div className="empty-state">
                <p>No education added yet</p>
              </div>
            ) : (
              cvData.education.map((edu, index) => (
                <div key={index} className="education-item card">
                  <div className="card-header">
                    <h3>Education #{index + 1}</h3>
                    <button 
                      className="remove-btn"
                      onClick={() => removeEducation(index)}
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Institution *</label>
                      <input
                        type="text"
                        placeholder="University/School Name"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Degree</label>
                      <input
                        type="text"
                        placeholder="e.g., Bachelor of Science"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Field of Study</label>
                      <input
                        type="text"
                        placeholder="e.g., Computer Science"
                        value={edu.fieldOfStudy}
                        onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                        disabled={edu.current}
                      />
                    </div>
                    
                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={edu.current}
                          onChange={(e) => updateEducation(index, 'current', e.target.checked)}
                        />
                        Currently studying here
                      </label>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Description (Optional)</label>
                    <textarea
                      placeholder="Add any additional details about your studies..."
                      value={edu.description}
                      onChange={(e) => updateEducation(index, 'description', e.target.value)}
                      rows="2"
                    />
                  </div>
                </div>
              ))
            )}
            
            <button className="add-btn" onClick={addEducation}>
              + Add Education
            </button>
          </div>
        )}

        {/* Experience Section */}
        {activeSection === 'experience' && (
          <div className="section experience-section">
            <h2>Work Experience</h2>
            <p className="section-hint">Add your work history (Only filled entries will appear in PDF)</p>
            
            {cvData.experience.length === 0 ? (
              <div className="empty-state">
                <p>No experience added yet</p>
              </div>
            ) : (
              cvData.experience.map((exp, index) => (
                <div key={index} className="experience-item card">
                  <div className="card-header">
                    <h3>Experience #{index + 1}</h3>
                    <button 
                      className="remove-btn"
                      onClick={() => removeExperience(index)}
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Company *</label>
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Position</label>
                      <input
                        type="text"
                        placeholder="e.g., Software Engineer"
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        placeholder="City, Country"
                        value={exp.location}
                        onChange={(e) => updateExperience(index, 'location', e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                        disabled={exp.current}
                      />
                    </div>
                    
                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                        />
                        Currently working here
                      </label>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      placeholder="Describe your responsibilities and achievements..."
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      rows="3"
                    />
                  </div>
                  
                  <div className="achievements-section">
                    <label>Key Achievements</label>
                    {exp.achievements && exp.achievements.map((ach, achIndex) => (
                      <div key={achIndex} className="achievement-item">
                        <input
                          type="text"
                          placeholder={`Achievement ${achIndex + 1}`}
                          value={ach}
                          onChange={(e) => updateAchievement(index, achIndex, e.target.value)}
                        />
                        <button 
                          className="remove-small"
                          onClick={() => removeAchievement(index, achIndex)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button 
                      className="add-small-btn"
                      onClick={() => addAchievement(index)}
                    >
                      + Add Achievement
                    </button>
                  </div>
                </div>
              ))
            )}
            
            <button className="add-btn" onClick={addExperience}>
              + Add Experience
            </button>
          </div>
        )}

        {/* Skills Section */}
        {activeSection === 'skills' && (
          <div className="section skills-section">
            <h2>Skills & Languages</h2>
            
            <div className="skills-container">
              <h3>Technical Skills</h3>
              {cvData.skills.length === 0 ? (
                <div className="empty-state small">
                  <p>No skills added</p>
                </div>
              ) : (
                cvData.skills.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <input
                      type="text"
                      placeholder="Skill name"
                      value={skill.name}
                      onChange={(e) => updateSkill(index, 'name', e.target.value)}
                    />
                    <select
                      value={skill.level}
                      onChange={(e) => updateSkill(index, 'level', e.target.value)}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <button 
                      className="remove-small"
                      onClick={() => removeSkill(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
              <button className="add-small-btn" onClick={addSkill}>
                + Add Skill
              </button>
            </div>
            
            <div className="languages-container">
              <h3>Languages</h3>
              {cvData.languages.length === 0 ? (
                <div className="empty-state small">
                  <p>No languages added</p>
                </div>
              ) : (
                cvData.languages.map((lang, index) => (
                  <div key={index} className="language-item">
                    <input
                      type="text"
                      placeholder="Language"
                      value={lang.name}
                      onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                    />
                    <select
                      value={lang.proficiency}
                      onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
                    >
                      <option value="Basic">Basic</option>
                      <option value="Conversational">Conversational</option>
                      <option value="Professional">Professional</option>
                      <option value="Native">Native</option>
                    </select>
                    <button 
                      className="remove-small"
                      onClick={() => removeLanguage(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
              <button className="add-small-btn" onClick={addLanguage}>
                + Add Language
              </button>
            </div>
          </div>
        )}

        {/* Additional Section (Projects, Certifications) */}
        {activeSection === 'additional' && (
          <div className="section additional-section">
            <h2>Projects & Certifications</h2>
            
            <div className="projects-container">
              <h3>Projects</h3>
              {cvData.projects.length === 0 ? (
                <div className="empty-state small">
                  <p>No projects added</p>
                </div>
              ) : (
                cvData.projects.map((proj, index) => (
                  <div key={index} className="project-item card">
                    <div className="card-header">
                      <h4>{proj.name || 'New Project'}</h4>
                      <button 
                        className="remove-btn small"
                        onClick={() => removeProject(index)}
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Project Name"
                        value={proj.name}
                        onChange={(e) => updateProject(index, 'name', e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <textarea
                        placeholder="Project Description"
                        value={proj.description}
                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                        rows="2"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Technologies</label>
                      {proj.technologies && proj.technologies.map((tech, techIndex) => (
                        <div key={techIndex} className="tech-item">
                          <input
                            type="text"
                            placeholder={`Technology ${techIndex + 1}`}
                            value={tech}
                            onChange={(e) => updateTechnology(index, techIndex, e.target.value)}
                          />
                          <button 
                            className="remove-small"
                            onClick={() => removeTechnology(index, techIndex)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button 
                        className="add-small-btn"
                        onClick={() => addTechnology(index)}
                      >
                        + Add Technology
                      </button>
                    </div>
                    
                    <div className="form-grid">
                      <input
                        type="url"
                        placeholder="GitHub Link"
                        value={proj.githubLink}
                        onChange={(e) => updateProject(index, 'githubLink', e.target.value)}
                      />
                      <input
                        type="url"
                        placeholder="Live Demo Link"
                        value={proj.liveLink}
                        onChange={(e) => updateProject(index, 'liveLink', e.target.value)}
                      />
                    </div>
                  </div>
                ))
              )}
              <button className="add-btn" onClick={addProject}>
                + Add Project
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Buttons for Mobile */}
      <div className="mobile-actions">
        <button className="save-btn" onClick={handleSave} disabled={loading}>
          💾
        </button>
        <button className="generate-btn" onClick={handleGeneratePDF} disabled={loading}>
          📄
        </button>
      </div>
    </div>
  );
};

export default CvGenerator;