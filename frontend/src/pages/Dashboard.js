import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [resources, setResources] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', tag: '', link: '' });
  const [doubtData, setDoubtData] = useState({ question: '', description: '', tag: '', status: 'unsolved' });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resources');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // New state for enhanced delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ id: null, type: null });

  useEffect(() => {
    fetchResources();
    fetchDoubts();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/resources');
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoubts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/doubts');
      setDoubts(response.data);
    } catch (error) {
      console.error('Error fetching doubts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResourceSubmit = async (e) => {
    e.preventDefault();
    try {
      const newResource = { ...formData };
      const response = await axios.post('http://localhost:5000/api/resources', newResource);
      setResources([...resources, response.data]);
      setFormData({ title: '', description: '', tag: '', link: '' });
    } catch (error) {
      console.error('Error submitting resource:', error);
    }
  };

  const handleDoubtSubmit = async (e) => {
    e.preventDefault();
    try {
      const newDoubt = { ...doubtData };
      const response = await axios.post('http://localhost:5000/api/doubts', newDoubt);
      setDoubts([...doubts, response.data]);
      setDoubtData({ question: '', description: '', tag: '', status: 'unsolved' });
    } catch (error) {
      console.error('Error submitting doubt:', error);
    }
  };

  const handleDeleteResource = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/resources/${id}`);
      setResources(resources.filter(resource => resource._id !== id));
    } catch (error) {
      console.error('Error deleting resource:', error);
    } finally {
      setConfirmDelete(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteDoubt = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/doubts/${id}`);
      setDoubts(doubts.filter(doubt => doubt._id !== id));
    } catch (error) {
      console.error('Error deleting doubt:', error);
    } finally {
      setConfirmDelete(false);
      setShowDeleteModal(false);
    }
  };

  const handleMarkResolved = async (id) => {
    try {
      const updatedDoubt = await axios.put(`http://localhost:5000/api/doubts/${id}`, { status: 'solved' });
      setDoubts(doubts.map(doubt => (doubt._id === id ? updatedDoubt.data : doubt)));
    } catch (error) {
      console.error('Error resolving doubt:', error);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  };

  const filteredResources = resources.filter(
    (res) =>
      res.title.toLowerCase().includes(searchTerm) ||
      res.description.toLowerCase().includes(searchTerm) ||
      res.tag.toLowerCase().includes(searchTerm)
  );

  const filteredDoubts = doubts.filter((doubt) => {
    const statusMatch = filterStatus === 'all' || doubt.status === filterStatus;
    const searchMatch = doubt.question.toLowerCase().includes(searchTerm) ||
                       doubt.description.toLowerCase().includes(searchTerm) ||
                       doubt.tag.toLowerCase().includes(searchTerm);
    return statusMatch && searchMatch;
  });

  const sortedResources = [...filteredResources].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const sortedDoubts = [...filteredDoubts].sort((a, b) => {
    if (sortBy === 'question') {
      return a.question.localeCompare(b.question);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const totalResources = resources.length;
  const totalDoubts = doubts.length;
  const solvedDoubts = doubts.filter((d) => d.status === 'solved').length;
  const unsolvedDoubts = totalDoubts - solvedDoubts;

  // New delete confirmation handlers
  const handleDeleteClick = (id, type) => {
    setItemToDelete({ id, type });
    setShowDeleteModal(true);
  };

  const confirmDeleteAction = () => {
    if (itemToDelete.type === 'resource') {
      handleDeleteResource(itemToDelete.id);
    } else if (itemToDelete.type === 'doubt') {
      handleDeleteDoubt(itemToDelete.id);
    }
  };

  return (
    <div className={`dashboard-wrapper ${isDarkMode ? 'dark' : ''}`}>
      <h2 className="dash-title">Study Resource & Doubt Manager</h2>

      <div className="dark-mode-toggle">
        <label className="switch">
          <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
          <span className="slider round"></span>
        </label>
      </div>

      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-number">{totalResources}</div>
          <div className="stat-label">Resources</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalDoubts}</div>
          <div className="stat-label">Total Doubts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{solvedDoubts}</div>
          <div className="stat-label">Solved</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{unsolvedDoubts}</div>
          <div className="stat-label">Unsolved</div>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by title, description, or tag..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('resources')}
        >
          Resources
        </button>
        <button
          className={`tab-btn ${activeTab === 'doubts' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('doubts')}
        >
          Doubts
        </button>
      </div>

      {activeTab === 'doubts' && (
        <div className="doubt-filter">
          <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
            <option value="all">All</option>
            <option value="unsolved">Unsolved</option>
            <option value="solved">Solved</option>
          </select>
        </div>
      )}
      <div className="sorting-controls">
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
          <option value="question">Sort by Question</option>
        </select>
      </div>

      <div className="dash-form">
        {activeTab === 'resources' ? (
          <form onSubmit={handleResourceSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="input-large"
            />
            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="input-large"
            />
            <input
              type="text"
              placeholder="Link"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="input-large"
            />
            <input
              type="text"
              placeholder="Tag"
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              className="input-large"
            />
            <button type="submit" className="submit-btn">Add Resource</button>
          </form>
        ) : (
          <form onSubmit={handleDoubtSubmit}>
            <input
              type="text"
              placeholder="Question"
              value={doubtData.question}
              onChange={(e) => setDoubtData({ ...doubtData, question: e.target.value })}
              required
              className="input-large"
            />
            <input
              type="text"
              placeholder="Description"
              value={doubtData.description}
              onChange={(e) => setDoubtData({ ...doubtData, description: e.target.value })}
              required
              className="input-large"
            />
            <input
              type="text"
              placeholder="Tag"
              value={doubtData.tag}
              onChange={(e) => setDoubtData({ ...doubtData, tag: e.target.value })}
              className="input-large"
            />
            <select
              value={doubtData.status}
              onChange={(e) => setDoubtData({ ...doubtData, status: e.target.value })}
              className="input-large"
            >
              <option value="unsolved">Unsolved</option>
              <option value="solved">Solved</option>
            </select>
            <button type="submit" className="submit-btn">Add Doubt</button>
          </form>
        )}
      </div>

      <div className="section">
        {loading ? (
          <div className="dash-loading">Loading...</div>
        ) : (
          <div className="card-grid">
            {activeTab === 'resources'
              ? sortedResources.map((resource) => (
                  <div key={resource._id} className="card">
                    <h5>{resource.title}</h5>
                    <p>{resource.description}</p>
                    <p className="tag">{resource.tag}</p>
                    <a href={resource.link} target="_blank" rel="noopener noreferrer">Link</a>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(resource._id, 'resource')}
                    >
                      🗑️
                    </button>
                  </div>
                ))
              : sortedDoubts.map((doubt) => (
                  <div key={doubt._id} className="card">
                    <h5>{doubt.question}</h5>
                    <p>{doubt.description}</p>
                    <p className="tag">{doubt.tag}</p>
                    <span className={`badge ${doubt.status === 'solved' ? 'solved' : 'unsolved'}`}>
                      {doubt.status}
                    </span>
                    <div className="action-btns">
                      {doubt.status === 'unsolved' && (
                        <button className="resolved-btn" onClick={() => handleMarkResolved(doubt._id)}>
                          Mark as Solved
                        </button>
                      )}
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteClick(doubt._id, 'doubt')}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>

      {/* New Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this {itemToDelete.type}?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmDeleteAction}>
                Delete
              </button>
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Original confirmation modal (kept for compatibility) */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure you want to delete this item?</h3>
            <div className="modal-actions">
              <button
                className="confirm-btn"
                onClick={() => {
                  if (deleteId) {
                    if (activeTab === 'resources') {
                      handleDeleteResource(deleteId);
                    } else {
                      handleDeleteDoubt(deleteId);
                    }
                  }
                }}
              >
                Yes
              </button>
              <button className="cancel-btn" onClick={() => setConfirmDelete(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;