const API = "http://localhost:4000";

async function post(url, body){
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(()=> ({}));
  if(!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

function toast(type, title, msg){
  const t = document.getElementById("toast");
  const tTitle = document.getElementById("tTitle");
  const tMsg = document.getElementById("tMsg");
  if(!t) return alert(title + "\n" + msg);
  t.className = "toast show " + (type === "ok" ? "ok" : "err");
  tTitle.textContent = title;
  tMsg.textContent = msg;
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=> t.className = "toast", 3500);
}

// Password strength meter (client-side hints)
function pwChecks(p){
  return {
    len: (p||"").length >= 8,
    upper: /[A-Z]/.test(p||""),
    lower: /[a-z]/.test(p||""),
    num: /[0-9]/.test(p||""),
    sym: /[^A-Za-z0-9]/.test(p||""),
  };
}
function pwScore(p){
  const c = pwChecks(p);
  return Object.values(c).filter(Boolean).length; // 0..5
}
function renderPwHints(p){
  const hints = document.getElementById("pwhints");
  const fill = document.getElementById("pwfill");
  if(!hints || !fill) return;

  const c = pwChecks(p);
  const items = [
    ["8+ characters", c.len],
    ["Uppercase (A-Z)", c.upper],
    ["Lowercase (a-z)", c.lower],
    ["Number (0-9)", c.num],
    ["Symbol (!@#)", c.sym],
  ];
  hints.innerHTML = items.map(([t, ok]) => `<span class="${ok?"good":""}">${ok?"✓":"•"} ${t}</span>`).join("");
  fill.style.width = (pwScore(p) / 5 * 100).toFixed(0) + "%";
}

// Signup
const signupForm = document.getElementById("signupForm");
if(signupForm){
  const pw = document.getElementById("password");
  pw?.addEventListener("input", ()=> renderPwHints(pw.value));
  renderPwHints("");

  signupForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const fullname = document.getElementById("fullname").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;

    if(password !== confirm) return toast("err","Fix password","Passwords do not match.");
    // Basic client check; backend enforces strict policy
    if(pwScore(password) < 5) return toast("err","Weak password","Use Upper, Lower, Number, Symbol and 8+ chars.");

    try{
      await post(API + "/api/signup", { fullname, username, email, password, confirm });
      toast("ok","Account created","You're logged in. Redirecting...");
      setTimeout(()=> window.location.href="dashboard.html", 700);
    }catch(err){
      toast("err","Signup failed", err.message);
    }
  });
}

// Login
const loginForm = document.getElementById("loginForm");
if(loginForm){
  loginForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const login_id = document.getElementById("login_id").value.trim();
    const password = document.getElementById("password").value;

    try{
      await post(API + "/api/login", { login_id, password });
      toast("ok","Welcome back","Login successful. Redirecting...");
      setTimeout(()=> window.location.href="dashboard.html", 700);
    }catch(err){
      toast("err","Login failed", err.message);
    }
  });
}

// Dashboard
async function loadSession(){
  const r = await fetch(API + "/api/session", { credentials:"include" });
  return r.json().catch(()=> ({ loggedIn:false }));
}
if(window.location.pathname.endsWith("dashboard.html")){
  (async ()=>{
    const s = await loadSession();
    if(!s.loggedIn) return window.location.href = "login.html";
    document.getElementById("fullName").textContent = s.user.fullname || "";
    document.getElementById("navUser").textContent = s.user.username || "";
  })();

  document.getElementById("logoutBtn")?.addEventListener("click", async ()=>{
    await fetch(API + "/api/logout", { method:"POST", credentials:"include" });
    toast("ok","Logged out","See you next time!");
    setTimeout(()=> window.location.href="login.html", 400);
  });
}
