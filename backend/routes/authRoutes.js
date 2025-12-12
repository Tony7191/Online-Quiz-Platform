const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post("/bootstrap-admin", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: "username and password required" });
    }

    const adminExists = await User.exists({ role: "admin" });
    if (adminExists) {
      return res.status(403).json({ message: "Admin already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      passwordHash,
      role: "admin",
    });

    res.json({
      message: "Admin created",
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to bootstrap admin" });
  }
});

router.post(
  "/create-user",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { username, password, role } = req.body || {};

      if (!username || !password || !role) {
        return res.status(400).json({
          message: "username, password, and role are required",
        });
      }

      if (!["admin", "teacher", "student"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const exists = await User.findOne({ username });
      if (exists) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        passwordHash,
        role,
      });

      res.json({
        message: "User created",
        user: { id: user._id, username: user.username, role: user.role },
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to create user" });
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: "username and password required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
