import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import './App.css';
import Splash from './components/Splash/Splash';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import TrendingJobAnalyzer from './components/TrendingJobAnalyzer/TrendingJobAnalyzer';
import SavedJobs from './components/SavedJobs/SavedJobs';
import LearningResources from './components/Learning_Resources/learning_resources';
import UserDashboard from './components/Dashboards/dashboardUser';
=======
import ProtectedRoute from './components/Common/ProtectedRoute';
import Splash from '../src/components/Splash/Splash';
import Login from '../src/components/Login/Login';
import Register from '../src/components/Register/Register';
import Home from '../src/components/Home/Home';
import TrendingJobAnalyzer from '../src/components/TrendingJobAnalyzer/TrendingJobAnalyzer';
import SavedJobs from '../src/components/SavedJobs/SavedJobs';
import YoutubeResources from './components/Learning_Resources/youtube_resources';
import ProfessionalCourses from '../src/components/Learning_Resources/professional_courses';
import LearningRoadmap from '../src/components/Learning_Resources/learning_roadmap';
import UserDashboard from '../src/components/Dashboards/dashboardUser';
import DashboardAdmin from '../src/components/Dashboards/dashboardAdmin';
>>>>>>> 6cd59e4fd242289f136f0ef75067c692ffc50fbc
import CvGenerator from '../src/components/CvGenerator/CvGenerator';
import Economy from '../src/components/Economy/economy';
import ProgressPage from '../src/components/Progress/progress_page';
import RecommendedCourses from '../src/components/Dashboards/RecommendedCourses';
import JobSkillAnalyzer from '../src/components/JobSkillAnalyzer/JobSkillAnalyzer';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
<<<<<<< HEAD
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<UserDashboard />} />
          <Route path="/cv-generator" element={<CvGenerator />} />
          <Route path="/job-analyzer" element={<TrendingJobAnalyzer />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/learning-resources" element={<LearningResources />} />
=======

          {/* Protected User Routes */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/cv-generator" element={<ProtectedRoute><CvGenerator /></ProtectedRoute>} />
          <Route path="/job-analyzer" element={<ProtectedRoute><TrendingJobAnalyzer /></ProtectedRoute>} />
          <Route path="/saved-jobs" element={<ProtectedRoute><SavedJobs /></ProtectedRoute>} />
          <Route path="/learning-resources" element={<ProtectedRoute><YoutubeResources /></ProtectedRoute>} />
          <Route path="/professional-courses" element={<ProtectedRoute><ProfessionalCourses /></ProtectedRoute>} />
          <Route path="/learning-roadmap" element={<ProtectedRoute><LearningRoadmap /></ProtectedRoute>} />
          <Route path="/economy" element={<ProtectedRoute><Economy /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
          <Route path="/recommended" element={<ProtectedRoute><RecommendedCourses /></ProtectedRoute>} />
          <Route path="/skill-analyzer" element={<ProtectedRoute><JobSkillAnalyzer /></ProtectedRoute>} />
                                       
          {/* Protected Admin Routes */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute adminOnly={true}>
              <DashboardAdmin />
            </ProtectedRoute>
          } />
>>>>>>> 6cd59e4fd242289f136f0ef75067c692ffc50fbc
        </Routes>
      </div>
    </Router>
  );
}

export default App;
