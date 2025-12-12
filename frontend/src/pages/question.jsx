function QuestionEditor({ question, onChange, onRemove }) {
  const { text, options, correctIndex } = question;

  const updateField = (field, value) => {
    onChange({ ...question, [field]: value });
  };

  const updateOption = (i, value) => {
    const newOptions = options.map((opt, idx) =>
      idx === i ? value : opt
    );
    updateField('options', newOptions);
  };

  return (
    <div className="container page box">
      <input
        placeholder="Question text"
        value={text}
        onChange={e => updateField('text', e.target.value)}
      />

      {options.map((opt, idx) => (
        <div key={idx}>
          <input
            value={opt}
            onChange={e => updateOption(idx, e.target.value)}
            placeholder={`Option ${idx + 1}`}
          />
          <input
            type="radio"
            checked={correctIndex === idx}
            onChange={() => updateField('correctIndex', idx)}
          /> Correct
        </div>
      ))}

      <button type="button" onClick={onRemove}>Remove question</button>
    </div>
  );
}

export default QuestionEditor;
