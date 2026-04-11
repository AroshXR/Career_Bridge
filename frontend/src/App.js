import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/Common/ProtectedRoute';
import ScrollToTop from './components/Common/ScrollToTop';
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
import DashboardAdmin from './components/Dashboards/dashboardAdmin';
import CvGenerator from './components/CvGenerator/CvGenerator';
import Economy from './components/Economy/economy';
import ProgressPage from './components/Progress/progress_page';
import RecommendedCourses from './components/Dashboards/RecommendedCourses';
import JobSkillAnalyzer from './components/JobSkillAnalyzer/JobSkillAnalyzer';
import FeedbackPage from './components/Feedback/FeedbackPage';
import AdminFeedbackView from './components/Feedback/AdminFeedbackView';
import ContactUs from './components/ContactUs/ContactUs';
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy';

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
