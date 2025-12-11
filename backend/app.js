const quizRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes');

app.use(express.json());
app.use(quizRoutes);
app.use(questionRoutes);
