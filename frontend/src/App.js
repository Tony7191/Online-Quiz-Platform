import { Routes, Route } from "react-router-dom";

import QuizList from "./pages/QuizList";
import TakeQuiz from "./pages/TakeQuiz";
import History from "./pages/History";
import CreateQuiz from "./pages/CreateQuiz";
import AddQuestion from "./AddQuestion";

function App() {
  return (
    <Routes>
      <Route path="/" element={<QuizList />} />
      <Route path="/quiz/:quizId" element={<TakeQuiz />} />
      <Route path="/quiz/:quizId/add-question" element={<AddQuestion />} />
      <Route path="/history" element={<History />} />
      <Route path="/create" element={<CreateQuiz />} />
    </Routes>
  );
}

export default App;
