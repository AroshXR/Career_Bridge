import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Splash from '../src/components/Splash/Splash';
import Login from '../src/components/Login/Login';
import Register from '../src/components/Register/Register';
import Home from '../src/components/Home/Home';
import TrendingJobAnalyzer from '../src/components/TrendingJobAnalyzer/TrendingJobAnalyzer';
import SavedJobs from '../src/components/TrendingJobAnalyzer/SavedJobs/SavedJobs';
import LearningResources from '../src/components/Learning_Resources/learning_resources';
import UserDashboard from '../src/components/Dashboards/dashboardUser';
import DashboardAdmin from '../src/components/Dashboards/dashboardAdmin';
import CvGenerator from '../src/components/CvGenerator/CvGenerator';

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
          <Route path="/admin-dashboard" element={<DashboardAdmin />} />
          <Route path="/cv-generator" element={<CvGenerator />} />
          <Route path="/job-analyzer" element={<TrendingJobAnalyzer />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/learning-resources" element={<LearningResources />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
