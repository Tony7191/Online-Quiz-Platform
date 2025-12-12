const express = require('express');
const cors = require('cors');

const quizRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes');
const attemptRoutes = require('./routes/attemptRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(quizRoutes);
app.use(questionRoutes);
app.use(attemptRoutes);

app.get('/', (req, res) => res.send('Quiz API running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
