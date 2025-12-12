import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";


function CreateQuiz() {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  function submitQuiz() {
    fetch("http://localhost:5000/quiz/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Quiz created!");

        // IMPORTANT: Use MongoDB _id from the backend
        const newQuizId = data.quiz._id;

        // Redirect to add question page after creating quiz
        navigate(`/quiz/${newQuizId}/add-question`);

        setTitle("");
      });
  }

  return (
    <div>
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
