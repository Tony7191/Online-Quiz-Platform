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

  // Load quiz with existing questions
  useEffect(() => {
    fetch(`http://localhost:5000/quiz/${quizId}`)
      .then((res) => res.json())
      .then((data) => setQuiz(data))
      .catch((err) => console.log(err));
  }, [quizId]);

  // ADD QUESTION
  function submitQuestion() {
    if (!text.trim()) {
      setMsg("Question text cannot be empty.");
      return;
    }
    if (options.some((opt) => !opt.trim())) {
      setMsg("All options must be filled in.");
      return;
    }

    const payload = { text, options, correct };

    fetch(`http://localhost:5000/quiz/${quizId}/add-question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        setMsg("Question added!");
        setText("");
        setOptions(["", "", "", ""]);
        setCorrect(0);
        setQuiz(data.quiz); // refresh quiz with new question
      })
      .catch((err) => console.log(err));
  }

  // DELETE QUESTION
  function deleteQuestion(index) {
    if (!window.confirm("Delete this question?")) return;

    fetch(`http://localhost:5000/quiz/${quizId}/question/${index}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        setQuiz(data.quiz); // update quiz after deletion
      })
      .catch((err) => console.log(err));
  }

  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <div>
      <BackButton />

      <h2>Add Question to: {quiz.title}</h2>

      <input
        type="text"
        placeholder="Question text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <h3>Options:</h3>
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

      <h3>Correct Answer:</h3>
      <select value={correct} onChange={(e) => setCorrect(Number(e.target.value))}>
        {options.map((_, i) => (
          <option key={i} value={i}>
            Option {i + 1}
          </option>
        ))}
      </select>

      <br /><br />

      <button onClick={submitQuestion}>Add Question</button>

      {msg && <p style={{ color: "green" }}>{msg}</p>}

      <hr />

      <h3>Existing Questions:</h3>

      {quiz.questions.length === 0 && <p>No questions yet.</p>}

      {quiz.questions.map((q, index) => (
        <div key={index} style={{ marginBottom: "15px" }}>
          <strong>{q.text}</strong>
          <button
            onClick={() => deleteQuestion(index)}
            style={{ marginLeft: "10px", color: "red" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default AddQuestion;
