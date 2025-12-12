import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/quiz/list")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load quizzes");
        return res.json();
      })
      .then((data) => {
        setQuizzes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load quizzes.");
        setLoading(false);
      });
  }, []);

  async function deleteQuiz(quizId) {
    const confirmDelete = window.confirm("Delete this quiz?");
    if (!confirmDelete) return;

    const res = await fetch(`http://localhost:5000/quiz/${quizId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete quiz.");
      return;
    }

    setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
  }

  if (loading) {
    return <div className="container page box">Loading quizzes…</div>;
  }

  if (error) {
    return <div className="container" style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div className="container page box">
      <h2>Available Quizzes</h2>

      {quizzes.length === 0 ? (
        <p>No quizzes available.</p>
      ) : (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz._id}>
              <strong>{quiz.title || "Untitled Quiz"}</strong>
              <br />

              <Link to={`/quiz/${quiz._id}`}>
                <button>Take Quiz</button>
              </Link>

              <Link to={`/quiz/${quiz._id}/add-question`}>
                <button>Add Question</button>
              </Link>

              <button
                className="delete-btn"
                onClick={() => deleteQuiz(quiz._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <hr />

      <Link to="/create">
        <button>Add New Quiz</button>
      </Link>

      <Link to="/history">
        <button>View My Results</button>
      </Link>
    </div>
  );
}

export default QuizList;
