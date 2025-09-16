// events.js — CRUD for /events
const eventsList = document.getElementById("events-list");
const eventForm = document.getElementById("event-form");

async function fetchEvents() {
  try {
    const res = await fetch(`${API_BASE}/events/`);
    if (!res.ok) throw new Error("Failed to fetch events");
    const data = await res.json();
    renderEvents(data);
  } catch (e) {
    eventsList.innerHTML = `<div class="item">Error loading events</div>`;
    console.error(e);
  }
}

function renderEvents(items) {
  eventsList.innerHTML = "";
  if (!items.length) {
    eventsList.innerHTML = `<div class="item">No events</div>`;
    return;
  }
  items.forEach(ev => {
    const item = el("div", { class: "item" });
    const meta = el("div", { class: "meta" });
    meta.innerHTML = `<strong>${ev.name}</strong><small>${ev.location} • ${new Date(ev.date).toLocaleString()}</small>`;
    const actions = el("div", { class: "actions" });
    const edit = el("button", { class: "small-btn edit-btn", text: "Edit" });
    const del = el("button", { class: "small-btn delete-btn", text: "Delete" });
    edit.onclick = () => fillEvent(ev);
    del.onclick = () => deleteEvent(ev.id);
    actions.append(edit, del);
    item.append(meta, actions);
    eventsList.appendChild(item);
  });
}

function fillEvent(e) {
  document.getElementById("event-id").value = e.id || "";
  document.getElementById("name").value = e.name || "";
  document.getElementById("location").value = e.location || "";
  // date => convert to input datetime-local format
  if (e.date) {
    const dt = new Date(e.date);
    const local = dt.toISOString().slice(0,16);
    document.getElementById("date").value = local;
  }
  document.getElementById("event_type").value = e.event_type || "concert";
  document.getElementById("description").value = e.description || "";
  document.getElementById("organizer_id").value = e.organizer_id || "";
}

eventForm?.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const id = document.getElementById("event-id").value;
  // convert datetime-local back to ISO
  const dateVal = document.getElementById("date").value;
  const payload = {
    name: document.getElementById("name").value,
    location: document.getElementById("location").value,
    date: new Date(dateVal).toISOString(),
    event_type: document.getElementById("event_type").value,
    description: document.getElementById("description").value,
    organizer_id: Number(document.getElementById("organizer_id").value) || null
  };

  try {
    let res;
    if (id) {
      res = await fetch(`${API_BASE}/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch(`${API_BASE}/events/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }
    if (!res.ok) throw new Error("Save failed");
    eventForm.reset();
    await fetchEvents();
  } catch (e) {
    alert("Failed to save event");
    console.error(e);
  }
});

document.getElementById("event-reset")?.addEventListener("click", () => {
  eventForm.reset();
  document.getElementById("event-id").value = "";
});

async function deleteEvent(id) {
  if (!confirm("Delete this event?")) return;
  try {
    const res = await fetch(`${API_BASE}/events/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    await fetchEvents();
  } catch (e) {
    alert("Failed to delete");
    console.error(e);
  }
}

fetchEvents();
