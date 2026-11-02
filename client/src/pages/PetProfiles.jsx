import React, { useState, useEffect } from 'react';
import petService from '../api/petService';

export default function PetProfiles() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    weight: '',
    allergies: '',
    photoUrl: '',
  });
  const [statusMsg, setStatusMsg] = useState('');

  const loadPets = async () => {
    try {
      setLoading(true);
      const res = await petService.getAllPets();
      if (res && res.data) {
        setPets(res.data);
      }
    } catch (err) {
      console.error('Failed to load pets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPets();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePet = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        allergies: formData.allergies ? formData.allergies.split(',').map((s) => s.trim()) : [],
        age: Number(formData.age) || 1,
        weight: Number(formData.weight) || 5,
        photoUrl: formData.photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400',
      };

      const res = await petService.createPet(payload);
      if (res.success) {
        setStatusMsg('Pet profile registered successfully!');
        setShowModal(false);
        setFormData({
          name: '',
          species: 'Dog',
          breed: '',
          age: '',
          gender: 'Male',
          weight: '',
          allergies: '',
          photoUrl: '',
        });
        loadPets();
        setTimeout(() => setStatusMsg(''), 4000);
      }
    } catch (err) {
      setStatusMsg(err.message || 'Error creating pet profile');
    }
  };

  const handleDeletePet = async (id) => {
    if (window.confirm('Are you sure you want to delete this pet profile?')) {
      try {
        await petService.deletePet(id);
        setPets((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        console.error('Error deleting pet:', err);
      }
    }
  };

  return (
    <div className="page-container">
      <div className="section-header">
        <div>
          <h2 className="page-title">Pet Profiles Directory</h2>
          <p className="page-subtitle">
            Frontend UI: <strong>Siddartha Raj (2303A51917)</strong> · Backend CRUD: <strong>Bodasu Nithin (2303A51803)</strong>
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          ➕ Add New Pet
        </button>
      </div>

      {statusMsg && <div className="alert-banner">{statusMsg}</div>}

      {/* Pet Cards Grid */}
      {loading ? (
        <div className="loading-state">Loading pet profiles from server...</div>
      ) : pets.length === 0 ? (
        <div className="empty-state">
          <p>No pets found. Click "Add New Pet" to create the first profile!</p>
        </div>
      ) : (
        <div className="pet-grid">
          {pets.map((pet) => (
            <div key={pet._id} className="pet-card">
              <div className="pet-card-image-wrap">
                <img
                  src={pet.photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400'}
                  alt={pet.name}
                  className="pet-image"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400';
                  }}
                />
                <span className="pet-species-badge">{pet.species}</span>
              </div>
              <div className="pet-card-body">
                <div className="pet-header-row">
                  <h3 className="pet-name">{pet.name}</h3>
                  <span className="pet-gender">{pet.gender === 'Female' ? '♀' : '♂'}</span>
                </div>
                <p className="pet-breed">{pet.breed || 'Mixed Breed'}</p>

                <div className="pet-specs">
                  <div className="spec-badge">Age: {pet.age} yrs</div>
                  <div className="spec-badge">Weight: {pet.weight || '--'} kg</div>
                </div>

                {pet.allergies && pet.allergies.length > 0 && (
                  <div className="pet-allergies">
                    <strong>Allergies:</strong>
                    <div className="allergy-tags">
                      {pet.allergies.map((allergy, idx) => (
                        <span key={idx} className="tag-allergy">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pet-card-actions">
                  <button className="btn-card-delete" onClick={() => handleDeletePet(pet._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Pet Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>Register New Pet</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleCreatePet} className="modal-form">
              <div className="form-group">
                <label>Pet Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Milo, Max, Bella"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Species *</label>
                  <select name="species" value={formData.species} onChange={handleInputChange}>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Breed</label>
                  <input
                    type="text"
                    name="breed"
                    placeholder="e.g. Golden Retriever"
                    value={formData.breed}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Age (years)</label>
                  <input
                    type="number"
                    name="age"
                    placeholder="e.g. 3"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  placeholder="e.g. 14.5"
                  value={formData.weight}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Known Allergies (comma-separated)</label>
                <input
                  type="text"
                  name="allergies"
                  placeholder="e.g. Beef, Peanut Butter"
                  value={formData.allergies}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Photo URL</label>
                <input
                  type="url"
                  name="photoUrl"
                  placeholder="https://example.com/pet.jpg"
                  value={formData.photoUrl}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Pet Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
