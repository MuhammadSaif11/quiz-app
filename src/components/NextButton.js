function NextButton({ dispatch, answer, length, index }) {
  if (answer === null) return null;
  if (index < length - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "next-question" })}
      >
        Next
      </button>
    );
  if (index === length - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "finish" })}
      >
        Finish
      </button>
    );
}

export default NextButton;
