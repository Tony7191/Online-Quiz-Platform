const store = require('../dataStore');

function findQuizByQuestionId(questionId) {
  for (const quiz of store.quizzes) {
    const question = quiz.questions.find(q => q.id === questionId);
    if (question) return { quiz, question };
  }
  return null;
}

exports.addQuestion = (req, res) => {
  const quizId = req.params.id;
  const { text, options, correctIndex } = req.body;

  const quiz = store.quizzes.find(q => q.id === quizId);
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

  const newQuestion = {
    id: String(store.nextQuestionId++),
    text,
    options,
    correctIndex,
  };

  quiz.questions.push(newQuestion);
  res.status(201).json(quiz);
};

exports.updateQuestion = (req, res) => {
  const questionId = req.params.id;
  const { text, options, correctIndex } = req.body;

  const result = findQuizByQuestionId(questionId);
  if (!result) return res.status(404).json({ message: 'Question not found' });

  const { quiz, question } = result;

  if (text !== undefined) question.text = text;
  if (options !== undefined) question.options = options;
  if (correctIndex !== undefined) question.correctIndex = correctIndex;

  res.json(quiz);
};

exports.deleteQuestion = (req, res) => {
  const questionId = req.params.id;

  const result = findQuizByQuestionId(questionId);
  if (!result) return res.status(404).json({ message: 'Question not found' });

  const { quiz } = result;

  quiz.questions = quiz.questions.filter(q => q.id !== questionId);

  if (quiz.questions.length === 0) {
    return res
      .status(400)
      .json({ message: 'Quiz must have at least one question.' });
  }

  res.json(quiz);
};
