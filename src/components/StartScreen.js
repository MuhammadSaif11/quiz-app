function StartScreen({ length, dispatch }) {
  return (
    <div className="start">
      <h2>Welcome To The React Quiz!</h2>
      <h3>{length} question to test your react mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start-quiz" })}
      >
        Let's Start
      </button>
    </div>
  );
}

export default StartScreen;
