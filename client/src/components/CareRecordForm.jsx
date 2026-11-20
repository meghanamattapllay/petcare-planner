import React, { useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { api } from "../api/api";

export default function CareRecordForm({ pet, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: "",
    careType: "Vaccination",
    eventDate: new Date().toISOString().slice(0, 10),
    nextDueDate: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const update = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await api(`/pets/${pet._id}/care-records`, {
        method: "POST",
        body: JSON.stringify({
          ...form,
          nextDueDate: form.nextDueDate || null,
        }),
      });

      onSaved();
    } catch (err) {
      setError(err.message || "Could not save care record.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overlay">
      <section className="form-panel">
        <button className="close" onClick={onClose}>
          <X />
        </button>

        <span className="eyebrow">Care history</span>
        <h2>Add care record</h2>
        <p className="panel-intro">Record a care event for {pet.name}.</p>

        <form onSubmit={save} className="pet-form">
          <label>
            Care title
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Annual vaccination"
              required
            />
          </label>

          <label>
            Care type
            <select
              value={form.careType}
              onChange={(e) => update("careType", e.target.value)}
            >
              {["Vaccination", "Medication", "Vet Visit", "Grooming", "Other"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            Event date
            <input
              type="date"
              value={form.eventDate}
              onChange={(e) => update("eventDate", e.target.value)}
              required
            />
          </label>

          <label>
            Next due date <span>optional</span>
            <input
              type="date"
              min={form.eventDate}
              value={form.nextDueDate}
              onChange={(e) => update("nextDueDate", e.target.value)}
            />
          </label>

          <label>
            Notes <span>optional</span>
            <textarea
              rows="3"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Additional details..."
            />
          </label>

          {error && <div className="error">{error}</div>}

          <div className="form-actions">
            <button type="button" className="secondary" onClick={onClose}>
              Cancel
            </button>

            <button className="primary" disabled={saving}>
              {saving ? "Saving..." : "Save care record"}
              <ChevronRight size={17} />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
