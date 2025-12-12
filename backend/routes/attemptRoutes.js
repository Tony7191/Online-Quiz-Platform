const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { requireAuth, requireRole } = require("../middleware/auth");


// ===== Attempt Model =====
const attemptSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    quizId: { type: String, required: true },
    score: { type: Number, required: true },
    answers: { type: Object, required: true },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const Attempt = mongoose.model("Attempt", attemptSchema);

/**
 * Student/Admin only:
 * Submit a quiz attempt
 */
router.post(
  "/submit",
  requireAuth,
  requireRole("student", "admin"),
  async (req, res) => {
    try {
      const { quizId, answers, score } = req.body;

      if (!quizId) {
        return res.status(400).json({ message: "quizId required" });
      }

      const newAttempt = await Attempt.create({
        studentId: req.user.id, // 🔐 derived from token
        quizId: String(quizId),
        answers: answers ?? {},
        score: Number(score ?? 0),
      });

      res.json({
        message: "Attempt saved successfully",
        attempt: newAttempt,
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to save attempt" });
    }
  }
);

/**
 * Student/Admin:
 * Get attempts for the CURRENT logged-in user
 * (Admin can see their own attempts if needed)
 */
router.get(
  "/my",
  requireAuth,
  requireRole("student", "admin"),
  async (req, res) => {
    try {
      const attempts = await Attempt.find({
        studentId: req.user.id,
      }).sort({ createdAt: -1 });

      res.json(attempts);
    } catch (err) {
      res.status(500).json({ message: "Failed to load attempts" });
    }
  }
);

module.exports = router;
