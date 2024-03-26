import { useState } from "react";
import { v4 as uuid } from "uuid";

const QuestionBar = ({ id, deleteQuestion, question }) => {
  return (
    <div>
      <input type="text" placeholder="Enter Question" />

      <button onClick={() => deleteQuestion(id)}>delete</button>
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
    <div>
      <h1>Edit Questions</h1>
      <div>
        <button>Back</button>
        <button onClick={addQuestion}>add question</button>
        <button>Save</button> /{" "}
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
