const express = require("express");
const router = express.Router();

let attempts = []; // temporary storage

// --- SUBMIT QUIZ ATTEMPT ---
router.post("/submit", (req, res) => {
  //console.log("ATTEMPT ROUTE HIT");         // <-- NEW LOG
  //console.log("REQUEST BODY:", req.body);   // <-- NEW LOG

  const { studentId, quizId, answers, score } = req.body;

  const newAttempt = {
    id: attempts.length + 1,
    studentId,
    quizId,
    score,
    answers,
    createdAt: new Date()
  };

  attempts.push(newAttempt);

  return res.json({
    message: "Attempt saved successfully",
    attempt: newAttempt,
  });
});

// --- GET ATTEMPTS FOR STUDENT ---
router.get("/student/:studentId", (req, res) => {
  //console.log("GET STUDENT ATTEMPTS HIT");  // <-- NEW LOG

  const studentId = req.params.studentId;
  const studentAttempts = attempts.filter(a => a.studentId == studentId);

  res.json(studentAttempts);
});

module.exports = router;
