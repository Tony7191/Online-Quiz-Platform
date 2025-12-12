import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function QuizList({ user, onLogout }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

useEffect(() => {
  const controller = new AbortController();

  setLoading(true);
  setError("");

  fetch("http://localhost:5000/quiz/list", { signal: controller.signal })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load quizzes");
      return res.json();
    })
    .then((data) => setQuizzes(Array.isArray(data) ? data : []))
    .catch((err) => {
      if (err.name !== "AbortError") setError("Could not load quizzes.");
    })
    .finally(() => setLoading(false));

  return () => controller.abort();
}, []);


  async function deleteQuiz(quizId) {
    if (!token) {
      alert("Not authenticated");
      return;
    }

    const confirmDelete = window.confirm("Delete this quiz?");
    if (!confirmDelete) return;

    const res = await fetch(`http://localhost:5000/quiz/${quizId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      alert("You are not allowed to delete this quiz.");
      return;
    }

    setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
  }

  if (loading) {
    return <div className="container page box">Loading quizzes…</div>;
  }

  if (error) {
    return (
      <div className="container page box" style={{ color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <div className="container page box">
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <h2 style={{ margin: 0 }}>Available Quizzes</h2>

        <span style={{ marginLeft: "auto", marginRight: 10 }}>
          Logged in as <strong>{user.username}</strong> ({user.role})
        </span>

        <button onClick={onLogout}>Logout</button>
      </div>

      {quizzes.length === 0 ? (
        <p>No quizzes available.</p>
      ) : (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz._id}>
              <strong>{quiz.title || "Untitled Quiz"}</strong>
              <br />

              {(user.role === "student" || user.role === "admin") && (
                <Link to={`/quiz/${quiz._id}`}>
                  <button>Take Quiz</button>
                </Link>
              )}

              {(user.role === "teacher" || user.role === "admin") && (
                <>
                  <Link to={`/quiz/${quiz._id}/add-question`}>
                    <button>Add Question</button>
                  </Link>

                  <button
                    className="delete-btn"
                    onClick={() => deleteQuiz(quiz._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <hr />
      {(user.role === "teacher" || user.role === "admin") && (
        <Link to="/create">
          <button>Add New Quiz</button>
        </Link>
      )}

      {(user.role === "student" || user.role === "admin") && (
        <Link to="/history">
          <button>Results</button>
        </Link>
      )}
    </div>
  );
}

export default QuizList;
