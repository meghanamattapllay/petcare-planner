import React, { useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { api } from "../api/api";
import { getPetImage, resolveImageUrl, speciesGalleries } from "../utils/petImages";

const emptyPet = { name: "", species: "Dog", breed: "", birthDate: "", notes: "", photoUrl: "" };

export default function PetForm({ pet, onClose, onSaved }) {
  const [form, setForm] = useState(pet || emptyPet);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        photoUrl: resolveImageUrl(form.photoUrl),
      };
      await api(pet ? `/pets/${pet._id}` : "/pets", {
        method: pet ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      onSaved();
    } catch (err) {
      setError(err.message);
    }
  };

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 450;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        update("photoUrl", dataUrl);
        setUploading(false);
      };
      img.onerror = () => {
        update("photoUrl", event.target.result);
        setUploading(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const previewImage = resolveImageUrl(form.photoUrl) || getPetImage(form);

  return (
    <div className="overlay">
      <section className="form-panel">
        <button className="close" onClick={onClose}>
          <X />
        </button>
        <span className="eyebrow">{pet ? "Update profile" : "New companion"}</span>
        <h2>{pet ? `Edit ${pet.name}` : "Add a pet"}</h2>
        <p className="panel-intro">A few details help keep their care journey organized.</p>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "18px", padding: "12px", background: "#f6faf8", borderRadius: "12px", border: "1px solid #e1eee7" }}>
          <img
            src={previewImage}
            alt="Preview"
            style={{ width: "68px", height: "68px", borderRadius: "12px", objectFit: "cover", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            onError={(e) => {
              e.target.onerror = null;
              const g = speciesGalleries[form?.species] || speciesGalleries.Dog;
              e.target.src = g[0];
            }}
          />
          <div style={{ flex: 1 }}>
            <strong style={{ display: "block", fontSize: "13px", color: "#1f302b", marginBottom: "5px" }}>
              {form.photoUrl ? "Photo Attached" : "Default Auto Photo (No custom upload)"}
            </strong>
            <label style={{ display: "inline-block", background: "#3b6d60", color: "#fff", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", margin: 0, boxShadow: "0 2px 4px rgba(59,109,96,0.2)" }}>
              {uploading ? "Processing..." : "📁 Upload photo from device"}
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
            </label>
            {form.photoUrl && (
              <button
                type="button"
                onClick={() => update("photoUrl", "")}
                style={{ marginLeft: "10px", background: "none", border: "none", color: "#dc2626", fontSize: "11.5px", cursor: "pointer", textDecoration: "underline" }}
              >
                Clear photo
              </button>
            )}
          </div>
        </div>

        <form onSubmit={save} className="pet-form">
          <label>
            Pet name
            <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Maple" required />
          </label>
          <label>
            Species
            <select value={form.species} onChange={(e) => update("species", e.target.value)}>
              {["Dog", "Cat", "Bird", "Rabbit", "Other"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Breed <span>optional</span>
            <input value={form.breed} onChange={(e) => update("breed", e.target.value)} placeholder="e.g. Golden Retriever" />
          </label>
          <label>
            Or Paste Web Image URL <span>optional</span>
            <input
              value={form.photoUrl || ""}
              onChange={(e) => update("photoUrl", e.target.value)}
              placeholder="https://... (or click Upload photo button above)"
            />
          </label>
          <label>
            Birth date <span>optional</span>
            <input
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              value={form.birthDate ? form.birthDate.slice(0, 10) : ""}
              onChange={(e) => update("birthDate", e.target.value)}
            />
          </label>
          <label>
            Notes <span>optional</span>
            <textarea
              rows="3"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Favorite things, important details..."
            />
          </label>
          {error && <div className="error">{error}</div>}
          <div className="form-actions">
            <button type="button" className="secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="primary">
              {pet ? "Save changes" : "Create profile"} <ChevronRight size={17} />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
