document.addEventListener("DOMContentLoaded", () => {
  console.log("Frontend loaded 🚀");
});

// base URL of your FastAPI backend
const API_BASE = "http://127.0.0.1:8000/events";

document.addEventListener("DOMContentLoaded", () => {
  // footer year
  const y = new Date().getFullYear();
  const el = document.getElementById("year");
  if (el) el.textContent = y;

  // small live notification if backend reachable
  pingBackend();
});

async function pingBackend() {
  try {
    const res = await fetch(`${API_BASE}/`);
    // ignore body — just detect reachability
    console.log("Backend reachable");
  } catch (err) {
    console.warn("Backend not reachable at", API_BASE);
  }
}

// utility: create dom element quickly
function el(tag, opts = {}) {
  const node = document.createElement(tag);
  if (opts.class) node.className = opts.class;
  if (opts.text) node.textContent = opts.text;
  if (opts.html) node.innerHTML = opts.html;
  return node;
}

fetch("http://127.0.0.1:8000/tickets", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    event_id: 1,
    user_id: 2,
    seat_number: "A12",
    price: 100.0
  })
})
  .then(res => res.json())
  .then(data => console.log("Created ticket:", data))
  .catch(err => console.error("Error:", err));
