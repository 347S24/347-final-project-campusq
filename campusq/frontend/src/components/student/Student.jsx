import "./Student.css";
import React, { useState } from "react";

export default function Student() {
  const [code, setCode] = useState("");
  const [questions, setQuestions] = useState("");
  const [error, setError] = useState("");

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
      </div>
    </div>
  );
}
