import "./StudentQuestions.css";
import { useLocation, Link } from "react-router-dom";
import { v4 as uuid } from "uuid";

export default function StudentQuestions() {
  const location = useLocation();
  const code = location.state.code;
  const questions = location.state.questions.split(",");
  const professor = location.state.professor;
  console.log(location.state);
  console.log(questions);

  return (
    <div id="wrapper">
      <div className="main-container">
        <Link to={"/student/code"}>
          <button className="back-button">Back</button>
        </Link>
        {questions.map((question) => (
          <div className="question-answer-wrapper" key={uuid()}>
            <div>{question}</div>
            <textarea className="question-input"></textarea>
          </div>
        ))}
        <button className="submit-button">Submit</button>
      </div>
    </div>
  );
}
