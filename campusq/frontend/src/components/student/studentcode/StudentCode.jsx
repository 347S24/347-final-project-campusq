import { redirect } from "react-router-dom";
import "./StudentCode.css";
import React, { useState } from "react";
import StudentQuestions from "../studentquestions/StudentQuestions";
import { Navigate } from "react-router-dom";

export default function StudentCode() {
  const [code, setCode] = useState("");
  const [questions, setQuestions] = useState("");
  const [error, setError] = useState("");
  const [professor, setProfessor] = useState("");

  const [redirect, setRedirect] = useState(false);

  const handleSubmit = async () => {
    try {
      {
        /*set this to your local ip/port accordingly */
      }
      const response = await fetch(
        "http://127.0.0.1:8000/api/officehours?code=" + code,
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
        setError("");
        setProfessor(data.instructor);
        setRedirect(true);
        console.log(redirect);
      } else if (response.status == 404) {
        setQuestions("");
        setError("Invalid code");
      } else {
        const errorResponse = await response.text();
        setQuestions("");
        setError(errorResponse);
      }
    } catch (error) {
      console.error("An error occurred", error);
      setQuestions("");
      setError("An error occurred");
    }
  };

  if (redirect) {
    return (
      <Navigate
        to="/student/questions"
        state={{
          code: code,
          questions: questions,
          professor: professor,
        }}
      />
    );
  }

  return (
    <div id="wrapper">
      <div className="main-container">
        <div>Enter teacher office hours code:</div>
        <input
          id="input"
          type="text"
          name="code"
          maxLength={4}
          onChange={(event) => setCode(event.target.value)}
        />
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
        {error && <div>{error}</div>}
        {questions && <div>{questions}</div>}
        {professor && <div>{professor}</div>}
      </div>
    </div>
  );
}
