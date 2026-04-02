import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from './components/Splash/Splash';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import TrendingJobAnalyzer from './components/TrendingJobAnalyzer/TrendingJobAnalyzer';
import SavedJobs from './components/SavedJobs/SavedJobs';
import YoutubeResources from './components/Learning_Resources/youtube_resources';
import ProfessionalCourses from './components/Learning_Resources/professional_courses';
import LearningRoadmap from './components/Learning_Resources/learning_roadmap';
import UserDashboard from './components/Dashboards/dashboardUser';
import CvGenerator from './components/CvGenerator/CvGenerator';
import Economy from './components/Economy/economy';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<UserDashboard />} />
          <Route path="/cv-generator" element={<CvGenerator />} />
          <Route path="/job-analyzer" element={<TrendingJobAnalyzer />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/learning-resources" element={<YoutubeResources />} />
          <Route path="/professional-courses" element={<ProfessionalCourses />} />
          <Route path="/learning-roadmap" element={<LearningRoadmap />} />
          <Route path="/economy" element={<Economy />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
