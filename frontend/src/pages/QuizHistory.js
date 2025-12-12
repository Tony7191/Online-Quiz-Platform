import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";


function QuizHistory() {
  const { studentId } = useParams();

  return (
    <div className="container page box">
      <BackButton />

      <h2>Quiz Results for student #{studentId}</h2>

      {/* Dummy attempt data */}
      <ul>
        <li>React Quiz — Score: 1/2</li>
        <li>JS Quiz — Score: 2/3</li>
      </ul>
    </div>
  );
}

export default QuizHistory;
