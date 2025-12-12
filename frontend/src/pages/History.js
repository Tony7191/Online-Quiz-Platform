import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";

function History() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Not authenticated.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/attempt/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || "Failed to load history");
        return data;
      })
      .then((data) => {
        setAttempts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError(err.message || "Could not load attempts.");
        setAttempts([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return <div className="container page box">Loading history…</div>;
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
      <BackButton />

      <h2>Your Quiz Attempts</h2>

      {attempts.length === 0 && <p>No attempts saved yet.</p>}

      {attempts.map((attempt, index) => (
        <div key={index} style={{ marginBottom: 12 }}>
          <p>
            <strong>Quiz ID:</strong> {attempt.quizId}
          </p>
          <p>
            <strong>Score:</strong> {attempt.score}
          </p>
          <p style={{ opacity: 0.7, fontSize: "0.9em" }}>
            {new Date(attempt.createdAt).toLocaleString()}
          </p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default History;
