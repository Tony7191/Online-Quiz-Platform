const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.post('/quiz', quizController.createQuiz);

router.put('/quiz/:id', quizController.updateQuizTitle);

router.delete('/quiz/:id', quizController.deleteQuiz);

router.get('/quiz/teacher/:id', quizController.getTeacherQuizzes);

module.exports = router;
