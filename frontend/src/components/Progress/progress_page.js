import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
    if (pct === 100) return '#27ae60';
    if (pct >= 50)  return '#f39c12';
    return '#6c5ce7';
  };

  // ────────────────────────────────────────────────────────────────────
  return (
    <div className="pp-page">

      {/* ── Header ── */}
      <div className="pp-header">
        <button className="pp-back-btn" onClick={() => navigate('/profile')}>← Dashboard</button>
        <div className="pp-title-wrap">
          <h1 className="pp-title">📊 My Learning Progress</h1>
          <p className="pp-subtitle">Track your AI-generated roadmaps. Check off steps as you master them.</p>
        </div>
        <button className="pp-new-btn" onClick={() => navigate('/learning-roadmap')}>
          + New Roadmap
        </button>
      </div>

      {/* ── States ── */}
      {loading && (
        <div className="pp-center">
          <div className="pp-spinner"></div>
          <p className="pp-loading-text">Loading your roadmaps…</p>
        </div>
      )}

      {error && !loading && (
        <div className="pp-center">
          <p className="pp-error">{error}</p>
          <button className="pp-retry-btn" onClick={fetchProgress}>Retry</button>
        </div>
      )}

      {!loading && !error && progressList.length === 0 && (
        <div className="pp-empty">
          <div className="pp-empty-icon">🗺️</div>
          <h2>No roadmaps yet</h2>
          <p>Search for a skill and click <strong>Follow Up 🚀</strong> to start tracking your learning journey.</p>
          <button className="pp-new-btn" onClick={() => navigate('/learning-roadmap')}>
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
            const color     = barColor(pct);

            return (
              <div key={item._id} className={`pp-card ${item.status === 'Completed' ? 'pp-card--done' : ''}`}>

                {/* Card header */}
                <div className="pp-card-header">
                  <div className="pp-card-title-row">
                    <h2 className="pp-skill-name">{item.skillName}</h2>
                    <span className={`pp-badge ${item.status === 'Completed' ? 'pp-badge--done' : 'pp-badge--progress'}`}>
                      {item.status === 'Completed' ? '🏆 Completed' : '⚡ In Progress'}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="pp-bar-wrap">
                    <div className="pp-bar-track">
                      <div
                        className="pp-bar-fill"
                        style={{ width: `${pct}%`, background: color }}
                      ></div>
                    </div>
                    <span className="pp-pct" style={{ color }}>{pct}%</span>
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
                    {deletingId === item._id ? 'Removing…' : '🗑 Remove Roadmap'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProgressPage;
