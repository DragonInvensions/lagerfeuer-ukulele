/* Text sicher in HTML setzen – Liedtexte kommen spaeter auch vom Server. */
const ERSATZ = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export function esc(text) {
  return String(text ?? "").replace(/[&<>"']/g, (zeichen) => ERSATZ[zeichen]);
}
