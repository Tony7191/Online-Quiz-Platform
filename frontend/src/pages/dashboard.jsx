import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TeacherDashboard({ teacherId }) {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/quiz/teacher/${teacherId}`);
      const data = await res.json();
      setQuizzes(data);
    };
    load();
  }, [teacherId]);

  const handleDelete = async (id) => {
    await fetch(`/quiz/${id}`, { method: 'DELETE' });
    setQuizzes(prev => prev.filter(q => q.id !== id));
  };

  return (
    <div>
      <h1>Your Quizzes</h1>
      <button onClick={() => navigate('/teacher/quizzes/new')}>
        Create Quiz
      </button>

      <ul>
        {quizzes.map(q => (
          <li key={q.id}>
            {q.title} ({q.questions.length} questions)
            <button onClick={() => navigate(`/teacher/quizzes/${q.id}/edit`)}>
              Edit
            </button>
            <button onClick={() => handleDelete(q.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeacherDashboard;
