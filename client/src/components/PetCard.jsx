import React from "react";
import { ChevronRight } from "lucide-react";
import { getPetImage, speciesGalleries } from "../utils/petImages";

export default function PetCard({ pet, onView }) {
  const imgUrl = getPetImage(pet);
  return (
    <button className="pet-card" onClick={onView}>
      <div className="pet-avatar">
        <img
          src={imgUrl}
          alt={pet.name}
          onError={(e) => {
            e.target.onerror = null;
            const g = speciesGalleries[pet?.species] || speciesGalleries.Dog;
            e.target.src = g[0];
          }}
        />
      </div>
      <div className="pet-card-main">
        <span className="species">{pet.species}</span>
        <h3>{pet.name}</h3>
        <p>
          {pet.breed || "Breed not added"}
          {pet.birthDate ? ` · Born ${new Date(pet.birthDate).getFullYear()}` : ""}
        </p>
      </div>
      <ChevronRight className="card-arrow" size={19} />
    </button>
  );
}
