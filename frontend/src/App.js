import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import QuizList from "./pages/QuizList";
import TakeQuiz from "./pages/TakeQuiz";
import History from "./pages/History";
import CreateQuiz from "./pages/CreateQuiz";
import AddQuestion from "./AddQuestion";

function RouteTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState("fade-in"); // fade-in | fade-out

  useEffect(() => {
  // 1) fade OUT current page
  setStage("fade-out");

  const t1 = setTimeout(() => {
    // 2) swap the route while invisible
    setDisplayLocation(location);

    // 3) fade IN new page on next frame
    requestAnimationFrame(() => setStage("fade-in"));
  }, 180); // must match CSS duration

  return () => clearTimeout(t1);
}, [location]);


  return (
    <div className={`route-stage ${stage}`}>
      <Routes location={displayLocation}>{children}</Routes>
    </div>
  );
}

export default function App() {
  return (
    <RouteTransition>
      <Route path="/" element={<QuizList />} />
      <Route path="/create" element={<CreateQuiz />} />
      <Route path="/quiz/:quizId" element={<TakeQuiz />} />
      <Route path="/quiz/:quizId/add-question" element={<AddQuestion />} />
      <Route path="/history" element={<History />} />
    </RouteTransition>
  );
}
