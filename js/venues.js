// venues.js — simple CRUD
const venuesList = document.getElementById("venues-list");
const venueForm = document.getElementById("venue-form");

async function fetchVenues() {
  try {
    const res = await fetch(`${API_BASE}/venues/`);
    if (!res.ok) throw new Error("Failed to fetch venues");
    const data = await res.json();
    renderVenues(data);
  } catch (e) {
    venuesList.innerHTML = `<div class="item">Error loading venues</div>`;
    console.error(e);
  }
}

function renderVenues(items) {
  venuesList.innerHTML = "";
  if (!items.length) {
    venuesList.innerHTML = `<div class="item">No venues</div>`;
    return;
  }
  items.forEach(v => {
    const item = el("div", { class: "item" });
    const meta = el("div", { class: "meta" });
    meta.innerHTML = `<strong>${v.name}</strong><small>${v.address} • capacity ${v.capacity}</small>`;
    const actions = el("div", { class: "actions" });
    const edit = el("button", { class: "small-btn edit-btn", text: "Edit" });
    const del = el("button", { class: "small-btn delete-btn", text: "Delete" });
    edit.onclick = () => fillVenue(v);
    del.onclick = () => deleteVenue(v.id);
    actions.append(edit, del);
    item.append(meta, actions);
    venuesList.appendChild(item);
  });
}

function fillVenue(v) {
  document.getElementById("venue-id").value = v.id || "";
  document.getElementById("v_name").value = v.name || "";
  document.getElementById("v_address").value = v.address || "";
  document.getElementById("v_capacity").value = v.capacity || "";
}

venueForm?.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const id = document.getElementById("venue-id").value;
  const payload = {
    name: document.getElementById("v_name").value,
    address: document.getElementById("v_address").value,
    capacity: Number(document.getElementById("v_capacity").value) || 0
  };
  try {
    let res;
    if (id) {
      res = await fetch(`${API_BASE}/venues/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } else {
      res = await fetch(`${API_BASE}/venues/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    }
    if (!res.ok) throw new Error("Save failed");
    venueForm.reset(); fetchVenues();
  } catch (e) {
    alert("Failed to save venue"); console.error(e);
  }
});

document.getElementById("venue-reset")?.addEventListener("click", () => {
  venueForm.reset();
  document.getElementById("venue-id").value = "";
});

async function deleteVenue(id) {
  if (!confirm("Delete this venue?")) return;
  try {
    const res = await fetch(`${API_BASE}/venues/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    await fetchVenues();
  } catch (e) {
    alert("Failed to delete venue"); console.error(e);
  }
}

fetchVenues();
