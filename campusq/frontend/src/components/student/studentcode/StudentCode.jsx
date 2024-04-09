import { redirect } from "react-router-dom";
import "./StudentCode.css";
import React, { useState } from "react";
import StudentQuestions from "../studentquestions/StudentQuestions";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useEffect } from "react";

export default function StudentCode() {
  const [code, setCode] = useState("");
  const [questions, setQuestions] = useState("");
  const [error, setError] = useState("");
  const [professor, setProfessor] = useState("");
  const [studentName, setStudentName] = useState("");

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

  // useEffect(() => {
  //   const cookies = new Cookies();
  //   const accessToken = cookies.get("access_token");
  //   console.log("Access token:", accessToken);
  //   const userDataURL = "http://127.0.0.1:8000/api/student/info";
  //   const headers = {
  //     Authorization: `Bearer ${accessToken}`,
  //   };

  //   fetch(userDataURL, {
  //     method: "GET",
  //     headers: headers,
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log(data);
  //     })
  //     .catch((error) => {
  //       console.error("There was a problem with the fetch operation:", error);
  //     });
  // }, []);

  useEffect(() => {
    const cookies = new Cookies();
    const accessToken = cookies.get("access_token");
    console.log("Access token:", accessToken);
    const userDataURL =
      "http://127.0.0.1:8000/api/student/info?access_token=" + accessToken;
    const headers = {};

    fetch(userDataURL, {
      method: "GET",
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setStudentName(data.login_id);
        console.log(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

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
    <div id="body">
      <div id="header">
        <div id="top-left">
          <div>Logged in: {studentName}</div>
          <button>logout</button>
        </div>
        <div id="middle">
          <h1 id="title">CampusQ</h1>
        </div>
        <div id="top-left">
          <h1>Something</h1>
        </div>
      </div>
      <div className="main-container">
        <div id="button-part">
          <input
            id="input"
            type="text"
            name="code"
            placeholder="Office Hours Code"
            maxLength={4}
            onChange={(event) => setCode(event.target.value)}
          />
          <button id="login-button" type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        <div id="error-area">
          {error && <div>{error}</div>}
          {questions && <div>{questions}</div>}
          {professor && <div>{professor}</div>}
        </div>
      </div>
    </div>
  );
}
