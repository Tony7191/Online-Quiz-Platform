const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.post('/quiz/:id/question', questionController.addQuestion);

router.put('/question/:id', questionController.updateQuestion);

router.delete('/question/:id', questionController.deleteQuestion);

module.exports = router;
