import { useState } from "react";
import { v4 as uuid } from "uuid";
import "./EditQuestions.css";
import {Link} from "react-router-dom";

const QuestionBar = ({ id, deleteQuestion, question }) => {
  return (
    <div className="question-bar-wrapper">
      <textarea
        className="question-input"
        type="text"
        placeholder="Enter Question"
      />

      <button
        className="generic-button"
        id="question-bar-delete"
        onClick={() => deleteQuestion(id)}
      >
        delete
      </button>
    </div>
  );
};

export default function EditQuestions() {
  {
    /*instead of [], we will first query the api
   inside a useEffect, then use the questions in the database
   to populate the page*/
  }
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions((questions) => {
      return [...questions, { id: uuid(), question: "" }];
    });
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((question) => question.id !== id));
  };

  return (
    <div className="">
      <h1>Edit Questions</h1>
      <div>
        <Link to={'/instructor'}><button className="generic-button">Back</button></Link>
        <button className="generic-button" onClick={addQuestion}>
          add question
        </button>
        <button className="generic-button">Save</button>{" "}
        {/*On click, this will send a post request to our
                                   api to update the database*/}
        {questions.map((question) => (
          <QuestionBar
            key={question.id}
            id={question.id}
            deleteQuestion={deleteQuestion}
            question={question}
          />
        ))}
      </div>
    </div>
  );
}
