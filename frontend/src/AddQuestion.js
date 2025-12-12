import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BackButton from "./components/BackButton";

function AddQuestion() {
  const { quizId } = useParams();

  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);
  const [msg, setMsg] = useState("");
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/quiz/${quizId}`)
      .then((res) => res.json())
      .then((data) => setQuiz(data))
      .catch(() => setMsg("Failed to load quiz."));
  }, [quizId]);

  async function submitQuestion() {
    setMsg("");

    if (!text.trim()) return setMsg("Question text cannot be empty.");
    if (options.some((opt) => !opt.trim())) return setMsg("All options must be filled in.");

    const payload = { text, options, correct };

    const res = await fetch(`http://localhost:5000/quiz/${quizId}/add-question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setMsg(data.message || "Failed to add question.");

    setMsg("Question added!");
    setText("");
    setOptions(["", "", "", ""]);
    setCorrect(0);
    setQuiz(data.quiz);
  }

  async function deleteQuestion(index) {
    const ok = window.confirm("Delete this question?");
    if (!ok) return;

    const res = await fetch(`http://localhost:5000/quiz/${quizId}/question/${index}`, {
      method: "DELETE",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setMsg(data.message || "Failed to delete question.");

    setQuiz(data.quiz);
  }

  if (!quiz) return <div className="container">Loading quiz...</div>;

  return (
    <div className="container">
      <BackButton />

      <h2>Add Question to: {quiz.title}</h2>

      <input
        type="text"
        placeholder="Question text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <h3>Options</h3>
      {options.map((opt, i) => (
        <input
          key={i}
          type="text"
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={(e) => {
            const updated = [...options];
            updated[i] = e.target.value;
            setOptions(updated);
          }}
        />
      ))}

      <h3>Correct Answer</h3>
      <select value={correct} onChange={(e) => setCorrect(Number(e.target.value))}>
        {options.map((_, i) => (
          <option key={i} value={i}>
            Option {i + 1}
          </option>
        ))}
      </select>

      <button onClick={submitQuestion}>Add Question</button>

      {msg && <p style={{ marginTop: 10 }}>{msg}</p>}

      <hr />

      <h3>Existing Questions</h3>
      {quiz.questions.length === 0 && <p>No questions yet.</p>}

      {quiz.questions.map((q, index) => (
        <div key={index} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <strong>{q.text}</strong>
          <button className="delete-btn" onClick={() => deleteQuestion(index)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default AddQuestion;
