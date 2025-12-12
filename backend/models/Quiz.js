const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [
    {
      text: { type: String, required: true },
      options: { type: [String], required: true },
      correct: { type: Number, required: true }
    }
  ]
});

module.exports = mongoose.model("Quiz", quizSchema);
