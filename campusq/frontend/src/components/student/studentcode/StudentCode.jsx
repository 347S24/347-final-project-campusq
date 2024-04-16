import { redirect } from "react-router-dom";
import "./StudentCode.css";
import React, { useState } from "react";
import StudentQuestions from "../studentquestions/StudentQuestions";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useEffect } from "react";

import { useParams } from "react-router-dom";

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
        "http://localhost:8000/api/officehours?code=" + code,
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

  const logout = async () => {
    const cookies = new Cookies();
    const accessToken = cookies.get("access_token");

    // Remove the access token from cookies
    cookies.remove("access_token");

    try {
      const response = await fetch(
        "https://canvas.jmu.edu/login/oauth2/token",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.forward_url) {
          // Redirect to the forward URL provided by Canvas
          window.location.href = data.forward_url;
        } else {
          // If no forward_url is provided, manually redirect to Canvas's logout URL
          window.location.href = "https://canvas.jmu.edu/logout";
        }
      } else {
        console.error("Failed to log out from Canvas");
        // If the token revocation failed, still try to logout from Canvas directly
        window.location.href = "https://canvas.jmu.edu/logout";
      }
    } catch (error) {
      console.error("Error logging out from Canvas:", error);
      // On network error, still attempt to redirect to Canvas logout
      window.location.href = "https://canvas.jmu.edu/logout";
    }
  };

  useEffect(() => {
    const cookies = new Cookies();
    const session_token = cookies.get("session_token");
    console.log("all cookies:", cookies.getAll());
    console.log("session_token:", session_token);
    const userDataURL = "http://localhost:8000/api/student/info";
    const headers = {};

    fetch(userDataURL, {
      method: "GET",
      credentials: "include",
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

  const handleLogout = () => {
    const cookies = new Cookies();
    cookies.remove("access_token");
    window.location.href = "https://oxana.instructure.com/logout";
  };

  return (
    <div id="body">
      <div id="header">
        <div id="top-left">
          <div>Logged in: {studentName}</div>
          <button onClick={logout}>logout</button>
        </div>
        <div id="middle">
          <h1 id="title">CampusQ</h1>
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
