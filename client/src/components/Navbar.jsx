import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ApiStatusBadge from './ApiStatusBadge';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🐾</span>
          <span className="logo-title">PetCare Planner</span>
          <span className="badge-team">PawTech</span>
        </Link>

        <nav className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Dashboard
          </NavLink>
          <NavLink to="/pets" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Pet Profiles
          </NavLink>
          <NavLink to="/reminders" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Reminders & Timeline
          </NavLink>
          <NavLink to="/team" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Team Distribution
          </NavLink>
        </nav>

        <div className="navbar-actions">
          <ApiStatusBadge />
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <span className="user-greeting">Hi, {user?.name || 'Owner'}</span>
              <button onClick={handleLogout} className="btn-logout">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">
                Sign In
              </Link>
              <Link to="/register" className="btn-register">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
