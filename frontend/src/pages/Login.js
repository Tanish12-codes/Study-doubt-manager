import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // ✅ use your auth context
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ login method from context
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
      } else {
        login(data.token); // ✅ save token to context + localStorage
        navigate('/dashboard'); // Redirect to dashboard after login
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form glass" onSubmit={handleSubmit}>
        <h2>🔐 Login</h2>

        <input
          type="text"
          className="auth-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="auth-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-action">
          <button className="auth-btn" type="submit">Login</button>
          <span className="auth-note wiggle-emoji">🤪 <Link to="/register">New here? Sign up</Link></span>
        </div>
      </form>
    </div>
  );
};

export default Login;
