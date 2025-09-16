// tickets.js
const ticketsList = document.getElementById("tickets-list");
const ticketForm = document.getElementById("ticket-form");

async function fetchTickets() {
  try {
    const res = await fetch(`${API_BASE}/tickets/`);
    if (!res.ok) throw new Error("Failed to fetch tickets");
    const data = await res.json();
    renderTickets(data);
  } catch (e) {
    ticketsList.innerHTML = `<div class="item">Error loading tickets</div>`;
    console.error(e);
  }
}

function renderTickets(items) {
  ticketsList.innerHTML = "";
  if (!items.length) {
    ticketsList.innerHTML = `<div class="item">No tickets</div>`;
    return;
  }
  items.forEach(t => {
    const item = el("div", { class: "item" });
    const meta = el("div", { class: "meta" });
    meta.innerHTML = `<strong>Ticket #${t.id} — ${t.seat_number}</strong><small>Event ${t.event_id} • User ${t.user_id} • ${t.price}</small>`;
    const actions = el("div", { class: "actions" });
    const del = el("button", { class: "small-btn delete-btn", text: "Delete" });
    del.onclick = () => deleteTicket(t.id);
    actions.append(del);
    item.append(meta, actions);
    ticketsList.appendChild(item);
  });
}

ticketForm?.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const payload = {
    event_id: Number(document.getElementById("t_event_id").value),
    user_id: Number(document.getElementById("t_user_id").value),
    seat_number: document.getElementById("t_seat_number").value,
    price: Number(document.getElementById("t_price").value),
    ticket_type: document.getElementById("t_ticket_type").value
  };

  try {
    const res = await fetch(`${API_BASE}/tickets/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Create failed");
    ticketForm.reset();
    await fetchTickets();
  } catch (e) {
    alert("Failed to create ticket");
    console.error(e);
  }
});

document.getElementById("ticket-reset")?.addEventListener("click", () => {
  ticketForm.reset();
  document.getElementById("ticket-id").value = "";
});

async function deleteTicket(id) {
  if (!confirm("Delete ticket?")) return;
  try {
    const res = await fetch(`${API_BASE}/tickets/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    await fetchTickets();
  } catch (e) {
    alert("Failed to delete ticket"); console.error(e);
  }
}

fetchTickets();
