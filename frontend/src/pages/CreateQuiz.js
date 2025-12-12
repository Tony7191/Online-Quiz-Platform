import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function CreateQuiz() {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  async function submitQuiz() {
    if (!title.trim()) {
      alert("Quiz title cannot be empty.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in as a teacher or admin.");
      return;
    }

    const res = await fetch("http://localhost:5000/quiz/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(data.message || "Failed to create quiz.");
      return;
    }

    const newQuizId = data?.quiz?._id;
    if (!newQuizId) {
      alert("Quiz created, but no quiz id returned.");
      return;
    }

    setTitle("");
    navigate(`/quiz/${newQuizId}/add-question`);
  }

  return (
    <div className="container page box">
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
