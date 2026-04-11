import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import './progress_page.css';

function ProgressPage() {
  const navigate = useNavigate();
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [deletingId, setDeletingId]     = useState(null);

  // ── helpers ──────────────────────────────────────────────────────────
  const getAuth = () => {
    const token      = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    return { token, userId: storedUser._id };
  };

  const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

  // ── fetch all progress for this user ─────────────────────────────────
  const fetchProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { token, userId } = getAuth();
      if (!userId) { setError('Please log in to view your progress.'); return; }

      const res = await axios.get(
        `http://localhost:5000/api/v1/progress/user/${userId}`,
        authHeader(token)
      );
      setProgressList(res.data?.data || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setProgressList([]); // no roadmaps yet — that's fine
      } else {
        setError('Failed to load your progress. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProgress(); }, [fetchProgress]);

  // ── toggle a checkbox ─────────────────────────────────────────────────
  const handleToggleTask = async (progressId, taskIndex) => {
    try {
      const { token } = getAuth();
      const res = await axios.put(
        'http://localhost:5000/api/v1/progress/complete-task',
        { progressId, taskIndex },
        authHeader(token)
      );
      const updated = res.data?.data;
      setProgressList(prev =>
        prev.map(p => (p._id === progressId ? updated : p))
      );
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  // ── delete a roadmap card ─────────────────────────────────────────────
  const handleDelete = async (progressId) => {
    if (!window.confirm('Remove this roadmap from your progress?')) return;
    setDeletingId(progressId);
    try {
      const { token } = getAuth();
      await axios.delete(
        `http://localhost:5000/api/v1/progress/${progressId}`,
        authHeader(token)
      );
      setProgressList(prev => prev.filter(p => p._id !== progressId));
    } catch (err) {
      console.error('Error deleting progress:', err);
      alert('Could not remove roadmap. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // ── colour for progress bar ───────────────────────────────────────────
  const barColor = (pct) => {
    if (pct === 100) return 'linear-gradient(90deg, #10B981, #34D399)';
    if (pct >= 50)  return 'linear-gradient(90deg, #f39c12, #f1c40f)';
    return 'linear-gradient(90deg, var(--primary_pp), var(--secondary_pp))';
  };

  // ────────────────────────────────────────────────────────────────────
  return (
    <div className="pp-page">
      <Navbar />

      {/* ── Hero Banner ── */}
      <div className="pp-hero">
        <div className="pp-header-actions">
          <button className="pp-btn" onClick={() => navigate('/profile')}>
            <span className="material-icons-round">arrow_back</span>
            Dashboard
          </button>
          <button className="pp-btn pp-new-btn" onClick={() => navigate('/learning-roadmap')}>
            <span className="material-icons-round">add</span>
            New Roadmap
          </button>
        </div>
        <span className="pp-eyebrow">Your Journey</span>
        <h1>Learning Progress</h1>
        <p>Track your AI-generated roadmaps. Check off steps as you master them.</p>
      </div>

      {/* ── Content Grid Wrapper ── */}
      <div className="pp-grid-wrapper">

        {/* ── States ── */}
        {loading && (
          <div className="pp-center">
            <div className="pp-spinner"></div>
            <p style={{marginTop: '1rem', color: 'var(--text-muted_pp)'}}>Loading your roadmaps…</p>
          </div>
        )}

        {error && !loading && (
          <div className="pp-center">
            <p style={{color: '#e74c3c', fontWeight: 600}}>{error}</p>
            <button className="pp-btn" style={{marginTop: '1rem', background: '#e74c3c'}} onClick={fetchProgress}>Retry</button>
          </div>
        )}

        {!loading && !error && progressList.length === 0 && (
          <div className="pp-empty">
            <h2 style={{fontSize: '3rem', marginBottom: '1rem'}}>🗺️</h2>
            <h2>No roadmaps yet</h2>
            <p>Search for a skill and click <strong>Follow Up 🚀</strong> to start tracking your learning journey.</p>
            <button className="pp-btn pp-new-btn" style={{marginTop: '1rem', background: 'var(--primary_pp)', color:'white'}} onClick={() => navigate('/learning-roadmap')}>
              Generate a Roadmap
            </button>
          </div>
        )}

        {/* ── Cards grid ── */}
        {!loading && !error && progressList.length > 0 && (
          <div className="pp-grid">
            {progressList.map(item => {
              const pct       = item.progressPercentage || 0;
              const completed = item.tasks?.filter(t => t.completed).length || 0;
              const total     = item.tasks?.length || 0;
              const bgGradient = barColor(pct);

              return (
                <div key={item._id} className={`pp-card ${item.status === 'Completed' ? 'pp-card--done' : ''}`}>

                  {/* Card header */}
                  <div className="pp-card-header">
                    <div className="pp-card-title-row">
                      <h2 className="pp-skill-name">{item.skillName}</h2>
                      <span className={`pp-badge ${item.status === 'Completed' ? 'pp-badge--done' : 'pp-badge--progress'}`}>
                        {item.status === 'Completed' ? 'Completed' : 'In Progress'}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="pp-bar-wrap">
                      <div className="pp-bar-track">
                        <div
                          className="pp-bar-fill"
                          style={{ width: `${pct}%`, background: bgGradient }}
                        ></div>
                      </div>
                      <span className="pp-pct" style={{ color: pct===100 ? '#10B981' : 'var(--primary_pp)' }}>{pct}%</span>
                    </div>
                    <p className="pp-steps-count">{completed} / {total} steps completed</p>
                  </div>

                  {/* Steps list */}
                  <ul className="pp-task-list">
                    {item.tasks?.map((task, idx) => (
                      <li
                        key={idx}
                        className={`pp-task-item ${task.completed ? 'pp-task-item--done' : ''}`}
                        onClick={() => handleToggleTask(item._id, idx)}
                      >
                        <span className={`pp-checkbox ${task.completed ? 'pp-checkbox--checked' : ''}`}>
                          {task.completed ? '✓' : ''}
                        </span>
                        <span className="pp-task-text">{task.title}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Delete button */}
                  <div className="pp-card-footer">
                    <button
                      className="pp-delete-btn"
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                    >
                      {deletingId === item._id ? 'Removing…' : 'Remove'}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default ProgressPage;
