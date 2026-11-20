import React from "react";

export default function Stat({ label, value, tone, icon, onClick }) {
  return (
    <button
      type="button"
      className={`stat ${tone}`}
      onClick={onClick}
      style={{ cursor: "pointer", border: "none", textAlign: "left", width: "100%", font: "inherit" }}
    >
      <div className="stat-icon">{icon}</div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </button>
  );
}
