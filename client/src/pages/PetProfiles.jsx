import React, { useEffect, useState } from 'react';
import petService from '../api/petService';
import recordService from '../api/recordService';

const FALLBACK_PHOTO =
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400';

const EMPTY_FORM = {
  name: '',
  species: 'Dog',
  breed: '',
  age: '',
  gender: 'Unknown',
  weight: '',
  allergies: '',
  photoUrl: '',
};

const getErrorMessage = (error, fallback) => error?.message || fallback;

const toFormData = (pet) => ({
  name: pet.name || '',
  species: pet.species || 'Dog',
  breed: pet.breed || '',
  age: pet.age ?? '',
  gender: pet.gender || 'Unknown',
  weight: pet.weight ?? '',
  allergies: Array.isArray(pet.allergies) ? pet.allergies.join(', ') : pet.allergies || '',
  photoUrl: pet.photoUrl || '',
});

export default function PetProfiles() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [careRecords, setCareRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState('');

  const loadPets = async () => {
    try {
      setLoading(true);
      setPageError('');
      const response = await petService.getAllPets();
      setPets(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      setPageError(getErrorMessage(error, 'Unable to load pet profiles.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPets();
  }, []);

  useEffect(() => {
    if (!statusMsg) return undefined;
    const timer = window.setTimeout(() => setStatusMsg(''), 4000);
    return () => window.clearTimeout(timer);
  }, [statusMsg]);

  const openForm = (pet = null) => {
    setFormData(pet ? toFormData(pet) : { ...EMPTY_FORM });
    setFormError('');
    setSelectedPet(pet);
    setModal('form');
  };

  const closeModal = () => {
    if (!saving) {
      setModal(null);
      setFormError('');
      setSelectedPet(null);
    }
  };

  const openDetails = async (pet) => {
    setSelectedPet(pet);
    setModal('details');
    setRecordsLoading(true);
    setRecordsError('');
    setCareRecords([]);
    try {
      const response = await recordService.getRecords({ petId: pet._id });
      setCareRecords(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      setRecordsError(getErrorMessage(error, 'Unable to load care records.'));
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    if (formError) setFormError('');
  };

  const validateForm = () => {
    const name = formData.name.trim();
    if (name.length < 2) return 'Pet name must be at least 2 characters.';
    if (!formData.species) return 'Please select a species.';
    if (formData.age !== '' && (Number.isNaN(Number(formData.age)) || Number(formData.age) < 0)) {
      return 'Age cannot be negative.';
    }
    if (formData.weight !== '' && (Number.isNaN(Number(formData.weight)) || Number(formData.weight) <= 0)) {
      return 'Weight must be greater than zero.';
    }
    if (formData.photoUrl.trim()) {
      try {
        new URL(formData.photoUrl.trim());
      } catch {
        return 'Please enter a valid photo URL.';
      }
    }
    return '';
  };

  const buildPayload = () => ({
    name: formData.name.trim(),
    species: formData.species,
    breed: formData.breed.trim(),
    age: formData.age === '' ? undefined : Number(formData.age),
    gender: formData.gender,
    weight: formData.weight === '' ? undefined : Number(formData.weight),
    allergies: formData.allergies
      ? formData.allergies.split(',').map((allergy) => allergy.trim()).filter(Boolean)
      : [],
    photoUrl: formData.photoUrl.trim() || FALLBACK_PHOTO,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setSaving(true);
      const payload = buildPayload();
      const response = selectedPet
        ? await petService.updatePet(selectedPet._id, payload)
        : await petService.createPet(payload);
      const savedPet = response?.data;
      if (savedPet) {
        setPets((previous) =>
          selectedPet
            ? previous.map((pet) => (pet._id === savedPet._id ? savedPet : pet))
            : [savedPet, ...previous]
        );
      } else {
        await loadPets();
      }
      setStatusMsg(selectedPet ? 'Pet profile updated successfully.' : 'Pet profile created successfully.');
      setSaving(false);
      closeModal();
      setFormData({ ...EMPTY_FORM });
    } catch (error) {
      setFormError(getErrorMessage(error, 'Unable to save the pet profile.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePet = async (pet) => {
    if (!window.confirm(`Delete ${pet.name}'s profile? This also removes associated care records.`)) return;
    try {
      await petService.deletePet(pet._id);
      setPets((previous) => previous.filter((item) => item._id !== pet._id));
      setStatusMsg(`${pet.name}'s profile was deleted.`);
    } catch (error) {
      setPageError(getErrorMessage(error, 'Unable to delete the pet profile.'));
    }
  };

  return (
    <div className="page-container">
      <div className="section-header">
        <div>
          <h2 className="page-title">Pet Profiles Directory</h2>
          <p className="page-subtitle">Manage your pets, health details, and care history in one place.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openForm()}>
          + Add New Pet
        </button>
      </div>

      {statusMsg && <div className="alert-banner" role="status">{statusMsg}</div>}
      {pageError && <div className="alert-error" role="alert">{pageError}</div>}

      {loading ? (
        <div className="loading-state">Loading pet profiles from server...</div>
      ) : pets.length === 0 ? (
        <div className="empty-state">
          <p>No pets found. Click “Add New Pet” to create the first profile.</p>
        </div>
      ) : (
        <div className="pet-grid">
          {pets.map((pet) => (
            <article key={pet._id} className="pet-card">
              <div className="pet-card-image-wrap">
                <img
                  src={pet.photoUrl || FALLBACK_PHOTO}
                  alt={`${pet.name} profile`}
                  className="pet-image"
                  onError={(event) => {
                    if (event.currentTarget.src !== FALLBACK_PHOTO) event.currentTarget.src = FALLBACK_PHOTO;
                  }}
                />
                <span className="pet-species-badge">{pet.species}</span>
              </div>
              <div className="pet-card-body">
                <div className="pet-header-row">
                  <h3 className="pet-name">{pet.name}</h3>
                  <span className="pet-gender" title={pet.gender || 'Unknown'}>
                    {pet.gender === 'Female' ? '♀' : pet.gender === 'Male' ? '♂' : '⚥'}
                  </span>
                </div>
                <p className="pet-breed">{pet.breed || 'Mixed Breed'}</p>
                <div className="pet-specs">
                  <span className="spec-badge">Age: {pet.age ?? '--'} yrs</span>
                  <span className="spec-badge">Weight: {pet.weight ?? '--'} kg</span>
                </div>
                <div className="pet-allergies">
                  <strong>Allergies</strong>
                  <div className="allergy-tags">
                    {pet.allergies?.length ? pet.allergies.map((allergy, index) => (
                      <span key={`${allergy}-${index}`} className="tag-allergy">{allergy}</span>
                    )) : <span className="no-allergies">None reported</span>}
                  </div>
                </div>
                <div className="pet-card-actions">
                  <button className="btn-card btn-card-delete" onClick={() => handleDeletePet(pet)}>Delete</button>
                  <button className="btn-card btn-card-edit" onClick={() => openForm(pet)}>Edit</button>
                  <button className="btn-card btn-card-view" onClick={() => openDetails(pet)}>View Details</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {modal === 'form' && (
        <div className="modal-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeModal()}>
          <div className="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="pet-form-title">
            <div className="modal-header">
              <h3 id="pet-form-title">{selectedPet ? 'Edit Pet Profile' : 'Register New Pet'}</h3>
              <button className="btn-close" onClick={closeModal} aria-label="Close">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              {formError && <div className="alert-error" role="alert">{formError}</div>}
              <div className="form-group">
                <label htmlFor="pet-name">Pet Name *</label>
                <input id="pet-name" type="text" name="name" required value={formData.name} onChange={handleInputChange} autoFocus />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pet-species">Species *</label>
                  <select id="pet-species" name="species" required value={formData.species} onChange={handleInputChange}>
                    {['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'].map((species) => <option key={species}>{species}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="pet-breed">Breed</label>
                  <input id="pet-breed" type="text" name="breed" value={formData.breed} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pet-age">Age (years)</label>
                  <input id="pet-age" type="number" min="0" step="1" name="age" value={formData.age} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="pet-gender">Gender</label>
                  <select id="pet-gender" name="gender" value={formData.gender} onChange={handleInputChange}>
                    <option>Male</option><option>Female</option><option>Unknown</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="pet-weight">Weight (kg)</label>
                <input id="pet-weight" type="number" min="0.1" step="0.1" name="weight" value={formData.weight} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="pet-allergies">Known Allergies (comma-separated)</label>
                <input id="pet-allergies" type="text" name="allergies" value={formData.allergies} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="pet-photo">Photo URL</label>
                <input id="pet-photo" type="url" name="photoUrl" value={formData.photoUrl} onChange={handleInputChange} placeholder="https://example.com/pet.jpg" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Pet Profile'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal === 'details' && selectedPet && (
        <div className="modal-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeModal()}>
          <div className="modal-dialog pet-details-dialog" role="dialog" aria-modal="true" aria-labelledby="pet-details-title">
            <div className="modal-header">
              <h3 id="pet-details-title">{selectedPet.name}'s Profile</h3>
              <button className="btn-close" onClick={closeModal} aria-label="Close">✕</button>
            </div>
            <div className="pet-details-content">
              <img className="pet-details-image" src={selectedPet.photoUrl || FALLBACK_PHOTO} alt={`${selectedPet.name} profile`} onError={(event) => { event.currentTarget.src = FALLBACK_PHOTO; }} />
              <div className="pet-details-summary">
                <h4>{selectedPet.name} <span>{selectedPet.gender === 'Female' ? '♀' : selectedPet.gender === 'Male' ? '♂' : '⚥'}</span></h4>
                <p>{selectedPet.species} · {selectedPet.breed || 'Mixed Breed'}</p>
              </div>
              <div className="pet-detail-stats">
                <div><span>Age</span><strong>{selectedPet.age ?? '--'} years</strong></div>
                <div><span>Weight</span><strong>{selectedPet.weight ?? '--'} kg</strong></div>
              </div>
              <h4 className="details-section-title">Known Allergies</h4>
              <div className="allergy-tags">
                {selectedPet.allergies?.length ? selectedPet.allergies.map((allergy, index) => <span key={`${allergy}-${index}`} className="tag-allergy">{allergy}</span>) : <span className="no-allergies">None reported</span>}
              </div>
              <h4 className="details-section-title">Care Records & Medical Notes</h4>
              {recordsLoading ? <p className="details-muted">Loading care records...</p> : recordsError ? <div className="alert-error">{recordsError}</div> : careRecords.length === 0 ? <p className="details-muted">No care records or medical notes found.</p> : (
                <div className="care-record-list">
                  {careRecords.map((record) => (
                    <div className="care-record" key={record._id}>
                      <div><strong>{record.title || record.careType || 'Care record'}</strong><span>{record.status || 'Recorded'}</span></div>
                      {record.notes && <p>{record.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
