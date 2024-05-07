import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import "./EditQuestions.css";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { set } from "mongoose";

const QuestionBar = ({ id, deleteQuestion, question, updateQuestion }) => {
  return (
    <div className="question-bar-wrapper">
      <textarea
        className="question-input"
        type="text"
        defaultValue={question}
        placeholder="Enter Question"
        onChange={(e) => updateQuestion(id, e.target.value)}
      />

      <button className="generic-button" onClick={() => deleteQuestion(id)}>
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

  const [questions, setQuestions] = useState({});
  const [redirect, setRedirect] = useState(false);

  const addQuestion = () => {
    const id = uuid();
    setQuestions((prevQuestions) => {
      return {
        ...prevQuestions,
        [id]: { id, question: "" },
      };
    });
  };

  const deleteQuestion = (id) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = { ...prevQuestions };
      delete updatedQuestions[id];
      return updatedQuestions;
    });
  };

  const updateQuestion = (id, value) => {
    setQuestions((prevQuestions) => ({
      ...prevQuestions,
      [id]: {
        ...prevQuestions[id],
        question: value,
      },
    }));
  };

  const save = async () => {
    const keys = Object.keys(questions);
    let values = [];
    for (let i = 0; i < keys.length; i++) {
      values.push(questions[keys[i]].question);
    }
    console.log("questions:", values);

    const response = await fetch(
      "http://localhost:8000/api/instructor_questions/save",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        credentials: "include",
        body: JSON.stringify({
          questions: values,
        }),
      }
    );

    if (response.ok) {
      console.log("Successfully saved questions");
      setRedirect(true);
    }
  };

  const init = async () => {
    const response = await fetch(
      "http://localhost:8000/api/instructor_questions",
      {
        method: "GET",
        headers: {
          "Content-Type": "text/plain",
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      console.log("Successfully fetched questions");
      const jsonData = await response.json();
      console.log("jsonData:", jsonData);
      console.log("jsonData[questions]:", jsonData.questions);
      const data = jsonData.questions;
      console.log("data:", data);

      setQuestions(() => {
        let newQuestions = {};
        let id = 0;
        for (let i = 0; i < data.length; i++) {
          id = uuid();
          newQuestions[id] = { id: id, question: data[i] };
        }
        console.log("newQuestions:", newQuestions);
        return newQuestions;
      });
      console.log("questions:", questions);
    } else {
      console.error("Failed to fetch questions");
    }
  };

  useEffect(() => {
    init();
    console.log("qiestions");
    console.log(questions);
  }, []);

  if (redirect) {
    return <Navigate to="/instructor" />;
  }

  return (
    <div className="">
      <h1>Edit Questions</h1>
      <div>
        <Link to={"/instructor"}>
          <button className="generic-button">Back</button>
        </Link>
        <button className="generic-button" onClick={addQuestion}>
          add question
        </button>
        <button onClick={save} className="generic-button">
          Save
        </button>{" "}
        {/*On click, this will send a post request to our
                                   api to update the database*/}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {Object.values(questions).map((question) => (
            <QuestionBar
              key={question.id}
              id={question.id}
              deleteQuestion={deleteQuestion}
              question={question.question}
              updateQuestion={updateQuestion}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
