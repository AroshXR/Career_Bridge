import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Splash from './components/Splash/Splash';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import TrendingJobAnalyzer from './components/TrendingJobAnalyzer/TrendingJobAnalyzer';
import SavedJobs from './components/SavedJobs/SavedJobs';
import LearningResources from './components/Learning_Resources/learning_resources';
import UserDashboard from './components/Dashboards/dashboardUser';
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
