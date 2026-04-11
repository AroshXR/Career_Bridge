import API_BASE_URL from '../apiConfig';

const API_URL = `${API_BASE_URL}/api/v1/users`;

// Get auth token
const getToken = () => localStorage.getItem('token');

// Generate and download PDF
export const generatePDF = async (cvData) => {
  try {
    const response = await fetch(`${API_URL}/cv/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(cvData)
    });

    if (!response.ok) throw new Error('Failed to generate PDF');

    // Download PDF
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-professional-cv.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
};

// Save CV to profile
export const saveCV = async (cvData) => {
  try {
    const response = await fetch(`${API_URL}/cv/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(cvData)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    return data;
  } catch (error) {
    console.error('Save CV Error:', error);
    throw error;
  }
};

// Load saved CV
export const loadSavedCV = async () => {
  try {
    const response = await fetch(`${API_URL}/cv/my-cv`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    return data.data;
  } catch (error) {
    console.error('Load CV Error:', error);
    return null;
  }
};

// Import from GitHub
export const importFromGitHub = async (githubUsername) => {
  try {
    const response = await fetch(`${API_URL}/cv/import/github`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ githubUsername })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    return data.data;
  } catch (error) {
    console.error('GitHub Import Error:', error);
    throw error;
  }
};