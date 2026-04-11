import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import './JobSkillAnalyzer.css';
import API_BASE_URL from '../../apiConfig';

// ─── Skill Card ───────────────────────────────────────────────────────────────
function SkillCard({ skill, editingNote, setEditingNote, savingNote, onToggleStatus, onSaveNote, onDelete }) {
    const noteValue = skill._id in editingNote ? editingNote[skill._id] : (skill.userNote || '');
    const hasNoteChange = skill._id in editingNote && editingNote[skill._id] !== (skill.userNote || '');
    const isCompleted = skill.status === 'completed';

    return (
        <div className={`jsa-skill-card ${skill.importance === 'Optional' ? 'optional' : 'essential'} ${isCompleted ? 'completed' : ''}`}>
            <div className="jsa-skill-top">
                <div className="jsa-skill-title-row">
                    <h4 className="jsa-skill-name">{skill.name}</h4>
                    <button className="jsa-skill-del" onClick={() => onDelete(skill._id)} title="Remove skill">×</button>
                </div>
                <div className="jsa-skill-badges-row">
                    <span className={`jsa-importance ${skill.importance === 'Optional' ? 'optional' : 'essential'}`}>
                        {skill.importance === 'Optional' ? '◈ Optional' : '★ Essential'}
                    </span>
                    <button className={`jsa-status-btn ${isCompleted ? 'done' : 'pending'}`} onClick={() => onToggleStatus(skill)}>
                        {isCompleted ? '✓ Mastered' : '○ Pending'}
                    </button>
                </div>
            </div>

            {skill.description && (
                <p className="jsa-skill-desc">{skill.description}</p>
            )}

            {skill.altLabels?.length > 0 && (
                <div className="jsa-alt-labels">
                    {skill.altLabels.slice(0, 4).map((label, i) => (
                        <span key={i} className="jsa-alt-label">{label}</span>
                    ))}
                </div>
            )}

            <div className="jsa-note-area">
                <textarea
                    className="jsa-note-input"
                    placeholder="Add a personal note..."
                    value={noteValue}
                    rows={2}
                    onChange={e => setEditingNote(prev => ({ ...prev, [skill._id]: e.target.value }))}
                />
                {hasNoteChange && (
                    <button
                        className="jsa-save-note-btn"
                        disabled={savingNote === skill._id}
                        onClick={() => onSaveNote(skill)}
                    >
                        {savingNote === skill._id ? 'Saving…' : 'Save Note'}
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function JobSkillAnalyzer() {
    const navigate = useNavigate();
    const location = useLocation();
    const autoAnalyzeJobId = location.state?.autoAnalyzeJobId ?? null;
    const autoAnalyzeJobTitle = location.state?.jobTitle ?? null;
    const autoTriggered = useRef(false);

    const [analyses, setAnalyses] = useState([]);
    const [savedJobs, setSavedJobs] = useState([]);
    const [selectedAnalysis, setSelectedAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analyzingJobId, setAnalyzingJobId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [editingNote, setEditingNote] = useState({});
    const [savingNote, setSavingNote] = useState(null);
    const [error, setError] = useState('');
    const [toast, setToast] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
            const [analysesRes, savedJobsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/v1/skills/user/me`, { headers }),
                axios.get(`${API_BASE_URL}/api/v1/trendingJobAnalyzer/getSavedJobs`, { headers }),
            ]);
            const fetched = analysesRes.data.data || [];
            setAnalyses(fetched);
            setSavedJobs(savedJobsRes.data.data?.jobs || []);
            if (fetched.length > 0) setSelectedAnalysis(fetched[0]);
        } catch {
            setError('Failed to load data. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!token) { navigate('/login'); return; }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-analyze: fires once after initial load completes
    useEffect(() => {
        if (loading || autoTriggered.current || !autoAnalyzeJobId) return;
        autoTriggered.current = true;

        const existing = analyses.find(a => a.jobId === autoAnalyzeJobId);
        if (existing) {
            setSelectedAnalysis(existing);
            setActiveFilter('all');
            showToast(`Showing analysis for "${autoAnalyzeJobTitle || existing.jobTitle}"`);
        } else {
            const jobExists = savedJobs.find(j => j.jobId === autoAnalyzeJobId);
            if (jobExists) {
                setShowModal(true);
                handleAnalyze(autoAnalyzeJobId);
            } else {
                showToast('Job not found in saved list. Please try saving it again.');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    // ── Actions ──────────────────────────────────────────────────────────────

    const handleAnalyze = async (jobId) => {
        setAnalyzingJobId(jobId);
        try {
            const res = await axios.post(`${API_BASE_URL}/api/v1/skills/analyze/${jobId}`, {}, { headers });
            const newDoc = res.data.data;
            setAnalyses(prev => [newDoc, ...prev]);
            setSelectedAnalysis(newDoc);
            setShowModal(false);
            setActiveFilter('all');
            showToast('Skill analysis complete!');
        } catch (err) {
            setError(err.response?.data?.error?.errorDescription || 'Analysis failed. Please try again.');
        } finally {
            setAnalyzingJobId(null);
        }
    };

    const handleToggleStatus = async (skill) => {
        const newStatus = skill.status === 'completed' ? 'pending' : 'completed';
        try {
            const res = await axios.patch(
                `${API_BASE_URL}/api/v1/skills/${selectedAnalysis.jobId}/${skill._id}`,
                { status: newStatus, userNote: skill.userNote || '', importance: skill.importance },
                { headers }
            );
            const updated = res.data.data;
            setAnalyses(prev => prev.map(a => a._id === updated._id ? updated : a));
            setSelectedAnalysis(updated);
            showToast(newStatus === 'completed' ? '✓ Marked as mastered!' : 'Marked as pending');
        } catch {
            setError('Failed to update skill status.');
        }
    };

    const handleSaveNote = async (skill) => {
        const note = editingNote[skill._id] ?? (skill.userNote || '');
        setSavingNote(skill._id);
        try {
            const res = await axios.patch(
                `${API_BASE_URL}/api/v1/skills/${selectedAnalysis.jobId}/${skill._id}`,
                { userNote: note, status: skill.status, importance: skill.importance },
                { headers }
            );
            const updated = res.data.data;
            setAnalyses(prev => prev.map(a => a._id === updated._id ? updated : a));
            setSelectedAnalysis(updated);
            setEditingNote(prev => { const n = { ...prev }; delete n[skill._id]; return n; });
            showToast('Note saved!');
        } catch {
            setError('Failed to save note.');
        } finally {
            setSavingNote(null);
        }
    };

    const handleDeleteSkill = async (skillId) => {
        try {
            const res = await axios.delete(
                `${API_BASE_URL}/api/v1/skills/${selectedAnalysis.jobId}/${skillId}`,
                { headers }
            );
            const updated = res.data.data;
            setAnalyses(prev => prev.map(a => a._id === updated._id ? updated : a));
            setSelectedAnalysis(updated);
            showToast('Skill removed.');
        } catch {
            setError('Failed to remove skill.');
        }
    };

    const handleDeleteAnalysis = async (jobId, e) => {
        e.stopPropagation();
        if (!window.confirm('Delete this entire skill analysis? This cannot be undone.')) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/v1/skills/${jobId}`, { headers });
            const remaining = analyses.filter(a => a.jobId !== jobId);
            setAnalyses(remaining);
            setSelectedAnalysis(remaining[0] || null);
            showToast('Analysis deleted.');
        } catch {
            setError('Failed to delete analysis.');
        }
    };

    // ── Derived data ─────────────────────────────────────────────────────────

    const analyzedJobIds = new Set(analyses.map(a => a.jobId));
    const unanalyzedJobs = savedJobs.filter(j => !analyzedJobIds.has(j.jobId));

    const getProgress = (a) => {
        if (!a.skills.length) return 0;
        return Math.round((a.skills.filter(s => s.status === 'completed').length / a.skills.length) * 100);
    };

    const totalSkills = analyses.reduce((s, a) => s + a.skills.length, 0);
    const completedSkills = analyses.reduce((s, a) => s + a.skills.filter(sk => sk.status === 'completed').length, 0);
    const overallProgress = totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;

    const filteredSkills = selectedAnalysis?.skills.filter(skill => {
        if (activeFilter === 'essential') return skill.importance === 'Essential';
        if (activeFilter === 'optional') return skill.importance === 'Optional';
        if (activeFilter === 'completed') return skill.status === 'completed';
        if (activeFilter === 'pending') return skill.status === 'pending';
        return true;
    }) ?? [];

    const sortedSkills = [...filteredSkills].sort((a, b) => {
        if (a.importance === 'Essential' && b.importance !== 'Essential') return -1;
        if (a.importance !== 'Essential' && b.importance === 'Essential') return 1;
        return 0;
    });

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="jsa-page">
            <Navbar />

            {/* ── Hero Header ── */}
            <header className="jsa-header">
                <div className="jsa-header-top">
                    <button className="jsa-new-btn" onClick={() => setShowModal(true)}>
                        <span>+</span> Analyze New Job
                    </button>
                </div>
                <div className="jsa-header-hero">
                    <div className="jsa-header-text">
                        <p className="jsa-header-eyebrow">AI-Powered Career Tools</p>
                        <h1>Job Skill Analyzer</h1>
                        <p>Personalized skill roadmaps built from your saved jobs</p>
                    </div>
                    <div className="jsa-stats-row">
                        <div className="jsa-stat">
                            <span className="jsa-stat-num">{analyses.length}</span>
                            <span className="jsa-stat-lbl">Analyses</span>
                        </div>
                        <div className="jsa-stat-divider" />
                        <div className="jsa-stat">
                            <span className="jsa-stat-num">{totalSkills}</span>
                            <span className="jsa-stat-lbl">Total Skills</span>
                        </div>
                        <div className="jsa-stat-divider" />
                        <div className="jsa-stat">
                            <span className="jsa-stat-num">{completedSkills}</span>
                            <span className="jsa-stat-lbl">Mastered</span>
                        </div>
                        <div className="jsa-stat-divider" />
                        <div className="jsa-stat">
                            <span className="jsa-stat-num">{overallProgress}%</span>
                            <span className="jsa-stat-lbl">Progress</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Content ── */}
            <main className="jsa-content">

                {error && (
                    <div className="jsa-error-banner">
                        <span>{error}</span>
                        <button onClick={() => setError('')}>×</button>
                    </div>
                )}

                {loading ? (
                    <div className="jsa-loading">
                        <div className="jsa-spinner" />
                        <p>Loading your skill analyses…</p>
                    </div>
                ) : analyses.length === 0 ? (
                    <div className="jsa-empty-state">
                        <div className="jsa-empty-icon">🧠</div>
                        <h2>No skill analyses yet</h2>
                        <p>Save a job from the Trending Job Analyzer, then analyze it here to get your personalized skill roadmap.</p>
                        <div className="jsa-empty-actions">
                            <button className="jsa-btn-primary" onClick={() => setShowModal(true)}>
                                Analyze a Saved Job
                            </button>
                            <button className="jsa-btn-secondary" onClick={() => navigate('/job-analyzer')}>
                                Browse Trending Jobs →
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="jsa-layout">

                        {/* ── Analysis Cards ── */}
                        <section className="jsa-analyses-section">
                            <h2 className="jsa-section-title">Your Analyses</h2>
                            <div className="jsa-analyses-grid">
                                {analyses.map(analysis => {
                                    const prog = getProgress(analysis);
                                    const essentialCount = analysis.skills.filter(s => s.importance === 'Essential').length;
                                    const optionalCount = analysis.skills.filter(s => s.importance === 'Optional').length;
                                    const isActive = selectedAnalysis?._id === analysis._id;
                                    return (
                                        <div
                                            key={analysis._id}
                                            className={`jsa-analysis-card ${isActive ? 'active' : ''}`}
                                            onClick={() => { setSelectedAnalysis(analysis); setActiveFilter('all'); setEditingNote({}); }}
                                        >
                                            <div className="jsa-card-top">
                                                <div className="jsa-card-title">{analysis.jobTitle}</div>
                                                <button
                                                    className="jsa-card-del-btn"
                                                    onClick={(e) => handleDeleteAnalysis(analysis.jobId, e)}
                                                    title="Delete analysis"
                                                >🗑</button>
                                            </div>
                                            <div className="jsa-card-pill-row">
                                                <span className="jsa-pill essential">{essentialCount} Essential</span>
                                                <span className="jsa-pill optional">{optionalCount} Optional</span>
                                            </div>
                                            <div className="jsa-card-progress-wrap">
                                                <div className="jsa-card-progress-bar">
                                                    <div className="jsa-card-progress-fill" style={{ width: `${prog}%` }} />
                                                </div>
                                                <span className="jsa-card-progress-label">{prog}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* ── Skill Detail View ── */}
                        {selectedAnalysis && (
                            <section className="jsa-detail-section">
                                <div className="jsa-detail-header">
                                    <div className="jsa-detail-title-block">
                                        <h2>{selectedAnalysis.jobTitle}</h2>
                                        <div className="jsa-detail-meta">
                                            <span className="jsa-meta-chip">{selectedAnalysis.skills.length} skills total</span>
                                            <span className="jsa-meta-chip success">{getProgress(selectedAnalysis)}% mastered</span>
                                        </div>
                                    </div>
                                    {/* Overall progress bar */}
                                    <div className="jsa-detail-progress-wrap">
                                        <div className="jsa-detail-progress-bar">
                                            <div
                                                className="jsa-detail-progress-fill"
                                                style={{ width: `${getProgress(selectedAnalysis)}%` }}
                                            />
                                        </div>
                                        <span className="jsa-detail-progress-pct">{getProgress(selectedAnalysis)}%</span>
                                    </div>
                                </div>

                                {/* Filter tabs */}
                                <div className="jsa-filter-tabs">
                                    {[
                                        { key: 'all', label: `All (${selectedAnalysis.skills.length})` },
                                        { key: 'essential', label: `Essential (${selectedAnalysis.skills.filter(s => s.importance === 'Essential').length})` },
                                        { key: 'optional', label: `Optional (${selectedAnalysis.skills.filter(s => s.importance === 'Optional').length})` },
                                        { key: 'pending', label: `Pending (${selectedAnalysis.skills.filter(s => s.status === 'pending').length})` },
                                        { key: 'completed', label: `Mastered (${selectedAnalysis.skills.filter(s => s.status === 'completed').length})` },
                                    ].map(tab => (
                                        <button
                                            key={tab.key}
                                            className={`jsa-filter-tab ${activeFilter === tab.key ? 'active' : ''}`}
                                            onClick={() => setActiveFilter(tab.key)}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {sortedSkills.length === 0 ? (
                                    <div className="jsa-filter-empty">No skills match this filter.</div>
                                ) : (
                                    <div className="jsa-skills-grid">
                                        {sortedSkills.map(skill => (
                                            <SkillCard
                                                key={skill._id}
                                                skill={skill}
                                                editingNote={editingNote}
                                                setEditingNote={setEditingNote}
                                                savingNote={savingNote}
                                                onToggleStatus={handleToggleStatus}
                                                onSaveNote={handleSaveNote}
                                                onDelete={handleDeleteSkill}
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}
                    </div>
                )}
            </main>

            {/* ── Analyze New Job Modal ── */}
            {showModal && (
                <div className="jsa-overlay" onClick={() => !analyzingJobId && setShowModal(false)}>
                    <div className="jsa-modal" onClick={e => e.stopPropagation()}>
                        <div className="jsa-modal-header">
                            <div>
                                <h3>Analyze a Saved Job</h3>
                                <p>Select a job to generate your AI-powered skill roadmap</p>
                            </div>
                            {!analyzingJobId && (
                                <button className="jsa-modal-close" onClick={() => setShowModal(false)}>×</button>
                            )}
                        </div>

                        {analyzingJobId ? (
                            <div className="jsa-analyzing-state">
                                <div className="jsa-analyze-spinner" />
                                <h4>Analyzing skills…</h4>
                                <p>Our AI is identifying the most relevant skills for your role. This takes a few seconds.</p>
                                <div className="jsa-analyze-dots">
                                    <span /><span /><span />
                                </div>
                            </div>
                        ) : unanalyzedJobs.length === 0 ? (
                            <div className="jsa-modal-empty">
                                <span className="jsa-modal-empty-icon">🎉</span>
                                <p>All your saved jobs have been analyzed!</p>
                                <button className="jsa-btn-primary" onClick={() => navigate('/job-analyzer')}>
                                    Find More Jobs
                                </button>
                            </div>
                        ) : (
                            <div className="jsa-modal-job-list">
                                {unanalyzedJobs.map(job => (
                                    <div key={job._id} className="jsa-modal-job-row">
                                        <div className="jsa-modal-job-info">
                                            <div className="jsa-modal-job-title">{job.title}</div>
                                            <div className="jsa-modal-job-sub">{job.company} · {job.location}</div>
                                        </div>
                                        <button
                                            className="jsa-modal-analyze-btn"
                                            onClick={() => handleAnalyze(job.jobId)}
                                        >
                                            Analyze →
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Toast ── */}
            {toast && (
                <div className="jsa-toast">{toast}</div>
            )}

            <Footer />
        </div>
    );
}
