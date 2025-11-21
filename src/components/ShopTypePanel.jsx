import React from "react";

export default function ShopTypePanel({ types, onSelect, onClose }) {
  return (
    <aside className="shop-type-panel open" aria-live="polite">
      <div className="shop-type-header">
        <div style={{ fontWeight: 800 }}>Shop by type</div>
        <button
          aria-label="Close shop type"
          style={{ background: "transparent", border: "none", color: "var(--muted)", fontSize: 18, cursor: "pointer" }}
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <div className="shop-type-body">
        <ul className="type-list">
          {types.map((type) => (
            <li key={type} onClick={() => onSelect(type)} style={{ cursor: "pointer" }}>{type}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
