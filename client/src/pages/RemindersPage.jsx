import React, { useState, useEffect, useMemo } from 'react';
import reminderService from '../api/reminderService';
import recordService from '../api/recordService';
import petService from '../api/petService';

/**
 * Page: Reminders & Timeline Dashboard
 * Assigned Member: MATAPALLY MEGHANA (Reminders & Timeline)
 * Roll Number: 2303A52505 · Branch: CSE (AIML)
 * Integrated by: Godishala Kruthik Roshan
 */

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Active view: 'dashboard' (grid of reminder cards) | 'timeline' (chronological pet history)
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedPetForTimeline, setSelectedPetForTimeline] = useState('');

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'UPCOMING' | 'TODAY' | 'OVERDUE'
  const [filterPet, setFilterPet] = useState('ALL');
  const [filterCareType, setFilterCareType] = useState('ALL');

  // Modal form state
  const [showModal, setShowModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    pet: '',
    careType: 'Vaccination',
    title: '',
    dateAdministered: new Date().toISOString().split('T')[0],
    nextDueDate: '',
    notes: '',
    veterinarian: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [remRes, petRes] = await Promise.all([
        reminderService.getReminders(),
        petService.getAllPets(),
      ]);

      if (remRes?.data?.data?.all) {
        setReminders(remRes.data.data.all);
      } else if (remRes?.data?.all) {
        setReminders(remRes.data.all);
      }

      if (petRes?.data?.data) {
        const fetchedPets = petRes.data.data;
        setPets(fetchedPets);
        if (fetchedPets.length > 0) {
          if (!formData.pet) setFormData((prev) => ({ ...prev, pet: fetchedPets[0]._id }));
          if (!selectedPetForTimeline) setSelectedPetForTimeline(fetchedPets[0]._id);
        }
      } else if (petRes?.data) {
        const fetchedPets = petRes.data;
        setPets(fetchedPets);
        if (fetchedPets.length > 0) {
          if (!formData.pet) setFormData((prev) => ({ ...prev, pet: fetchedPets[0]._id }));
          if (!selectedPetForTimeline) setSelectedPetForTimeline(fetchedPets[0]._id);
        }
      }
    } catch (err) {
      console.error('Error loading reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter reminders based on search query, pet dropdown, and care type dropdown FIRST
  // to ensure filter tab count numbers update dynamically based on the filtered results
  const baseFilteredReminders = useMemo(() => {
    return reminders.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.petName?.toLowerCase().includes(q) ||
        item.species?.toLowerCase().includes(q) ||
        item.breed?.toLowerCase().includes(q) ||
        item.careType?.toLowerCase().includes(q) ||
        item.notes?.toLowerCase().includes(q) ||
        item.veterinarian?.toLowerCase().includes(q);

      const matchesPet =
        filterPet === 'ALL' ||
        String(item.petId) === String(filterPet) ||
        item.petName?.toLowerCase() === filterPet.toLowerCase();

      const matchesCareType =
        filterCareType === 'ALL' ||
        item.careType?.toLowerCase() === filterCareType.toLowerCase();

      return matchesSearch && matchesPet && matchesCareType;
    });
  }, [reminders, searchQuery, filterPet, filterCareType]);

  // Dynamic counts derived from the filtered set
  const dynamicCounts = useMemo(() => {
    const total = baseFilteredReminders.length;
    const upcoming = baseFilteredReminders.filter((r) => r.daysDifference > 0).length;
    const today = baseFilteredReminders.filter((r) => r.daysDifference === 0).length;
    const overdue = baseFilteredReminders.filter((r) => r.daysDifference < 0).length;
    return {
      total,
      upcoming,
      today,
      overdue,
      upcomingTotal: upcoming + today, // upcoming tab includes today if clicked
    };
  }, [baseFilteredReminders]);

  // Final filtered list based on the active status tab
  const displayedReminders = useMemo(() => {
    return baseFilteredReminders.filter((item) => {
      if (filterStatus === 'ALL') return true;
      if (filterStatus === 'UPCOMING') return item.daysDifference >= 0;
      if (filterStatus === 'TODAY') return item.daysDifference === 0;
      if (filterStatus === 'OVERDUE') return item.daysDifference < 0;
      return true;
    });
  }, [baseFilteredReminders, filterStatus]);

  // Care history timeline for the currently selected pet
  const petTimelineEvents = useMemo(() => {
    if (!selectedPetForTimeline) return [];
    return reminders
      .filter((r) => String(r.petId) === String(selectedPetForTimeline))
      .sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime());
  }, [reminders, selectedPetForTimeline]);

  const selectedPetObj = useMemo(() => {
    return pets.find((p) => String(p._id) === String(selectedPetForTimeline));
  }, [pets, selectedPetForTimeline]);

  // Handle Form Submission with Validation
  const handleCreateRecord = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.pet) {
      errors.pet = 'Please select a pet';
    }
    if (!formData.title?.trim()) {
      errors.title = 'Title / description is required';
    }
    if (!formData.nextDueDate) {
      errors.nextDueDate = 'Next Due Date is required';
    } else {
      const d = new Date(formData.nextDueDate);
      if (isNaN(d.getTime())) {
        errors.nextDueDate = 'Please enter a valid date';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);
      setFormErrors({});

      await recordService.createRecord({
        ...formData,
        pet: formData.pet,
        title: formData.title.trim(),
        notes: formData.notes?.trim() || '',
        veterinarian: formData.veterinarian?.trim() || '',
      });

      setShowModal(false);
      setFeedbackMsg({ type: 'success', text: 'Care reminder scheduled successfully!' });
      setTimeout(() => setFeedbackMsg(null), 4000);

      // Reset form
      setFormData({
        pet: pets[0]?._id || '',
        careType: 'Vaccination',
        title: '',
        dateAdministered: new Date().toISOString().split('T')[0],
        nextDueDate: '',
        notes: '',
        veterinarian: '',
      });

      // Reload timeline and reminders
      await loadData();
    } catch (err) {
      alert(err.message || 'Error creating care reminder');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterStatus('ALL');
    setFilterPet('ALL');
    setFilterCareType('ALL');
  };

  const openTimelineForPet = (petId) => {
    setSelectedPetForTimeline(petId);
    setActiveView('timeline');
  };

  // Helper for date formatting
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="section-header">
        <div>
          <h2 className="page-title">Reminders & Care Timeline</h2>
          <p className="page-subtitle">
            Timeline Engine: <strong>Matapally Meghana (2303A52505)</strong> · Database: <strong>Bodasu Nithin (2303A51803)</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* View Mode Switcher */}
          <div className="view-toggle-group">
            <button
              className={`view-toggle-btn ${activeView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveView('dashboard')}
            >
              📋 Reminders Dashboard
            </button>
            <button
              className={`view-toggle-btn ${activeView === 'timeline' ? 'active' : ''}`}
              onClick={() => setActiveView('timeline')}
            >
              ⏳ Pet Care Timeline
            </button>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            ➕ Schedule Care / Reminder
          </button>
        </div>
      </div>

      {/* Success/Action Feedback Toast */}
      {feedbackMsg && (
        <div
          style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>✓ {feedbackMsg.text}</span>
          <button
            onClick={() => setFeedbackMsg(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Summary Stat Cards */}
      <div className="reminders-stats-row">
        <div className="reminder-stat-card total">
          <div className="reminder-stat-icon">📅</div>
          <div>
            <div className="reminder-stat-value">{reminders.length}</div>
            <div className="reminder-stat-label">Total Reminders</div>
          </div>
        </div>
        <div className="reminder-stat-card upcoming">
          <div className="reminder-stat-icon">🔵</div>
          <div>
            <div className="reminder-stat-value">
              {reminders.filter((r) => r.daysDifference > 0).length}
            </div>
            <div className="reminder-stat-label">Upcoming Care</div>
          </div>
        </div>
        <div className="reminder-stat-card today">
          <div className="reminder-stat-icon">🟡</div>
          <div>
            <div className="reminder-stat-value">
              {reminders.filter((r) => r.daysDifference === 0).length}
            </div>
            <div className="reminder-stat-label">Due Today</div>
          </div>
        </div>
        <div className="reminder-stat-card overdue">
          <div className="reminder-stat-icon">🔴</div>
          <div>
            <div className="reminder-stat-value">
              {reminders.filter((r) => r.daysDifference < 0).length}
            </div>
            <div className="reminder-stat-label">Overdue Care</div>
          </div>
        </div>
      </div>

      {/* VIEW 1: REMINDERS DASHBOARD */}
      {activeView === 'dashboard' && (
        <>
          {/* Search & Dynamic Filter Controls */}
          <div className="filter-bar" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', width: '100%' }}>
              <div className="search-wrap" style={{ flex: '1 1 280px' }}>
                <input
                  type="text"
                  placeholder="Search by pet name, care type, title, veterinarian..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-search"
                />
              </div>

              {/* Filter Tab Buttons with Dynamic Result Counts */}
              <div className="filter-buttons">
                <button
                  className={`btn-filter ${filterStatus === 'ALL' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('ALL')}
                >
                  All Records ({dynamicCounts.total})
                </button>
                <button
                  className={`btn-filter ${filterStatus === 'UPCOMING' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('UPCOMING')}
                >
                  Upcoming ({dynamicCounts.upcomingTotal})
                </button>
                {dynamicCounts.today > 0 && (
                  <button
                    className={`btn-filter today ${filterStatus === 'TODAY' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('TODAY')}
                  >
                    🟡 Due Today ({dynamicCounts.today})
                  </button>
                )}
                <button
                  className={`btn-filter overdue ${filterStatus === 'OVERDUE' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('OVERDUE')}
                >
                  ⚠️ Overdue ({dynamicCounts.overdue})
                </button>
              </div>
            </div>

            {/* Dropdown Filters: Pet & Care Type */}
            <div className="filter-dropdowns">
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Filters:
              </label>
              <select
                className="filter-select"
                value={filterPet}
                onChange={(e) => setFilterPet(e.target.value)}
              >
                <option value="ALL">🐾 All Pets</option>
                {pets.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.species})
                  </option>
                ))}
              </select>

              <select
                className="filter-select"
                value={filterCareType}
                onChange={(e) => setFilterCareType(e.target.value)}
              >
                <option value="ALL">🏷️ All Care Types</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Medication">Medication</option>
                <option value="Grooming">Grooming</option>
                <option value="Vet Visit">Vet Visit</option>
                <option value="Deworming">Deworming</option>
                <option value="Nutrition">Nutrition</option>
                <option value="Other">Other</option>
              </select>

              {(searchQuery || filterPet !== 'ALL' || filterCareType !== 'ALL' || filterStatus !== 'ALL') && (
                <button className="btn-clear-filters" onClick={handleClearFilters}>
                  ✕ Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Reminders List */}
          {loading ? (
            <div className="loading-state">Calculating timeline and due dates...</div>
          ) : displayedReminders.length === 0 ? (
            <div className="empty-state">
              <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {reminders.length === 0
                  ? 'No care reminders scheduled yet.'
                  : 'No care reminders found matching your criteria.'}
              </p>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {reminders.length === 0
                  ? 'Keep your furry friends healthy by scheduling vaccinations, grooming, and medication reminders!'
                  : 'Try clearing your search query or adjusting the filters.'}
              </p>
              {reminders.length === 0 ? (
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                  ➕ Schedule First Reminder
                </button>
              ) : (
                <button className="btn btn-outline" onClick={handleClearFilters}>
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="timeline-grid">
              {displayedReminders.map((rem) => {
                const isOverdue = rem.daysDifference < 0;
                const isDueToday = rem.daysDifference === 0;

                return (
                  <div
                    key={rem.id}
                    className={`reminder-card ${
                      isOverdue ? 'card-overdue' : isDueToday ? 'card-today' : 'card-upcoming'
                    }`}
                  >
                    <div className="reminder-header">
                      <span className={`reminder-type-tag ${rem.careType?.toLowerCase().replace(' ', '-')}`}>
                        {rem.careType}
                      </span>
                      <span
                        className={`status-pill ${
                          isOverdue ? 'pill-overdue' : isDueToday ? 'pill-today' : 'pill-upcoming'
                        }`}
                      >
                        {isOverdue
                          ? `Overdue by ${Math.abs(rem.daysDifference)} day${Math.abs(rem.daysDifference) === 1 ? '' : 's'}`
                          : isDueToday
                          ? '🟡 Due Today!'
                          : rem.daysDifference === 1
                          ? 'In 1 day (Tomorrow)'
                          : `In ${rem.daysDifference} days`}
                      </span>
                    </div>

                    <h3 className="reminder-title">{rem.title}</h3>
                    <p className="reminder-pet-name">
                      🐾 Target Pet: <strong>{rem.petName}</strong> {rem.species ? `(${rem.species}${rem.breed ? ` · ${rem.breed}` : ''})` : ''}
                    </p>

                    <div className="reminder-meta-grid">
                      <div>
                        <span className="meta-label">Next Due Date:</span>
                        <span className="meta-val" style={{ color: isOverdue ? 'var(--danger)' : isDueToday ? '#b45309' : 'inherit' }}>
                          {formatDate(rem.nextDueDate)}
                        </span>
                      </div>
                      <div>
                        <span className="meta-label">Administered:</span>
                        <span className="meta-val">{formatDate(rem.dateAdministered)}</span>
                      </div>
                    </div>

                    {rem.veterinarian && (
                      <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                        🩺 Vet / Clinic: <strong style={{ color: 'var(--text-main)' }}>{rem.veterinarian}</strong>
                      </div>
                    )}

                    {rem.notes && <p className="reminder-notes">"{rem.notes}"</p>}

                    <div className="reminder-card-footer">
                      <button
                        className="btn-link-timeline"
                        onClick={() => openTimelineForPet(rem.petId)}
                      >
                        ⏳ View Pet Care Timeline →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* VIEW 2: PET CARE TIMELINE (CHRONOLOGICAL TRACK FOR EACH PET) */}
      {activeView === 'timeline' && (
        <div className="pet-timeline-container">
          <div className="pet-timeline-header">
            <div className="pet-timeline-pet-info">
              <div className="pet-timeline-avatar">🐾</div>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>
                  {selectedPetObj?.name || 'Selected Pet'}’s Care Timeline
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {selectedPetObj
                    ? `${selectedPetObj.species} · ${selectedPetObj.breed || 'Breed Unspecified'} · Age: ${selectedPetObj.age || 0} yrs`
                    : 'Select a pet to view their chronological history and future milestones'}
                </p>
              </div>
            </div>

            {/* Pet Switcher Dropdown */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Select Pet:</label>
              <select
                className="filter-select"
                value={selectedPetForTimeline}
                onChange={(e) => setSelectedPetForTimeline(e.target.value)}
              >
                {pets.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.species})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {petTimelineEvents.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem 1rem' }}>
              <p style={{ fontWeight: 600 }}>No care records found for this pet yet.</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Schedule a vaccination, medication, or wellness checkup to start building their care timeline!
              </p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, pet: selectedPetForTimeline }));
                  setShowModal(true);
                }}
              >
                ➕ Schedule Care for {selectedPetObj?.name || 'this pet'}
              </button>
            </div>
          ) : (
            <div className="pet-timeline-track">
              {petTimelineEvents.map((evt) => {
                const isOverdue = evt.daysDifference < 0;
                const isDueToday = evt.daysDifference === 0;

                const markerClass = isOverdue
                  ? 'node-overdue'
                  : isDueToday
                  ? 'node-today'
                  : 'node-upcoming';

                return (
                  <div key={evt.id} className="timeline-event-item">
                    <div className={`timeline-node-marker ${markerClass}`}>
                      {isOverdue ? '⚠️' : isDueToday ? '⏱️' : '✓'}
                    </div>

                    <div className="timeline-event-card">
                      <div className="timeline-event-header">
                        <span className="timeline-event-title">{evt.title}</span>
                        <span
                          className={`status-pill ${
                            isOverdue ? 'pill-overdue' : isDueToday ? 'pill-today' : 'pill-upcoming'
                          }`}
                        >
                          {isOverdue
                            ? `Overdue by ${Math.abs(evt.daysDifference)} days`
                            : isDueToday
                            ? 'Due Today'
                            : `In ${evt.daysDifference} days`}
                        </span>
                      </div>

                      <div className="timeline-event-dates">
                        <span>🏷️ Care Type: <strong>{evt.careType}</strong></span>
                        <span>📅 Next Due: <strong>{formatDate(evt.nextDueDate)}</strong></span>
                        {evt.dateAdministered && (
                          <span>💉 Administered: <strong>{formatDate(evt.dateAdministered)}</strong></span>
                        )}
                      </div>

                      {evt.veterinarian && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          🩺 Provider: <strong>{evt.veterinarian}</strong>
                        </div>
                      )}

                      {evt.notes && <div className="timeline-event-notes">"{evt.notes}"</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SCHEDULE CARE / ADD REMINDER MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>Schedule Pet Care / Reminder</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="modal-form">
              <div className="form-group">
                <label>Select Pet *</label>
                <select
                  name="pet"
                  value={formData.pet}
                  onChange={(e) => setFormData({ ...formData, pet: e.target.value })}
                  required
                >
                  {pets.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.species}{p.breed ? ` - ${p.breed}` : ''})
                    </option>
                  ))}
                </select>
                {formErrors.pet && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>{formErrors.pet}</p>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Care Type *</label>
                  <select
                    name="careType"
                    value={formData.careType}
                    onChange={(e) => setFormData({ ...formData, careType: e.target.value })}
                  >
                    <option value="Vaccination">Vaccination</option>
                    <option value="Medication">Medication</option>
                    <option value="Grooming">Grooming</option>
                    <option value="Vet Visit">Vet Visit</option>
                    <option value="Deworming">Deworming</option>
                    <option value="Nutrition">Nutrition</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Title / Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rabies Vaccination Booster"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  {formErrors.title && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>{formErrors.title}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date Administered</label>
                  <input
                    type="date"
                    value={formData.dateAdministered}
                    onChange={(e) => setFormData({ ...formData, dateAdministered: e.target.value })}
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Defaults to today's date</small>
                </div>

                <div className="form-group">
                  <label>Next Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.nextDueDate}
                    onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                  />
                  {formErrors.nextDueDate ? (
                    <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>{formErrors.nextDueDate}</p>
                  ) : formData.nextDueDate ? (
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {new Date(formData.nextDueDate) < new Date(new Date().setHours(0, 0, 0, 0))
                        ? '⚠️ This date is in the past and will appear as Overdue.'
                        : '✓ Scheduled for upcoming timeline.'}
                    </small>
                  ) : null}
                </div>
              </div>

              <div className="form-group">
                <label>Veterinarian / Clinic Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Sarah Jenkins · PawCare Hospital"
                  value={formData.veterinarian}
                  onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Notes & Dosage Instructions</label>
                <textarea
                  rows="3"
                  placeholder="Add any special instructions, dosage (e.g. 1ml subcutaneous), or observations..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
