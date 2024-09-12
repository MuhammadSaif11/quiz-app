function Options({ question, answer, dispatch }) {
  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option ${answer === index ? "answer" : ""} ${
            answer === null
              ? ""
              : index === question.correctOption
              ? "correct"
              : "wrong"
          }`}
          key={option}
          onClick={() => dispatch({ type: "new-answer", payload: index })}
          disabled={answer !== null}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
