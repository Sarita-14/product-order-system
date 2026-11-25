// Centered dialog. Closes on Escape, on the × button, or on a backdrop click.
import { useEffect } from "react";

function Modal({ title, onClose, children }) {
  // ---------- Close on Escape ----------
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // ---------- Markup ----------
  return (
    <div className="modal-backdrop" onClick={onClose}>
      {/* stopPropagation: clicks inside the dialog must not close it */}
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
