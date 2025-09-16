// orders.js
const ordersList = document.getElementById("orders-list");
const orderForm = document.getElementById("order-form");

async function fetchOrders() {
  try {
    const res = await fetch(`${API_BASE}/orders/`);
    if (!res.ok) throw new Error("Failed to fetch orders");
    const data = await res.json();
    renderOrders(data);
  } catch (e) {
    ordersList.innerHTML = `<div class="item">Error loading orders</div>`;
    console.error(e);
  }
}

function renderOrders(items) {
  ordersList.innerHTML = "";
  if (!items.length) {
    ordersList.innerHTML = `<div class="item">No orders</div>`;
    return;
  }
  items.forEach(o => {
    const item = el("div", { class: "item" });
    const meta = el("div", { class: "meta" });
    meta.innerHTML = `<strong>Order #${o.id}</strong><small>Ticket ${o.ticket_id} • User ${o.user_id} • Qty ${o.quantity}</small>`;
    const actions = el("div", { class: "actions" });
    const del = el("button", { class: "small-btn delete-btn", text: "Delete" });
    del.onclick = () => deleteOrder(o.id);
    actions.append(del);
    item.append(meta, actions);
    ordersList.appendChild(item);
  });
}

orderForm?.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const payload = {
    ticket_id: Number(document.getElementById("o_ticket_id").value),
    user_id: Number(document.getElementById("o_user_id").value),
    quantity: Number(document.getElementById("o_quantity").value)
  };
  try {
    const res = await fetch(`${API_BASE}/orders/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Create failed");
    orderForm.reset();
    await fetchOrders();
  } catch (e) {
    alert("Failed to create order"); console.error(e);
  }
});

document.getElementById("order-reset")?.addEventListener("click", () => {
  orderForm.reset();
  document.getElementById("order-id").value = "";
});

async function deleteOrder(id) {
  if (!confirm("Delete order?")) return;
  try {
    const res = await fetch(`${API_BASE}/orders/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    await fetchOrders();
  } catch (e) {
    alert("Failed to delete order"); console.error(e);
  }
}

fetchOrders();
