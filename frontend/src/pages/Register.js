// src/pages/Signup.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Auth.css'; // ✅ lowercase, matches your Login import

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');  // New username state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(username, email, password);  // Pass username to signup function
      navigate('/');
    } catch (err) {
      setError('Signup failed: ' + err.message);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form glass">
        <h2>📝 Sign Up</h2>

        <input
          type="text"
          className="auth-input"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          className="auth-input"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="auth-input"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-action">
          <button className="auth-btn" type="submit">Sign Up</button>
          <span className="auth-note wiggle-emoji">🤓 <Link to="/login">Already have an account?</Link></span>
        </div>
      </form>
    </div>
  );
};

export default Signup;
