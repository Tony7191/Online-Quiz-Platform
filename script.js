function loadUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function signup(event) {
  event.preventDefault();
  let fullname = document.getElementById("fullname").value;
  let username = document.getElementById("username").value;
  let pass = document.getElementById("password").value;
  let confirm = document.getElementById("confirm").value;

  if (pass !== confirm) { alert("Passwords do not match!"); return false; }

  let users = loadUsers();
  if (users.find(u => u.username === username)) {
    alert("Username already exists!");
    return false;
  }

  users.push({ fullname, username, password: pass });
  saveUsers(users);
  alert("Account created successfully!");
  window.location.href = "login.html";
}

function login(event) {
  event.preventDefault();
  let username = document.getElementById("username").value;
  let pass = document.getElementById("password").value;
  let users = loadUsers();
  let user = users.find(u => u.username === username && u.password === pass);

  if (!user) { alert("Invalid username or password!"); return false; }

  localStorage.setItem("session", JSON.stringify(user));
  window.location.href = "dashboard.html";
}

function logout() {
  localStorage.removeItem("session");
  window.location.href = "login.html";
}

if (window.location.pathname.includes("dashboard")) {
  let session = JSON.parse(localStorage.getItem("session"));
  if (!session) window.location.href = "login.html";
  document.getElementById("welcome").innerText = "Welcome, " + session.fullname;
}
