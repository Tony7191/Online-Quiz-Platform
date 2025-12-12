const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");

// GET all quizzes
router.get("/list", async (req, res) => {
  const quizzes = await Quiz.find();
  res.json(quizzes);
});

// Create new quiz
router.post("/create", async (req, res) => {
  const { title } = req.body;

  const newQuiz = new Quiz({
    title,
    questions: []
  });

  await newQuiz.save();
  res.json({ message: "Quiz created", quiz: newQuiz });
});

// Get one quiz
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
});

// Add question to quiz
router.post("/:id/add-question", async (req, res) => {
  const { text, options, correct } = req.body;

  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    quiz.questions.push({ text, options, correct });
    await quiz.save();

    res.json({ message: "Question added", quiz });
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
});

// DELETE a quiz by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Quiz.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({ message: "Quiz deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
});

// DELETE a specific question from a quiz
router.delete("/:quizId/question/:questionIndex", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const index = parseInt(req.params.questionIndex);

    if (index < 0 || index >= quiz.questions.length) {
      return res.status(400).json({ message: "Invalid question index" });
    }

    quiz.questions.splice(index, 1); // remove 1 question
    await quiz.save();

    res.json({ message: "Question deleted", quiz });
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
});

module.exports = router;
