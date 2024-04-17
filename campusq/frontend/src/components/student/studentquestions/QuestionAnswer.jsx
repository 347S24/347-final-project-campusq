import React from "react";

const QuestionAnswer = ({ question, index, answers, setAnswers }) => {
  return (
    <div className="question-answer-wrapper">
      <div>{question}</div>
      <textarea
        value={answers[index]}
        onChange={(event) => {
          const newAnswers = [...answers];
          newAnswers[index] = event.target.value;
          setAnswers(newAnswers);
          console.log(newAnswers);
        }}
        className="question-input"
        key={index}
      ></textarea>
    </div>
  );
};

export default QuestionAnswer;
