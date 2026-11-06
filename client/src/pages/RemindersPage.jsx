import React, { useState, useEffect } from 'react';
import reminderService from '../api/reminderService';
import recordService from '../api/recordService';
import petService from '../api/petService';

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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

      if (remRes?.data?.all) {
        setReminders(remRes.data.all);
      }
      if (petRes?.data) {
        setPets(petRes.data);
        if (petRes.data.length > 0 && !formData.pet) {
          setFormData((prev) => ({ ...prev, pet: petRes.data[0]._id }));
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

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    try {
      await recordService.createRecord(formData);
      setShowModal(false);
      setFormData({
        pet: pets[0]?._id || '',
        careType: 'Vaccination',
        title: '',
        dateAdministered: new Date().toISOString().split('T')[0],
        nextDueDate: '',
        notes: '',
        veterinarian: '',
      });
      loadData();
    } catch (err) {
      alert(err.message || 'Error creating care reminder');
    }
  };

  const filteredReminders = reminders.filter((item) => {
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'UPCOMING' && item.daysDifference >= 0) ||
      (filterStatus === 'OVERDUE' && item.daysDifference < 0);

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.careType.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="page-container">
      <div className="section-header">
        <div>
          <h2 className="page-title">Reminders & Care Timeline</h2>
          <p className="page-subtitle">
            Timeline Engine: <strong>Matapally Meghana (2303A52505)</strong> · Database: <strong>Bodasu Nithin (2303A51803)</strong>
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          ➕ Schedule Care / Reminder
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <input
            type="text"
            placeholder="Search by pet name, care type, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-search"
          />
        </div>
        <div className="filter-buttons">
          <button
            className={`btn-filter ${filterStatus === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterStatus('ALL')}
          >
            All Records ({reminders.length})
          </button>
          <button
            className={`btn-filter ${filterStatus === 'UPCOMING' ? 'active' : ''}`}
            onClick={() => setFilterStatus('UPCOMING')}
          >
            Upcoming ({reminders.filter((r) => r.daysDifference >= 0).length})
          </button>
          <button
            className={`btn-filter overdue ${filterStatus === 'OVERDUE' ? 'active' : ''}`}
            onClick={() => setFilterStatus('OVERDUE')}
          >
            ⚠️ Overdue ({reminders.filter((r) => r.daysDifference < 0).length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Calculating timeline and due dates...</div>
      ) : filteredReminders.length === 0 ? (
        <div className="empty-state">
          <p>No care reminders found matching your criteria.</p>
        </div>
      ) : (
        <div className="timeline-grid">
          {filteredReminders.map((rem) => {
            const isOverdue = rem.daysDifference < 0;
            const isDueToday = rem.daysDifference === 0;

            return (
              <div
                key={rem.id}
                className={`reminder-card ${isOverdue ? 'card-overdue' : isDueToday ? 'card-today' : 'card-upcoming'}`}
              >
                <div className="reminder-header">
                  <span className="reminder-type-tag">{rem.careType}</span>
                  <span className={`status-pill ${isOverdue ? 'pill-overdue' : 'pill-upcoming'}`}>
                    {isOverdue
                      ? `Overdue by ${Math.abs(rem.daysDifference)} days`
                      : isDueToday
                      ? 'Due Today!'
                      : `In ${rem.daysDifference} days`}
                  </span>
                </div>

                <h3 className="reminder-title">{rem.title}</h3>
                <p className="reminder-pet-name">
                  🐾 Target Pet: <strong>{rem.petName}</strong> ({rem.species})
                </p>

                <div className="reminder-meta-row">
                  <div className="meta-col">
                    <span className="meta-label">Next Due Date:</span>
                    <span className="meta-val">
                      {new Date(rem.nextDueDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {rem.notes && <p className="reminder-notes">"{rem.notes}"</p>}
              </div>
            );
          })}
        </div>
      )}

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
                      {p.name} ({p.species} - {p.breed})
                    </option>
                  ))}
                </select>
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
                </div>

                <div className="form-group">
                  <label>Next Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.nextDueDate}
                    onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Veterinarian / Clinic Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Sarah Jenkins"
                  value={formData.veterinarian}
                  onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Notes & Dosage Instructions</label>
                <textarea
                  rows="3"
                  placeholder="Add any special instructions or observations..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

