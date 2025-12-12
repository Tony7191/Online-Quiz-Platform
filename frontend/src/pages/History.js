import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";


function History() {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/attempt/student/10")
      .then(res => res.json())
      .then(data => setAttempts(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <BackButton />

      <h2>Your Quiz Attempts</h2>

      {attempts.length === 0 && <p>No attempts saved yet.</p>}

      {attempts.map((attempt, index) => (
        <div key={index} style={{ marginBottom: "12px" }}>
          <p><strong>Quiz ID:</strong> {attempt.quizId}</p>
          <p><strong>Score:</strong> {attempt.score}</p>
          <hr/>
        </div>
      ))}
    </div>
  );
}

export default History;
