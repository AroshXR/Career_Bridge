// GitHub API - Completely Free
export const fetchGitHubData = async (username) => {
  try {
    // Fetch user profile
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    if (!userResponse.ok) return null;
    const userData = await userResponse.json();
    
    // Fetch repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
    const reposData = await reposResponse.json();
    
    // Extract languages
    const languages = [...new Set(reposData
      .map(repo => repo.language)
      .filter(lang => lang)
    )];
    
    // Get top projects
    const projects = reposData
      .slice(0, 3)
      .map(repo => ({
        name: repo.name,
        description: repo.description || 'No description',
        technologies: repo.language ? [repo.language] : [],
        githubLink: repo.html_url,
        stars: repo.stargazers_count
      }));
    
    return {
      name: userData.name || username,
      bio: userData.bio || 'Software Developer',
      location: userData.location,
      followers: userData.followers,
      following: userData.following,
      languages: languages,
      projects: projects
    };
  } catch (error) {
    console.error('GitHub API Error:', error);
    return null;
  }
};

// Mock LinkedIn Data (for development/demo)
export const getMockLinkedInData = () => {
  return {
    fullName: "John Doe",
    headline: "Senior Software Engineer",
    summary: "Experienced developer with 5+ years in full-stack development",
    experience: [
      {
        company: "Tech Corp",
        position: "Software Engineer",
        startDate: "2020-01",
        endDate: "Present",
        description: "Developing web applications"
      }
    ],
    education: [
      {
        institution: "University of Technology",
        degree: "Bachelor's",
        fieldOfStudy: "Computer Science",
        endDate: "2019"
      }
    ],
    skills: ["JavaScript", "React", "Node.js", "Python"]
  };
};

// Skill suggestions based on job role
export const getTrendingSkills = async (jobRole) => {
  const skillDatabase = {
    'frontend': ['React', 'Vue.js', 'Angular', 'TypeScript', 'HTML5', 'CSS3', 'JavaScript', 'Webpack'],
    'backend': ['Node.js', 'Python', 'Java', 'Spring Boot', 'Django', 'SQL', 'MongoDB', 'Docker'],
    'fullstack': ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'PostgreSQL', 'GraphQL'],
    'data': ['Python', 'SQL', 'Pandas', 'NumPy', 'Tableau', 'Machine Learning', 'TensorFlow'],
    'devops': ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Azure', 'CI/CD', 'Terraform'],
    'mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android'],
    'default': ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'Communication']
  };
  
  const role = jobRole?.toLowerCase() || 'default';
  let matchedSkills = [];
  
  // Check if any keyword matches
  for (const [key, skills] of Object.entries(skillDatabase)) {
    if (role.includes(key)) {
      matchedSkills = [...matchedSkills, ...skills];
    }
  }
  
  // If no match, return default skills
  if (matchedSkills.length === 0) {
    matchedSkills = skillDatabase.default;
  }
  
  // Remove duplicates and return top 8
  return [...new Set(matchedSkills)].slice(0, 8);
};