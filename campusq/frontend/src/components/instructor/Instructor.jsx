import "./Instructor.css";
import StudentBar from "./studentbar/StudentBar.jsx";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import TestView from "../../TestView.jsx";
import Cookies from "universal-cookie";
import { set } from "mongoose";

export default function Instructor() {
  const [student, setStudent] = useState([]);
  const [data, setData] = useState({});
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [sessionStatus, setSessionStatus] = useState(false);
  const [studentName, setStudentName] = useState("");

  const [code, setCode] = useState("1234");

  const addStudent = () => {
    setStudent([
      ...student,
      <StudentBar name={`student #${student.length + 1}`} />, // Added + 1 becuase current student.length count starts at 0
    ]);
  };

  const inviteStudent = () => {
    setStudent((students) => {
      return students.slice(1);
    });
  };

  const init = async () => {
    const response = await fetch("http://localhost:8000/api/instructor/info", {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
      },
      credentials: "include",
    });

    if (response.ok) {
      console.log("Successfully fetched instructor info");
      const jsonData = await response.json();

      console.log("data:", jsonData);
      setData(jsonData);

      setCode(jsonData.sessioncode);
      setQuestions(jsonData.questions);
      setAnswers(jsonData.answers);
      setStudentName(jsonData.name);
      setSessionStatus(jsonData.sessionStatus);
    } else {
      console.error("Failed to fetch instructor info");
    }
  };

  useEffect(() => {
    init();
  }, []);

  const activateSession = async () => {
    const response = await fetch("http://localhost:8000/api/activate_session", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      credentials: "include",
    });

    if (response.ok) {
      console.log("Successfully activated session");
      setSessionStatus(true);
    }
  };

  const endSession = async () => {
    const response = await fetch(
      "http://localhost:8000/api/deactivate_session",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      console.log("Successfully ended session");
      setSessionStatus(false);
    }
  };

  const logout = async () => {
    const cookies = new Cookies();
    cookies.remove("access_token", { path: "/" });
    cookies.remove("session_token", { path: "/" });

    console.log("Logged out");

    window.location = "/login";
  };

  console.log("data", data);
  console.log("sessioncode", data.sessioncode);

  return (
    <div className="instructor-container">
      <header className="instructor-header">
        <div id="user-info">Logged in: {studentName}</div>
        <button onClick={logout}>Logout</button>
      </header>
      <div className="session-controls">
        <button onClick={inviteStudent}>Invite Student</button>
        <button onClick={activateSession}>Activate Session</button>
        <button onClick={endSession}>End Session</button>
        {sessionStatus ? (
          <div></div>
        ) : (
          <Link to={"/instructor/edit"}>
            <button>Edit questions</button>
          </Link>
        )}
        {sessionStatus ? (
          <h1 style={{ color: "green" }}>Session is active</h1>
        ) : (
          <h1 style={{ color: "red" }}>Session is not active</h1>
        )}
      </div>
      <TestView
        code={data.sessioncode}
        questions={questions}
        answers={answers}
      />
      <div className="student-wrapper">{student}</div>
    </div>
  );
}
