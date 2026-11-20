import React from "react";
import { Plus, Trash2, X } from "lucide-react";
import { getPetImage, speciesGalleries, speciesIcon } from "../utils/petImages";
import CareTimeline from "./CareTimeline";

export default function PetDetails({ pet, onClose, onEdit, onDelete, onAddCareRecord }) {
  const Icon = speciesIcon(pet.species);

  return (
    <div className="overlay">
      <section className="details-panel">
        <button className="close" onClick={onClose}>
          <X />
        </button>

        <div className="details-avatar">
          <img
            src={getPetImage(pet)}
            alt={pet.name}
            onError={(e) => {
              e.target.onerror = null;
              const g = speciesGalleries[pet?.species] || speciesGalleries.Dog;
              e.target.src = g[0];
            }}
          />
        </div>

        <span className="eyebrow">{pet.species} profile</span>
        <h2>{pet.name}</h2>
        <p className="details-breed">{pet.breed || "Breed not added"}</p>

        <div className="details-meta">
          <div>
            <small>Birth date</small>
            <strong>
              {pet.birthDate
                ? new Date(pet.birthDate).toLocaleDateString()
                : "Not added"}
            </strong>
          </div>

          <div>
            <small>Profile added</small>
            <strong>{new Date(pet.createdAt).toLocaleDateString()}</strong>
          </div>
        </div>

        {pet.notes && (
          <div className="notes">
            <small>Notes</small>
            <p>{pet.notes}</p>
          </div>
        )}

        <div className="details-actions">
          <button className="secondary" onClick={onEdit}>
            Edit profile
          </button>

          <button className="danger" onClick={onDelete}>
            <Trash2 size={16} /> Delete
          </button>
        </div>

        <button className="primary add-care-button" onClick={onAddCareRecord}>
          <Plus size={17} /> Add care record
        </button>

        <CareTimeline pet={pet} key={pet._id} />
      </section>
    </div>
  );
}
