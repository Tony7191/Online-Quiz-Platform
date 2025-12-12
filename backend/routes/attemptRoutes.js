const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  quizId: { type: String, required: true },
  score: { type: Number, required: true },
  answers: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Attempt = mongoose.model("Attempt", attemptSchema);

router.post("/submit", async (req, res) => {
  const { studentId, quizId, answers, score } = req.body;

  const newAttempt = await Attempt.create({
    studentId: String(studentId),
    quizId: String(quizId),
    answers: answers ?? {},
    score: Number(score ?? 0),
  });

  res.json({ message: "Attempt saved successfully", attempt: newAttempt });
});

router.get("/student/:studentId", async (req, res) => {
  const studentId = String(req.params.studentId);
  const attempts = await Attempt.find({ studentId }).sort({ createdAt: -1 });
  res.json(attempts);
});

module.exports = router;
