import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";

function TakeQuiz() {
  const { quizId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch(`http://localhost:5000/quiz/${quizId}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || `Server error (${res.status})`);
        return data;
      })
      .then((data) => setQuiz(data))
      .catch((err) => setError(err.message || "Failed to load quiz"))
      .finally(() => setLoading(false));
  }, [quizId]);

  async function submitQuiz() {
    if (!quiz?.questions?.length) return;

    let correctCount = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct) correctCount++;
    });

    setScore(correctCount);
    setSubmitted(true);

    fetch("http://localhost:5000/attempt/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: 10,
        quizId,
        answers: selectedAnswers,
        score: correctCount,
      }),
    }).catch(() => {});
  }

  if (loading) return <div className="container page box">Loading quiz…</div>;
  if (error) return <div className="container page box" style={{ color: "red" }}>Error: {error}</div>;
  if (!quiz) return <div className="container page box">Quiz not found.</div>;

  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="container page box">
        <BackButton />
        <h2>{quiz.title}</h2>
        <p>This quiz has no questions yet.</p>
      </div>
    );
  }

  return (
    <div className="container page box">
      <BackButton />

      <h2>{quiz.title}</h2>

      {!submitted &&
        quiz.questions.map((q, index) => (
          <div key={index} style={{ marginBottom: 20 }}>
            <p>
              <strong>Q{index + 1}:</strong> {q.text}
            </p>

            {q.options.map((opt, i) => (
              <label key={i} style={{ display: "block" }}>
                <input
                  type="radio"
                  name={`question-${index}`}
                  checked={selectedAnswers[index] === i}
                  onChange={() =>
                    setSelectedAnswers((prev) => ({
                      ...prev,
                      [index]: i,
                    }))
                  }
                />
                {opt}
              </label>
            ))}
          </div>
        ))}

      {!submitted ? (
        <button onClick={submitQuiz}>Submit Quiz</button>
      ) : (
        <h3>
          Your Score: {score} / {quiz.questions.length}
        </h3>
      )}
    </div>
  );
}

export default TakeQuiz;
