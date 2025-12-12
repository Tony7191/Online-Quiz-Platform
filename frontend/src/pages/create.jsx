import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionEditor from './question';

const token = localStorage.getItem("token");


function CreateQuizPage({ teacherId }) {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  const addEmptyQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { text: '', options: ['', '', '', ''], correctIndex: 0 },
    ]);
  };

  const updateQuestion = (index, updated) => {
    setQuestions(prev => prev.map((q, i) => (i === index ? updated : q)));
  };

  const removeQuestion = (index) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch('/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, teacherId, questions }),
    });

    navigate('/teacher/dashboard');
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Quiz</h1>

      <label>
        Quiz title:
        <input value={title} onChange={e => setTitle(e.target.value)} />
      </label>

      <h2>Questions</h2>

      {questions.map((q, idx) => (
        <QuestionEditor
          key={idx}
          question={q}
          onChange={(updated) => updateQuestion(idx, updated)}
          onRemove={() => removeQuestion(idx)}
        />
      ))}

      <button type="button" onClick={addEmptyQuestion}>Add question</button>
      <button type="submit">Save quiz</button>
    </form>
  );
}

export default CreateQuizPage;
