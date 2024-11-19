import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiRequest from '../../lib/apiRequest';
import { Users, FileText } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({});
  const [editingUser, setEditingUser] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [selectedView, setSelectedView] = useState('users');
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    password: '',
    isAdmin: false
  });
  const [editPostForm, setEditPostForm] = useState({
    title: '',
    price: 0,
    type: 'rent',
    property: 'apartment',
    bedroom: 1,
    bathroom: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, postsRes, statsRes] = await Promise.all([
        apiRequest.get('/admin/users'),
        apiRequest.get('/admin/posts'),
        apiRequest.get('/admin/stats')
      ]);
      
      setUsers(usersRes.data);
      setPosts(postsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user.id);
    setEditForm({
      username: user.username,
      email: user.email,
      password: '',
      isAdmin: user.isAdmin
    });
  };

  const handleUpdateUser = async (userId) => {
    try {
      const response = await apiRequest.put(`/admin/users/${userId}`, editForm);
      setUsers(users.map((user) => (user.id === userId ? response.data : user)));
      setEditingUser(null);
      setEditForm({ username: '', email: '', password: '', isAdmin: false });
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await apiRequest.delete(`/admin/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
      setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post.id);
    setEditPostForm({
      title: post.title,
      price: post.price,
      type: post.type,
      property: post.property,
      bedroom: post.bedroom,
      bathroom: post.bathroom
    });
  };

  const handleUpdatePost = async (postId) => {
    try {
      const response = await apiRequest.put(`/admin/posts/${postId}`, editPostForm);
      setPosts(posts.map((post) => (post.id === postId ? response.data : post)));
      setEditingPost(null);
      setEditPostForm({
        title: '',
        price: 0,
        type: 'rent',
        property: 'apartment',
        bedroom: 1,
        bathroom: 1
      });
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await apiRequest.delete(`/admin/posts/${postId}`);
      setPosts(posts.filter((post) => post.id !== postId));
      setStats((prev) => ({ ...prev, totalPosts: prev.totalPosts - 1 }));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const renderUserEditForm = (user) => (
    <tr key={user.id} className="edit-row">
      <td>
        <input
          type="text"
          value={editForm.username}
          onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
          className="edit-input"
          placeholder="Username"
        />
      </td>
      <td>
        <input
          type="email"
          value={editForm.email}
          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
          className="edit-input"
          placeholder="Email"
        />
      </td>
      <td>
        <input
          type="password"
          value={editForm.password}
          onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
          className="edit-input"
          placeholder="New password (optional)"
        />
      </td>
      <td>
        <label className="admin-checkbox">
          <input
            type="checkbox"
            checked={editForm.isAdmin}
            onChange={(e) => setEditForm({ ...editForm, isAdmin: e.target.checked })}
          />
          Admin
        </label>
      </td>
      <td className="action-buttons">
        <button onClick={() => handleUpdateUser(user.id)} className="button-save">Save</button>
        <button onClick={() => setEditingUser(null)} className="button-cancel">Cancel</button>
      </td>
    </tr>
  );

  const renderPostEditForm = (post) => (
    <tr key={post.id} className="edit-row">
      <td>
        <input
          type="text"
          value={editPostForm.title}
          onChange={(e) => setEditPostForm({ ...editPostForm, title: e.target.value })}
          className="edit-input"
          placeholder="Title"
        />
      </td>
      <td>
        <input
          type="number"
          value={editPostForm.price}
          onChange={(e) => setEditPostForm({ ...editPostForm, price: Number(e.target.value) })}
          className="edit-input"
          min="0"
        />
      </td>
      <td>
        <select
          value={editPostForm.type}
          onChange={(e) => setEditPostForm({ ...editPostForm, type: e.target.value })}
          className="edit-input"
        >
          <option value="rent">Rent</option>
          <option value="buy">Buy</option>
        </select>
      </td>
      <td>
        <select
          value={editPostForm.property}
          onChange={(e) => setEditPostForm({ ...editPostForm, property: e.target.value })}
          className="edit-input"
        >
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="condo">Condo</option>
          <option value="land">Land</option>
        </select>
      </td>
      <td>
        <input
          type="number"
          value={editPostForm.bedroom}
          onChange={(e) => setEditPostForm({ ...editPostForm, bedroom: Number(e.target.value) })}
          className="edit-input"
          min="0"
        />
      </td>
      <td>
        <input
          type="number"
          value={editPostForm.bathroom}
          onChange={(e) => setEditPostForm({ ...editPostForm, bathroom: Number(e.target.value) })}
          className="edit-input"
          min="0"
        />
      </td>
      <td className="action-buttons">
        <button onClick={() => handleUpdatePost(post.id)} className="button-save">Save</button>
        <button onClick={() => setEditingPost(null)} className="button-cancel">Cancel</button>
      </td>
    </tr>
  );

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <Users size={24} />
          <h3>Total Users</h3>
          <p>{stats.totalUsers || 0}</p>
        </div>
        <div className="stat-card">
          <FileText size={24} />
          <h3>Total Posts</h3>
          <p>{stats.totalPosts || 0}</p>
        </div>
      </div>

      <div className="view-selector">
        <button
          onClick={() => setSelectedView('users')}
          className={`view-button ${selectedView === 'users' ? 'active' : ''}`}
        >
          Users
        </button>
        <button
          onClick={() => setSelectedView('posts')}
          className={`view-button ${selectedView === 'posts' ? 'active' : ''}`}
        >
          Posts
        </button>
      </div>

      {selectedView === 'users' && (
        <div className="user-list">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Password</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>******</td>
                  <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                  <td className="action-buttons">
                    <button onClick={() => handleEditUser(user)} className="button-edit">Edit</button>
                    <button onClick={() => handleDeleteUser(user.id)} className="button-delete">Delete</button>
                  </td>
                </tr>
              ))}
              {editingUser && renderUserEditForm(users.find((user) => user.id === editingUser))}
            </tbody>
          </table>
        </div>
      )}

      {selectedView === 'posts' && (
        <div className="post-list">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Type</th>
                <th>Property</th>
                <th>Bedroom</th>
                <th>Bathroom</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>{post.price}</td>
                  <td>{post.type}</td>
                  <td>{post.property}</td>
                  <td>{post.bedroom}</td>
                  <td>{post.bathroom}</td>
                  <td className="action-buttons">
                    <button onClick={() => handleEditPost(post)} className="button-edit">Edit</button>
                    <button onClick={() => handleDeletePost(post.id)} className="button-delete">Delete</button>
                  </td>
                </tr>
              ))}
              {editingPost && renderPostEditForm(posts.find((post) => post.id === editingPost))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
