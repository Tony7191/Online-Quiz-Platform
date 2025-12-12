import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function CreateQuiz() {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  async function submitQuiz() {
    if (!title.trim()) return alert("Quiz title cannot be empty.");

    const res = await fetch("http://localhost:5000/quiz/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    const data = await res.json();

    if (!res.ok) return alert(data.message || "Failed to create quiz.");

    const newQuizId = data?.quiz?._id;
    if (!newQuizId) return alert("Quiz created, but no quiz id returned.");

    setTitle("");
    navigate(`/quiz/${newQuizId}/add-question`);
  }

  return (
    <div className="container">
      <BackButton />

      <h2>Create a New Quiz</h2>

      <input
        type="text"
        placeholder="Quiz title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={submitQuiz}>Add Quiz</button>
    </div>
  );
}

export default CreateQuiz;
