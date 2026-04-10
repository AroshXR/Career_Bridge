import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import './dashboardAdmin.css';

const DashboardAdmin = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
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

    // Define fetchUsers with useCallback to avoid dependency issues
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            console.log("Fetching users from: http://localhost:5000/api/v1/users");
            console.log("Using token:", token);
            
            const response = await axios.get('http://localhost:5000/api/v1/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log("Full response:", response);
            console.log("Response data:", response.data);
            console.log("Users data:", response.data.data);
            
            setUsers(response.data.data || []);
            setError(''); // Clear error on success
            setLoading(false);
        } catch (err) {
            console.error("Error fetching users - Full error:", err);
            console.error("Error response:", err.response);
            console.error("Error response data:", err.response?.data);
            console.error("Error response status:", err.response?.status);
            
            // Show specific error message
            if (err.response?.status === 403) {
                setError('Access denied. Admin privileges required.');
            } else if (err.response?.status === 401) {
                setError('Session expired. Please login again.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(err.response?.data?.error?.errorDescription || err.response?.data?.message || 'Failed to fetch users');
            }
            setLoading(false);
        }
    }, [token, navigate]);

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token, fetchUsers]); // Added fetchUsers to dependencies

    const handleUpdateStatus = async (userId, newStatus) => {
        try {
            console.log(`Updating user ${userId} status to ${newStatus}`);
            const response = await axios.put(`http://localhost:5000/api/v1/users/${userId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Update status response:", response.data);
            // Refresh list
            fetchUsers();
        } catch (err) {
            console.error("Error updating status:", err);
            console.error("Error response:", err.response?.data);
            alert('Failed to update status: ' + (err.response?.data?.error?.errorDescription || 'Unknown error'));
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to permanently delete this user?")) {
            try {
                console.log(`Deleting user ${userId}`);
                const response = await axios.delete(`http://localhost:5000/api/v1/users/admin/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Delete response:", response.data);
                fetchUsers();
            } catch (err) {
                console.error("Error deleting user:", err);
                console.error("Error response:", err.response?.data);
                alert('Failed to delete user: ' + (err.response?.data?.error?.errorDescription || 'Unknown error'));
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
                <div className="admin-stats">
                    <div className="stat-card">
                        <h3>Total Users</h3>
                        <p className="stat-number">{users.length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Active Users</h3>
                        <p className="stat-number active">{activeUsers}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Blocked Users</h3>
                        <p className="stat-number blocked">{blockedUsers}</p>
                    </div>
                </div>

                <div className="admin-users-section">
                    <div className="section-header">
                        <h2>User Management</h2>
                        <button className="refresh-btn" onClick={fetchUsers}>Refresh Data</button>
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
            </div>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardAdmin;