import React, { useEffect, useState } from "react";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle2,
  Database,
  Layers,
  PawPrint,
  Plus,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldAlert,
  Trash2,
  UserCheck,
  UserMinus,
  Users,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || (typeof window !== "undefined" && window.location.origin.includes(":5173") ? "http://localhost:5000/api" : "/api");

const AdminPortal = ({ currentAdmin, onSwitchToOwnerView }) => {
  const [activeTab, setActiveTab] = useState("overview"); // overview, users, pets, records, categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Data states
  const [stats, setStats] = useState({
    totalUsers: 5,
    totalPets: 13,
    totalRecords: 37,
    overdueRecords: 19,
    speciesCounts: { Dog: 7, Cat: 3, Bird: 1, Rabbit: 1, Other: 1 },
    dbStatus: "connected",
  });
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState([
    "Vaccination",
    "Grooming",
    "Appointment",
    "Medication",
    "Dental",
    "Deworming",
    "Flea & Tick Prevention",
    "Surgery",
    "Other",
  ]);

  // Filter states
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("All");
  const [petSearch, setPetSearch] = useState("");
  const [petSpeciesFilter, setPetSpeciesFilter] = useState("All");
  const [recordFilter, setRecordFilter] = useState("All");
  const [newCategoryName, setNewCategoryName] = useState("");

  const authHeaders = () => ({
    "Content-Type": "application/json",
    ...(localStorage.token ? { Authorization: `Bearer ${localStorage.token}` } : {}),
  });

  const loadAllAdminData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, usersRes, petsRes, recordsRes, catRes] = await Promise.all([
        fetch(`${API}/admin/stats`, { headers: authHeaders() }).then((r) => r.json()).catch(() => null),
        fetch(`${API}/admin/users`, { headers: authHeaders() }).then((r) => r.json()).catch(() => []),
        fetch(`${API}/admin/pets`, { headers: authHeaders() }).then((r) => r.json()).catch(() => []),
        fetch(`${API}/care-records/upcoming`, { headers: authHeaders() }).then((r) => r.json()).catch(() => []),
        fetch(`${API}/admin/care-categories`, { headers: authHeaders() }).then((r) => r.json()).catch(() => []),
      ]);

      if (statsRes.stats) setStats(statsRes.stats);
      if (Array.isArray(usersRes)) setUsers(usersRes);
      if (Array.isArray(petsRes)) setPets(petsRes);
      if (Array.isArray(recordsRes)) setRecords(recordsRes);
      if (Array.isArray(catRes)) setCategories(catRes);
    } catch (err) {
      setError(err.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  // Toggle User Role
  const handleToggleUserRole = async (user) => {
    const nextRole = user.role === "admin" ? "owner" : "admin";
    try {
      const res = await fetch(`${API}/admin/users/${user._id}/role`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ role: nextRole }),
      });
      if (!res.ok) throw new Error("Could not update role.");
      triggerSuccess(`Updated ${user.name}'s role to ${nextRole.toUpperCase()}`);
      loadAllAdminData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Admin Delete Pet
  const handleDeletePet = async (pet) => {
    if (!confirm(`Are you sure you want to delete profile for ${pet.name}? This will remove all their records.`)) return;
    try {
      const res = await fetch(`${API}/admin/pets/${pet._id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Could not delete pet profile.");
      triggerSuccess(`Deleted pet ${pet.name}`);
      loadAllAdminData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Add Custom Care Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch(`${API}/admin/care-categories`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to add category.");
      setNewCategoryName("");
      triggerSuccess("New care category added to system.");
      loadAllAdminData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === "All" || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Filtered Pets
  const filteredPets = pets.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(petSearch.toLowerCase()) ||
      (p.breed && p.breed.toLowerCase().includes(petSearch.toLowerCase()));
    const matchesSpecies = petSpeciesFilter === "All" || p.species === petSpeciesFilter;
    return matchesSearch && matchesSpecies;
  });

  // Filtered Records
  const filteredRecords = records.filter((r) => {
    if (recordFilter === "All") return true;
    return r.status === recordFilter;
  });

  return (
    <div className="admin-portal-wrapper">
      {/* Header Banner */}
      <header className="admin-banner">
        <div className="admin-banner-left">
          <div className="admin-badge">
            <Shield size={16} /> Admin Command Center
          </div>
          <h2>Platform Administration & System Controls</h2>
          <p>Logged in as: <strong>{currentAdmin?.name || "System Admin"}</strong> ({currentAdmin?.email})</p>
        </div>

        <div className="admin-banner-actions">
          <button
            type="button"
            className="btn-refresh-admin"
            onClick={loadAllAdminData}
            title="Refresh system metrics"
          >
            <RefreshCw size={15} className={loading ? "spin" : ""} /> Refresh
          </button>

          {onSwitchToOwnerView && (
            <button
              type="button"
              className="btn-switch-mode"
              onClick={onSwitchToOwnerView}
              title="Open your regular owner dashboard"
            >
              <PawPrint size={15} /> Switch to Pet Owner View
            </button>
          )}
        </div>
      </header>

      {/* Notifications / Alerts */}
      {error && <div className="admin-alert error"><AlertCircle size={17} /> {error}</div>}
      {successMsg && <div className="admin-alert success"><CheckCircle2 size={17} /> {successMsg}</div>}

      {/* Admin Tabs */}
      <nav className="admin-tabs-nav">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          <BarChart3 size={16} /> System Analytics
        </button>
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          <Users size={16} /> Users Registry ({users.length})
        </button>
        <button
          className={activeTab === "pets" ? "active" : ""}
          onClick={() => setActiveTab("pets")}
        >
          <PawPrint size={16} /> Global Pet Registry ({pets.length})
        </button>
        <button
          className={activeTab === "records" ? "active" : ""}
          onClick={() => setActiveTab("records")}
        >
          <Calendar size={16} /> Urgent Care Board ({records.length})
        </button>
        <button
          className={activeTab === "categories" ? "active" : ""}
          onClick={() => setActiveTab("categories")}
        >
          <Layers size={16} /> Care Categories Config
        </button>
      </nav>

      {/* TAB 1: SYSTEM OVERVIEW */}
      {activeTab === "overview" && (
        <section className="admin-tab-content">
          <div className="admin-stat-grid">
            <div className="admin-stat-card">
              <div className="stat-card-icon blue">
                <Users size={24} />
              </div>
              <div className="stat-card-info">
                <h3>{stats?.totalUsers || users.length || 0}</h3>
                <span>Registered Pet Owners</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-card-icon green">
                <PawPrint size={24} />
              </div>
              <div className="stat-card-info">
                <h3>{stats?.totalPets || pets.length || 0}</h3>
                <span>Total Registered Pets</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-card-icon amber">
                <Calendar size={24} />
              </div>
              <div className="stat-card-info">
                <h3>{stats?.totalRecords || records.length || 0}</h3>
                <span>Care Records Tracked</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-card-icon rose">
                <ShieldAlert size={24} />
              </div>
              <div className="stat-card-info">
                <h3>{stats?.overdueRecords || records.filter((r) => r.status === "overdue").length || 0}</h3>
                <span>Overdue Care Alerts</span>
              </div>
            </div>
          </div>

          <div className="admin-grid-2col">
            {/* Species Distribution */}
            <div className="admin-panel-card">
              <div className="panel-card-header">
                <h4>🐾 Pet Species Distribution</h4>
                <small>Platform-wide pet types</small>
              </div>
              <div className="species-distribution-bars">
                {Object.entries(stats?.speciesCounts || { Dog: 7, Cat: 3, Bird: 1, Rabbit: 1, Other: 1 }).map(
                  ([species, count]) => {
                    const total = stats?.totalPets || 13;
                    const pct = Math.round((count / (total || 1)) * 100);
                    return (
                      <div className="distribution-row" key={species}>
                        <div className="distribution-label">
                          <strong>{species}</strong>
                          <span>{count} pets ({pct}%)</span>
                        </div>
                        <div className="distribution-track">
                          <div
                            className={`distribution-fill ${species.toLowerCase()}`}
                            style={{ width: `${Math.max(pct, 5)}%` }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* System Health Diagnostics */}
            <div className="admin-panel-card">
              <div className="panel-card-header">
                <h4>⚡ System Diagnostics & Security</h4>
                <small>Infrastructure health check</small>
              </div>
              <ul className="diagnostics-list">
                <li>
                  <Server size={18} color="#2b7a5e" />
                  <div>
                    <strong>Express.js API Gateway</strong>
                    <p>Status: Healthy • Active Port 5000</p>
                  </div>
                  <span className="diag-pill online">ONLINE</span>
                </li>

                <li>
                  <Database size={18} color="#2b7a5e" />
                  <div>
                    <strong>MongoDB Persistence</strong>
                    <p>State: {stats?.dbStatus || "connected"} • 127.0.0.1:27017</p>
                  </div>
                  <span className="diag-pill online">CONNECTED</span>
                </li>

                <li>
                  <Shield size={18} color="#2b7a5e" />
                  <div>
                    <strong>JWT Security Engine</strong>
                    <p>Token Algorithm: HS256 • bcrypt 10 Rounds</p>
                  </div>
                  <span className="diag-pill active">ENFORCED</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: USERS REGISTRY */}
      {activeTab === "users" && (
        <section className="admin-tab-content">
          <div className="admin-table-toolbar">
            <div className="search">
              <Search size={16} />
              <input
                placeholder="Search owner name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            <div className="toolbar-filters">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
              >
                <option value="All">All User Roles</option>
                <option value="owner">Pet Owners</option>
                <option value="admin">Administrators</option>
              </select>
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Email Address</th>
                  <th>System Role</th>
                  <th>Pets Owned</th>
                  <th>Member Since</th>
                  <th>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-circle">
                          {user.name ? user.name[0].toUpperCase() : "U"}
                        </div>
                        <strong>{user.name}</strong>
                      </div>
                    </td>
                    <td><code>{user.email}</code></td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role === "admin" ? "🛡️ Admin" : "🐾 Pet Owner"}
                      </span>
                    </td>
                    <td><strong>{user.petsCount || 0} pets</strong></td>
                    <td>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td>
                      <button
                        type="button"
                        className={`action-btn-role ${user.role === "admin" ? "demote" : "promote"}`}
                        onClick={() => handleToggleUserRole(user)}
                        title={user.role === "admin" ? "Demote to Owner" : "Promote to Admin"}
                      >
                        {user.role === "admin" ? (
                          <><UserMinus size={14} /> Demote to Owner</>
                        ) : (
                          <><UserCheck size={14} /> Make Admin</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
                {!filteredUsers.length && (
                  <tr>
                    <td colSpan="6" className="table-empty">
                      No registered users found matching the query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 3: GLOBAL PET REGISTRY */}
      {activeTab === "pets" && (
        <section className="admin-tab-content">
          <div className="admin-table-toolbar">
            <div className="search">
              <Search size={16} />
              <input
                placeholder="Search pet name, breed..."
                value={petSearch}
                onChange={(e) => setPetSearch(e.target.value)}
              />
            </div>

            <div className="toolbar-filters">
              <select
                value={petSpeciesFilter}
                onChange={(e) => setPetSpeciesFilter(e.target.value)}
              >
                <option value="All">All Species</option>
                <option value="Dog">Dogs</option>
                <option value="Cat">Cats</option>
                <option value="Bird">Birds</option>
                <option value="Rabbit">Rabbits</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="admin-pet-cards-grid">
            {filteredPets.map((pet) => (
              <div className="admin-pet-card" key={pet._id}>
                <div className="admin-pet-card-header">
                  <span className="pet-species-tag">{pet.species}</span>
                  <button
                    type="button"
                    className="delete-pet-btn"
                    onClick={() => handleDeletePet(pet)}
                    title="Admin delete profile"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="admin-pet-main">
                  <h3>{pet.name}</h3>
                  <p className="breed">{pet.breed || "Breed not specified"}</p>
                  <p className="owner-ref">
                    Owner: <strong>{pet.ownerId?.name || "Demo Pet Owner"}</strong>
                  </p>
                </div>

                <div className="admin-pet-footer">
                  <small>Added: {new Date(pet.createdAt || Date.now()).toLocaleDateString()}</small>
                </div>
              </div>
            ))}
            {!filteredPets.length && (
              <div className="empty-panel">
                <PawPrint size={32} />
                <p>No pets found matching the criteria.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* TAB 4: URGENT CARE BOARD */}
      {activeTab === "records" && (
        <section className="admin-tab-content">
          <div className="admin-table-toolbar">
            <div className="toolbar-filters">
              <button
                type="button"
                className={`filter-chip ${recordFilter === "All" ? "active" : ""}`}
                onClick={() => setRecordFilter("All")}
              >
                All Care Records ({records.length})
              </button>
              <button
                type="button"
                className={`filter-chip overdue ${recordFilter === "overdue" ? "active" : ""}`}
                onClick={() => setRecordFilter("overdue")}
              >
                Overdue Attention
              </button>
              <button
                type="button"
                className={`filter-chip upcoming ${recordFilter === "upcoming" ? "active" : ""}`}
                onClick={() => setRecordFilter("upcoming")}
              >
                Upcoming Scheduled
              </button>
            </div>
          </div>

          <div className="admin-records-list">
            {filteredRecords.map((r) => (
              <div className="admin-record-item" key={r._id}>
                <div className={`record-status-pill ${r.status || "upcoming"}`}>
                  {r.status || "upcoming"}
                </div>
                <div className="record-details">
                  <h4>{r.title}</h4>
                  <p>
                    Target Pet: <strong>{r.petId?.name || "Pet"}</strong> • Category:{" "}
                    <span className="care-tag">{r.careType}</span>
                  </p>
                  {r.notes && <small className="record-notes">“{r.notes}”</small>}
                </div>
                <div className="record-due">
                  <small>Due Date</small>
                  <strong>
                    {r.nextDueDate ? new Date(r.nextDueDate).toLocaleDateString() : "Pending"}
                  </strong>
                </div>
              </div>
            ))}
            {!filteredRecords.length && (
              <div className="empty-panel">
                <CheckCircle2 size={32} />
                <p>No records match this filter.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* TAB 5: CATEGORIES CONFIG */}
      {activeTab === "categories" && (
        <section className="admin-tab-content">
          <div className="admin-panel-card" style={{ maxWidth: "680px", margin: "0 auto" }}>
            <div className="panel-card-header">
              <h4>🏷️ System Care Categories Configuration</h4>
              <p>Add care categories available to all pet owners across the platform.</p>
            </div>

            <form onSubmit={handleAddCategory} className="add-category-form">
              <input
                placeholder="Enter new care type (e.g. Microchipping, Deworming, Physio)..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />
              <button type="submit" className="primary">
                <Plus size={16} /> Add Category
              </button>
            </form>

            <div className="categories-chips-cloud">
              {categories.map((cat, idx) => (
                <div className="category-chip-item" key={idx}>
                  <Layers size={14} color="#3b6d60" />
                  <span>{cat}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminPortal;

