import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function TestView({ questions, answers, code }) {
  console.log("testviewcode", code);
  console.log("testviewquestions", questions);
  console.log("testviewanswers", answers);

  return (
    <div className="main-container">
      office hours code: <b>{code}</b>
      <style>
        {`
        table, tr, th, td {
          border: 1px solid black;
        }
        .main-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }

      `}
      </style>
      <table
        style={{
          outline: "1px solid black",
        }}
      >
        <th>Position</th>
        <th>Student</th>

        {questions.map((question, index) => (
          <th key={index}>{question}</th>
        ))}
        {Object.keys(answers).map((key, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{key}</td>
            {answers[key].map((answer, index) => (
              <td key={index}>{answer}</td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
}
