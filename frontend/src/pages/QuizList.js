import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch("http://localhost:5000/quiz/list")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server responded ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        //console.log("Raw /quiz/list response:", data);

        if (Array.isArray(data)) {
          setQuizzes(data);
        } else {
          setQuizzes([]);
          setError("Unexpected response shape. Expected array.");
          //console.warn("Unexpected /quiz/list shape:", data);
        }
      })
      .catch((err) => {
        //console.error("Failed to load quizzes:", err);
        setError(err.message || "Failed to load quizzes");
        setQuizzes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  //console.log("QUIZ LIST IN FRONTEND:", quizzes);

  if (loading) return <div>Loading quizzes…</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div>
      <h2>Available Quizzes</h2>

      {quizzes.length === 0 ? (
        <p>No quizzes found.</p>
      ) : (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz._id}>
              {/* TAKE QUIZ */}
              <Link to={`/quiz/${quiz._id}`}>
                {quiz.title || "Untitled Quiz"}
              </Link>

              {" — "}

              {/* ADD QUESTION */}
              <Link to={`/quiz/${quiz._id}/add-question`}>
                Add Question
              </Link>

              {" — "}

              {/* DELETE QUIZ */}
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this quiz?")) {
                    fetch(`http://localhost:5000/quiz/${quiz._id}`, {
                      method: "DELETE",
                    })
                      .then((res) => res.json())
                      .then(() => {
                        // remove deleted quiz from state
                        setQuizzes(quizzes.filter((q) => q._id !== quiz._id));
                      })
                      .catch((err) => console.log(err));
                  }
                }}
                style={{ marginLeft: "10px", color: "red" }}
              >
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
