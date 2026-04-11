import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/Common/ProtectedRoute';
import ScrollToTop from './components/Common/ScrollToTop';
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
import CvGenerator from '../src/components/CvGenerator/CvGenerator';
import Economy from '../src/components/Economy/economy';
import ProgressPage from '../src/components/Progress/progress_page';
import RecommendedCourses from '../src/components/Dashboards/RecommendedCourses';
import JobSkillAnalyzer from '../src/components/JobSkillAnalyzer/JobSkillAnalyzer';
import FeedbackPage from './components/Feedback/FeedbackPage';
import AdminFeedbackView from './components/Feedback/AdminFeedbackView';
import ContactUs from '../src/components/ContactUs/ContactUs';
import PrivacyPolicy from '../src/components/PrivacyPolicy/PrivacyPolicy';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

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
          <Route path="/admin/feedbacks" element={
            <ProtectedRoute adminOnly={true}>
              <AdminFeedbackView />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
