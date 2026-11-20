import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  Menu,
  PawPrint,
  Plus,
  Search,
  Shield,
  Sparkles,
  UserCircle,
  X,
} from "lucide-react";
import { api } from "../api/api";
import Stat from "./Stat";
import PetCard from "./PetCard";
import PetDetails from "./PetDetails";
import PetForm from "./PetForm";
import CareRecordForm from "./CareRecordForm";
import AdminPortal from "./AdminPortal";
import Reminders from "./Reminders";

export default function Dashboard({ user, onLogout }) {
  const [pets, setPets] = useState([]);
  const [activePage, setActivePage] = useState(user?.role === "admin" ? "Admin" : "Overview");
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const load = async () => {
    try {
      const [petData, recordData] = await Promise.all([
        api("/pets").catch((err) => {
          console.warn("Failed loading pets:", err.message);
          return [];
        }),
        api("/care-records/upcoming").catch((err) => {
          console.warn("Failed loading upcoming care records:", err.message);
          return [];
        }),
      ]);

      const resolvedPets = Array.isArray(petData) ? petData : petData?.data || [];
      const resolvedRecords = Array.isArray(recordData) ? recordData : recordData?.data || [];

      setPets(resolvedPets);
      setRecords(resolvedRecords);
      setError("");
    } catch (e) {
      console.warn("load error:", e);
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () => pets.filter((pet) => pet.name.toLowerCase().includes(search.toLowerCase())),
    [pets, search]
  );

  const remove = async (pet) => {
    if (!confirm(`Remove ${pet.name} and its records?`)) return;

    try {
      await api(`/pets/${pet._id}`, { method: "DELETE" });
      setSelected(null);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const myRecords = useMemo(() => {
    if (user?.role === "admin") return records;
    if (!pets || pets.length === 0) return [];
    const petIdSet = new Set(pets.map((p) => String(p._id)));
    return records.filter((r) => {
      const pid = String(r.petId?._id || r.petId || r.pet?._id || r.pet);
      return petIdSet.has(pid);
    });
  }, [pets, records, user]);

  const due = myRecords.filter((record) => (record.status || "").toLowerCase() === "upcoming").length;
  const overdue = myRecords.filter((record) => (record.status || "").toLowerCase() === "overdue").length;

  return (
    <div className="app-shell">
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand-wrapper">
          <span className="brand">
            <PawPrint size={21} /> PetCare Planner
          </span>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)} title="Close navigation">
            <X size={18} />
          </button>
        </div>

        <nav>
          {user?.role === "admin" && (
            <a
              className={`nav-admin-link ${activePage === "Admin" ? "active" : ""}`}
              onClick={() => {
                setActivePage("Admin");
                setSidebarOpen(false);
              }}
            >
              <Shield size={18} />
              Admin Portal <span className="admin-chip">Staff</span>
            </a>
          )}

          <a
            className={activePage === "Overview" ? "active" : ""}
            onClick={() => {
              setActivePage("Overview");
              setSidebarOpen(false);
            }}
          >
            <LayoutDashboard size={18} />
            Overview
          </a>

          <a
            className={activePage === "My pets" ? "active" : ""}
            onClick={() => {
              setActivePage("My pets");
              setSidebarOpen(false);
            }}
          >
            <PawPrint size={18} />
            My pets <span>{pets.length}</span>
          </a>

          <a
            className={activePage === "Care calendar" ? "active" : ""}
            onClick={() => {
              setActivePage("Care calendar");
              setSidebarOpen(false);
            }}
          >
            <CalendarDays size={18} />
            Care calendar
          </a>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-add-btn" onClick={() => setModal({ type: "pet" })}>
            <Plus size={16} /> Add a pet
          </button>

          <div className="user-profile">
            <div className="avatar">{user.name[0]?.toUpperCase() || "U"}</div>
            <div className="user-meta">
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </div>
            <button className="logout-btn" onClick={onLogout} title="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(true)} title="Open navigation">
              <Menu size={20} />
            </button>

            <div>
              <span className="eyebrow">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <h1>
                Good {new Date().getHours() < 12 ? "morning" : "afternoon"},{" "}
                {user.name.split(" ")[0]} <Sparkles className="sparkle" size={18} />
              </h1>
            </div>
          </div>

          <div className="header-actions">
            <div className="notification-wrapper">
              <button
                className={`icon-btn ${showNotifications ? "active" : ""}`}
                title="Care Notifications"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
              >
                <Bell size={19} />
                {overdue > 0 && <i />}
              </button>

              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h4>Care Notifications</h4>
                    <span className="notifications-count">{overdue} Needs attention</span>
                  </div>
                  <div className="notifications-list">
                    {myRecords.slice(0, 6).map((r) => (
                      <div
                        key={r._id}
                        className="notification-item"
                        onClick={() => {
                          setActivePage("Care calendar");
                          setShowNotifications(false);
                        }}
                      >
                        <div className="notification-title">
                          <strong>{r.title}</strong>
                          <span className={`status-pill ${r.status}`}>{r.status}</span>
                        </div>
                        <div className="notification-sub">
                          <span>🐾 {r.petId?.name || "Your pet"}</span>
                          <span>• {new Date(r.nextDueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                    {!myRecords.length && <div className="notifications-empty">No current notifications</div>}
                  </div>
                  <div className="notifications-footer">
                    <button
                      onClick={() => {
                        setActivePage("Care calendar");
                        setShowNotifications(false);
                      }}
                    >
                      View all in Care calendar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="profile-wrapper">
              <button
                className="profile-btn"
                title={`${user.name} Profile`}
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
              >
                {user.name[0]?.toUpperCase() || "U"}
              </button>

              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="profile-avatar-large">{user.name[0]?.toUpperCase() || "U"}</div>
                    <div className="profile-user-info">
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                      <span className="profile-badge">{user.role === "admin" ? "Staff Administrator" : "Pet Caregiver"}</span>
                    </div>
                  </div>

                  <div className="profile-stats-row">
                    <div className="profile-stat-box">
                      <span className="profile-stat-val">{pets.length}</span>
                      <span className="profile-stat-lbl">Pets</span>
                    </div>
                    <div className="profile-stat-box">
                      <span className="profile-stat-val">{myRecords.length}</span>
                      <span className="profile-stat-lbl">Care Records</span>
                    </div>
                  </div>

                  <div className="profile-dropdown-menu">
                    {user.role === "admin" && (
                      <button
                        className="profile-menu-item"
                        onClick={() => {
                          setActivePage("Admin");
                          setShowProfileMenu(false);
                        }}
                      >
                        <Shield size={16} /> Admin Command Portal
                      </button>
                    )}
                    <button
                      className="profile-menu-item"
                      onClick={() => {
                        setActivePage("My pets");
                        setShowProfileMenu(false);
                      }}
                    >
                      <PawPrint size={16} /> View All Pets
                    </button>
                    <button
                      className="profile-menu-item"
                      onClick={() => {
                        setActivePage("Care calendar");
                        setShowProfileMenu(false);
                      }}
                    >
                      <CalendarDays size={16} /> Care Calendar & Reminders
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {error && <div className="error banner">{error}</div>}

        {activePage === "Admin" && (
          <AdminPortal currentAdmin={user} onSwitchToOwnerView={() => setActivePage("Overview")} />
        )}

        {activePage === "Care calendar" && <Reminders pets={pets} user={user} />}

        {activePage === "My pets" && (
          <>
            <section className="section-heading">
              <div>
                <span className="eyebrow">Your companions</span>
                <h2>
                  My pets <small>{pets.length}</small>
                </h2>
              </div>

              <div className="search">
                <Search size={17} />
                <input placeholder="Search pets..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </section>

            <section className="pet-grid">
              {filtered.map((pet) => (
                <PetCard key={pet._id} pet={pet} onView={() => setSelected(pet)} />
              ))}

              {!filtered.length && (
                <div className="empty">
                  <PawPrint size={32} />
                  <h3>No companions found</h3>
                  <p>Try a different search term, or add a new pet to begin tracking care.</p>
                  <button className="primary" onClick={() => setModal({ type: "pet" })}>
                    <Plus size={16} /> Add a pet
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        {activePage === "Overview" && (
          <>
            <section className="hero">
              <div>
                <span className="eyebrow">Your care overview</span>
                <h2>
                  Small moments make
                  <br />
                  <em>happy, healthy lives.</em>
                </h2>
                <p>Stay on top of everything your companions need.</p>
                <div className="hero-actions">
                  <button className="primary" onClick={() => setModal({ type: "pet" })}>
                    <Plus size={16} /> Add a pet
                  </button>
                </div>
              </div>

              <div className="welcome-illustration">
                <span className="hero-dog">🐕</span>
                <span className="hero-sparkle">✦</span>
              </div>
            </section>

            <section className="stat-grid">
              <Stat label="Your pets" value={pets.length} tone="peach" icon={<PawPrint />} onClick={() => setActivePage("My pets")} />
              <Stat label="Upcoming" value={due} tone="green" icon={<CalendarDays />} onClick={() => setActivePage("Care calendar")} />
              <Stat label="Needs attention" value={overdue} tone="rose" icon={<Bell />} onClick={() => setActivePage("Care calendar")} />
            </section>

            <section className="section-heading">
              <div>
                <span className="eyebrow">Your companions</span>
                <h2>
                  Pet profiles <small>{pets.length}</small>
                </h2>
              </div>

              <div className="search">
                <Search size={17} />
                <input placeholder="Search pets..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </section>

            <section className="pet-grid">
              {filtered.map((pet) => (
                <PetCard key={pet._id} pet={pet} onView={() => setSelected(pet)} />
              ))}

              {!filtered.length && (
                <div className="empty">
                  <PawPrint size={32} />
                  <h3>No pets added yet</h3>
                  <p>Add your first companion to begin tracking health and care schedules.</p>
                  <button className="primary" onClick={() => setModal({ type: "pet" })}>
                    <Plus size={16} /> Add a pet
                  </button>
                </div>
              )}
            </section>

            <section className="section-heading">
              <div>
                <span className="eyebrow">Timely Care</span>
                <h2>Upcoming reminders</h2>
              </div>
            </section>

            <div className="reminder-list">
              {records.slice(0, 4).map((record) => {
                const dueDateObj = record.nextDueDate ? new Date(record.nextDueDate) : null;
                const isValidDate = dueDateObj && !isNaN(dueDateObj.getTime());
                const statusClass = record.status || "upcoming";

                return (
                  <div className="reminder" key={record._id}>
                    <div className={`reminder-date ${statusClass}`}>
                      <strong>{isValidDate ? dueDateObj.getDate() : "--"}</strong>
                      <small>{isValidDate ? dueDateObj.toLocaleString("en", { month: "short" }) : "Due"}</small>
                    </div>

                    <div className="reminder-content">
                      <div className="reminder-header-row">
                        <strong>{record.title}</strong>
                        <span className="reminder-type-badge">{record.careType}</span>
                      </div>
                      <div className="reminder-pet-info">
                        <span>🐾 {record.petId?.name || "Your pet"}</span>
                        {record.notes && <span className="reminder-notes-snippet">• {record.notes}</span>}
                      </div>
                    </div>

                    <span className={`pill ${statusClass}`}>{statusClass}</span>
                  </div>
                );
              })}

              {!records.length && (
                <div className="empty compact">
                  <CalendarDays size={26} />
                  <p>No care reminders yet. Add a care record from a pet profile.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {selected && (
        <PetDetails
          pet={selected}
          onClose={() => setSelected(null)}
          onEdit={() => {
            setModal({ type: "pet", pet: selected });
            setSelected(null);
          }}
          onDelete={() => remove(selected)}
          onAddCareRecord={() => {
            setModal({ type: "care", pet: selected });
            setSelected(null);
          }}
        />
      )}

      {modal?.type === "pet" && (
        <PetForm
          pet={modal.pet}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            load();
          }}
        />
      )}

      {modal?.type === "care" && (
        <CareRecordForm
          pet={modal.pet}
          onClose={() => setModal(null)}
          onSaved={() => {
            const petRef = modal.pet;
            setModal(null);
            load();
            setSelected(petRef);
          }}
        />
      )}
    </div>
  );
}
