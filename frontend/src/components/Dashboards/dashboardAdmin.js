import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import './dashboardAdmin.css';
import API_BASE_URL from '../../apiConfig';

const DashboardAdmin = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');

    // Verify admin access locally
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        console.log("Token exists:", !!token);
        console.log("User stored:", userStr);

        if (!token || !userStr) {
            navigate('/login');
            return;
        }
        try {
            const user = JSON.parse(userStr);
            console.log("User role:", user.role);
            if (user.role !== 'admin') {
                console.log("Not admin, redirecting to home");
                navigate('/home');
            }
        } catch (e) {
            console.error("Error parsing user:", e);
            navigate('/login');
        }
    }, [navigate, token]);

    // Define fetchDashboardData to pull all real data
    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch both Users and Backend Aggregated Stats
            const [usersRes, statsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/v1/users`, { headers }),
                axios.get(`${API_BASE_URL}/api/v1/users/admin/stats`, { headers })
            ]);

            setUsers(usersRes.data.data || []);
            setStats(statsRes.data.data || null);
            setError('');
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            } else {
                setError(err.response?.data?.error?.errorDescription || 'Failed to load system data');
            }
        } finally {
            setLoading(false);
        }
    }, [token, navigate]);

    useEffect(() => {
        if (token) {
            fetchDashboardData();
        }
    }, [token, fetchDashboardData]);

    const handleUpdateStatus = async (userId, newStatus) => {
        try {
            console.log(`Updating user ${userId} status to ${newStatus}`);
            const response = await axios.put(`${API_BASE_URL}/api/v1/users/${userId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Update status response:", response.data);
            // Refresh list
            fetchDashboardData();
        } catch (err) {
            console.error("Error updating status:", err);
            alert('Failed to update: ' + (err.response?.data?.error?.errorDescription || 'Unknown error'));
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure?")) {
            try {
                await axios.delete(`${API_BASE_URL}/api/v1/users/admin/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchDashboardData();
            } catch (err) {
                console.error("Error deleting:", err);
                alert('Delete failed');
            }
        }
    };

    if (loading) return <div className="admin-loading">Loading Admin Dashboard...</div>;

    const activeUsers = users.filter(u => u.status === 'active').length;
    const blockedUsers = users.filter(u => u.status === 'blocked').length;
    // Removed unused pendingUsers variable

    return (
        <div className="admin-page-wrapper">
            <Navbar />
            <div className="admin-dashboard-container">
                <header className="admin-header">
                    <div className="header-left">
                        <h1>Admin Control Panel</h1>
                        <span className="platform-name">Skill Bridge App</span>
                    </div>
                </header>

                <div className="admin-content">
                    {/* ── TOP STATS ── */}
                    <div className="admin-stats">
                        <div className="stat-card">
                            <span className="material-icons-round stat-icon">people</span>
                            <div>
                                <h3>Total Users</h3>
                                <p className="stat-number">{stats?.overview?.totalUsers || users.length}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <span className="material-icons-round stat-icon">map</span>
                            <div>
                                <h3>Total Roadmaps</h3>
                                <p className="stat-number">{stats?.overview?.totalRoadmaps || 0}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <span className="material-icons-round stat-icon">work</span>
                            <div>
                                <h3>Saved Jobs</h3>
                                <p className="stat-number">{stats?.overview?.totalSavedJobs || 0}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <span className="material-icons-round stat-icon">trending_up</span>
                            <div>
                                <h3>System Activity</h3>
                                <p className="stat-number">{stats?.overview?.recentInteractions || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="admin-users-section">
                        <div className="section-header">
                            <h2>User Management</h2>
                            <button className="refresh-btn" onClick={fetchDashboardData}>Refresh Data</button>
                        </div>

                        {error && <p className="error-msg" style={{ backgroundColor: "#f8d7da", color: "#721c24", padding: "10px", borderRadius: "4px", marginBottom: "15px" }}>⚠️ {error}</p>}

                        <div className="table-wrapper">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>User ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? users.map(user => (
                                        <tr key={user._id}>
                                            <td className="user-id">{user.userId}</td>
                                            <td className="user-name">{user.name}</td>
                                            <td className="user-email">{user.email}</td>
                                            <td><span className={`role-badge ${user.role || 'user'}`}>{user.role || 'user'}</span></td>
                                            <td><span className={`status-badge ${user.status || 'active'}`}>{user.status || 'active'}</span></td>
                                            <td className="action-buttons">
                                                {(user.status === 'active' || user.status === 'blocked') ? (
                                                    <button className="btn-block" onClick={() => handleUpdateStatus(user._id, user.status === 'active' ? 'blocked' : 'active')}>
                                                        {user.status === 'active' ? 'Block' : 'Unblock'}
                                                    </button>
                                                ) : (
                                                    <button className="btn-approve" onClick={() => handleUpdateStatus(user._id, 'active')}>Approve</button>
                                                )}
                                                <button className="btn-delete" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="no-users">No users found in the system.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── ANALYTICS SECTION ── */}
                    <div className="admin-analytics-section">
                        <div className="analytics-grid">
                            {/* Registration Growth Chart */}
                            <div className="chart-card">
                                <div className="chart-header">
                                    <h3>User Registration History</h3>
                                    <p>Daily growth based on actual database records</p>
                                </div>
                                <div className="chart-wrapper">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={stats?.userGrowth || []}>
                                            <defs>
                                                <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#2d1ced" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#2d1ced" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                            <XAxis dataKey="date" hide={false} axisLine={false} tick={{ fontSize: 10 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                            <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.08)' }} />
                                            <Area type="monotone" dataKey="count" stroke="#2d1ced" strokeWidth={3} fillOpacity={1} fill="url(#colorReg)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Skill Trends Chart */}
                            <div className="chart-card">
                                <div className="chart-header">
                                    <h3>Most Popular Skills</h3>
                                    <p>Based on roadmaps added by users</p>
                                </div>
                                <div className="chart-wrapper">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={stats?.skillTrends || []} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="skill" type="category" width={100} tick={{ fontSize: 10, fontWeight: 600 }} axisLine={false} />
                                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.08)' }} />
                                            <Bar dataKey="count" fill="#74b7db" radius={[0, 4, 4, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardAdmin;