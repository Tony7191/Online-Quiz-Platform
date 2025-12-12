import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import BackButton from "../components/BackButton";


function TakeQuiz() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  // Load quiz + questions from MongoDB
  useEffect(() => {
    fetch(`http://localhost:5000/quiz/${quizId}`)
      .then((res) => res.json())
      .then((data) => setQuiz(data))
      .catch((err) => console.log(err));
  }, [quizId]);

  if (!quiz) return <div>Loading quiz...</div>;

  // QUIZ HAS NO QUESTIONS
  if (!quiz.questions || quiz.questions.length === 0) {
    return <p>This quiz has no questions yet.</p>;
  }

  function submitQuiz() {
    let correctCount = 0;

    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setSubmitted(true);

    // Save attempt to backend
    fetch("http://localhost:5000/attempt/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: 10, // mock student ID
        quizId: quizId,
        answers: selectedAnswers,
        score: correctCount,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Attempt saved:", data))
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <BackButton />


      <h2>{quiz.title}</h2>

      {!submitted &&
        quiz.questions.map((q, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <p><strong>Q{index + 1}:</strong> {q.text}</p>

            {q.options.map((opt, i) => (
              <label key={i} style={{ display: "block" }}>
                <input
                  type="radio"
                  name={`question-${index}`}
                  onChange={() =>
                    setSelectedAnswers({
                      ...selectedAnswers,
                      [index]: i,
                    })
                  }
                />
                {opt}
              </label>
            ))}
          </div>
        ))}

      {!submitted && (
        <button onClick={submitQuiz}>Submit Quiz</button>
      )}

      {submitted && (
        <h3>Your Score: {score} / {quiz.questions.length}</h3>
      )}
    </div>
  );
}

export default TakeQuiz;
