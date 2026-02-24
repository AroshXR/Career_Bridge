import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Splash from './components/Splash/Splash';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import TrendingJobAnalyzer from './components/TrendingJobAnalyzer/TrendingJobAnalyzer';
import SavedJobs from './components/SavedJobs/SavedJobs';
import UserDashboard from './components/Dashboards/dashboardUser';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
