import User from "../Models/User.js";
import { generatePDF } from "../services/pdfService.js";
import { fetchGitHubData, getTrendingSkills } from "../services/thirdPartyApiService.js"; 

// @desc    Generate PDF without saving
// @route   POST /api/v1/users/cv/generate
export const generateCV = async (req, res) => {
  try {
    const cvData = req.body;
    
    const filteredData = {
      personal: {
        name: cvData.personal?.name || req.user.name,
        email: cvData.personal?.email || req.user.email,
        phone: cvData.personal?.phone || req.user.phone,
        linkedin: cvData.personal?.linkedin || req.user.linkedin,
        github: cvData.personal?.github || req.user.github,
        portfolio: cvData.personal?.portfolio || req.user.portfolio,
        summary: cvData.personal?.summary || cvData.personal?.professionalSummary
      },
      education: cvData.education?.filter(edu => edu.institution?.trim()) || [],
      experience: cvData.experience?.filter(exp => exp.company?.trim()) || [],
      skills: cvData.skills?.filter(skill => skill.name?.trim()) || [],
      languages: cvData.languages?.filter(lang => lang.name?.trim()) || [],
      certifications: cvData.certifications?.filter(cert => cert.name?.trim()) || [],
      projects: cvData.projects?.filter(proj => proj.name?.trim()) || [],
      achievements: cvData.achievements?.filter(ach => ach.title?.trim()) || []
    };
    
    // Generate PDF
    const pdfBuffer = await generatePDF(filteredData);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=professional-cv.pdf');
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ message: 'Failed to generate PDF', error: error.message });
  }
};

// @desc    Save CV data to user profile
// @route   POST /api/v1/users/cv/save
export const saveCVData = async (req, res) => {
  try {
    const userId = req.user.id;
    const cvData = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        cvDetails: cvData,
        phone: cvData.personal?.phone || req.user.phone,
        github: cvData.personal?.github || req.user.github,
        linkedin: cvData.personal?.linkedin || req.user.linkedin,
        portfolio: cvData.personal?.portfolio || req.user.portfolio
      },
      { new: true }
    ).select('-password');
    
    res.json({
      success: true,
      message: 'CV saved successfully',
      data: updatedUser.cvDetails
    });
    
  } catch (error) {
    console.error('Save CV Error:', error);
    res.status(500).json({ message: 'Failed to save CV', error: error.message });
  }
};

// @desc    Get user's saved CV data
// @route   GET /api/v1/users/cv/my-cv
export const getMyCV = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('cvDetails phone github linkedin portfolio name email');

    const responseData = {
      personal: {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        portfolio: user.portfolio || ''
      },
      ...(user.cvDetails || {})
    };
    
    res.json({
      success: true,
      data: responseData
    });
    
  } catch (error) {
    console.error('Fetch CV Error:', error);
    res.status(500).json({ message: 'Failed to fetch CV', error: error.message });
  }
};

// @desc    Import data from GitHub
// @route   POST /api/v1/users/cv/import/github
export const importFromGitHub = async (req, res) => {
  try {
    const { githubUsername } = req.body;
    
    if (!githubUsername) {
      return res.status(400).json({ message: 'GitHub username required' });
    }
    
    const githubData = await fetchGitHubData(githubUsername);
    
    if (!githubData) {
    
      return res.json({
        success: true,
        data: {
          personal: {
            name: req.user.name,
            professionalSummary: "Software Developer with experience in building web applications"
          },
          skills: [
            { name: "JavaScript", level: "Intermediate" },
            { name: "React", level: "Intermediate" },
            { name: "Node.js", level: "Beginner" }
          ],
          projects: [
            {
              name: "E-commerce Platform",
              description: "Full-stack e-commerce application",
              technologies: ["React", "Node.js", "MongoDB"],
              githubLink: `https://github.com/${githubUsername}/project1`
            }
          ]
        }
      });
    }
    
    // Format GitHub data for CV
    const cvFormat = {
      personal: {
        name: githubData.name || req.user.name,
        professionalSummary: githubData.bio || '',
        github: `https://github.com/${githubUsername}`
      },
      skills: githubData.languages?.map(lang => ({ 
        name: lang, 
        level: 'Intermediate' 
      })) || [],
      projects: githubData.projects || []
    };
    
    res.json({
      success: true,
      data: cvFormat
    });
    
  } catch (error) {
    console.error('GitHub Import Error:', error);
    res.status(500).json({ message: 'Failed to import from GitHub', error: error.message });
  }
};

// @desc    Get skill suggestions based on job role
// @route   GET /api/v1/users/cv/skills/:jobRole
export const getSkillSuggestions = async (req, res) => {
  try {
    const { jobRole } = req.params;
    
    const suggestions = await getTrendingSkills(jobRole);
    
    res.json({
      success: true,
      data: suggestions
    });
    
  } catch (error) {
    console.error('Skill Suggestions Error:', error);
    res.status(500).json({ message: 'Failed to get suggestions', error: error.message });
  }
};