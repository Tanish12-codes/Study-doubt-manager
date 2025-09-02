import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import '../App.css';

const Navbar = () => {
  const { token, logout } = useContext(AuthContext); // Access token and logout from AuthContext
  const history = useHistory(); // For navigation after logout

  const handleLogout = () => {
    logout(); // Call logout function from context
    history.push('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2 className="logo">📚 Study Doubt Manager</h2>
      </div>

      <div className="nav-links" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {/* TEMPORARY DASHBOARD ACCESS */}
      
        {/* Conditional rendering for Login/Logout based on token */}
        {!token ? (
          <>
            <Link to="/login" className="nav-link">
              Login
              <span className="wiggle-emoji" role="img" aria-label="goofy emoji"> 🤪 </span>
            </Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        ) : (
          <button className="nav-link" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            Logout
          </button>
        )}

        {/* DARK MODE TOGGLE (still on far right) */}
        <span className="dark-mode-toggle" role="img" aria-label="dark mode">🌙</span>
      </div>
    </nav>
  );
};

export default Navbar;
