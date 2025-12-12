const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 4000;
const USERS_FILE = path.join(__dirname, "users.json");

// ---------- JSON DB helpers ----------
function readUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    const raw = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}
function writeUsers(users) {
  const tmp = USERS_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(users, null, 2));
  fs.renameSync(tmp, USERS_FILE);
}
function norm(s){ return (s || "").trim(); }
function normLower(s){ return norm(s).toLowerCase(); }
function isEmail(s){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
// Strict password policy:
// 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol
function strongPassword(p){
  if(!p || p.length < 8) return false;
  const hasUpper = /[A-Z]/.test(p);
  const hasLower = /[a-z]/.test(p);
  const hasNum   = /[0-9]/.test(p);
  const hasSym   = /[^A-Za-z0-9]/.test(p);
  return hasUpper && hasLower && hasNum && hasSym;
}

// ---------- Security middleware ----------
app.use(helmet());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(morgan("dev"));

app.use(cors({
  origin: [
    "http://localhost:5500","http://127.0.0.1:5500",
    "http://localhost:5173","http://127.0.0.1:5173"
  ],
  credentials: true
}));

app.use(session({
  name: "quiz.sid",
  secret: process.env.SESSION_SECRET || "CHANGE_ME_IN_PROD_very_long_random_string",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false, sameSite: "lax", maxAge: 1000*60*60*8 } // 8h
}));

// Auth rate limit (brute force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false
});

app.get("/api/ping", (_, res) => res.json({ ok: true }));

// ---------- Signup ----------
app.post("/api/signup", authLimiter, async (req, res) => {
  const fullname = norm(req.body.fullname);
  const username = norm(req.body.username);
  const email = normLower(req.body.email);
  const password = req.body.password || "";
  const confirm = req.body.confirm || "";

  if (!fullname || !username || !email || !password || !confirm) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (fullname.length < 3 || fullname.length > 100) {
    return res.status(400).json({ error: "Full name must be 3–100 characters." });
  }
  if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
    return res.status(400).json({ error: "Username must be 3–30 chars (letters, numbers, underscore)." });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }
  if (!strongPassword(password)) {
    return res.status(400).json({ error: "Password must be 8+ chars and include Uppercase, Lowercase, Number, Symbol." });
  }
  if (password !== confirm) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  const users = readUsers();
  if (users.some(u => u.usernameLower === username.toLowerCase())) {
    return res.status(409).json({ error: "Username already exists." });
  }
  if (users.some(u => u.email === email)) {
    return res.status(409).json({ error: "Email already registered." });
  }

  const hash = await bcrypt.hash(password, 12);
  const user = {
    id: uuidv4(),
    fullname,
    username,
    usernameLower: username.toLowerCase(),
    email,
    passwordHash: hash,
    failedAttempts: 0,
    lockUntil: 0,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  writeUsers(users);

  // Auto login after signup
  req.session.user = { id: user.id, username: user.username, fullname: user.fullname, email: user.email };
  res.status(201).json({ message: "Account created.", user: req.session.user });
});

// ---------- Login (strict + lockout) ----------
app.post("/api/login", authLimiter, async (req, res) => {
  const loginId = norm(req.body.login_id);
  const password = req.body.password || "";

  if (!loginId || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const users = readUsers();
  const loginIdLower = loginId.toLowerCase();
  const user = users.find(u => u.usernameLower === loginIdLower || u.email === loginIdLower);

  // Always respond similarly to avoid leaking which field exists
  const generic = () => res.status(401).json({ error: "Invalid login details." });

  if (!user) return generic();

  const now = Date.now();
  if (user.lockUntil && now < user.lockUntil) {
    const secs = Math.ceil((user.lockUntil - now) / 1000);
    return res.status(429).json({ error: `Account locked. Try again in ${secs}s.` });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    user.failedAttempts = (user.failedAttempts || 0) + 1;

    // Lock after 5 fails for 5 minutes
    if (user.failedAttempts >= 5) {
      user.lockUntil = now + 5 * 60 * 1000;
      user.failedAttempts = 0; // reset after locking
    }

    writeUsers(users);
    return generic();
  }

  // Success: reset counters
  user.failedAttempts = 0;
  user.lockUntil = 0;
  writeUsers(users);

  req.session.user = { id: user.id, username: user.username, fullname: user.fullname, email: user.email };
  res.json({ message: "Login successful.", user: req.session.user });
});

app.get("/api/session", (req, res) => {
  if (req.session && req.session.user) return res.json({ loggedIn: true, user: req.session.user });
  res.json({ loggedIn: false });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: "Logout failed." });
    res.clearCookie("quiz.sid");
    res.json({ message: "Logged out." });
  });
});

function requireAuth(req, res, next){
  if (req.session && req.session.user) return next();
  res.status(401).json({ error: "Not authenticated." });
}

app.get("/api/me", requireAuth, (req, res) => res.json({ user: req.session.user }));

app.listen(PORT, () => console.log(`Auth backend running on http://localhost:${PORT}`));
