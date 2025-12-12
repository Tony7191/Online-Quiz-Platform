import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { quizId } = useParams();

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`http://localhost:5000/quiz/${quizId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Server error (${res.status})`);
        return res.json();
      })
      .then((data) => setQuizzes(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "Failed to load quizzes"))
      .finally(() => setLoading(false));
  }, []);

  async function deleteQuiz(quizId) {
    const ok = window.confirm("Are you sure you want to delete this quiz?");
    if (!ok) return;

    const res = await fetch(`http://localhost:5000/quiz/${quizId}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) return alert(data.message || "Failed to delete quiz.");

    setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
  }

  if (loading) return <div className="container">Loading quizzes…</div>;
  if (error) return <div className="container" style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div className="container">
      <h2>Available Quizzes</h2>

      {quizzes.length === 0 ? (
        <p>No quizzes found.</p>
      ) : (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz._id}>
              <Link to={`/quiz/${quiz._id}`}>{quiz.title || "Untitled Quiz"}</Link>
              {" — "}
              <Link to={`/quiz/${quiz._id}/add-question`}>Add Question</Link>
              {" — "}
              <button className="delete-btn" onClick={() => deleteQuiz(quiz._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <br />

      <Link to="/history">
        <button>View My Results</button>
      </Link>

      <Link to="/create">
        <button>Add New Quiz</button>
      </Link>
    </div>
  );
}

export default QuizList;
