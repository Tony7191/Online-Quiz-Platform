import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import QuizList from "./pages/QuizList";
import TakeQuiz from "./pages/TakeQuiz";
import History from "./pages/History";
import CreateQuiz from "./pages/CreateQuiz";
import AddQuestion from "./AddQuestion";
import Login from "./pages/Login";

function RouteTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState("fade-in");

  useEffect(() => {
    setStage("fade-out");

    const t1 = setTimeout(() => {
      setDisplayLocation(location);
      requestAnimationFrame(() => setStage("fade-in"));
    }, 180);

    return () => clearTimeout(t1);
  }, [location]);

  return (
    <div className={`route-stage ${stage}`}>
      <Routes location={displayLocation}>{children}</Routes>
    </div>
  );
}

function RequireAuth({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireRole({ user, roles, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  function handleLogin(userData) {
    setUser(userData);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <RouteTransition>
      <Route
        path="/login"
        element={<Login onLogin={handleLogin} />}
      />

      <Route
        path="/"
        element={
          <RequireAuth user={user}>
            <QuizList user={user} onLogout={handleLogout} />
          </RequireAuth>
        }
      />

      <Route
        path="/quiz/:quizId"
        element={
          <RequireRole user={user} roles={["student", "admin"]}>
            <TakeQuiz />
          </RequireRole>
        }
      />

      <Route
        path="/create"
        element={
          <RequireRole user={user} roles={["teacher", "admin"]}>
            <CreateQuiz />
          </RequireRole>
        }
      />

      <Route
        path="/quiz/:quizId/add-question"
        element={
          <RequireRole user={user} roles={["teacher", "admin"]}>
            <AddQuestion />
          </RequireRole>
        }
      />

      <Route
        path="/history"
        element={
          <RequireRole user={user} roles={["student", "admin"]}>
            <History />
          </RequireRole>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </RouteTransition>
  );
}
