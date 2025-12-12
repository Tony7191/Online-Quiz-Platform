import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate("/")} 
      style={{ marginBottom: "20px" }}
    >
      ← Back to Home
    </button>
  );
}

export default BackButton;
