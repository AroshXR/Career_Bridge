import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Splash from '../src/Components/Splash/Splash';
import Login from '../src/Components/Login/Login';
import Register from '../src/Components/Register/Register';
import Home from '../src/Components/Home/Home';
import TrendingJobAnalyzer from '../src/Components/TrendingJobAnalyzer/TrendingJobAnalyzer';
import SavedJobs from '../src/Components/SavedJobs/SavedJobs';
import LearningResources from '../src/Components/Learning_Resources/learning_resources';
import UserDashboard from '../src/components/Dashboards/dashboardUser';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<UserDashboard/>}/>
          <Route path="/job-analyzer" element={<TrendingJobAnalyzer />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/learning-resources" element={<LearningResources />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
