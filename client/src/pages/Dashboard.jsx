import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { checkApiHealth } from '../api/apiClient';
import petService from '../api/petService';
import reminderService from '../api/reminderService';

export default function Dashboard() {
  const [healthInfo, setHealthInfo] = useState(null);
  const [petCount, setPetCount] = useState(0);
  const [remindersSummary, setRemindersSummary] = useState({ total: 0, upcomingCount: 0, overdueCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [healthRes, petRes, reminderRes] = await Promise.allSettled([
          checkApiHealth(),
          petService.getAllPets(),
          reminderService.getReminders(),
        ]);

        if (healthRes.status === 'fulfilled' && healthRes.value.success) {
          setHealthInfo(healthRes.value.data);
        }

        if (petRes.status === 'fulfilled' && petRes.value.data) {
          setPetCount(petRes.value.data.length || 0);
        }

        if (reminderRes.status === 'fulfilled' && reminderRes.value.summary) {
          setRemindersSummary(reminderRes.value.summary);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="page-container">
      {/* Hero Header */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-badge">Team PawTech Innovators</div>
          <h1 className="hero-title">PetCare Planner</h1>
          <p className="hero-subtitle">
            Centralized Pet Care Records & Smart Reminder Board. Keep track of vaccinations, medical history, grooming sessions, and upcoming appointments.
          </p>
          <div className="hero-actions">
            <Link to="/pets" className="btn btn-primary">
              🐾 Manage Pets
            </Link>
            <Link to="/reminders" className="btn btn-secondary">
              ⏰ View Reminders
            </Link>
            <Link to="/team" className="btn btn-outline">
              👥 Team Work Board
            </Link>
          </div>
        </div>
      </section>

      {/* Integration Verification Card */}
      <section className="integration-card">
        <div className="integration-header">
          <div className="integration-badge">
            <span className="pulse-dot"></span>
            Integration & Project Lead Status
          </div>
          <span className="lead-tag">Lead: Godishala Kruthik Roshan (2303A52339)</span>
        </div>
        <div className="integration-body">
          <div className="integration-item">
            <span className="label">API Gateway Status:</span>
            <span className={`val-badge ${healthInfo ? 'online' : 'offline'}`}>
              {healthInfo ? 'CONNECTED (Port 5000)' : 'CHECKING / OFFLINE'}
            </span>
          </div>
          <div className="integration-item">
            <span className="label">Database State:</span>
            <span className="val-text">{healthInfo?.database || 'Auto-Detected (Mongoose)'}</span>
          </div>
          <div className="integration-item">
            <span className="label">Frontend-Backend Bridge:</span>
            <span className="val-text">Vite Proxy + Axios Interceptor</span>
          </div>
          <div className="integration-item">
            <span className="label">Project Deliverable:</span>
            <span className="val-text">MERN Architecture & Submissions Ready</span>
          </div>
        </div>
      </section>

      {/* Quick Metrics */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🐕</div>
          <div className="stat-content">
            <span className="stat-value">{loading ? '...' : petCount}</span>
            <span className="stat-label">Registered Pets</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <span className="stat-value">{loading ? '...' : remindersSummary.upcomingCount}</span>
            <span className="stat-label">Upcoming Reminders</span>
          </div>
        </div>

        <div className="stat-card overdue-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <span className="stat-value">{loading ? '...' : remindersSummary.overdueCount}</span>
            <span className="stat-label">Overdue Alerts</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <span className="stat-value">{loading ? '...' : remindersSummary.total}</span>
            <span className="stat-label">Total Care Records</span>
          </div>
        </div>
      </section>

      {/* Quick Feature Highlights */}
      <section className="dashboard-features">
        <div className="feature-box">
          <h3>🐶 Pet Profiles</h3>
          <p>Assigned to Siddartha Raj (2303A51917). Store species, breed, medical alerts, allergies, and photos.</p>
          <Link to="/pets" className="feature-link">Explore Profiles →</Link>
        </div>
        <div className="feature-box">
          <h3>🔐 Secure Authentication</h3>
          <p>Assigned to Chippa Vasu (2303A51618). JWT authentication and role-based owner data segregation.</p>
          <Link to="/login" className="feature-link">Auth Gateway →</Link>
        </div>
        <div className="feature-box">
          <h3>💾 Database & CRUD APIs</h3>
          <p>Assigned to Bodasu Nithin (2303A51803). MongoDB schema definitions and RESTful endpoints.</p>
          <Link to="/team" className="feature-link">View API Contracts →</Link>
        </div>
        <div className="feature-box">
          <h3>⏰ Reminders & Timeline</h3>
          <p>Assigned to Matapally Meghana (2303A52505). Date calculation engine for overdue and upcoming pet care.</p>
          <Link to="/reminders" className="feature-link">Check Timeline →</Link>
        </div>
      </section>
    </div>
  );
}
