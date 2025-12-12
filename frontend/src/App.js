import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuizList from "./pages/QuizList";
import TakeQuiz from "./pages/TakeQuiz";
import QuizHistory from "./pages/QuizHistory";
import History from "./pages/History";
import CreateQuiz from "./pages/CreateQuiz";
import AddQuestion from "./AddQuestion";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuizList />} />
        <Route path="/quiz/:quizId" element={<TakeQuiz />} />
        <Route path="/history/:studentId" element={<QuizHistory />} />
        <Route path="/history" element={<History />} />
        <Route path="/create" element={<CreateQuiz />} />
        <Route path="/quiz/:quizId/add-question" element={<AddQuestion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
