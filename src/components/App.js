import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";
import Footer from "./Footer";

const SECS_PER_QUESTION = 20;
const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "data-received":
      return { ...state, questions: action.payload, status: "ready" };
    case "data-failed":
      return { ...state, status: "error" };
    case "start-quiz":
      return {
        ...state,
        status: "active",
        secondsRemaining: SECS_PER_QUESTION * state.questions.length,
      };
    case "new-answer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "next-question":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...initialState,
        status: "ready",
        highscore: state.highscore,
        questions: state.questions,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Unknown action");
  }
};
function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const questionsLength = questions.length;
  const maxPoints = questions.reduce(
    (value, question) => value + question.points,
    0
  );

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:8000/questions");
        const data = await res.json();
        dispatch({ type: "data-received", payload: data });
      } catch (error) {
        console.log(error);
        dispatch({ type: "data-failed" });
      }

      // console.log(data);
    };
    fetchQuestions();
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "error" && <Error />}
        {status === "loading" && <Loader />}
        {status === "ready" && (
          <StartScreen length={questionsLength} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              length={questionsLength}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Question
              question={questions.at(index)}
              answer={answer}
              dispatch={dispatch}
            />
            <Footer>
              <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
              <NextButton
                answer={answer}
                dispatch={dispatch}
                length={questionsLength}
                index={index}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
        {/* <p>1/15</p>
        <p>Question?</p> */}
      </Main>
    </div>
  );
}

export default App;
