// users.js — simple CRUD for /users
const usersList = document.getElementById("users-list");
const userForm = document.getElementById("user-form");

async function fetchUsers() {
  try {
    const res = await fetch(`${API_BASE}/users/`);
    if (!res.ok) throw new Error("Failed to fetch users");
    const data = await res.json();
    renderUsers(data);
  } catch (e) {
    usersList.innerHTML = `<div class="item">Error loading users</div>`;
    console.error(e);
  }
}

function renderUsers(users) {
  usersList.innerHTML = "";
  if (!users.length) {
    usersList.innerHTML = `<div class="item">No users yet</div>`;
    return;
  }
  users.forEach(u => {
    const item = el("div", { class: "item" });
    const meta = el("div", { class: "meta" });
    meta.innerHTML = `<strong>${u.username}</strong><small>${u.email || ""}</small>`;
    const actions = el("div", { class: "actions" });
    const edit = el("button", { class: "small-btn edit-btn", text: "Edit" });
    const del = el("button", { class: "small-btn delete-btn", text: "Delete" });

    edit.onclick = () => fillForm(u);
    del.onclick = () => deleteUser(u.id);

    actions.append(edit, del);
    item.append(meta, actions);
    usersList.appendChild(item);
  });
}

function fillForm(u) {
  document.getElementById("user-id").value = u.id || "";
  document.getElementById("username").value = u.username || "";
  document.getElementById("email").value = u.email || "";
  document.getElementById("full_name").value = u.full_name || "";
  document.getElementById("user_type").value = u.user_type || "user";
}

userForm?.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const id = document.getElementById("user-id").value;
  const payload = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    full_name: document.getElementById("full_name").value,
    hashed_password: document.getElementById("password").value,
    user_type: document.getElementById("user_type").value
  };

  try {
    let res;
    if (id) {
      // if your backend has PUT user endpoint — adapt path; otherwise create new
      res = await fetch(`${API_BASE}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch(`${API_BASE}/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }
    if (!res.ok) throw new Error("Save failed");
    userForm.reset();
    await fetchUsers();
  } catch (e) {
    alert("Failed to save user — check backend console");
    console.error(e);
  }
});

document.getElementById("reset-btn")?.addEventListener("click", () => {
  userForm.reset();
  document.getElementById("user-id").value = "";
});

async function deleteUser(id) {
  if (!confirm("Delete this user?")) return;
  try {
    const res = await fetch(`${API_BASE}/users/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    await fetchUsers();
  } catch (e) {
    alert("Failed to delete");
    console.error(e);
  }
}

// initial load
fetchUsers();
