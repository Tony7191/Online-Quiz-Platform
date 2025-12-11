const store = require('../data');

exports.createQuiz = (req, res) => {
  const { title, teacherId, questions } = req.body;

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: 'Quiz must have at least one question.' });
  }

  const quiz = {
    id: String(store.nextQuizId++),
    title,
    teacherId: String(teacherId),
    questions: questions.map(q => ({
      id: String(store.nextQuestionId++),
      text: q.text,
      options: q.options,
      correctIndex: q.correctIndex,
    })),
  };

  store.quizzes.push(quiz);
  res.status(201).json(quiz);
};

exports.updateQuizTitle = (req, res) => {
  const quizId = req.params.id;
  const { title } = req.body;

  const quiz = store.quizzes.find(q => q.id === quizId);
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

  quiz.title = title;
  res.json(quiz);
};

exports.deleteQuiz = (req, res) => {
  const quizId = req.params.id;
  const index = store.quizzes.findIndex(q => q.id === quizId);

  if (index === -1) return res.status(404).json({ message: 'Quiz not found' });

  store.quizzes.splice(index, 1);
  res.json({ message: 'Quiz deleted' });
};

exports.getTeacherQuizzes = (req, res) => {
  const teacherId = String(req.params.id);
  const teacherQuizzes = store.quizzes.filter(q => q.teacherId === teacherId);
  res.json(teacherQuizzes);
};
