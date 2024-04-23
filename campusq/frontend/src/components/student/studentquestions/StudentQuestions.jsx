import "./StudentQuestions.css";
import { useLocation, Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { useState } from "react";
import QuestionAnswer from "./QuestionAnswer";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";
import { set } from "mongoose";

export default function StudentQuestions() {
  const cookies = new Cookies();
  const canvas_id = cookies.get("canvas_id");
  console.log("canvas id from site: ", canvas_id);
  const location = useLocation();
  const questions = location.state.questions;
  const code = location.state.code;
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [data, setData] = useState({});
  const [redirect, setRedirect] = useState(false);

  const submitAnswers = async () => {
    try {
      console.log("Submitting answers");
      const response = await fetch(
        "http://localhost:8000/api/officehoursquestions/submit",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "text/plain",
          },
          body: JSON.stringify({
            canvas_id: canvas_id,
            answers: answers,
            code: code,
          }),
        }
      );

      if (response.ok) {
        console.log("Answers submitted");
        const newData = await response.json();
        setData(newData);
        console.log("data: ", data);

        setRedirect(true);
      } else {
        console.error("Failed to submit answers");
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  if (redirect) {
    console.log("redirecting");

    console.log("data message: ", data.message);
    console.log("data total: ", data.totalInQ);
    console.log("data position: ", data.position);
    return (
      <Navigate
        to="/student/waitroom"
        state={{
          total: data.totalInQ,
          position: data.position,
        }}
      />
    );
  }

  return (
    <div id="wrapper">
      <div className="main-container">
        <Link to={"/student/code"}>
          <button className="back-button">Back</button>
        </Link>
        {questions.map((question, index) => (
          <QuestionAnswer
            question={question}
            index={index}
            answers={answers}
            setAnswers={setAnswers}
            key={index}
          />
        ))}
        <button onClick={submitAnswers} className="submit-button">
          Submit
        </button>
      </div>
    </div>
  );
}
